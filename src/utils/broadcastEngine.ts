// Broadcast Engine - Manages canonical broadcast events
import { supabase } from '@/integrations/supabase/client';
import { CanonMetadata } from './canonHelper';

export type BroadcastScope = 'local' | 'city' | 'global';
export type BroadcastEventType = 'title_earned' | 'stamp' | 'booking_streak' | 'achievement' | 'prestige_milestone' | 'service_milestone';

export interface BroadcastEvent {
  id?: string;
  event_type: BroadcastEventType;
  user_id: string;
  content: string;
  canon_confidence: number;
  broadcast_scope: BroadcastScope;
  visible_to_public: boolean;
  city?: string;
  metadata?: any;
  geographic_location?: [number, number]; // [lng, lat]
  engagement_count?: number;
  created_at?: string;
}

export interface BroadcastPreferences {
  public_echo_participation: boolean;
  show_location: boolean;
  auto_broadcast_achievements: boolean;
}

/**
 * Creates a broadcast event from Canon metadata
 */
export async function createBroadcastEvent(
  eventType: BroadcastEventType,
  content: string,
  canonMetadata: CanonMetadata,
  scope: BroadcastScope = 'local',
  location?: [number, number]
): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Check user preferences
    const { data: preferences } = await supabase
      .from('user_broadcast_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const shouldPublish = preferences?.public_echo_participation ?? true;
    const showLocation = preferences?.show_location ?? true;

    const broadcastData = {
      event_type: eventType,
      user_id: user.id,
      source_table: 'system',
      source_id: crypto.randomUUID(),
      verified: canonMetadata.trust === 'canon',
      broadcast_scope: scope,
      visible_to_public: shouldPublish,
      canon_confidence: canonMetadata.confidence || 0.8,
      metadata: {
        source: canonMetadata.source,
        trust: canonMetadata.trust,
        generatedBy: canonMetadata.generatedBy,
        command: canonMetadata.command,
        confidence: canonMetadata.confidence,
        dataPoints: canonMetadata.dataPoints,
        lastVerified: canonMetadata.lastVerified?.toISOString(),
        content,
        originalCommand: canonMetadata.command
      },
      city: 'Montreal', // TODO: Get from user location
      geographic_location: showLocation && location ? `POINT(${location[0]} ${location[1]})` : null
    };

    const { data, error } = await supabase
      .from('canonical_broadcast_events')
      .insert(broadcastData)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating broadcast event:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Error in createBroadcastEvent:', error);
    return null;
  }
}

/**
 * Gets user's broadcast preferences
 */
export async function getBroadcastPreferences(): Promise<BroadcastPreferences | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_broadcast_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching broadcast preferences:', error);
      return null;
    }

    return data || {
      public_echo_participation: true,
      show_location: true,
      auto_broadcast_achievements: false
    };
  } catch (error) {
    console.error('Error in getBroadcastPreferences:', error);
    return null;
  }
}

/**
 * Updates user's broadcast preferences
 */
export async function updateBroadcastPreferences(preferences: Partial<BroadcastPreferences>): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_broadcast_preferences')
      .upsert({
        user_id: user.id,
        ...preferences
      });

    if (error) {
      console.error('Error updating broadcast preferences:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateBroadcastPreferences:', error);
    return false;
  }
}

/**
 * Gets public broadcast events for display
 */
export async function getPublicBroadcasts(
  scope?: BroadcastScope,
  city?: string,
  limit: number = 20
): Promise<BroadcastEvent[]> {
  try {
    let query = supabase
      .from('canonical_broadcast_events')
      .select(`
        id,
        event_type,
        user_id,
        broadcast_scope,
        visible_to_public,
        canon_confidence,
        metadata,
        city,
        engagement_count,
        created_at,
        geographic_location
      `)
      .eq('visible_to_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (scope) {
      query = query.eq('broadcast_scope', scope);
    }

    if (city) {
      query = query.eq('city', city);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching public broadcasts:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      event_type: item.event_type as BroadcastEventType,
      user_id: item.user_id,
      content: (typeof item.metadata === 'object' && item.metadata && 'content' in item.metadata) 
        ? String(item.metadata.content) 
        : 'Achievement unlocked!',
      canon_confidence: item.canon_confidence,
      broadcast_scope: item.broadcast_scope as BroadcastScope,
      visible_to_public: item.visible_to_public,
      city: item.city,
      metadata: item.metadata,
      engagement_count: item.engagement_count || 0,
      created_at: item.created_at
    }));
  } catch (error) {
    console.error('Error in getPublicBroadcasts:', error);
    return [];
  }
}

/**
 * Adds a reaction to a broadcast event
 */
export async function addBroadcastReaction(
  broadcastId: string,
  reactionType: 'clap' | 'comment' | 'insight'
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('broadcast_reactions')
      .upsert({
        broadcast_id: broadcastId,
        user_id: user.id,
        reaction_type: reactionType
      });

    if (error) {
      console.error('Error adding broadcast reaction:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addBroadcastReaction:', error);
    return false;
  }
}

/**
 * Generates Annette-style broadcast transcript
 */
export function generateBroadcastTranscript(broadcast: BroadcastEvent): string {
  const scope = broadcast.broadcast_scope.toUpperCase();
  const canonTag = broadcast.canon_confidence > 0.8 ? 'Verified Canon' : 'Non-Canon';
  const location = broadcast.city || 'Unknown Sector';
  
  return `[Broadcast Echo | ${canonTag} | ${location} ${scope === 'LOCAL' ? 'Sector' : scope === 'CITY' ? 'City' : 'Global'}]\n"${broadcast.content}"`;
}

/**
 * Prompts user for broadcast consent after achievements
 */
export async function promptBroadcastConsent(
  eventType: BroadcastEventType,
  content: string
): Promise<boolean> {
  // This would show a modal/toast asking for consent
  // For now, return true if auto_broadcast is enabled
  const preferences = await getBroadcastPreferences();
  return preferences?.auto_broadcast_achievements ?? false;
}