import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CanonEvent {
  id: string;
  user_id: string;
  related_user_ids?: string[];
  event_type: string;
  title: string;
  description?: string;
  timestamp: string;
  canon_rank: string;
  echo_scope: string;
  origin_dashboard?: string;
  event_source_type?: string;
  stamp_id?: string;
  annette_commentary?: string;
  echo_score: number;
  vote_score?: number;
  vote_count?: number;
  created_at: string;
  updated_at: string;
  followed_user_name?: string; // For subscribed events
  users?: {
    full_name?: string;
    email: string;
  };
  stamp_definitions?: {
    name: string;
    icon_url?: string;
    rarity: string;
    emotion_flavor?: string;
  };
}

export interface StampDefinition {
  id: string;
  name: string;
  icon_url?: string;
  rarity: string;
  emotion_flavor?: string;
  description?: string;
}

export const useCanonEvents = (filter?: string, sortBy?: string) => {
  const [events, setEvents] = useState<CanonEvent[]>([]);
  const [stamps, setStamps] = useState<StampDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEvents = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let ownEvents: CanonEvent[] = [];
      let subscribedEvents: CanonEvent[] = [];

      // Fetch own events
      let ownQuery = supabase
        .from('canon_events')
        .select(`
          *,
          users:user_id (full_name, email),
          stamp_definitions:stamp_id (name, icon_url, rarity, emotion_flavor)
        `)
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      const { data: ownData } = await ownQuery.limit(25);
      ownEvents = (ownData as any) || [];

      // Fetch subscribed events if not filtering to own stamps only
      if (filter !== 'my-stamps') {
        try {
          const { data: subscriptionsData } = await supabase.rpc('get_subscribed_canon_events', {
            p_user_id: user.id
          });

          if (subscriptionsData) {
            subscribedEvents = subscriptionsData.map((event: any) => ({
              id: event.id,
              user_id: event.user_id,
              event_type: event.event_type,
              title: event.title,
              description: event.description,
              timestamp: event.event_timestamp,
              canon_rank: event.canon_rank,
              echo_scope: event.echo_scope,
              annette_commentary: event.annette_commentary,
              echo_score: 0, // Default score for subscribed events
              related_user_ids: null,
              origin_dashboard: null,
              event_source_type: null,
              stamp_id: null,
              created_at: event.event_timestamp,
              updated_at: event.event_timestamp,
              followed_user_name: event.followed_user_name
            }));
          }
        } catch (subError) {
          console.warn('Failed to fetch subscribed events:', subError);
        }
      }

      // Combine and filter events
      let allEvents = [...ownEvents, ...subscribedEvents];

      // Apply additional filters
      if (filter === 'friends') {
        // Get user's service connections
        const { data: connections } = await supabase
          .from('service_connections')
          .select('user_one_id, user_two_id')
          .or(`user_one_id.eq.${user.id},user_two_id.eq.${user.id}`)
          .eq('cred_connection_established', true);

        if (connections && connections.length > 0) {
          const friendIds = connections.map(conn => 
            conn.user_one_id === user.id ? conn.user_two_id : conn.user_one_id
          );
          allEvents = allEvents.filter(event => 
            event.user_id === user.id || friendIds.includes(event.user_id)
          );
        } else {
          // No friends, show only own events
          allEvents = ownEvents;
        }
      } else if (filter === 'local') {
        allEvents = allEvents.filter(event => 
          ['local', 'regional'].includes(event.canon_rank)
        );
      } else if (filter === 'global') {
        allEvents = allEvents.filter(event => 
          ['global', 'legendary'].includes(event.canon_rank)
        );
      }

      // Remove duplicates first
      const uniqueEvents = allEvents
        .filter((event, index, self) => 
          index === self.findIndex(e => e.id === event.id)
        );

      // Apply sorting
      let sortedEvents = uniqueEvents;
      if (sortBy === 'echo-depth') {
        sortedEvents = uniqueEvents.sort((a, b) => b.echo_score - a.echo_score);
      } else {
        // Default: sort by timestamp
        sortedEvents = uniqueEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }

      setEvents(sortedEvents.slice(0, 50));
    } catch (err) {
      console.error('Error fetching canon events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const fetchStamps = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('stamp_definitions')
        .select('*')
        .eq('is_enabled', true)
        .order('rarity', { ascending: false });

      if (fetchError) throw fetchError;

      setStamps(data as StampDefinition[] || []);
    } catch (err) {
      console.error('Error fetching stamps:', err);
    }
  };

  const createCanonEvent = async (eventData: {
    event_type: string;
    title: string;
    description?: string;
    canon_rank?: string;
    echo_scope?: string;
    origin_dashboard?: string;
    event_source_type?: string;
    stamp_id?: string;
    related_user_ids?: string[];
  }) => {
    try {
      const { data, error: createError } = await supabase.rpc('create_canon_event', {
        p_event_type: eventData.event_type,
        p_title: eventData.title,
        p_description: eventData.description,
        p_canon_rank: eventData.canon_rank || 'local',
        p_echo_scope: eventData.echo_scope || 'public',
        p_origin_dashboard: eventData.origin_dashboard,
        p_event_source_type: eventData.event_source_type,
        p_stamp_id: eventData.stamp_id,
        p_related_user_ids: eventData.related_user_ids
      });

      if (createError) throw createError;

      // Generate Annette commentary
      try {
        await supabase.functions.invoke('generate-annette-commentary', {
          body: {
            title: eventData.title,
            eventType: eventData.event_type,
            canonRank: eventData.canon_rank || 'local',
            eventId: data
          }
        });
      } catch (commentaryError) {
        console.warn('Failed to generate Annette commentary:', commentaryError);
      }

      // Refresh events
      await fetchEvents();
      
      return data;
    } catch (err) {
      console.error('Error creating canon event:', err);
      throw err;
    }
  };

  const updateEventScope = async (eventId: string, newScope: string) => {
    try {
      const { error: updateError } = await supabase
        .from('canon_events')
        .update({ echo_scope: newScope })
        .eq('id', eventId)
        .eq('user_id', user?.id);

      if (updateError) throw updateError;

      await fetchEvents();
    } catch (err) {
      console.error('Error updating event scope:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchStamps();
  }, [user, filter, sortBy]);

  return {
    events,
    stamps,
    loading,
    error,
    createCanonEvent,
    updateEventScope,
    refetch: fetchEvents
  };
};