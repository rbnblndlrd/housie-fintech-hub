import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CanonVote {
  id: string;
  event_id: string;
  user_id: string;
  vote_type: 'upvote' | 'downvote';
  weight: number;
  timestamp: string;
}

export const useCanonVotes = (eventId: string) => {
  const [votes, setVotes] = useState<CanonVote[]>([]);
  const [userVote, setUserVote] = useState<CanonVote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchVotes = async () => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('canon_votes')
        .select('*')
        .eq('event_id', eventId);

      if (error) throw error;

      setVotes((data as CanonVote[]) || []);
      
      // Find current user's vote
      const currentUserVote = (data as CanonVote[])?.find(vote => vote.user_id === user?.id);
      setUserVote(currentUserVote || null);
      
    } catch (err) {
      console.error('Error fetching votes:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (voteType: 'upvote' | 'downvote') => {
    if (!user || !eventId) return;

    try {
      setLoading(true);
      
      // If user already voted, update the vote
      if (userVote) {
        if (userVote.vote_type === voteType) {
          // Same vote type - remove vote
          const { error } = await supabase
            .from('canon_votes')
            .delete()
            .eq('id', userVote.id);
          
          if (error) throw error;
          setUserVote(null);
        } else {
          // Different vote type - update vote
          const { error } = await supabase
            .from('canon_votes')
            .update({ vote_type: voteType })
            .eq('id', userVote.id);
          
          if (error) throw error;
          setUserVote({ ...userVote, vote_type: voteType });
        }
      } else {
        // No existing vote - create new vote
        const { data, error } = await supabase
          .from('canon_votes')
          .insert({
            event_id: eventId,
            user_id: user.id,
            vote_type: voteType,
            weight: 1
          })
          .select()
          .single();
        
        if (error) throw error;
        setUserVote(data as CanonVote);
      }
      
      // Refresh votes to get updated counts
      await fetchVotes();
      
    } catch (err) {
      console.error('Error casting vote:', err);
      setError(err instanceof Error ? err.message : 'Failed to cast vote');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, [eventId, user?.id]);

  return {
    votes,
    userVote,
    loading,
    error,
    castVote,
    refetch: fetchVotes
  };
};