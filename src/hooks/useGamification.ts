
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunityRating } from './useCommunityRating';
import { toast } from 'sonner';

// Legacy interfaces for backward compatibility
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

// Updated hook that provides backward compatibility while using new community rating system
export const useGamification = (userId?: string) => {
  const { user } = useAuth();
  const { communityRating, pointTransactions, loading, error } = useCommunityRating(userId);
  
  // Legacy empty data for backward compatibility
  const [achievements] = useState<Achievement[]>([]);
  const [territoryClaims] = useState<TerritoryClaim[]>([]);
  const [leaderboards] = useState<LeaderboardEntry[]>([]);

  const targetUserId = userId || user?.id;

  // Convert community rating to legacy loyalty points format
  const loyaltyPoints: LoyaltyPoints | null = communityRating ? {
    total_points: communityRating.totalPoints,
    available_points: communityRating.totalPoints,
    lifetime_earned: communityRating.totalPoints,
    tier_level: communityRating.tier,
    tier_benefits: {
      tier: communityRating.tier,
      progress: communityRating.tierProgress,
      networkConnections: communityRating.networkConnections
    }
  } : null;

  // Legacy territory claim function (deprecated)
  const claimTerritory = async (zoneCode: string) => {
    console.warn('Territory claiming is deprecated in the new community rating system');
    toast.error('Territory system has been replaced with community rating points');
    return false;
  };

  // Award points using new system
  const awardPoints = async (points: number, reason: string, bookingId?: string) => {
    if (!targetUserId) return false;

    try {
      // Call the new database function
      const { error } = await supabase.rpc('award_community_rating_points', {
        p_user_id: targetUserId,
        p_points: points,
        p_reason: reason
      });

      if (error) throw error;

      toast.success(`+${points} points: ${reason}`);
      return true;
    } catch (error: any) {
      console.error('Error awarding points:', error);
      toast.error('Failed to award points');
      return false;
    }
  };

  return {
    // New community rating data
    communityRating,
    pointTransactions,
    
    // Legacy data (empty for backward compatibility)
    achievements,
    loyaltyPoints,
    territoryClaims,
    leaderboards,
    
    // Status
    loading,
    error,
    
    // Functions
    claimTerritory,
    awardPoints,
    refetch: () => {
      // Refetch is handled by useCommunityRating hook
    }
  };
};
