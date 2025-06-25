
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
  const optionsRef = useRef<string>('');

  useEffect(() => {
    if (!enabled || !onUpdate) return;

    // Create a unique key for these subscription options
    const currentOptions = `${table}-${event}-${schema}-${filter}-${enabled}`;
    
    // Only setup if options have changed
    if (isSubscribedRef.current && optionsRef.current === currentOptions) {
      return;
    }

    console.log(`Setting up real-time subscription for ${schema}.${table}`);
    
    // Clean up existing channel if any
    if (channelRef.current) {
      console.log(`Cleaning up existing subscription for ${table}`);
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      isSubscribedRef.current = false;
    }

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
    optionsRef.current = currentOptions;

    return () => {
      console.log(`Cleaning up real-time subscription for ${table}`);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
        optionsRef.current = '';
      }
    };
  }, [table, event, schema, filter, enabled]); // Include all dependencies

  return {
    isSubscribed: isSubscribedRef.current
  };
};
