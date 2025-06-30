
import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const channelsRef = useRef<any[]>([]);

  const handleChange = useCallback((table: string) => (payload: any) => {
    console.log(`Real-time system: ${table} changed`, payload);
    onDataChange?.(table, payload);
  }, [onDataChange]);

  useEffect(() => {
    if (!enabled || isInitializedRef.current) return;

    console.log('🔄 Initializing realtime system for tables:', tables);
    
    // Clean up any existing channels first
    channelsRef.current.forEach(channel => {
      try {
        supabase.removeChannel(channel);
      } catch (error) {
        console.warn('⚠️ Error removing existing channel:', error);
      }
    });
    channelsRef.current = [];
    
    // Set up subscriptions for all tables
    tables.forEach(table => {
      const subscriptionKey = `${table}-${Date.now()}`;
      
      if (!subscriptionsRef.current.has(subscriptionKey)) {
        subscriptionsRef.current.add(subscriptionKey);
        console.log(`🔄 Setting up subscription for table: ${table}`);
        
        try {
          const channel = supabase
            .channel(`realtime-system-${subscriptionKey}`)
            .on(
              'postgres_changes' as any,
              {
                event: '*',
                schema: 'public',
                table
              },
              handleChange(table)
            )
            .subscribe();
            
          channelsRef.current.push(channel);
        } catch (error) {
          console.error(`❌ Failed to setup subscription for ${table}:`, error);
        }
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
      
      // Clean up all channels
      channelsRef.current.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.warn('⚠️ Error removing channel during cleanup:', error);
        }
      });
      channelsRef.current = [];
      
      subscriptionsRef.current.clear();
      isInitializedRef.current = false;
    };
  }, [enabled, tables.join(','), handleChange]); // Depend on tables as string to avoid array reference issues

  return {
    isActive: enabled,
    tables,
    subscriptionCount: subscriptionsRef.current.size
  };
};
