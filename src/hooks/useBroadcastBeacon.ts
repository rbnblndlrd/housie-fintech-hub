import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CanonEcho {
  id: string;
  user_id: string;
  message: string;
  broadcast_range: 'local' | 'city' | 'global' | 'whisper';
  canon_confidence: number;
  location: string;
  city: string;
  created_at: string;
  is_unread: boolean;
  pulse_active: boolean;
  tags: string[];
  engagement_count: number;
}

export type BroadcastRangeFilter = 'all' | 'local' | 'city' | 'global';

export const useBroadcastBeacon = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [echoes, setEchoes] = useState<CanonEcho[]>([]);
  const [loading, setLoading] = useState(true);
  const [rangeFilter, setRangeFilter] = useState<BroadcastRangeFilter>('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEchoes();
      setupRealtimeSubscription();
    }
  }, [user, rangeFilter]);

  const fetchEchoes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_filtered_canon_echoes', {
        p_user_id: user.id,
        p_range_filter: rangeFilter,
        p_limit: 50,
        p_offset: 0
      });

      if (error) throw error;

      const echoData = data?.map((echo: any) => ({
        id: echo.id,
        user_id: echo.user_id,
        message: echo.message,
        broadcast_range: echo.broadcast_range,
        canon_confidence: echo.canon_confidence,
        location: echo.location,
        city: echo.city,
        created_at: echo.created_at,
        is_unread: echo.is_unread,
        pulse_active: echo.pulse_active,
        tags: echo.tags || [],
        engagement_count: echo.engagement_count || 0
      })) || [];

      setEchoes(echoData);
      
      // Count unread and check for pulse
      const unread = echoData.filter(echo => echo.is_unread).length;
      const hasPulse = echoData.some(echo => echo.pulse_active);
      
      setUnreadCount(unread);
      setPulseActive(hasPulse);
    } catch (error) {
      console.error('Error fetching canon echoes:', error);
      toast({
        title: "Error loading broadcasts",
        description: "Failed to load Canon Echo Feed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('canon-echoes-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'canon_echoes'
        },
        (payload) => {
          console.log('📡 New Canon Echo broadcast detected:', payload);
          fetchEchoes(); // Refresh the feed
          setPulseActive(true);
          
          // Auto-disable pulse after animation duration
          setTimeout(() => setPulseActive(false), 3000);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'canonical_broadcast_events'
        },
        (payload) => {
          console.log('📡 New Canon Broadcast event detected:', payload);
          fetchEchoes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markEchoesAsRead = async (echoIds: string[]) => {
    if (!user || echoIds.length === 0) return;

    try {
      const { error } = await supabase.rpc('mark_echoes_read', {
        p_user_id: user.id,
        p_echo_ids: echoIds
      });

      if (error) throw error;

      // Update local state
      setEchoes(prev => prev.map(echo => 
        echoIds.includes(echo.id) 
          ? { ...echo, is_unread: false, pulse_active: false }
          : echo
      ));
      
      setUnreadCount(prev => Math.max(0, prev - echoIds.length));
    } catch (error) {
      console.error('Error marking echoes as read:', error);
    }
  };

  const getBroadcastIcon = (range: string) => {
    switch (range) {
      case 'global': return '🌍';
      case 'city': return '🏙️';
      case 'local': return '📍';
      case 'whisper': return '👂';
      default: return '📡';
    }
  };

  const getBroadcastLabel = (range: string) => {
    switch (range) {
      case 'global': return 'Global';
      case 'city': return 'City';
      case 'local': return 'Local';
      case 'whisper': return 'Whisper';
      default: return 'Broadcast';
    }
  };

  const generateAnnetteTransmissionLine = (echo: CanonEcho) => {
    const icon = getBroadcastIcon(echo.broadcast_range);
    
    switch (echo.broadcast_range) {
      case 'global':
        return `${icon} GLOBAL TRANSMISSION: ${echo.message} — Annette broadcasting grid-wide.`;
      case 'city':
        return `${icon} City-wide signal detected: ${echo.message} — This one's making waves across ${echo.city}.`;
      case 'local':
        return `${icon} Local Canon echo: ${echo.message}`;
      case 'whisper':
        return `${icon} Private frequency: ${echo.message}`;
      default:
        return `📡 Canon transmission: ${echo.message}`;
    }
  };

  return {
    echoes,
    loading,
    rangeFilter,
    setRangeFilter,
    unreadCount,
    pulseActive,
    markEchoesAsRead,
    getBroadcastIcon,
    getBroadcastLabel,
    generateAnnetteTransmissionLine,
    refreshEchoes: fetchEchoes
  };
};