import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface FusionStampDefinition {
  id: string;
  name: string;
  required_stamp_ids: string[];
  flavor_text: string;
  annette_voice_lines: string[];
  icon_url?: string;
  canon_multiplier: number;
  unlockable_at_tier: number;
}

export interface UserFusionStamp {
  id: string;
  fusion_stamp_id: string;
  source_stamp_ids: string[];
  crafted_at: string;
  is_equipped: boolean;
  display_position?: number;
  definition?: FusionStampDefinition;
}

export interface FusionEligibility {
  eligible: boolean;
  missing_stamps?: string[];
  tier_required?: number;
  user_tier?: number;
}

export function useFusionStamps() {
  const { user } = useAuth();
  const [definitions, setDefinitions] = useState<FusionStampDefinition[]>([]);
  const [userFusionStamps, setUserFusionStamps] = useState<UserFusionStamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFusionData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Load fusion stamp definitions
      const { data: definitionsData, error: defError } = await supabase
        .from('fusion_stamp_definitions')
        .select('*')
        .order('unlockable_at_tier', { ascending: true });

      if (defError) throw defError;

      // Load user's fusion stamps
      const { data: userStampsData, error: userError } = await supabase
        .from('user_fusion_stamps')
        .select('*')
        .eq('user_id', user.id)
        .order('crafted_at', { ascending: false });

      if (userError) throw userError;

      // Enrich user stamps with definitions
      const enrichedUserStamps = userStampsData?.map(stamp => ({
        ...stamp,
        definition: definitionsData?.find(def => def.id === stamp.fusion_stamp_id)
      })) || [];

      setDefinitions(definitionsData || []);
      setUserFusionStamps(enrichedUserStamps);
    } catch (err) {
      console.error('Error loading fusion data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load fusion data');
    } finally {
      setLoading(false);
    }
  };

  const checkFusionEligibility = async (fusionId: string): Promise<FusionEligibility> => {
    if (!user?.id) return { eligible: false };

    try {
      const { data, error } = await supabase.rpc('check_fusion_eligibility', {
        p_user_id: user.id,
        p_fusion_id: fusionId
      });

      if (error) throw error;

      return { eligible: data || false };
    } catch (err) {
      console.error('Error checking fusion eligibility:', err);
      return { eligible: false };
    }
  };

  const craftFusionStamp = async (fusionId: string) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.rpc('craft_fusion_stamp', {
        p_user_id: user.id,
        p_fusion_id: fusionId
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; fusion_name?: string; voice_line?: string };
      if (!result.success) {
        throw new Error(result.error || 'Failed to craft fusion stamp');
      }

      // Reload fusion data to show the new stamp
      await loadFusionData();

      return data;
    } catch (err) {
      console.error('Error crafting fusion stamp:', err);
      throw err;
    }
  };

  const equipFusionStamp = async (fusionStampId: string, position: number) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('user_fusion_stamps')
        .update({ 
          is_equipped: true, 
          display_position: position 
        })
        .eq('user_id', user.id)
        .eq('id', fusionStampId);

      if (error) throw error;

      await loadFusionData();
      return true;
    } catch (err) {
      console.error('Error equipping fusion stamp:', err);
      return false;
    }
  };

  const unequipFusionStamp = async (fusionStampId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('user_fusion_stamps')
        .update({ 
          is_equipped: false, 
          display_position: null 
        })
        .eq('user_id', user.id)
        .eq('id', fusionStampId);

      if (error) throw error;

      await loadFusionData();
      return true;
    } catch (err) {
      console.error('Error unequipping fusion stamp:', err);
      return false;
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadFusionData();
    }
  }, [user?.id]);

  const refreshFusionData = () => {
    if (user?.id) {
      loadFusionData();
    }
  };

  return {
    definitions,
    userFusionStamps,
    loading,
    error,
    checkFusionEligibility,
    craftFusionStamp,
    equipFusionStamp,
    unequipFusionStamp,
    refreshFusionData
  };
}