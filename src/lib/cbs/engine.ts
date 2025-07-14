// CBS Engine - Core logic for processing and broadcasting Canon events

import { supabase } from '@/integrations/supabase/client';
import { CBSEvent, CBSEventCreate, CBSConfiguration } from './types';
import { CBS_DETECTORS } from './detectors';

export class CBSEngine {
  private config: CBSConfiguration;
  private activeSubscriptions: Map<string, any> = new Map();

  constructor(config: Partial<CBSConfiguration> = {}) {
    this.config = {
      enableRealTimeDetection: true,
      defaultBroadcastScope: 'local',
      enablePublicBroadcast: true,
      minimumCanonConfidence: 0.7,
      ...config
    };
  }

  /**
   * Initialize the CBS engine with real-time event detection
   */
  async initialize(): Promise<void> {
    if (!this.config.enableRealTimeDetection) {
      console.log('CBS: Real-time detection disabled');
      return;
    }

    console.log('🎯 CBS Engine: Initializing Canon event detection...');

    // Set up real-time subscriptions for each detector
    for (const detector of CBS_DETECTORS) {
      await this.setupDetectorSubscription(detector);
    }

    console.log(`✅ CBS Engine: ${CBS_DETECTORS.length} event detectors active`);
  }

  /**
   * Set up real-time subscription for a specific detector
   */
  private async setupDetectorSubscription(detector: typeof CBS_DETECTORS[0]): Promise<void> {
    const { table, event_types, detector: detectorFn, canonConfidence } = detector;

    for (const eventType of event_types) {
      const channelName = `cbs-${table}-${eventType.toLowerCase()}`;
      
      if (this.activeSubscriptions.has(channelName)) {
        console.log(`CBS: Subscription ${channelName} already exists`);
        continue;
      }

      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: eventType as any,
            schema: 'public',
            table: table
          },
          async (payload) => {
            try {
              const cbsEvent = detectorFn(payload);
              if (cbsEvent && cbsEvent.canon_confidence >= this.config.minimumCanonConfidence) {
                await this.broadcastCanonEvent(cbsEvent);
              }
            } catch (error) {
              console.error(`CBS: Error processing ${table} ${eventType}:`, error);
            }
          }
        )
        .subscribe((status) => {
          console.log(`CBS: ${channelName} subscription status:`, status);
        });

      this.activeSubscriptions.set(channelName, channel);
    }
  }

  /**
   * Broadcast a Canon-verified event to the CBS system
   */
  async broadcastCanonEvent(event: CBSEventCreate): Promise<string | null> {
    try {
      console.log('📡 CBS: Broadcasting Canon event:', event.event_type);

      const { data, error } = await supabase.rpc('broadcast_canon_event', {
        p_event_type: event.event_type,
        p_user_id: event.user_id,
        p_source_table: event.source_table,
        p_source_id: event.source_id,
        p_verified: event.verified ?? true,
        p_broadcast_scope: event.broadcast_scope ?? this.config.defaultBroadcastScope,
        p_visible_to_public: event.visible_to_public ?? this.config.enablePublicBroadcast,
        p_canon_confidence: event.canon_confidence ?? 0.8,
        p_metadata: event.metadata ?? {},
        p_city: event.city
      });

      if (error) {
        console.error('CBS: Failed to broadcast event:', error);
        return null;
      }

      console.log(`✨ CBS: Event ${event.event_type} broadcast with ID:`, data);
      return data;
    } catch (error) {
      console.error('CBS: Error broadcasting event:', error);
      return null;
    }
  }

  /**
   * Get recent Canon events for a user or globally
   */
  async getCanonEvents(options: {
    userId?: string;
    eventTypes?: string[];
    broadcastScope?: string[];
    limit?: number;
    verifiedOnly?: boolean;
  } = {}): Promise<CBSEvent[]> {
    try {
      let query = supabase
        .from('canonical_broadcast_events')
        .select('*')
        .eq('visible_to_public', true)
        .order('created_at', { ascending: false });

      if (options.userId) {
        query = query.eq('user_id', options.userId);
      }

      if (options.eventTypes && options.eventTypes.length > 0) {
        query = query.in('event_type', options.eventTypes);
      }

      if (options.broadcastScope && options.broadcastScope.length > 0) {
        query = query.in('broadcast_scope', options.broadcastScope);
      }

      if (options.verifiedOnly) {
        query = query.eq('verified', true);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('CBS: Error fetching Canon events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('CBS: Error in getCanonEvents:', error);
      return [];
    }
  }

  /**
   * Get event statistics for analytics
   */
  async getEventStats(userId?: string): Promise<{
    totalEvents: number;
    verifiedEvents: number;
    eventsByType: Record<string, number>;
    recentEvents: CBSEvent[];
  }> {
    try {
      const events = await this.getCanonEvents({
        userId,
        limit: 100,
        verifiedOnly: false
      });

      const verifiedEvents = events.filter(e => e.verified);
      const eventsByType = events.reduce((acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalEvents: events.length,
        verifiedEvents: verifiedEvents.length,
        eventsByType,
        recentEvents: events.slice(0, 10)
      };
    } catch (error) {
      console.error('CBS: Error getting event stats:', error);
      return {
        totalEvents: 0,
        verifiedEvents: 0,
        eventsByType: {},
        recentEvents: []
      };
    }
  }

  /**
   * Cleanup and stop all subscriptions
   */
  async cleanup(): Promise<void> {
    console.log('🧹 CBS Engine: Cleaning up subscriptions...');
    
    for (const [channelName, channel] of this.activeSubscriptions) {
      try {
        await supabase.removeChannel(channel);
        console.log(`CBS: Removed subscription ${channelName}`);
      } catch (error) {
        console.warn(`CBS: Error removing ${channelName}:`, error);
      }
    }

    this.activeSubscriptions.clear();
    console.log('✅ CBS Engine: Cleanup complete');
  }
}

// Global CBS Engine instance
export const cbsEngine = new CBSEngine();