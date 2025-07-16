import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface StampStoryline {
  id: string;
  user_id: string;
  storyline_type: string;
  title: string;
  description: string;
  progression_stage: number;
  total_stages: number;
  is_complete: boolean;
  theme_color: string;
  icon: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  metadata: any;
}

export interface StorylineProgression {
  id: string;
  storyline_id: string;
  user_stamp_id: string;
  stage_number: number;
  narrative_text: string;
  trigger_context: any;
  created_at: string;
}

export interface CanonicalChain {
  id: string;
  user_id: string;
  title: string;
  description: string;
  is_public: boolean;
  chain_sequence: string[];
  storyline_ids: string[];
  prestige_score: number;
  theme: string;
  visual_style: string;
  annotations: Array<{ stamp_id: string; note: string; }>;
  created_at: string;
  updated_at: string;
  last_stamp_added_at?: string;
  metadata: any;
  is_complete: boolean;
  completion_timestamp?: string;
  sealed_by_user_id?: string;
  completed_stamp_id?: string;
  mint_token_id?: string;
  completion_annotation?: string;
}

export function useStorylines() {
  const { user } = useAuth();
  const [storylines, setStorylines] = useState<StampStoryline[]>([]);
  const [progressions, setProgressions] = useState<StorylineProgression[]>([]);
  const [canonicalChain, setCanonicalChain] = useState<CanonicalChain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStorylineData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Load storylines
      const { data: storylinesData, error: storylinesError } = await supabase
        .from('stamp_storylines')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (storylinesError) throw storylinesError;

      // Load progressions
      const { data: progressionsData, error: progressionsError } = await supabase
        .from('storyline_progressions')
        .select('*')
        .in('storyline_id', (storylinesData || []).map(s => s.id))
        .order('stage_number', { ascending: true });

      if (progressionsError) throw progressionsError;

      // Load canonical chain
      const { data: chainData, error: chainError } = await supabase
        .from('canonical_chains')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (chainError && chainError.code !== 'PGRST116') throw chainError;

      // Transform the data to match interfaces
      const transformedStorylines = (storylinesData || []).map((item: any) => ({
        ...item,
        metadata: item.metadata || {},
        chain_sequence: Array.isArray(item.chain_sequence) ? item.chain_sequence.map(String) : []
      }));

      const transformedProgressions = (progressionsData || []).map((item: any) => ({
        ...item,
        trigger_context: item.trigger_context || {}
      }));

      const transformedChain = chainData ? {
        ...chainData,
        chain_sequence: Array.isArray(chainData.chain_sequence) ? chainData.chain_sequence.map(String) : [],
        storyline_ids: Array.isArray(chainData.storyline_ids) ? chainData.storyline_ids.map(String) : [],
        annotations: Array.isArray(chainData.annotations) ? 
          chainData.annotations.map((ann: any) => ({
            stamp_id: ann.stamp_id || '',
            note: ann.note || ''
          })) : [],
        metadata: chainData.metadata || {}
      } : null;

      setStorylines(transformedStorylines);
      setProgressions(transformedProgressions);
      setCanonicalChain(transformedChain);
    } catch (err) {
      console.error('Error loading storyline data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load storylines');
    } finally {
      setLoading(false);
    }
  };

  const updateChainTitle = async (title: string) => {
    if (!user?.id || !canonicalChain) return false;

    try {
      const { error } = await supabase
        .from('canonical_chains')
        .update({ title })
        .eq('id', canonicalChain.id);

      if (error) throw error;

      setCanonicalChain(prev => prev ? { ...prev, title } : null);
      return true;
    } catch (err) {
      console.error('Error updating chain title:', err);
      return false;
    }
  };

  const toggleChainPublic = async () => {
    if (!user?.id || !canonicalChain) return false;

    try {
      const newPublicState = !canonicalChain.is_public;
      const { error } = await supabase
        .from('canonical_chains')
        .update({ is_public: newPublicState })
        .eq('id', canonicalChain.id);

      if (error) throw error;

      setCanonicalChain(prev => prev ? { ...prev, is_public: newPublicState } : null);
      return true;
    } catch (err) {
      console.error('Error toggling chain visibility:', err);
      return false;
    }
  };

  const addAnnotation = async (stampId: string, note: string) => {
    if (!user?.id || !canonicalChain) return false;

    try {
      const currentAnnotations = canonicalChain.annotations || [];
      const existingIndex = currentAnnotations.findIndex(a => a.stamp_id === stampId);
      
      let newAnnotations;
      if (existingIndex >= 0) {
        // Update existing annotation
        newAnnotations = [...currentAnnotations];
        newAnnotations[existingIndex] = { stamp_id: stampId, note };
      } else {
        // Add new annotation
        newAnnotations = [...currentAnnotations, { stamp_id: stampId, note }];
      }

      const { error } = await supabase
        .from('canonical_chains')
        .update({ annotations: newAnnotations })
        .eq('id', canonicalChain.id);

      if (error) throw error;

      setCanonicalChain(prev => prev ? { ...prev, annotations: newAnnotations } : null);
      return true;
    } catch (err) {
      console.error('Error adding annotation:', err);
      return false;
    }
  };

  const getStorylineProgressions = (storylineId: string) => {
    return progressions.filter(p => p.storyline_id === storylineId);
  };

  const getCompletedStorylines = () => {
    return storylines.filter(s => s.is_complete);
  };

  const getActiveStorylines = () => {
    return storylines.filter(s => !s.is_complete);
  };

  const sealCanonicalChain = async (finalStampId?: string, annotation?: string): Promise<{ success: boolean; error?: string; prestige_title?: string; broadcast_created?: boolean }> => {
    if (!user?.id || !canonicalChain || canonicalChain.is_complete) return { success: false, error: 'Invalid chain state' };

    try {
      const { data, error } = await supabase
        .rpc('seal_canonical_chain', {
          p_chain_id: canonicalChain.id,
          p_user_id: user.id,
          p_final_stamp_id: finalStampId,
          p_annotation: annotation
        });

      if (error) throw error;

      // Refresh the chain data
      await loadStorylineData();
      
      return data as { success: boolean; error?: string; prestige_title?: string; broadcast_created?: boolean };
    } catch (err) {
      console.error('Error sealing chain:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to seal chain' };
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadStorylineData();
    }
  }, [user?.id]);

  return {
    storylines,
    progressions,
    canonicalChain,
    loading,
    error,
    updateChainTitle,
    toggleChainPublic,
    addAnnotation,
    sealCanonicalChain,
    getStorylineProgressions,
    getCompletedStorylines,
    getActiveStorylines,
    refreshStorylines: loadStorylineData
  };
}