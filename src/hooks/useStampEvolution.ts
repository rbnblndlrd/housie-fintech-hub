import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface StampEvolution {
  id: string;
  base_stamp_id: string;
  evolution_tier: string;
  required_count: number;
  evolved_name: string;
  evolved_icon: string;
  evolved_flavor_text: string;
}

interface EvolvedUserStamp {
  id: string;
  stamp_id: string;
  evolution_count: number;
  evolution_tier: string;
  evolution_info?: StampEvolution;
  next_evolution?: StampEvolution;
}

export function useStampEvolution() {
  const { user } = useAuth();
  const [evolutions, setEvolutions] = useState<StampEvolution[]>([]);
  const [userStamps, setUserStamps] = useState<EvolvedUserStamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvolutionData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Load all stamp evolutions
      const { data: evolutionData, error: evolutionError } = await supabase
        .from('stamp_evolutions')
        .select('*')
        .order('required_count', { ascending: true });

      if (evolutionError) throw evolutionError;

      // Load user stamps with evolution data
      const { data: stampData, error: stampError } = await supabase
        .from('user_stamps')
        .select('*')
        .eq('user_id', user.id);

      if (stampError) throw stampError;

      const evolvedStamps: EvolvedUserStamp[] = (stampData || []).map(stamp => {
        // Find current evolution info
        const currentEvolution = evolutionData?.find(e => 
          e.base_stamp_id === stamp.stamp_id && 
          e.evolution_tier === stamp.evolution_tier
        );

        // Find next evolution
        const nextEvolution = evolutionData?.find(e => 
          e.base_stamp_id === stamp.stamp_id && 
          e.required_count > stamp.evolution_count
        );

        return {
          ...stamp,
          evolution_info: currentEvolution,
          next_evolution: nextEvolution
        };
      });

      setEvolutions(evolutionData || []);
      setUserStamps(evolvedStamps);

    } catch (err) {
      console.error('Error loading evolution data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load evolution data');
    } finally {
      setLoading(false);
    }
  };

  const evolveStamp = async (stampId: string) => {
    if (!user?.id) return false;

    try {
      const { data: newTier, error } = await supabase
        .rpc('evolve_stamp', {
          p_user_id: user.id,
          p_stamp_id: stampId
        });

      if (error) throw error;

      await loadEvolutionData();
      return newTier;
    } catch (err) {
      console.error('Error evolving stamp:', err);
      return false;
    }
  };

  const getEvolutionProgress = (stampId: string) => {
    const userStamp = userStamps.find(s => s.stamp_id === stampId);
    if (!userStamp) return null;

    const nextEvolution = userStamp.next_evolution;
    if (!nextEvolution) return { isMaxLevel: true };

    const progress = Math.min(userStamp.evolution_count / nextEvolution.required_count, 1);
    
    return {
      isMaxLevel: false,
      progress,
      currentCount: userStamp.evolution_count,
      requiredCount: nextEvolution.required_count,
      nextEvolution
    };
  };

  const getDisplayName = (stampId: string) => {
    const userStamp = userStamps.find(s => s.stamp_id === stampId);
    if (!userStamp?.evolution_info) return null;

    return userStamp.evolution_info.evolved_name;
  };

  const getDisplayIcon = (stampId: string) => {
    const userStamp = userStamps.find(s => s.stamp_id === stampId);
    if (!userStamp?.evolution_info) return null;

    return userStamp.evolution_info.evolved_icon;
  };

  const getFlavorText = (stampId: string) => {
    const userStamp = userStamps.find(s => s.stamp_id === stampId);
    if (!userStamp?.evolution_info) return null;

    return userStamp.evolution_info.evolved_flavor_text;
  };

  useEffect(() => {
    if (user?.id) {
      loadEvolutionData();
    }
  }, [user?.id]);

  return {
    evolutions,
    userStamps,
    loading,
    error,
    evolveStamp,
    getEvolutionProgress,
    getDisplayName,
    getDisplayIcon,
    getFlavorText,
    refreshEvolutionData: loadEvolutionData
  };
}