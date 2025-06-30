
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealtimeSubscriptionOptions {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  schema?: string;
  onUpdate?: (payload: any) => void;
  filter?: string;
  enabled?: boolean;
}

export const useRealtimeSubscription = ({
  table,
  event = '*',
  schema = 'public',
  onUpdate,
  filter,
  enabled = true
}: RealtimeSubscriptionOptions) => {
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!enabled || !onUpdate) return;

    // Prevent multiple subscriptions with debounce
    if (isSubscribedRef.current) {
      console.log(`⚠️ Subscription for ${table} already exists, skipping`);
      return;
    }

    // Clear any existing cleanup timeout
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
    }

    console.log(`🔄 Setting up real-time subscription for ${schema}.${table}`);
    
    // Create unique channel name to prevent conflicts
    const channelName = `realtime-${table}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes' as any,
          {
            event,
            schema,
            table,
            ...(filter && { filter })
          },
          (payload) => {
            console.log(`Real-time change in ${table}:`, payload);
            onUpdate(payload);
          }
        )
        .subscribe((status) => {
          console.log(`Subscription status for ${table}:`, status);
          if (status === 'SUBSCRIBED') {
            isSubscribedRef.current = true;
          }
        });

      channelRef.current = channel;
    } catch (error) {
      console.error(`❌ Failed to create subscription for ${table}:`, error);
    }

    return () => {
      console.log(`🧹 Cleaning up real-time subscription for ${table}`);
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch (error) {
          console.warn(`⚠️ Error removing channel for ${table}:`, error);
        }
        channelRef.current = null;
      }
      isSubscribedRef.current = false;
      
      // Add small delay before allowing new subscriptions
      cleanupTimeoutRef.current = setTimeout(() => {
        console.log(`✅ Cleanup complete for ${table}`);
      }, 100);
    };
  }, [table, event, schema, filter, enabled, onUpdate]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    };
  }, []);

  return {
    isSubscribed: isSubscribedRef.current
  };
};
