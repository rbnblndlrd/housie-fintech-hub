import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Radio,
  MapPin,
  Globe,
  Clock,
  Heart,
  MessageCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getPublicBroadcasts, addBroadcastReaction, BroadcastEvent, BroadcastScope } from '@/utils/broadcastEngine';
import { generateBroadcastTranscript } from '@/utils/broadcastEngine';
import { useToast } from '@/hooks/use-toast';

interface CommunityEchoesWidgetProps {
  scope?: BroadcastScope;
  limit?: number;
  showControls?: boolean;
}

const CommunityEchoesWidget: React.FC<CommunityEchoesWidgetProps> = ({ 
  scope,
  limit = 5,
  showControls = true 
}) => {
  const [broadcasts, setBroadcasts] = useState<BroadcastEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [selectedScope, setSelectedScope] = useState<BroadcastScope | undefined>(scope);
  const { toast } = useToast();

  useEffect(() => {
    loadBroadcasts();
  }, [selectedScope, limit]);

  const loadBroadcasts = async () => {
    setLoading(true);
    try {
      const data = await getPublicBroadcasts(selectedScope, 'Montreal', limit);
      setBroadcasts(data);
    } catch (error) {
      console.error('Error loading broadcasts:', error);
      toast({
        title: "Connection Issue",
        description: "Unable to load community echoes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (broadcastId: string, reactionType: 'clap' | 'comment' | 'insight') => {
    try {
      const success = await addBroadcastReaction(broadcastId, reactionType);
      if (success) {
        // Update local state to reflect the reaction
        setBroadcasts(prev => prev.map(b => 
          b.id === broadcastId 
            ? { ...b, engagement_count: (b.engagement_count || 0) + 1 }
            : b
        ));
        
        toast({
          title: "Reaction Added",
          description: "Your reaction has been broadcast to the community!",
        });
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: "Unable to React",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  const getScopeIcon = (scope: BroadcastScope) => {
    switch (scope) {
      case 'local':
        return <MapPin className="h-3 w-3" />;
      case 'city':
        return <Radio className="h-3 w-3" />;
      case 'global':
        return <Globe className="h-3 w-3" />;
      default:
        return <Radio className="h-3 w-3" />;
    }
  };

  const getScopeBadgeVariant = (scope: BroadcastScope) => {
    switch (scope) {
      case 'local':
        return 'secondary';
      case 'city':
        return 'default';
      case 'global':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            Community Echoes
          </CardTitle>
          {showControls && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-6 w-6 p-0"
            >
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          )}
        </div>
        
        {showControls && expanded && (
          <div className="flex gap-1 mt-2">
            {(['local', 'city', 'global'] as BroadcastScope[]).map((scopeOption) => (
              <Button
                key={scopeOption}
                variant={selectedScope === scopeOption ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedScope(selectedScope === scopeOption ? undefined : scopeOption)}
                className="h-6 px-2 text-xs"
              >
                {getScopeIcon(scopeOption)}
                <span className="ml-1 capitalize">{scopeOption}</span>
              </Button>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-1" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : broadcasts.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            <Radio className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No community echoes yet.</p>
            <p className="text-xs">Be the first to make waves!</p>
          </div>
        ) : (
          broadcasts.map((broadcast, index) => (
            <div key={broadcast.id || index}>
              <div className="space-y-2">
                {/* Header with scope and canon status */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={getScopeBadgeVariant(broadcast.broadcast_scope)}
                      className="h-5 px-2 text-xs"
                    >
                      {getScopeIcon(broadcast.broadcast_scope)}
                      <span className="ml-1 capitalize">{broadcast.broadcast_scope}</span>
                    </Badge>
                    
                    <Badge 
                      variant={broadcast.canon_confidence > 0.8 ? 'default' : 'secondary'}
                      className="h-5 px-2 text-xs"
                    >
                      {broadcast.canon_confidence > 0.8 ? '✅ Canon' : '🌀 Non-Canon'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeAgo(broadcast.created_at || '')}</span>
                  </div>
                </div>

                {/* Broadcast content */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-sm font-mono text-foreground/90 whitespace-pre-line">
                    {generateBroadcastTranscript(broadcast)}
                  </div>
                </div>

                {/* Engagement actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReaction(broadcast.id!, 'clap')}
                      className="h-6 px-2 text-xs"
                    >
                      <Heart className="h-3 w-3 mr-1" />
                      {broadcast.engagement_count || 0}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReaction(broadcast.id!, 'comment')}
                      className="h-6 px-2 text-xs"
                    >
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReaction(broadcast.id!, 'insight')}
                      className="h-6 px-2 text-xs"
                    >
                      <Lightbulb className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {broadcast.city}
                  </div>
                </div>
              </div>
              
              {index < broadcasts.length - 1 && <Separator className="my-3" />}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityEchoesWidget;