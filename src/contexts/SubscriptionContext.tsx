
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
}

interface SubscriptionContextType {
  subscriptionData: SubscriptionData;
  loading: boolean;
  checkSubscription: () => Promise<void>;
  isFeatureAvailable: (feature: 'google_calendar' | 'export_import' | 'cross_platform') => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
  });
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();

  const checkSubscription = async () => {
    if (!user || !session) {
      setSubscriptionData({ subscribed: false, subscription_tier: null, subscription_end: null });
      setLoading(false);
      return;
    }

    try {
      // Read subscription data directly from the users table with fallback
      const { data, error } = await supabase
        .from('users')
        .select('subscription_tier, subscription_status')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.warn('Subscription query failed, using fallback:', error);
        // Don't block the app - use safe defaults
        setSubscriptionData({ 
          subscribed: false, 
          subscription_tier: 'free', 
          subscription_end: null 
        });
      } else {
        const isSubscribed = data?.subscription_tier && data.subscription_tier !== 'free';
        setSubscriptionData({
          subscribed: isSubscribed || false,
          subscription_tier: data?.subscription_tier || 'free',
          subscription_end: null, // We don't have this field in our users table yet
        });
      }
    } catch (error) {
      console.warn('Subscription check failed, using fallback:', error);
      // Always provide safe defaults to prevent app blocking
      setSubscriptionData({ 
        subscribed: false, 
        subscription_tier: 'free', 
        subscription_end: null 
      });
    } finally {
      setLoading(false);
    }
  };

  const isFeatureAvailable = (feature: 'google_calendar' | 'export_import' | 'cross_platform'): boolean => {
    if (!subscriptionData.subscribed) return false;
    
    const tier = subscriptionData.subscription_tier;
    if (tier === 'premium' || tier === 'pro' || tier === 'starter') {
      return true;
    }
    
    return false;
  };

  useEffect(() => {
    checkSubscription();
  }, [user, session]);

  const value = {
    subscriptionData,
    loading,
    checkSubscription,
    isFeatureAvailable,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
