import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getStampDefinition } from '@/utils/stampDefinitions';

export interface EquippedStamp {
  stamp_id: string;
  display_position: number;
  equipped_at: string;
  definition?: any;
}

export function useEquippedStamps(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  const [equippedStamps, setEquippedStamps] = useState<EquippedStamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEquippedStamps = async () => {
    if (!targetUserId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .rpc('get_user_equipped_stamps', { p_user_id: targetUserId });

      if (supabaseError) throw supabaseError;

      const stampsWithDefinitions = (data || []).map((stamp: any) => ({
        ...stamp,
        definition: getStampDefinition(stamp.stamp_id)
      }));

      setEquippedStamps(stampsWithDefinitions);
    } catch (err) {
      console.error('Error loading equipped stamps:', err);
      setError(err instanceof Error ? err.message : 'Failed to load equipped stamps');
    } finally {
      setLoading(false);
    }
  };

  const equipStamp = async (stampId: string, position: number) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('user_equipped_stamps')
        .upsert({
          user_id: user.id,
          stamp_id: stampId,
          display_position: position
        });

      if (error) throw error;
      
      await loadEquippedStamps();
      return true;
    } catch (err) {
      console.error('Error equipping stamp:', err);
      return false;
    }
  };

  const unequipStamp = async (stampId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('user_equipped_stamps')
        .delete()
        .match({ user_id: user.id, stamp_id: stampId });

      if (error) throw error;
      
      await loadEquippedStamps();
      return true;
    } catch (err) {
      console.error('Error unequipping stamp:', err);
      return false;
    }
  };

  useEffect(() => {
    if (targetUserId) {
      loadEquippedStamps();
    }
  }, [targetUserId]);

  return {
    equippedStamps,
    loading,
    error,
    equipStamp,
    unequipStamp,
    refreshEquippedStamps: loadEquippedStamps
  };
}