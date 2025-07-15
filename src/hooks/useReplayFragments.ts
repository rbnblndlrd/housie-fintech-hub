import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ReplayFragment {
  id: string;
  event_id: string;
  timestamp: string;
  type: 'quote' | 'photo' | 'stat' | 'location' | 'reaction';
  content?: string;
  image_url?: string;
  audio_url?: string;
  step_order: number;
  created_at: string;
  updated_at: string;
}

export const useReplayFragments = (eventId?: string) => {
  const [fragments, setFragments] = useState<ReplayFragment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchFragments = async () => {
    if (!eventId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('replay_fragments')
        .select('*')
        .eq('event_id', eventId)
        .order('step_order', { ascending: true });

      if (fetchError) throw fetchError;

      setFragments((data || []) as ReplayFragment[]);
    } catch (err) {
      console.error('Error fetching replay fragments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch replay fragments');
    } finally {
      setLoading(false);
    }
  };

  const createFragment = async (fragmentData: Omit<ReplayFragment, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error: createError } = await supabase
        .from('replay_fragments')
        .insert([fragmentData])
        .select()
        .single();

      if (createError) throw createError;

      setFragments(prev => [...prev, data as ReplayFragment].sort((a, b) => a.step_order - b.step_order));
      return data;
    } catch (err) {
      console.error('Error creating replay fragment:', err);
      setError(err instanceof Error ? err.message : 'Failed to create replay fragment');
      throw err;
    }
  };

  const updateFragment = async (fragmentId: string, updates: Partial<ReplayFragment>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('replay_fragments')
        .update(updates)
        .eq('id', fragmentId)
        .select()
        .single();

      if (updateError) throw updateError;

      setFragments(prev => 
        prev.map(f => f.id === fragmentId ? { ...f, ...data } as ReplayFragment : f)
          .sort((a, b) => a.step_order - b.step_order)
      );
      return data;
    } catch (err) {
      console.error('Error updating replay fragment:', err);
      setError(err instanceof Error ? err.message : 'Failed to update replay fragment');
      throw err;
    }
  };

  const deleteFragment = async (fragmentId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('replay_fragments')
        .delete()
        .eq('id', fragmentId);

      if (deleteError) throw deleteError;

      setFragments(prev => prev.filter(f => f.id !== fragmentId));
    } catch (err) {
      console.error('Error deleting replay fragment:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete replay fragment');
      throw err;
    }
  };

  const generateReplay = async (eventId: string) => {
    try {
      const { data, error: generateError } = await supabase.functions.invoke('auto-generate-replay', {
        body: { eventId }
      });

      if (generateError) throw generateError;

      await fetchFragments(); // Refresh fragments after generation
      return data;
    } catch (err) {
      console.error('Error generating replay:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate replay');
      throw err;
    }
  };

  useEffect(() => {
    fetchFragments();
  }, [eventId]);

  return {
    fragments,
    loading,
    error,
    createFragment,
    updateFragment,
    deleteFragment,
    generateReplay,
    refetch: fetchFragments
  };
};