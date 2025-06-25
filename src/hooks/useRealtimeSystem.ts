
import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSubscription } from './useRealtimeSubscription';

interface RealtimeSystemOptions {
  tables: string[];
  onDataChange?: (table: string, payload: any) => void;
  enabled?: boolean;
}

export const useRealtimeSystem = ({
  tables,
  onDataChange,
  enabled = true
}: RealtimeSystemOptions) => {
  const subscriptionsRef = useRef<Set<string>>(new Set());
  const isInitializedRef = useRef(false);

  const handleChange = useCallback((table: string) => (payload: any) => {
    console.log(`Real-time system: ${table} changed`, payload);
    onDataChange?.(table, payload);
  }, [onDataChange]);

  useEffect(() => {
    if (!enabled || isInitializedRef.current) return;

    console.log('🔄 Initializing realtime system for tables:', tables);
    
    // Set up subscriptions for all tables
    tables.forEach(table => {
      const subscriptionKey = `${table}-${enabled}-${Date.now()}`;
      
      if (!subscriptionsRef.current.has(subscriptionKey)) {
        subscriptionsRef.current.add(subscriptionKey);
        console.log(`🔄 Setting up subscription for table: ${table}`);
      }
    });

    isInitializedRef.current = true;

    // Health check for real-time system
    const healthCheck = setInterval(() => {
      console.log('Real-time system health check - active subscriptions:', Array.from(subscriptionsRef.current));
    }, 120000); // Every 2 minutes

    return () => {
      console.log('🧹 Cleaning up realtime system');
      clearInterval(healthCheck);
      subscriptionsRef.current.clear();
      isInitializedRef.current = false;
    };
  }, [enabled, tables.join(',')]); // Depend on tables as string to avoid array reference issues

  return {
    isActive: enabled,
    tables,
    subscriptionCount: subscriptionsRef.current.size
  };
};
