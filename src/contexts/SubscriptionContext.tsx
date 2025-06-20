
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  is_admin: boolean;
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
    is_admin: false,
  });
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();

  const checkSubscription = async () => {
    if (!user || !session) {
      setSubscriptionData({ 
        subscribed: false, 
        subscription_tier: null, 
        subscription_end: null, 
        is_admin: false 
      });
      setLoading(false);
      return;
    }

    try {
      // Check admin status from auth metadata
      const isAdminFromAuth = user?.user_metadata?.is_admin === true;
      
      // Get user data from our users table to check subscription_tier
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        setSubscriptionData({ 
          subscribed: false, 
          subscription_tier: null, 
          subscription_end: null, 
          is_admin: isAdminFromAuth 
        });
      } else {
        const tier = userData?.subscription_tier || 'free';
        const hasSubscription = ['starter', 'pro', 'premium'].includes(tier);
        
        setSubscriptionData({
          subscribed: hasSubscription,
          subscription_tier: tier,
          subscription_end: null, // Can be enhanced later with actual subscription end dates
          is_admin: isAdminFromAuth,
        });
      }
    } catch (error) {
      console.error('Error in checkSubscription:', error);
      setSubscriptionData({ 
        subscribed: false, 
        subscription_tier: null, 
        subscription_end: null, 
        is_admin: false 
      });
    } finally {
      setLoading(false);
    }
  };

  const isFeatureAvailable = (feature: 'google_calendar' | 'export_import' | 'cross_platform'): boolean => {
    // Admin users have access to everything
    if (subscriptionData.is_admin) return true;
    
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
