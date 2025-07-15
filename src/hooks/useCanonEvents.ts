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
  created_at: string;
  updated_at: string;
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

export const useCanonEvents = (filter?: string) => {
  const [events, setEvents] = useState<CanonEvent[]>([]);
  const [stamps, setStamps] = useState<StampDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEvents = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('canon_events')
        .select(`
          *,
          users:user_id (full_name, email),
          stamp_definitions:stamp_id (name, icon_url, rarity, emotion_flavor)
        `)
        .order('timestamp', { ascending: false });

      // Apply filters
      if (filter === 'my-stamps') {
        query = query.eq('user_id', user.id);
      } else if (filter === 'friends') {
        query = query.eq('echo_scope', 'friends');
      } else if (filter === 'local') {
        query = query.in('canon_rank', ['local']);
      } else if (filter === 'global') {
        query = query.in('canon_rank', ['global', 'legendary']);
      }

      const { data, error: fetchError } = await query.limit(50);

      if (fetchError) throw fetchError;

      setEvents((data as any) || []);
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
  }, [user, filter]);

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