import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface StampDefinition {
  id: string;
  name: string;
  icon_url: string;
  rarity: 'common' | 'rare' | 'legendary' | 'unique';
  emotion_flavor: string;
  description: string;
  is_enabled: boolean;
}

export interface StampUsage {
  id: string;
  stamp_id: string;
  canon_event_id: string;
  user_id: string;
  timestamp: string;
  assigned_by: string;
  metadata: any;
  stamp_definitions?: StampDefinition;
}

export const useStampDefinitions = () => {
  const [stamps, setStamps] = useState<StampDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchStamps = async () => {
    try {
      const { data, error } = await supabase
        .from('stamp_definitions')
        .select('*')
        .eq('is_enabled', true)
        .order('rarity', { ascending: false })
        .order('name');

      if (error) throw error;
      setStamps((data || []) as StampDefinition[]);
    } catch (error) {
      console.error('Error fetching stamps:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignStampToEvent = async (stampId: string, eventId: string) => {
    if (!user) throw new Error('Not authenticated');

    try {
      const { data, error } = await supabase
        .from('stamp_usages')
        .insert({
          stamp_id: stampId,
          canon_event_id: eventId,
          user_id: user.id,
          assigned_by: user.id
        })
        .select(`
          *,
          stamp_definitions(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error assigning stamp:', error);
      throw error;
    }
  };

  const removeStampFromEvent = async (stampUsageId: string) => {
    try {
      const { error } = await supabase
        .from('stamp_usages')
        .delete()
        .eq('id', stampUsageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing stamp:', error);
      throw error;
    }
  };

  const getStampsForEvent = async (eventId: string): Promise<StampUsage[]> => {
    try {
      const { data, error } = await supabase
        .from('stamp_usages')
        .select(`
          *,
          stamp_definitions(*)
        `)
        .eq('canon_event_id', eventId);

      if (error) throw error;
      return (data || []) as StampUsage[];
    } catch (error) {
      console.error('Error fetching event stamps:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchStamps();
  }, []);

  return {
    stamps,
    loading,
    assignStampToEvent,
    removeStampFromEvent,
    getStampsForEvent,
    refetch: fetchStamps
  };
};