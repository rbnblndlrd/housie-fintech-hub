
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string | null;
  loading: boolean;
}

export const useSubscriptionData = () => {
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: 'free',
    subscription_end: null,
    loading: true
  });

  useEffect(() => {
    if (user) {
      loadSubscriptionData();
    }
  }, [user]);

  const loadSubscriptionData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('subscription_tier, subscription_status')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.warn('Subscription data query failed, using fallback:', error);
        // Use safe defaults instead of blocking
        setSubscriptionData({
          subscribed: false,
          subscription_tier: 'free',
          subscription_end: null,
          loading: false
        });
        return;
      }

      const isSubscribed = data?.subscription_tier && data.subscription_tier !== 'free';
      setSubscriptionData({
        subscribed: isSubscribed || false,
        subscription_tier: data?.subscription_tier || 'free',
        subscription_end: null, // We don't have this field yet
        loading: false
      });
    } catch (error) {
      console.warn('Subscription data loading failed, using fallback:', error);
      // Always provide safe defaults
      setSubscriptionData({
        subscribed: false,
        subscription_tier: 'free',
        subscription_end: null,
        loading: false
      });
    }
  };

  const openSubscriptionPortal = async () => {
    // This would call a Supabase edge function to create a customer portal session
    console.log('Opening subscription portal...');
    // Placeholder for actual implementation
  };

  return {
    subscriptionData,
    loadSubscriptionData,
    openSubscriptionPortal
  };
};
