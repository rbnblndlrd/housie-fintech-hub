import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TrendingUp, Eye, Users, MapPin, Minimize2, GripVertical } from 'lucide-react';
import OverlayWrapper from './OverlayWrapper';

interface MarketInsightsOverlayProps {
  position: string;
  visible: boolean;
  minimized: boolean;
  draggable: boolean;
  onMinimize: () => void;
  showHeatZones: boolean;
  showProviders: boolean;
  showTrafficAreas: boolean;
  onToggleHeatZones: (checked: boolean) => void;
  onToggleProviders: (checked: boolean) => void;
  onToggleTrafficAreas: (checked: boolean) => void;
  isFleetMode: boolean;
}

const MarketInsightsOverlay: React.FC<MarketInsightsOverlayProps> = ({
  position,
  visible,
  minimized,
  draggable,
  onMinimize,
  showHeatZones,
  showProviders,
  showTrafficAreas,
  onToggleHeatZones,
  onToggleProviders,
  onToggleTrafficAreas,
  isFleetMode
}) => {
  if (!visible) return null;

  if (minimized) {
    return (
      <div className={`absolute ${position} z-30`}>
        <Button
          variant="outline"
          size="sm"
          onClick={onMinimize}
          className="bg-white/90 backdrop-blur-sm"
        >
          <TrendingUp className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <OverlayWrapper
      position={position}
      draggable={draggable}
      className="z-30"
    >
      <Card className="w-72 bg-white/95 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              {draggable && <GripVertical className="h-4 w-4 cursor-grab" />}
              <TrendingUp className="h-4 w-4" />
              {isFleetMode ? 'Fleet Market Intelligence' : 'Market Insights'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="h-6 w-6 p-0"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {/* Demand Levels Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full"></div>
              <Label htmlFor="demand-toggle" className="text-sm font-medium">
                Demand Levels
              </Label>
            </div>
            <Switch
              id="demand-toggle"
              checked={showHeatZones}
              onCheckedChange={onToggleHeatZones}
            />
          </div>
          <p className="text-xs text-gray-600 -mt-2">
            {showHeatZones ? 'Showing' : 'Hidden'} market demand by neighborhood
          </p>

          {/* Show Providers Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <Label htmlFor="providers-toggle" className="text-sm font-medium">
                {isFleetMode ? 'Fleet Vehicles' : 'Show Providers'}
              </Label>
            </div>
            <Switch
              id="providers-toggle"
              checked={showProviders}
              onCheckedChange={onToggleProviders}
            />
          </div>
          <p className="text-xs text-gray-600 -mt-2">
            {showProviders ? 'Showing' : 'Hidden'} {isFleetMode ? 'your fleet vehicles' : 'provider locations'}
          </p>

          {/* High Traffic Areas Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-purple-600" />
              <Label htmlFor="traffic-toggle" className="text-sm font-medium">
                High Traffic Areas
              </Label>
            </div>
            <Switch
              id="traffic-toggle"
              checked={showTrafficAreas}
              onCheckedChange={onToggleTrafficAreas}
            />
          </div>
          <p className="text-xs text-gray-600 -mt-2">
            {showTrafficAreas ? 'Showing' : 'Hidden'} commercial & transit zones
          </p>

          {/* Quick Actions */}
          <div className="pt-2 border-t space-y-2">
            <Button size="sm" variant="outline" className="w-full justify-start">
              <Eye className="h-4 w-4 mr-2" />
              View Market Report
            </Button>
            {isFleetMode && (
              <Button size="sm" variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Fleet Analytics
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </OverlayWrapper>
  );
};

export default MarketInsightsOverlay;
