
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface LiveStats {
  availableProviders: number;
  activeZones: number;
  avgResponseTime: string;
  peakDemandZone: string;
}

interface LiveStatsCardProps {
  liveStats: LiveStats;
}

const LiveStatsCard: React.FC<LiveStatsCardProps> = ({ liveStats }) => {
  return (
    <div className="absolute top-4 right-4 z-10">
      <Card className="fintech-card">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{liveStats.availableProviders}</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveStatsCard;
