import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Users, Settings, UserMinus, UserPlus } from 'lucide-react';
import { useCanonSubscriptions, CanonSubscription } from '@/hooks/useCanonSubscriptions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const EVENT_TYPES = [
  { value: 'prestige_milestone', label: 'Prestige Milestones' },
  { value: 'cluster_built', label: 'Cluster Building' },
  { value: 'crew_saved_the_day', label: 'Crew Heroics' },
  { value: 'opportunity_formed', label: 'Opportunities' },
  { value: 'rare_unlock', label: 'Rare Unlocks' },
  { value: 'review_commendation', label: 'Commendations' }
];

const RANK_OPTIONS = [
  { value: 'local', label: 'Local+', description: 'All ranks' },
  { value: 'regional', label: 'Regional+', description: 'Regional and above' },
  { value: 'global', label: 'Global+', description: 'Global and legendary only' },
  { value: 'legendary', label: 'Legendary', description: 'Only legendary events' }
];

interface UserSearchResult {
  id: string;
  email: string;
  full_name?: string;
}

export const CanonSubscriptionsSettings: React.FC = () => {
  const { subscriptions, loading, followUser, unfollowUser, updateSubscription, isFollowing } = useCanonSubscriptions();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<CanonSubscription | null>(null);
  const { toast } = useToast();

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const { data: users } = await supabase
        .from('users')
        .select('id, email')
        .or(`email.ilike.%${searchQuery}%`)
        .limit(10);

      if (users) {
        // Get profile names for the users
        const usersWithProfiles = await Promise.all(
          users.map(async (user) => {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('full_name')
              .eq('user_id', user.id)
              .maybeSingle();

            return {
              ...user,
              full_name: profile?.full_name
            };
          })
        );

        setSearchResults(usersWithProfiles);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Error",
        description: "Failed to search users.",
        variant: "destructive"
      });
    } finally {
      setSearching(false);
    }
  };

  const handleFollowUser = async (userId: string) => {
    await followUser(userId);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleUpdateSubscription = async (
    followedId: string,
    eventTypes: string[],
    minimumRank: 'local' | 'regional' | 'global' | 'legendary'
  ) => {
    await updateSubscription(followedId, {
      subscribed_event_types: eventTypes.length > 0 ? eventTypes : null,
      minimum_rank: minimumRank
    });
    setEditingSubscription(null);
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Follow Canon Broadcasters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
                className="pl-9"
              />
            </div>
            <Button onClick={searchUsers} disabled={searching || !searchQuery.trim()}>
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{user.full_name || user.email}</p>
                    {user.full_name && <p className="text-sm text-muted-foreground">{user.email}</p>}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleFollowUser(user.id)}
                    disabled={isFollowing(user.id)}
                  >
                    {isFollowing(user.id) ? 'Following' : 'Follow'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Your Canon Subscriptions ({subscriptions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading subscriptions...</p>
          ) : subscriptions.length === 0 ? (
            <p className="text-muted-foreground">
              You're not following any Canon broadcasters yet. Search above to start following!
            </p>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {subscription.followed_user?.full_name || subscription.followed_user?.email || 'Unknown User'}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{subscription.minimum_rank}+</Badge>
                      {subscription.subscribed_event_types ? (
                        <span>{subscription.subscribed_event_types.length} event types</span>
                      ) : (
                        <span>All events</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingSubscription(subscription)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Subscription Settings</DialogTitle>
                        </DialogHeader>
                        <SubscriptionEditor
                          subscription={editingSubscription}
                          onSave={handleUpdateSubscription}
                          onClose={() => setEditingSubscription(null)}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => unfollowUser(subscription.followed_id)}
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface SubscriptionEditorProps {
  subscription: CanonSubscription | null;
  onSave: (followedId: string, eventTypes: string[], minimumRank: 'local' | 'regional' | 'global' | 'legendary') => void;
  onClose: () => void;
}

const SubscriptionEditor: React.FC<SubscriptionEditorProps> = ({ subscription, onSave, onClose }) => {
  const [eventTypes, setEventTypes] = useState<string[]>(subscription?.subscribed_event_types || []);
  const [minimumRank, setMinimumRank] = useState<'local' | 'regional' | 'global' | 'legendary'>(
    subscription?.minimum_rank || 'local'
  );

  if (!subscription) return null;

  const handleEventTypeChange = (eventType: string, checked: boolean) => {
    if (checked) {
      setEventTypes(prev => [...prev, eventType]);
    } else {
      setEventTypes(prev => prev.filter(type => type !== eventType));
    }
  };

  const handleSave = () => {
    onSave(subscription.followed_id, eventTypes, minimumRank);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Minimum Canon Rank</h4>
          <Select value={minimumRank} onValueChange={(value: any) => setMinimumRank(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANK_OPTIONS.map((rank) => (
                <SelectItem key={rank.value} value={rank.value}>
                  <div>
                    <div className="font-medium">{rank.label}</div>
                    <div className="text-xs text-muted-foreground">{rank.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="font-medium mb-2">Event Types (leave empty for all)</h4>
          <div className="space-y-2">
            {EVENT_TYPES.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={type.value}
                  checked={eventTypes.includes(type.value)}
                  onCheckedChange={(checked) => handleEventTypeChange(type.value, checked as boolean)}
                />
                <label htmlFor={type.value} className="text-sm font-medium">
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};