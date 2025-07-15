import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCanonReactions, REACTION_CONFIG } from '@/hooks/useCanonReactions';

interface CanonReactionButtonsProps {
  eventId: string;
  compact?: boolean;
}

export const CanonReactionButtons: React.FC<CanonReactionButtonsProps> = ({ 
  eventId, 
  compact = false 
}) => {
  const { userReactions, toggleReaction, getReactionCounts } = useCanonReactions(eventId);
  const reactionCounts = getReactionCounts();

  const reactionTypes = Object.keys(REACTION_CONFIG) as Array<keyof typeof REACTION_CONFIG>;

  if (compact) {
    // Show only active reactions with counts
    const activeReactions = reactionTypes.filter(type => reactionCounts[type] > 0);
    
    if (activeReactions.length === 0) return null;

    return (
      <div className="flex items-center gap-1 text-sm">
        {activeReactions.map((type) => (
          <Badge key={type} variant="secondary" className="text-xs">
            {REACTION_CONFIG[type].emoji} {reactionCounts[type]}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {reactionTypes.map((type) => {
        const config = REACTION_CONFIG[type];
        const count = reactionCounts[type] || 0;
        const hasUserReacted = userReactions.has(type);

        return (
          <Button
            key={type}
            variant={hasUserReacted ? "default" : "outline"}
            size="sm"
            onClick={() => toggleReaction(type)}
            className={`h-8 text-xs ${hasUserReacted ? 'bg-primary/20 border-primary' : ''}`}
          >
            <span className="mr-1">{config.emoji}</span>
            {count > 0 && <span className="ml-1">{count}</span>}
          </Button>
        );
      })}
    </div>
  );
};