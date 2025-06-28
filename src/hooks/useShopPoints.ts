
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ShopPointsData {
  communityPoints: number;
  shopPoints: number;
  tier: 'New' | 'Growing' | 'Established' | 'Premium' | 'Elite';
  conversionRate: number;
  nextTierPoints: number | null;
  nextTier: string | null;
}

export const useShopPoints = (userId?: string) => {
  const { user } = useAuth();
  const [shopPointsData, setShopPointsData] = useState<ShopPointsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || user?.id;

  const calculateShopPoints = (communityPoints: number) => {
    if (communityPoints < 10) return Math.floor(communityPoints * 0.5);
    if (communityPoints < 50) return Math.floor(communityPoints * 0.75);
    if (communityPoints < 100) return Math.floor(communityPoints * 1.0);
    if (communityPoints < 500) return Math.floor(communityPoints * 1.25);
    return Math.floor(communityPoints * 1.5);
  };

  const getTierInfo = (points: number) => {
    if (points >= 500) return { 
      tier: 'Elite' as const, 
      rate: 1.5, 
      nextTier: null, 
      nextTierPoints: null 
    };
    if (points >= 100) return { 
      tier: 'Premium' as const, 
      rate: 1.25, 
      nextTier: 'Elite', 
      nextTierPoints: 500 - points 
    };
    if (points >= 50) return { 
      tier: 'Established' as const, 
      rate: 1.0, 
      nextTier: 'Premium', 
      nextTierPoints: 100 - points 
    };
    if (points >= 10) return { 
      tier: 'Growing' as const, 
      rate: 0.75, 
      nextTier: 'Established', 
      nextTierPoints: 50 - points 
    };
    return { 
      tier: 'New' as const, 
      rate: 0.5, 
      nextTier: 'Growing', 
      nextTierPoints: 10 - points 
    };
  };

  const fetchShopPointsData = async () => {
    if (!targetUserId) return;

    try {
      console.log('🛍️ Fetching shop points data for user:', targetUserId);

      // Get provider profile data
      const { data: providerProfile, error: providerError } = await supabase
        .from('provider_profiles')
        .select('community_rating_points, shop_points')
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
      const communityPoints = providerProfile?.community_rating_points || userCredits?.total_credits || 0;
      const shopPoints = providerProfile?.shop_points || userCredits?.shop_points || calculateShopPoints(communityPoints);
      
      const tierInfo = getTierInfo(communityPoints);

      setShopPointsData({
        communityPoints,
        shopPoints,
        tier: tierInfo.tier,
        conversionRate: tierInfo.rate,
        nextTierPoints: tierInfo.nextTierPoints,
        nextTier: tierInfo.nextTier,
      });

      console.log('✅ Shop points data loaded:', {
        communityPoints,
        shopPoints,
        tier: tierInfo.tier,
        rate: tierInfo.rate
      });

    } catch (error: any) {
      console.error('❌ Error fetching shop points data:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!targetUserId) return;
      
      setLoading(true);
      setError(null);
      
      await fetchShopPointsData();
      setLoading(false);
    };

    loadData();

    // Set up real-time subscription for point updates
    if (targetUserId) {
      const subscription = supabase
        .channel('shop_points_updates')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'provider_profiles', filter: `user_id=eq.${targetUserId}` },
          () => {
            console.log('📡 Provider profile changed, refreshing shop points...');
            fetchShopPointsData();
          }
        )
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'user_credits', filter: `user_id=eq.${targetUserId}` },
          () => {
            console.log('📡 User credits changed, refreshing shop points...');
            fetchShopPointsData();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [targetUserId]);

  return {
    shopPointsData,
    loading,
    error,
    refetch: fetchShopPointsData
  };
};
