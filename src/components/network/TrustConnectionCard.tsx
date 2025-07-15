import React from 'react';
import { TrustConnection } from '@/hooks/useNetworkGraph';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Clock, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TrustConnectionCardProps {
  connection: TrustConnection;
  anonymize: boolean;
  rank: number;
}

export function TrustConnectionCard({ connection, anonymize, rank }: TrustConnectionCardProps) {
  const trustLevel = connection.trust_score > 100 ? 'high' : 
                    connection.trust_score > 50 ? 'medium' : 'low';

  const getTrustColor = () => {
    switch (trustLevel) {
      case 'high': return 'text-green-500 border-green-500/20 bg-green-500/5';
      case 'medium': return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5';
      default: return 'text-muted-foreground border-border';
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${getTrustColor()}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold">
                #{rank}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">
                {anonymize ? `Connection ${rank}` : `User ${connection.target_id.slice(0, 8)}`}
              </p>
              <p className="text-xs text-muted-foreground">
                Trust Score: {Math.round(connection.trust_score)}
              </p>
            </div>
          </div>
          
          {connection.canon_event_ids.length > 0 && (
            <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/30">
              <Crown className="h-3 w-3 mr-1" />
              {connection.canon_event_ids.length}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Last seen: {formatDistanceToNow(new Date(connection.last_seen), { addSuffix: true })}
          </div>

          {connection.canon_event_ids.length > 0 && (
            <div className="p-2 bg-muted/30 rounded text-xs">
              <p className="font-medium text-primary mb-1">Canon Events Shared:</p>
              <p className="text-muted-foreground">
                {connection.canon_event_ids.length} verified broadcast{connection.canon_event_ids.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Trust level indicator */}
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                trustLevel === 'high' ? 'bg-green-500' :
                trustLevel === 'medium' ? 'bg-yellow-500' :
                'bg-muted-foreground'
              }`}
              style={{ width: `${Math.min(connection.trust_score / 100 * 100, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}