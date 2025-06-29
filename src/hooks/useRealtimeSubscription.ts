
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

  useEffect(() => {
    if (!enabled || !onUpdate) return;

    // Prevent multiple subscriptions
    if (isSubscribedRef.current) {
      return;
    }

    console.log(`Setting up real-time subscription for ${schema}.${table}`);
    
    // Create unique channel name to prevent conflicts
    const channelName = `realtime-${table}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
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
      .subscribe();

    channelRef.current = channel;
    isSubscribedRef.current = true;

    return () => {
      console.log(`Cleaning up real-time subscription for ${table}`);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [table, event, schema, filter, enabled, onUpdate]);

  return {
    isSubscribed: isSubscribedRef.current
  };
};
