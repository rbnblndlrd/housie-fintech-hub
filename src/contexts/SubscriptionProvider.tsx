
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  isSubscribed: boolean;
  subscriptionStatus: string;
  subscriptionTier: string;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');
  const [subscriptionTier, setSubscriptionTier] = useState('basic');

  useEffect(() => {
    if (user) {
      // For now, set all authenticated users as subscribed basic tier
      setIsSubscribed(true);
      setSubscriptionStatus('active');
      setSubscriptionTier('basic');
    } else {
      setIsSubscribed(false);
      setSubscriptionStatus('free');
      setSubscriptionTier('basic');
    }
  }, [user]);

  const value = {
    isSubscribed,
    subscriptionStatus,
    subscriptionTier
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
