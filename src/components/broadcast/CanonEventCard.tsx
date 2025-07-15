import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Share2, MoreHorizontal, UserPlus, Zap } from 'lucide-react';
import { CanonEvent } from '@/hooks/useCanonEvents';
import { CanonReactionButtons } from './CanonReactionButtons';
import { useCanonSubscriptions } from '@/hooks/useCanonSubscriptions';
import { useAuth } from '@/contexts/AuthContext';

interface CanonEventCardProps {
  event: CanonEvent;
  onInspect: (event: CanonEvent) => void;
  onShare?: (event: CanonEvent) => void;
}

export const CanonEventCard: React.FC<CanonEventCardProps> = ({ 
  event, 
  onInspect, 
  onShare 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();
  const { followUser, isFollowing } = useCanonSubscriptions();

  const getRankBadgeVariant = (rank: string) => {
    switch (rank) {
      case 'legendary': return 'destructive';
      case 'global': return 'default';
      case 'regional': return 'secondary';
      default: return 'outline';
    }
  };

  const getScopeBadgeVariant = (scope: string) => {
    switch (scope) {
      case 'private': return 'outline';
      case 'friends': return 'secondary';
      case 'city': return 'default';
      case 'public': return 'default';
      default: return 'outline';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'prestige_milestone': return '🏆';
      case 'cluster_built': return '🏗️';
      case 'crew_saved_the_day': return '🦸';
      case 'broadcast_custom': return '📡';
      case 'opportunity_formed': return '💡';
      case 'rare_unlock': return '🔓';
      case 'review_commendation': return '⭐';
      default: return '📢';
    }
  };

  return (
    <Card 
      className="transition-all duration-200 hover:shadow-lg cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getEventTypeIcon(event.event_type)}</span>
            <Badge variant={getRankBadgeVariant(event.canon_rank)}>
              {event.canon_rank.toUpperCase()}
            </Badge>
            {event.stamp_definitions && (
              <span className="text-lg">{event.stamp_definitions.icon_url}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getScopeBadgeVariant(event.echo_scope)}>
              {event.echo_scope}
            </Badge>
            {event.echo_score > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {event.echo_score}
              </Badge>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-foreground mb-2 leading-tight">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {event.description}
          </p>
        )}

        {event.annette_commentary && (
          <div className="bg-primary/5 border-l-4 border-primary pl-3 py-2 mb-3">
            <p className="text-sm italic text-primary font-medium">
              "{event.annette_commentary}"
            </p>
            <p className="text-xs text-muted-foreground mt-1">— Annette</p>
          </div>
        )}

        {/* Reaction Buttons */}
        <div className="mb-3">
          <CanonReactionButtons eventId={event.id} compact={!isHovered} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              {event.followed_user_name || event.users?.full_name || event.users?.email}
              {event.followed_user_name && <Badge variant="outline" className="ml-1 text-xs">Following</Badge>}
            </span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(event.timestamp))} ago</span>
          </div>

          {isHovered && (
            <div className="flex items-center gap-1">
              {event.user_id !== user?.id && !isFollowing(event.user_id) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    followUser(event.user_id);
                  }}
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onInspect(event);
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
              {onShare && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(event);
                  }}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};