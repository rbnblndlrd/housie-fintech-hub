import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CanonReaction {
  id: string;
  event_id: string;
  user_id: string;
  reaction_type: 'cheer' | 'awe' | 'hilarious' | 'repost' | 'boost' | 'tearjerker';
  timestamp: string;
}

export const REACTION_CONFIG = {
  cheer: { emoji: '🎉', label: 'Cheer', score: 1 },
  awe: { emoji: '💬', label: 'Awe', score: 2 },
  hilarious: { emoji: '😂', label: 'Hilarious', score: 1 },
  repost: { emoji: '🔁', label: 'Repost', score: 3 },
  boost: { emoji: '🔥', label: 'Boost', score: 5 },
  tearjerker: { emoji: '😢', label: 'Tearjerker', score: 4 }
} as const;

export const useCanonReactions = (eventId?: string) => {
  const [reactions, setReactions] = useState<CanonReaction[]>([]);
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReactions = async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('canon_reactions')
        .select('*')
        .eq('event_id', eventId)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      setReactions((data as CanonReaction[]) || []);

      // Track user's reactions
      if (user) {
        const userReactionTypes = new Set(
          (data || [])
            .filter(r => r.user_id === user.id)
            .map(r => r.reaction_type)
        );
        setUserReactions(userReactionTypes);
      }
    } catch (err) {
      console.error('Error fetching reactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const addReaction = async (reactionType: keyof typeof REACTION_CONFIG) => {
    if (!user || !eventId) return;

    try {
      const { error } = await supabase
        .from('canon_reactions')
        .insert({
          event_id: eventId,
          user_id: user.id,
          reaction_type: reactionType
        });

      if (error) throw error;

      setUserReactions(prev => new Set([...prev, reactionType]));
      await fetchReactions();

      toast({
        title: "Reaction added!",
        description: `${REACTION_CONFIG[reactionType].emoji} ${REACTION_CONFIG[reactionType].label}`,
      });
    } catch (err) {
      console.error('Error adding reaction:', err);
      toast({
        title: "Error",
        description: "Failed to add reaction.",
        variant: "destructive",
      });
    }
  };

  const removeReaction = async (reactionType: keyof typeof REACTION_CONFIG) => {
    if (!user || !eventId) return;

    try {
      const { error } = await supabase
        .from('canon_reactions')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .eq('reaction_type', reactionType);

      if (error) throw error;

      setUserReactions(prev => {
        const newSet = new Set(prev);
        newSet.delete(reactionType);
        return newSet;
      });
      await fetchReactions();
    } catch (err) {
      console.error('Error removing reaction:', err);
      toast({
        title: "Error",
        description: "Failed to remove reaction.",
        variant: "destructive",
      });
    }
  };

  const toggleReaction = async (reactionType: keyof typeof REACTION_CONFIG) => {
    if (userReactions.has(reactionType)) {
      await removeReaction(reactionType);
    } else {
      await addReaction(reactionType);
    }
  };

  const getReactionCounts = () => {
    const counts: Record<string, number> = {};
    reactions.forEach(reaction => {
      counts[reaction.reaction_type] = (counts[reaction.reaction_type] || 0) + 1;
    });
    return counts;
  };

  const getTotalEchoScore = () => {
    const counts = getReactionCounts();
    return Object.entries(counts).reduce((total, [type, count]) => {
      return total + (REACTION_CONFIG[type as keyof typeof REACTION_CONFIG]?.score || 1) * count;
    }, 0);
  };

  useEffect(() => {
    fetchReactions();
  }, [eventId, user]);

  return {
    reactions,
    userReactions,
    loading,
    addReaction,
    removeReaction,
    toggleReaction,
    getReactionCounts,
    getTotalEchoScore,
    refetch: fetchReactions
  };
};