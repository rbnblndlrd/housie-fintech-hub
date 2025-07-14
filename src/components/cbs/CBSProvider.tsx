// CBS Provider - Automatically initializes the Canonical Broadcast System

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCBSEngine } from '@/hooks/useCBSEngine';
import { CBSEvent } from '@/lib/cbs/types';
import { useAuth } from '@/contexts/AuthContext';

interface CBSContextType {
  isInitialized: boolean;
  recentEvents: CBSEvent[];
  eventStats: {
    totalEvents: number;
    verifiedEvents: number;
    eventsByType: Record<string, number>;
    recentEvents: CBSEvent[];
  };
  broadcastEvent: (event: any) => Promise<string | null>;
  loadRecentEvents: () => Promise<void>;
}

const CBSContext = createContext<CBSContextType | null>(null);

interface CBSProviderProps {
  children: React.ReactNode;
  enableForGuests?: boolean;
}

export const CBSProvider: React.FC<CBSProviderProps> = ({ 
  children, 
  enableForGuests = false 
}) => {
  const { user } = useAuth();
  const [shouldInitialize, setShouldInitialize] = useState(false);

  // Initialize CBS only for authenticated users or when explicitly enabled for guests
  useEffect(() => {
    setShouldInitialize(!!(user || enableForGuests));
  }, [user, enableForGuests]);

  const {
    isInitialized,
    recentEvents,
    eventStats,
    broadcastEvent,
    loadRecentEvents
  } = useCBSEngine({
    autoInitialize: shouldInitialize,
    userId: user?.id
  });

  // Log initialization status
  useEffect(() => {
    if (isInitialized) {
      console.log('🎯 CBS System: Online and monitoring Canon events');
    }
  }, [isInitialized]);

  const contextValue: CBSContextType = {
    isInitialized,
    recentEvents,
    eventStats,
    broadcastEvent,
    loadRecentEvents
  };

  return (
    <CBSContext.Provider value={contextValue}>
      {children}
    </CBSContext.Provider>
  );
};

export const useCBS = (): CBSContextType => {
  const context = useContext(CBSContext);
  if (!context) {
    throw new Error('useCBS must be used within a CBSProvider');
  }
  return context;
};