import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface CanonSeason {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  theme: string;
  seasonal_title_rewards: string[];
  seasonal_stamp_variants: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSeasonalStats {
  id: string;
  user_id: string;
  season_id: string;
  canon_earned: number;
  stamps_earned: number;
  fusion_titles_earned: number;
  broadcasts_triggered: number;
  created_at: string;
  updated_at: string;
}

export interface SeasonalTitleReward {
  id: string;
  season_id: string;
  title_id: string;
  name: string;
  description: string;
  requirements: Json;
  icon: string;
  rarity: string;
  is_limited_time: boolean;
  created_at: string;
}

export interface UserSeasonalTitleProgress {
  id: string;
  user_id: string;
  season_id: string;
  title_id: string;
  progress_data: Json;
  completed_at: string | null;
  equipped: boolean;
  created_at: string;
  updated_at: string;
}

export function useSeasonalData() {
  const { user } = useAuth();
  const [currentSeason, setCurrentSeason] = useState<CanonSeason | null>(null);
  const [allSeasons, setAllSeasons] = useState<CanonSeason[]>([]);
  const [userStats, setUserStats] = useState<UserSeasonalStats[]>([]);
  const [seasonalTitles, setSeasonalTitles] = useState<SeasonalTitleReward[]>([]);
  const [titleProgress, setTitleProgress] = useState<UserSeasonalTitleProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSeasonalData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Load all seasons
      const { data: seasonsData, error: seasonsError } = await supabase
        .from('canon_seasons')
        .select('*')
        .order('start_date', { ascending: false });

      if (seasonsError) throw seasonsError;
      setAllSeasons(seasonsData || []);

      // Find current active season
      const activeSeason = seasonsData?.find(season => season.active);
      setCurrentSeason(activeSeason || null);

      // Load user seasonal stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_seasonal_stats')
        .select('*')
        .eq('user_id', user.id);

      if (statsError) throw statsError;
      setUserStats(statsData || []);

      // Load seasonal titles
      const { data: titlesData, error: titlesError } = await supabase
        .from('seasonal_title_rewards')
        .select('*');

      if (titlesError) throw titlesError;
      setSeasonalTitles(titlesData || []);

      // Load user title progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_seasonal_title_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) throw progressError;
      setTitleProgress(progressData || []);

    } catch (err) {
      console.error('Error loading seasonal data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load seasonal data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadSeasonalData();
    }
  }, [user?.id]);

  const getCurrentSeasonStats = () => {
    if (!currentSeason || !user?.id) return null;
    return userStats.find(stat => stat.season_id === currentSeason.id);
  };

  const getSeasonStats = (seasonId: string) => {
    return userStats.find(stat => stat.season_id === seasonId);
  };

  const getCurrentSeasonTitles = () => {
    if (!currentSeason) return [];
    return seasonalTitles.filter(title => title.season_id === currentSeason.id);
  };

  const getSeasonTitles = (seasonId: string) => {
    return seasonalTitles.filter(title => title.season_id === seasonId);
  };

  const getUserTitleProgress = (titleId: string, seasonId?: string) => {
    const targetSeasonId = seasonId || currentSeason?.id;
    if (!targetSeasonId) return null;
    
    return titleProgress.find(
      progress => progress.title_id === titleId && progress.season_id === targetSeasonId
    );
  };

  const getSeasonThemeIcon = (theme: string) => {
    switch (theme) {
      case 'autumn': return '🍂';
      case 'winter': return '❄️';
      case 'spring': return '🌸';
      case 'summer': return '☀️';
      default: return '🌟';
    }
  };

  const getSeasonThemeColor = (theme: string) => {
    switch (theme) {
      case 'autumn': return 'from-orange-500 to-red-500';
      case 'winter': return 'from-blue-400 to-indigo-600';
      case 'spring': return 'from-green-400 to-pink-400';
      case 'summer': return 'from-yellow-400 to-orange-500';
      default: return 'from-purple-400 to-pink-400';
    }
  };

  const refreshSeasonalData = () => {
    if (user?.id) {
      loadSeasonalData();
    }
  };

  return {
    currentSeason,
    allSeasons,
    userStats,
    seasonalTitles,
    titleProgress,
    loading,
    error,
    getCurrentSeasonStats,
    getSeasonStats,
    getCurrentSeasonTitles,
    getSeasonTitles,
    getUserTitleProgress,
    getSeasonThemeIcon,
    getSeasonThemeColor,
    refreshSeasonalData
  };
}