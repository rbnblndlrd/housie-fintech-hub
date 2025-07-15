import React from 'react';
import { TrustConnection } from '@/hooks/useNetworkGraph';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, Crown, Radio, Users } from 'lucide-react';

interface NetworkGraphProps {
  connections: TrustConnection[];
  mode: 'all' | 'canon' | 'crew' | 'broadcast';
  centerUserId?: string;
  anonymize: boolean;
}

export function NetworkGraph({ connections, mode, centerUserId, anonymize }: NetworkGraphProps) {
  const getModeIcon = () => {
    switch (mode) {
      case 'canon': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'crew': return <Users className="h-4 w-4 text-blue-500" />;
      case 'broadcast': return <Radio className="h-4 w-4 text-green-500" />;
      default: return <Network className="h-4 w-4 text-primary" />;
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'canon': return 'border-yellow-500/30 bg-yellow-500/5';
      case 'crew': return 'border-blue-500/30 bg-blue-500/5';
      case 'broadcast': return 'border-green-500/30 bg-green-500/5';
      default: return 'border-primary/30 bg-primary/5';
    }
  };

  // For now, we'll show a simplified grid layout instead of a complex graph visualization
  // In production, you'd integrate with a graph library like D3.js or react-force-graph
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        {getModeIcon()}
        <span className="font-medium">
          {mode === 'all' ? 'All Connections' :
           mode === 'canon' ? 'Canon Mode' :
           mode === 'crew' ? 'Crew Lens' :
           'Broadcast Mesh'}
        </span>
        <Badge variant="outline">{connections.length} nodes</Badge>
      </div>

      {connections.length === 0 ? (
        <div className="text-center py-12">
          <Network className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No connections found for this mode</p>
        </div>
      ) : (
        <div className="relative">
          {/* Central Node */}
          <div className="flex justify-center mb-8">
            <div className={`relative w-20 h-20 rounded-full border-4 ${getModeColor()} flex items-center justify-center`}>
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">You</span>
              </div>
              {mode === 'canon' && (
                <div className="absolute -top-2 -right-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                </div>
              )}
            </div>
          </div>

          {/* Connection Nodes in a radial pattern */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {connections.slice(0, 12).map((connection, index) => {
              const trustLevel = connection.trust_score > 100 ? 'high' : 
                               connection.trust_score > 50 ? 'medium' : 'low';
              
              return (
                <div key={connection.target_id} className="relative">
                  <Card className={`transition-all duration-300 hover:scale-105 cursor-pointer ${
                    trustLevel === 'high' ? 'border-green-500/50 bg-green-50/5' :
                    trustLevel === 'medium' ? 'border-yellow-500/50 bg-yellow-50/5' :
                    'border-border'
                  }`}>
                    <CardContent className="p-3 text-center">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                        <span className="text-xs font-mono">
                          {anonymize ? `U${index + 1}` : connection.target_id.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mb-1">
                        Trust: {Math.round(connection.trust_score)}
                      </div>
                      
                      {connection.canon_event_ids.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <Crown className="h-3 w-3 mr-1" />
                          {connection.canon_event_ids.length}
                        </Badge>
                      )}
                      
                      {/* Trust line to center (visual representation) */}
                      <div className={`absolute bottom-full left-1/2 w-px h-8 -translate-x-1/2 ${
                        trustLevel === 'high' ? 'bg-green-500' :
                        trustLevel === 'medium' ? 'bg-yellow-500' :
                        'bg-border'
                      }`} style={{
                        opacity: Math.min(connection.trust_score / 100, 1)
                      }} />
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {connections.length > 12 && (
            <div className="text-center mt-6">
              <Badge variant="outline">
                +{connections.length - 12} more connections
              </Badge>
            </div>
          )}
        </div>
      )}
    </div>
  );
}