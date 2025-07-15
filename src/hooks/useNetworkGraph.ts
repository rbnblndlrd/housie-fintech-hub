import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface TrustConnection {
  target_id: string;
  trust_score: number;
  last_seen: string;
  canon_event_ids: string[];
}

export interface NetworkGraphData {
  connections: TrustConnection[];
  graph_date: string;
  updated_at: string;
}

export interface NetworkVisibilitySettings {
  is_public: boolean;
  show_partial_graph: boolean;
  anonymize_connections: boolean;
}

export function useNetworkGraph(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  const [graphData, setGraphData] = useState<NetworkGraphData | null>(null);
  const [visibilitySettings, setVisibilitySettings] = useState<NetworkVisibilitySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNetworkData = async () => {
    if (!targetUserId) return;

    try {
      setLoading(true);
      setError(null);

      // Load trust graph snapshot
      const { data: graphSnapshot, error: graphError } = await supabase
        .from('user_trust_graph_snapshots')
        .select('*')
        .eq('user_id', targetUserId)
        .order('graph_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (graphError) throw graphError;

      // Load visibility settings
      const { data: visibilityData, error: visibilityError } = await supabase
        .from('network_visibility_settings')
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (visibilityError) throw visibilityError;

      setGraphData(graphSnapshot ? {
        connections: graphSnapshot.connections as unknown as TrustConnection[],
        graph_date: graphSnapshot.graph_date,
        updated_at: graphSnapshot.updated_at
      } : null);

      setVisibilitySettings(visibilityData || {
        is_public: false,
        show_partial_graph: true,
        anonymize_connections: false
      });

    } catch (err) {
      console.error('Error loading network data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load network data');
    } finally {
      setLoading(false);
    }
  };

  const generateTrustGraph = async () => {
    if (!user?.id || targetUserId !== user.id) {
      throw new Error('Can only generate own trust graph');
    }

    try {
      const { data, error } = await supabase.rpc('generate_user_trust_graph', {
        p_user_id: user.id
      });

      if (error) throw error;

      // Insert or update the snapshot
      const { error: insertError } = await supabase
        .from('user_trust_graph_snapshots')
        .upsert({
          user_id: user.id,
          connections: data,
          graph_date: new Date().toISOString().split('T')[0]
        });

      if (insertError) throw insertError;

      await loadNetworkData();
      return data;
    } catch (err) {
      console.error('Error generating trust graph:', err);
      throw err;
    }
  };

  const updateVisibilitySettings = async (updates: Partial<NetworkVisibilitySettings>) => {
    if (!user?.id || targetUserId !== user.id) {
      throw new Error('Can only update own visibility settings');
    }

    try {
      const { data, error } = await supabase
        .from('network_visibility_settings')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setVisibilitySettings(data);
      return data;
    } catch (err) {
      console.error('Error updating visibility settings:', err);
      throw err;
    }
  };

  const getConnectionsByType = (type: 'all' | 'canon' | 'crew' | 'broadcast') => {
    if (!graphData) return [];

    const connections = graphData.connections;

    switch (type) {
      case 'canon':
        return connections.filter(conn => conn.canon_event_ids.length > 0);
      case 'crew':
        // Future: filter by crew connections
        return connections.filter(conn => conn.trust_score > 50);
      case 'broadcast':
        return connections.filter(conn => conn.canon_event_ids.length > 0);
      case 'all':
      default:
        return connections;
    }
  };

  useEffect(() => {
    if (targetUserId) {
      loadNetworkData();
    }
  }, [targetUserId]);

  const refreshNetworkData = () => {
    if (targetUserId) {
      loadNetworkData();
    }
  };

  return {
    graphData,
    visibilitySettings,
    loading,
    error,
    generateTrustGraph,
    updateVisibilitySettings,
    getConnectionsByType,
    refreshNetworkData
  };
}