
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
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        setSubscriptionData({ subscribed: false, subscription_tier: null, subscription_end: null });
      } else {
        setSubscriptionData({
          subscribed: data.subscribed || false,
          subscription_tier: data.subscription_tier || null,
          subscription_end: data.subscription_end || null,
        });
      }
    } catch (error) {
      console.error('Error in checkSubscription:', error);
      setSubscriptionData({ subscribed: false, subscription_tier: null, subscription_end: null });
    } finally {
      setLoading(false);
    }
  };

  const isFeatureAvailable = (feature: 'google_calendar' | 'export_import' | 'cross_platform'): boolean => {
    if (!subscriptionData.subscribed) return false;
    
    const tier = subscriptionData.subscription_tier;
    if (tier === 'Premium' || tier === 'Pro' || tier === 'Starter') {
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
