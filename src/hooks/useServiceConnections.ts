import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ServiceConnection {
  id: string;
  user_one_id: string;
  user_two_id: string;
  connection_tier: 'service' | 'trusted' | 'network';
  service_connection_count: number;
  cred_connection_established: boolean;
  can_message: boolean;
  last_booked_date: string;
  other_user?: {
    id: string;
    full_name: string;
    profile_image?: string;
  };
}

export interface RebookingSuggestion {
  provider_name: string;
  provider_user_id: string;
  service_type: string;
  last_booking_date: string;
  suggested_date: string;
  frequency_pattern?: string;
  total_bookings: number;
}

export const useServiceConnections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<ServiceConnection[]>([]);
  const [rebookingSuggestions, setRebookingSuggestions] = useState<RebookingSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const loadServiceConnections = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // First get the connections
      const { data: connectionsData, error: connectionsError } = await supabase
        .from('service_connections')
        .select('*')
        .or(`user_one_id.eq.${user.id},user_two_id.eq.${user.id}`)
        .order('last_booked_date', { ascending: false });

      if (connectionsError) throw connectionsError;

      if (!connectionsData) {
        setConnections([]);
        return;
      }

      // Get user details for each connection
      const userIds = connectionsData.flatMap(conn => [conn.user_one_id, conn.user_two_id])
        .filter(id => id !== user.id);

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, profile_image')
        .in('id', userIds);

      if (usersError) throw usersError;

      const processedConnections: ServiceConnection[] = connectionsData.map(conn => {
        const otherUserId = conn.user_one_id === user.id ? conn.user_two_id : conn.user_one_id;
        const otherUser = usersData?.find(u => u.id === otherUserId);
        
        return {
          ...conn,
          connection_tier: conn.connection_tier as 'service' | 'trusted' | 'network',
          other_user: otherUser ? {
            id: otherUser.id,
            full_name: otherUser.full_name || 'Unknown User',
            profile_image: otherUser.profile_image || undefined
          } : undefined
        };
      });

      setConnections(processedConnections);
    } catch (error) {
      console.error('Error loading service connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRebookingSuggestions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('get_rebooking_suggestions', { user_uuid: user.id });

      if (error) throw error;
      setRebookingSuggestions(data || []);
    } catch (error) {
      console.error('Error loading rebooking suggestions:', error);
    }
  };

  const checkMessagingPermission = async (targetUserId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .rpc('can_message_user', { target_user_id: targetUserId });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error checking messaging permission:', error);
      return false;
    }
  };

  const markRebookingSuggestionActedOn = async (providerUserId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('rebooking_suggestions')
        .update({ suggestion_acted_on: true })
        .eq('user_id', user.id)
        .eq('provider_user_id', providerUserId);
    } catch (error) {
      console.error('Error marking rebooking suggestion as acted on:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadServiceConnections();
      loadRebookingSuggestions();
    }
  }, [user]);

  return {
    connections,
    rebookingSuggestions,
    loading,
    checkMessagingPermission,
    markRebookingSuggestionActedOn,
    refreshConnections: loadServiceConnections,
    refreshSuggestions: loadRebookingSuggestions
  };
};