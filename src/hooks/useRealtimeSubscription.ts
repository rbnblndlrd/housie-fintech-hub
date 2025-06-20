
import { useEffect } from 'react';
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
  useEffect(() => {
    if (!enabled || !onUpdate) return;

    console.log(`Setting up real-time subscription for ${schema}.${table}`);
    
    const channelName = `realtime-${table}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
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

    return () => {
      console.log(`Cleaning up real-time subscription for ${table}`);
      supabase.removeChannel(channel);
    };
  }, [table, event, schema, filter, enabled, onUpdate]);
};
