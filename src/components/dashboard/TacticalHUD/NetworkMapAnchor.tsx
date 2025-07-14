import React from 'react';
import { AnchorCard } from './AnchorCard';
import { Network, Users, Zap, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const NetworkMapAnchor: React.FC = () => {
  // Mock data for network connections
  const networkData = [
    { name: "Tech Alliance", members: 12, activity: "high", type: "professional" },
    { name: "Local Providers", members: 8, activity: "medium", type: "regional" },
    { name: "Elite Circle", members: 5, activity: "high", type: "prestige" },
  ];

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'high': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <AnchorCard title="Network Pulse" icon={Network}>
      <div className="space-y-2 h-full overflow-y-auto">
        {networkData.map((network, index) => (
          <div key={index} className="p-2 rounded-lg bg-muted/30 border border-border/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getActivityColor(network.activity)} animate-pulse`} />
                <span className="text-xs font-medium truncate">{network.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs py-0 px-1">
                {network.type}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{network.members} members</span>
              <div className="flex items-center gap-1 ml-auto">
                <TrendingUp className={`h-3 w-3 ${getActivityColor(network.activity)}`} />
                <span className={`text-xs ${getActivityColor(network.activity)}`}>
                  {network.activity}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-primary">Network Score: 127</span>
          </div>
        </div>
      </div>
    </AnchorCard>
  );
};