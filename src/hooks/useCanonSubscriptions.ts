import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CanonSubscription {
  id: string;
  follower_id: string;
  followed_id: string;
  subscribed_event_types: string[] | null;
  minimum_rank: 'local' | 'regional' | 'global' | 'legendary';
  created_at: string;
  followed_user?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export const useCanonSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<CanonSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSubscriptions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('canon_subscriptions')
        .select('*')
        .eq('follower_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user details separately for each subscription
      const subscriptionsWithUsers = await Promise.all(
        (data || []).map(async (sub) => {
          const { data: userData } = await supabase
            .from('users')
            .select('id, email')
            .eq('id', sub.followed_id)
            .single();

          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('full_name')
            .eq('user_id', sub.followed_id)
            .maybeSingle();

          return {
            ...sub,
            minimum_rank: sub.minimum_rank as 'local' | 'regional' | 'global' | 'legendary',
            followed_user: userData ? {
              id: userData.id,
              email: userData.email,
              full_name: profileData?.full_name
            } : undefined
          };
        })
      );

      setSubscriptions(subscriptionsWithUsers);
      setError(null);
    } catch (err) {
      console.error('Error fetching canon subscriptions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (
    followedId: string, 
    eventTypes?: string[], 
    minimumRank: 'local' | 'regional' | 'global' | 'legendary' = 'local'
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('canon_subscriptions')
        .insert({
          follower_id: user.id,
          followed_id: followedId,
          subscribed_event_types: eventTypes || null,
          minimum_rank: minimumRank
        });

      if (error) throw error;

      toast({
        title: "Following!",
        description: "You'll now see their Canon events in your feed.",
      });

      await fetchSubscriptions();
    } catch (err) {
      console.error('Error following user:', err);
      toast({
        title: "Error",
        description: "Failed to follow user.",
        variant: "destructive",
      });
    }
  };

  const unfollowUser = async (followedId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('canon_subscriptions')
        .delete()
        .eq('follower_id', user.id)
        .eq('followed_id', followedId);

      if (error) throw error;

      toast({
        title: "Unfollowed",
        description: "You'll no longer see their Canon events.",
      });

      await fetchSubscriptions();
    } catch (err) {
      console.error('Error unfollowing user:', err);
      toast({
        title: "Error",
        description: "Failed to unfollow user.",
        variant: "destructive",
      });
    }
  };

  const updateSubscription = async (
    followedId: string,
    updates: {
      subscribed_event_types?: string[] | null;
      minimum_rank?: 'local' | 'regional' | 'global' | 'legendary';
    }
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('canon_subscriptions')
        .update(updates)
        .eq('follower_id', user.id)
        .eq('followed_id', followedId);

      if (error) throw error;

      toast({
        title: "Updated",
        description: "Subscription preferences updated.",
      });

      await fetchSubscriptions();
    } catch (err) {
      console.error('Error updating subscription:', err);
      toast({
        title: "Error",
        description: "Failed to update subscription.",
        variant: "destructive",
      });
    }
  };

  const isFollowing = (userId: string) => {
    return subscriptions.some(sub => sub.followed_id === userId);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  return {
    subscriptions,
    loading,
    error,
    followUser,
    unfollowUser,
    updateSubscription,
    isFollowing,
    refetch: fetchSubscriptions
  };
};