
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CommunityRating {
  totalPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  tierProgress: number;
  networkConnections: number;
  totalReviews: number;
  qualityCommendations: number;
  reliabilityCommendations: number;
  courtesyCommendations: number;
  shopPoints?: number;
  shopPointsTier?: string;
  shopPointsConversionRate?: number;
}

export interface PointTransaction {
  id: string;
  points_amount: number;
  reason: string;
  transaction_type: 'earned' | 'penalty' | 'bonus' | 'adjustment';
  created_at: string;
}

export const useCommunityRating = (userId?: string) => {
  const { user } = useAuth();
  const [communityRating, setCommunityRating] = useState<CommunityRating | null>(null);
  const [pointTransactions, setPointTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || user?.id;

  const getTierInfo = (points: number) => {
    if (points >= 300) return { tier: 'Platinum' as const, progress: Math.min(100, ((points - 300) / 200) * 100) };
    if (points >= 150) return { tier: 'Gold' as const, progress: ((points - 150) / 150) * 100 };
    if (points >= 50) return { tier: 'Silver' as const, progress: ((points - 50) / 100) * 100 };
    return { tier: 'Bronze' as const, progress: (points / 50) * 100 };
  };

  const getShopPointsTier = (points: number) => {
    if (points >= 500) return { tier: 'Elite', rate: 1.5 };
    if (points >= 100) return { tier: 'Premium', rate: 1.25 };
    if (points >= 50) return { tier: 'Established', rate: 1.0 };
    if (points >= 10) return { tier: 'Growing', rate: 0.75 };
    return { tier: 'New', rate: 0.5 };
  };

  const fetchCommunityRating = async () => {
    if (!targetUserId) return;

    try {
      console.log('🏆 Fetching community rating for user:', targetUserId);

      // Get provider profile data
      const { data: providerProfile, error: providerError } = await supabase
        .from('provider_profiles')
        .select(`
          community_rating_points,
          shop_points,
          network_connections,
          total_reviews,
          quality_commendations,
          reliability_commendations,
          courtesy_commendations
        `)
        .eq('user_id', targetUserId)
        .single();

      if (providerError && providerError.code !== 'PGRST116') {
        console.error('Error fetching provider profile:', providerError);
      }

      // Get user credits for customers
      const { data: userCredits, error: creditsError } = await supabase
        .from('user_credits')
        .select('total_credits, shop_points')
        .eq('user_id', targetUserId)
        .single();

      if (creditsError && creditsError.code !== 'PGRST116') {
        console.error('Error fetching user credits:', creditsError);
      }

      // Use provider points if available, otherwise use customer credits
      const totalPoints = providerProfile?.community_rating_points || userCredits?.total_credits || 0;
      const shopPoints = providerProfile?.shop_points || userCredits?.shop_points || 0;
      const tierInfo = getTierInfo(totalPoints);
      const shopTierInfo = getShopPointsTier(totalPoints);

      setCommunityRating({
        totalPoints,
        tier: tierInfo.tier,
        tierProgress: tierInfo.progress,
        networkConnections: providerProfile?.network_connections || 0,
        totalReviews: providerProfile?.total_reviews || 0,
        qualityCommendations: providerProfile?.quality_commendations || 0,
        reliabilityCommendations: providerProfile?.reliability_commendations || 0,
        courtesyCommendations: providerProfile?.courtesy_commendations || 0,
        shopPoints,
        shopPointsTier: shopTierInfo.tier,
        shopPointsConversionRate: shopTierInfo.rate,
      });

      console.log('✅ Community rating loaded:', {
        totalPoints,
        shopPoints,
        tier: tierInfo.tier,
        shopTier: shopTierInfo.tier,
        progress: tierInfo.progress
      });

    } catch (error: any) {
      console.error('❌ Error fetching community rating:', error);
      setError(error.message);
    }
  };

  const fetchPointTransactions = async () => {
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from('point_transactions')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Type cast the data to match our interface
      const typedTransactions: PointTransaction[] = (data || []).map(item => ({
        id: item.id,
        points_amount: item.points_amount,
        reason: item.reason,
        transaction_type: item.transaction_type as 'earned' | 'penalty' | 'bonus' | 'adjustment',
        created_at: item.created_at
      }));
      
      setPointTransactions(typedTransactions);
    } catch (error: any) {
      console.error('❌ Error fetching point transactions:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!targetUserId) return;
      
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchCommunityRating(),
        fetchPointTransactions()
      ]);
      
      setLoading(false);
    };

    loadData();

    // Set up real-time subscription for point updates
    if (targetUserId) {
      const subscription = supabase
        .channel('community_rating_updates')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'provider_profiles', filter: `user_id=eq.${targetUserId}` },
          () => {
            console.log('📡 Provider profile changed, refreshing community rating...');
            fetchCommunityRating();
          }
        )
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'point_transactions', filter: `user_id=eq.${targetUserId}` },
          () => {
            console.log('📡 Point transaction added, refreshing...');
            fetchCommunityRating();
            fetchPointTransactions();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [targetUserId]);

  return {
    communityRating,
    pointTransactions,
    loading,
    error,
    refetch: () => {
      fetchCommunityRating();
      fetchPointTransactions();
    }
  };
};
