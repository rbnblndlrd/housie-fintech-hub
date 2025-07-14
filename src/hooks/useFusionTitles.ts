import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface FusionTitle {
  id: string;
  name: string;
  description: string;
  required_prestige_tier: number;
  required_stamps: string[];
  flavor_lines: string[];
  icon: string;
  rarity: string;
  is_active: boolean;
}

interface UserFusionTitle {
  id: string;
  title_id: string;
  unlocked_at: string;
  is_equipped: boolean;
  unlock_context: any;
  fusion_title?: FusionTitle;
}

interface FusionTitleEligibility {
  title_id: string;
  eligible: boolean;
  missing_stamps: string[];
  current_prestige: number;
  required_prestige: number;
}

export function useFusionTitles() {
  const { user } = useAuth();
  const [fusionTitles, setFusionTitles] = useState<FusionTitle[]>([]);
  const [userFusionTitles, setUserFusionTitles] = useState<UserFusionTitle[]>([]);
  const [eligibility, setEligibility] = useState<FusionTitleEligibility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFusionTitles = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Load all fusion titles
      const { data: titles, error: titlesError } = await supabase
        .from('fusion_titles')
        .select('*')
        .eq('is_active', true)
        .order('rarity', { ascending: false });

      if (titlesError) throw titlesError;

      // Load user's fusion titles
      const { data: userTitles, error: userTitlesError } = await supabase
        .from('user_fusion_titles')
        .select(`
          *,
          fusion_title:fusion_titles(*)
        `)
        .eq('user_id', user.id);

      if (userTitlesError) throw userTitlesError;

      setFusionTitles(titles || []);
      setUserFusionTitles(userTitles || []);

      // Check eligibility for each title
      await checkEligibility(titles || []);

    } catch (err) {
      console.error('Error loading fusion titles:', err);
      setError(err instanceof Error ? err.message : 'Failed to load fusion titles');
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async (titles: FusionTitle[]) => {
    if (!user?.id) return;

    const eligibilityResults: FusionTitleEligibility[] = [];

    for (const title of titles) {
      try {
        // Check if already unlocked
        const alreadyUnlocked = userFusionTitles.some(ut => ut.title_id === title.id);
        if (alreadyUnlocked) {
          eligibilityResults.push({
            title_id: title.id,
            eligible: true,
            missing_stamps: [],
            current_prestige: 0,
            required_prestige: title.required_prestige_tier
          });
          continue;
        }

        // Check eligibility via RPC
        const { data: eligible, error } = await supabase
          .rpc('check_fusion_title_eligibility', {
            p_user_id: user.id,
            p_title_id: title.id
          });

        if (error) throw error;

        // Get detailed info for UI
        const { data: userStamps } = await supabase
          .from('user_stamps')
          .select('stamp_id')
          .eq('user_id', user.id);

        const userStampIds = userStamps?.map(s => s.stamp_id) || [];
        const missingStamps = title.required_stamps.filter(s => !userStampIds.includes(s));

        // Get prestige count
        const { data: prestigeProgress, error: prestigeError } = await supabase
          .from('prestige_progress')
          .select('id')
          .eq('user_id', user.id)
          .not('completed_at', 'is', null);

        if (prestigeError) throw prestigeError;

        eligibilityResults.push({
          title_id: title.id,
          eligible: eligible || false,
          missing_stamps: missingStamps,
          current_prestige: prestigeProgress?.length || 0,
          required_prestige: title.required_prestige_tier
        });

      } catch (err) {
        console.error(`Error checking eligibility for ${title.id}:`, err);
        eligibilityResults.push({
          title_id: title.id,
          eligible: false,
          missing_stamps: title.required_stamps,
          current_prestige: 0,
          required_prestige: title.required_prestige_tier
        });
      }
    }

    setEligibility(eligibilityResults);
  };

  const equipFusionTitle = async (titleId: string) => {
    if (!user?.id) return false;

    try {
      // Unequip all other fusion titles
      const { error: unequipError } = await supabase
        .from('user_fusion_titles')
        .update({ is_equipped: false })
        .eq('user_id', user.id)
        .eq('is_equipped', true);

      if (unequipError) throw unequipError;

      // Equip the selected title
      const { error: equipError } = await supabase
        .from('user_fusion_titles')
        .update({ is_equipped: true })
        .eq('user_id', user.id)
        .eq('title_id', titleId);

      if (equipError) throw equipError;

      await loadFusionTitles();
      return true;
    } catch (err) {
      console.error('Error equipping fusion title:', err);
      return false;
    }
  };

  const unequipFusionTitle = async (titleId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('user_fusion_titles')
        .update({ is_equipped: false })
        .eq('user_id', user.id)
        .eq('title_id', titleId);

      if (error) throw error;

      await loadFusionTitles();
      return true;
    } catch (err) {
      console.error('Error unequipping fusion title:', err);
      return false;
    }
  };

  const getEquippedTitle = () => {
    return userFusionTitles.find(title => title.is_equipped);
  };

  const getEligibilityForTitle = (titleId: string) => {
    return eligibility.find(e => e.title_id === titleId);
  };

  useEffect(() => {
    if (user?.id) {
      loadFusionTitles();
    }
  }, [user?.id]);

  return {
    fusionTitles,
    userFusionTitles,
    eligibility,
    loading,
    error,
    equipFusionTitle,
    unequipFusionTitle,
    getEquippedTitle,
    getEligibilityForTitle,
    refreshFusionTitles: loadFusionTitles
  };
}