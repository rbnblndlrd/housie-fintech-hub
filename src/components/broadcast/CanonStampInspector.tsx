import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { CanonEvent } from '@/hooks/useCanonEvents';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Users, MapPin, Clock, Eye, EyeOff, Globe, UserCheck } from 'lucide-react';

interface CanonStampInspectorProps {
  event: CanonEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateScope?: (eventId: string, newScope: string) => void;
}

export const CanonStampInspector: React.FC<CanonStampInspectorProps> = ({
  event,
  isOpen,
  onClose,
  onUpdateScope
}) => {
  const { user } = useAuth();
  const [editingScope, setEditingScope] = useState(false);
  const [newScope, setNewScope] = useState('');

  if (!event) return null;

  const isOwner = user?.id === event.user_id;
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.email === '7utile@gmail.com';

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'legendary': return 'text-purple-500';
      case 'global': return 'text-blue-500';
      case 'regional': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case 'private': return <EyeOff className="w-4 h-4" />;
      case 'friends': return <UserCheck className="w-4 h-4" />;
      case 'city': return <MapPin className="w-4 h-4" />;
      case 'public': return <Globe className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const handleScopeUpdate = () => {
    if (onUpdateScope && newScope && newScope !== event.echo_scope) {
      onUpdateScope(event.id, newScope);
      setEditingScope(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">
              {event.event_type === 'prestige_milestone' && '🏆'}
              {event.event_type === 'cluster_built' && '🏗️'}
              {event.event_type === 'crew_saved_the_day' && '🦸'}
              {event.event_type === 'broadcast_custom' && '📡'}
              {event.event_type === 'opportunity_formed' && '💡'}
              {event.event_type === 'rare_unlock' && '🔓'}
              {event.event_type === 'review_commendation' && '⭐'}
            </span>
            Canon Event Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title and Description */}
          <div>
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            {event.description && (
              <p className="text-muted-foreground">{event.description}</p>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={getRankColor(event.canon_rank)}>
              {event.canon_rank.toUpperCase()} VERIFIED
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              {getScopeIcon(event.echo_scope)}
              {event.echo_scope}
            </Badge>
            {event.stamp_definitions && (
              <Badge variant="default">
                {event.stamp_definitions.icon_url} {event.stamp_definitions.name}
              </Badge>
            )}
          </div>

          {/* Annette Commentary */}
          {event.annette_commentary && (
            <div className="bg-primary/5 border-l-4 border-primary pl-4 py-3">
              <p className="italic text-primary font-medium">
                "{event.annette_commentary}"
              </p>
              <p className="text-sm text-muted-foreground mt-1">— Annette's Commentary</p>
            </div>
          )}

          {/* Event Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {formatDistanceToNow(new Date(event.timestamp))} ago
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {event.users?.full_name || event.users?.email}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {event.origin_dashboard && (
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{event.origin_dashboard}</span>
                </div>
              )}
              {event.event_source_type && (
                <div className="text-sm text-muted-foreground">
                  Source: {event.event_source_type}
                </div>
              )}
            </div>
          </div>

          {/* Related Users */}
          {event.related_user_ids && event.related_user_ids.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Related Users</h4>
              <p className="text-sm text-muted-foreground">
                {event.related_user_ids.length} user(s) involved
              </p>
            </div>
          )}

          {/* Scope Control */}
          {isOwner && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Visibility Control</h4>
              {editingScope ? (
                <div className="flex items-center gap-2">
                  <Select value={newScope} onValueChange={setNewScope}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="city">City</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleScopeUpdate} size="sm">
                    Save
                  </Button>
                  <Button 
                    onClick={() => setEditingScope(false)} 
                    variant="outline" 
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => {
                    setNewScope(event.echo_scope);
                    setEditingScope(true);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Change Visibility
                </Button>
              )}
            </div>
          )}

          {/* Admin Controls */}
          {isAdmin && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Admin Controls</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  Edit Commentary
                </Button>
                <Button variant="outline" size="sm">
                  Appeal Verification Rank
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};