import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface MetaChainDefinition {
  id: string;
  name: string;
  description: string;
  trigger_requirements: any;
  required_chain_count: number;
  required_chain_types: any;
  prestige_title: string;
  annette_voice_line: string;
  reward_data: any;
}

export interface UserMetaChain {
  id: string;
  meta_chain_id: string;
  achieved_at: string;
  sealed_chain_sequence: string[];
  achievement_context: any;
  meta_chain_definition: MetaChainDefinition;
}

export interface ChainSealTimelineEntry {
  id: string;
  chain_id: string;
  sealed_at: string;
  chain_title: string;
  chain_theme: string;
  prestige_title_awarded: string;
  seal_annotation: string;
  sequence_position: number;
  meta_significance: string;
}

export const useMetaChains = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch available meta-chain definitions
  const { data: metaChainDefinitions = [], isLoading: definitionsLoading } = useQuery({
    queryKey: ['meta-chain-definitions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meta_chain_definitions')
        .select('*')
        .eq('is_active', true)
        .order('required_chain_count', { ascending: true });
        
      if (error) throw error;
      return data as MetaChainDefinition[];
    }
  });

  // Fetch user's meta-chain achievements
  const { data: userMetaChains = [], isLoading: userMetaChainsLoading } = useQuery({
    queryKey: ['user-meta-chains', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_meta_chains')
        .select(`
          *,
          meta_chain_definitions (*)
        `)
        .eq('user_id', user.id)
        .order('achieved_at', { ascending: false });
        
      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        meta_chain_definition: item.meta_chain_definitions
      })) as UserMetaChain[];
    },
    enabled: !!user?.id
  });

  // Fetch user's chain seal timeline
  const { data: sealTimeline = [], isLoading: timelineLoading } = useQuery({
    queryKey: ['chain-seal-timeline', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('chain_seal_timeline')
        .select('*')
        .eq('user_id', user.id)
        .order('sealed_at', { ascending: true });
        
      if (error) throw error;
      return data as ChainSealTimelineEntry[];
    },
    enabled: !!user?.id
  });

  // Check meta-chain eligibility
  const checkMetaChainEligibility = (definition: MetaChainDefinition): {
    eligible: boolean;
    progress: number;
    requirements: string[];
  } => {
    if (!user?.id) return { eligible: false, progress: 0, requirements: [] };
    
    const requirements: string[] = [];
    let progress = 0;
    
    // Check if already achieved
    const alreadyAchieved = userMetaChains.some(mc => mc.meta_chain_id === definition.id);
    if (alreadyAchieved) {
      return { eligible: false, progress: 100, requirements: ['Already achieved'] };
    }
    
    const sealedChains = sealTimeline.length;
    
    // Check basic chain count requirement
    if (definition.id === 'kind-of-big-deal') {
      progress = Math.min((sealedChains / 5) * 100, 100);
      requirements.push(`Seal ${Math.max(0, 5 - sealedChains)} more chains (${sealedChains}/5)`);
      return { eligible: sealedChains >= 5, progress, requirements };
    }
    
    // Check annotation requirement for Storybound
    if (definition.id === 'storybound') {
      const annotatedChains = sealTimeline.filter(
        entry => entry.seal_annotation && entry.seal_annotation.length > 10
      ).length;
      
      progress = Math.min((annotatedChains / 3) * 100, 100);
      requirements.push(`Add annotations to ${Math.max(0, 3 - annotatedChains)} more chains (${annotatedChains}/3)`);
      return { eligible: annotatedChains >= 3, progress, requirements };
    }
    
    // Default chain count check
    progress = Math.min((sealedChains / definition.required_chain_count) * 100, 100);
    requirements.push(`Seal ${Math.max(0, definition.required_chain_count - sealedChains)} more chains`);
    
    return { 
      eligible: sealedChains >= definition.required_chain_count, 
      progress, 
      requirements 
    };
  };

  // Get Hall of Legends data (public timelines)
  const { data: hallOfLegends = [], isLoading: hallLoading } = useQuery({
    queryKey: ['hall-of-legends'],
    queryFn: async () => {
      // First get users who allow public timeline
      const { data: publicUsers, error: usersError } = await supabase
        .from('user_profiles')
        .select('user_id, username, full_name')
        .eq('allow_public_timeline', true);
        
      if (usersError) throw usersError;
      
      if (!publicUsers || publicUsers.length === 0) return [];
      
      const publicUserIds = publicUsers.map(u => u.user_id);
      
      // Then get timeline entries for public users
      const { data, error } = await supabase
        .from('chain_seal_timeline')
        .select('*')
        .in('user_id', publicUserIds)
        .order('sealed_at', { ascending: false })
        .limit(50);
        
      if (error) throw error;
      
      // Merge with user profile data
      return data.map(entry => ({
        ...entry,
        user_profile: publicUsers.find(u => u.user_id === entry.user_id)
      })) || [];
    }
  });

  // Toggle public timeline visibility
  const togglePublicTimelineMutation = useMutation({
    mutationFn: async (isPublic: boolean) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ allow_public_timeline: isPublic })
        .eq('user_id', user.id);
        
      if (error) throw error;
    },
    onSuccess: (_, isPublic) => {
      queryClient.invalidateQueries({ queryKey: ['hall-of-legends'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success(
        isPublic 
          ? 'Your chain achievements are now public in the Hall of Legends!'
          : 'Your chain achievements are now private.'
      );
    },
    onError: (error) => {
      console.error('Error updating public timeline:', error);
      toast.error('Failed to update timeline visibility');
    }
  });

  return {
    metaChainDefinitions,
    userMetaChains,
    sealTimeline,
    hallOfLegends,
    isLoading: definitionsLoading || userMetaChainsLoading || timelineLoading,
    checkMetaChainEligibility,
    togglePublicTimeline: togglePublicTimelineMutation.mutate,
    isTogglingPublic: togglePublicTimelineMutation.isPending
  };
};