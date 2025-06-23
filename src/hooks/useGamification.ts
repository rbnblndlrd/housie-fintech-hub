
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Achievement {
  id: string;
  achievement_type: string;
  achievement_name: string;
  achievement_tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  points_awarded: number;
  unlocked_at: string;
}

export interface LoyaltyPoints {
  total_points: number;
  available_points: number;
  lifetime_earned: number;
  tier_level: string;
  tier_benefits: any;
}

export interface TerritoryClaim {
  id: string;
  zone_code: string;
  status: 'claimed' | 'contested' | 'abandoned';
  jobs_completed_in_zone: number;
  territory_score: number;
  claimed_at: string;
  zone_name?: string;
}

export interface LeaderboardEntry {
  id: string;
  leaderboard_type: string;
  score: number;
  rank_position: number;
  user_id: string;
  provider_id?: string;
  zone_code?: string;
  period_start: string;
  period_end: string;
  metadata: any;
}

export const useGamification = (userId?: string) => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints | null>(null);
  const [territoryClaims, setTerritoryClaims] = useState<TerritoryClaim[]>([]);
  const [leaderboards, setLeaderboards] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || user?.id;

  const fetchAchievements = async () => {
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', targetUserId)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error: any) {
      console.error('Error fetching achievements:', error);
      setError(error.message);
    }
  };

  const fetchLoyaltyPoints = async () => {
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setLoyaltyPoints(data);
    } catch (error: any) {
      console.error('Error fetching loyalty points:', error);
      setError(error.message);
    }
  };

  const fetchTerritoryClaims = async () => {
    if (!targetUserId) return;

    try {
      // First get provider profile
      const { data: providerProfile } = await supabase
        .from('provider_profiles')
        .select('id')
        .eq('user_id', targetUserId)
        .single();

      if (!providerProfile) {
        setTerritoryClaims([]);
        return;
      }

      const { data, error } = await supabase
        .from('territory_claims')
        .select(`
          *,
          montreal_zones!inner(zone_name)
        `)
        .eq('provider_id', providerProfile.id)
        .order('claimed_at', { ascending: false });

      if (error) throw error;
      
      const claimsWithZoneNames = (data || []).map(claim => ({
        ...claim,
        zone_name: claim.montreal_zones?.zone_name
      }));
      
      setTerritoryClaims(claimsWithZoneNames);
    } catch (error: any) {
      console.error('Error fetching territory claims:', error);
      setError(error.message);
    }
  };

  const fetchLeaderboards = async () => {
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from('leaderboards')
        .select('*')
        .eq('user_id', targetUserId)
        .order('rank_position', { ascending: true });

      if (error) throw error;
      setLeaderboards(data || []);
    } catch (error: any) {
      console.error('Error fetching leaderboards:', error);
      setError(error.message);
    }
  };

  const claimTerritory = async (zoneCode: string) => {
    if (!targetUserId) return false;

    try {
      // Get provider profile
      const { data: providerProfile } = await supabase
        .from('provider_profiles')
        .select('id')
        .eq('user_id', targetUserId)
        .single();

      if (!providerProfile) {
        toast.error('You must be a provider to claim territory');
        return false;
      }

      const { data, error } = await supabase.rpc('claim_territory', {
        claiming_provider_id: providerProfile.id,
        target_zone_code: zoneCode
      });

      if (error) throw error;

      if (data) {
        toast.success(`Territory ${zoneCode} claimed successfully! +100 points`);
        await fetchTerritoryClaims();
        await fetchLoyaltyPoints();
        return true;
      } else {
        toast.error('Territory already claimed or invalid');
        return false;
      }
    } catch (error: any) {
      console.error('Error claiming territory:', error);
      toast.error('Failed to claim territory');
      return false;
    }
  };

  const awardPoints = async (points: number, reason: string, bookingId?: string) => {
    if (!targetUserId) return false;

    try {
      const { error } = await supabase.rpc('award_points', {
        target_user_id: targetUserId,
        points: points,
        reason: reason,
        transaction_type: 'earned',
        related_booking_id: bookingId
      });

      if (error) throw error;

      toast.success(`+${points} points: ${reason}`);
      await fetchLoyaltyPoints();
      return true;
    } catch (error: any) {
      console.error('Error awarding points:', error);
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!targetUserId) return;
      
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchAchievements(),
        fetchLoyaltyPoints(),
        fetchTerritoryClaims(),
        fetchLeaderboards()
      ]);
      
      setLoading(false);
    };

    loadData();
  }, [targetUserId]);

  return {
    achievements,
    loyaltyPoints,
    territoryClaims,
    leaderboards,
    loading,
    error,
    claimTerritory,
    awardPoints,
    refetch: () => {
      fetchAchievements();
      fetchLoyaltyPoints();
      fetchTerritoryClaims();
      fetchLeaderboards();
    }
  };
};
