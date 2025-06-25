
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TrendingUp, Users, MapPin } from 'lucide-react';

interface MarketInsightsPanelProps {
  showDemandLevels: boolean;
  showProviders: boolean;
  showHighTrafficAreas: boolean;
  onToggleDemandLevels: (enabled: boolean) => void;
  onToggleProviders: (enabled: boolean) => void;
  onToggleHighTrafficAreas: (enabled: boolean) => void;
}

const MarketInsightsPanel: React.FC<MarketInsightsPanelProps> = ({
  showDemandLevels,
  showProviders,
  showHighTrafficAreas,
  onToggleDemandLevels,
  onToggleProviders,
  onToggleHighTrafficAreas
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          📊 Market Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-red-500 rounded-full"></div>
              <Label htmlFor="demand-levels" className="text-sm font-medium">
                Demand Levels
              </Label>
            </div>
            <Switch
              id="demand-levels"
              checked={showDemandLevels}
              onCheckedChange={onToggleDemandLevels}
            />
          </div>
          <p className="text-xs text-gray-600 ml-5">
            {showDemandLevels ? 'Showing' : 'Hiding'} market demand heat zones by neighborhood
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <Label htmlFor="show-providers" className="text-sm font-medium">
                Show Providers
              </Label>
            </div>
            <Switch
              id="show-providers"
              checked={showProviders}
              onCheckedChange={onToggleProviders}
            />
          </div>
          <p className="text-xs text-gray-600 ml-5">
            {showProviders ? 'Displaying' : 'Hiding'} service provider locations and availability
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-600" />
              <Label htmlFor="high-traffic" className="text-sm font-medium">
                High Traffic Areas
              </Label>
            </div>
            <Switch
              id="high-traffic"
              checked={showHighTrafficAreas}
              onCheckedChange={onToggleHighTrafficAreas}
            />
          </div>
          <p className="text-xs text-gray-600 ml-5">
            {showHighTrafficAreas ? 'Highlighting' : 'Hiding'} commercial zones and transit hubs
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketInsightsPanel;
