
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

  const handleChange = useCallback((table: string) => (payload: any) => {
    console.log(`Real-time system: ${table} changed`, payload);
    onDataChange?.(table, payload);
  }, []); // Stable callback

  // Set up subscriptions for all tables
  tables.forEach(table => {
    const subscriptionKey = `${table}-${enabled}`;
    
    // Only create subscription if not already exists
    if (!subscriptionsRef.current.has(subscriptionKey)) {
      subscriptionsRef.current.add(subscriptionKey);
      
      useRealtimeSubscription({
        table,
        event: '*',
        schema: 'public',
        enabled,
        onUpdate: handleChange(table)
      });
    }
  });

  // Health check for real-time system
  useEffect(() => {
    if (!enabled) return;

    const healthCheck = setInterval(() => {
      console.log('Real-time system health check - active subscriptions:', Array.from(subscriptionsRef.current));
    }, 60000); // Every 60 seconds (reduced frequency)

    return () => {
      clearInterval(healthCheck);
      subscriptionsRef.current.clear();
    };
  }, [enabled]); // Only depend on enabled

  return {
    isActive: enabled,
    tables,
    subscriptionCount: subscriptionsRef.current.size
  };
};
