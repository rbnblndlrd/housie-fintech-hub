import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useCanonVotes } from '@/hooks/useCanonVotes';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CanonVoteButtonsProps {
  eventId: string;
  voteScore?: number;
  voteCount?: number;
  compact?: boolean;
}

export const CanonVoteButtons: React.FC<CanonVoteButtonsProps> = ({ 
  eventId, 
  voteScore = 0, 
  voteCount = 0,
  compact = false 
}) => {
  const { user } = useAuth();
  const { userVote, loading, castVote } = useCanonVotes(eventId);

  if (!user) return null;

  const handleUpvote = () => castVote('upvote');
  const handleDownvote = () => castVote('downvote');

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-1 ${compact ? 'text-xs' : 'text-sm'}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={userVote?.vote_type === 'upvote' ? 'default' : 'ghost'}
              size={compact ? 'sm' : 'default'}
              onClick={handleUpvote}
              disabled={loading}
              className={`p-1 h-auto ${compact ? 'min-w-0' : ''}`}
            >
              <ThumbsUp className={`${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Vote to boost this event's legacy</p>
          </TooltipContent>
        </Tooltip>

        {!compact && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={userVote?.vote_type === 'downvote' ? 'destructive' : 'ghost'}
                size="default"
                onClick={handleDownvote}
                disabled={loading}
                className="p-1 h-auto"
              >
                <ThumbsDown className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This event doesn't deserve the attention</p>
            </TooltipContent>
          </Tooltip>
        )}

        {voteScore !== 0 && (
          <Badge variant="outline" className={`${compact ? 'text-xs px-1' : ''}`}>
            {voteScore > 0 ? '+' : ''}{voteScore}
          </Badge>
        )}

        {!compact && voteCount > 0 && (
          <span className="text-xs text-muted-foreground">
            {voteCount} vote{voteCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </TooltipProvider>
  );
};