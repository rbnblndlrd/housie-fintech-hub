
import { useEffect, useCallback } from 'react';
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
  const handleChange = useCallback((table: string) => (payload: any) => {
    console.log(`Real-time system: ${table} changed`, payload);
    onDataChange?.(table, payload);
  }, [onDataChange]);

  // Set up subscriptions for all tables
  tables.forEach(table => {
    useRealtimeSubscription({
      table,
      event: '*',
      schema: 'public',
      enabled,
      onUpdate: handleChange(table)
    });
  });

  // Health check for real-time system
  useEffect(() => {
    if (!enabled) return;

    const healthCheck = setInterval(() => {
      console.log('Real-time system health check - active subscriptions:', tables);
    }, 30000); // Every 30 seconds

    return () => clearInterval(healthCheck);
  }, [enabled, tables]);

  return {
    isActive: enabled,
    tables
  };
};
