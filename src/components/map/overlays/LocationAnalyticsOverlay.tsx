
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp, DollarSign, Users, AlertTriangle, Target, Minimize2, GripVertical } from 'lucide-react';
import { OverlayWrapper } from './OverlayWrapper';

interface LocationAnalyticsOverlayProps {
  position: string;
  visible: boolean;
  minimized: boolean;
  draggable: boolean;
  onMinimize: () => void;
  currentArea: string;
  marketDemand: string;
  avgRate: number;
  competition: string;
  opportunityLevel: string;
  isFleetMode: boolean;
}

const LocationAnalyticsOverlay: React.FC<LocationAnalyticsOverlayProps> = ({
  position,
  visible,
  minimized,
  draggable,
  onMinimize,
  currentArea,
  marketDemand,
  avgRate,
  competition,
  opportunityLevel,
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
          <MapPin className="h-4 w-4" />
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
              <MapPin className="h-4 w-4" />
              📍 {isFleetMode ? 'Fleet Area Analytics' : 'Location Analytics'}
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
        <CardContent className="pt-0 space-y-3">
          {/* Current Area */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">
                {isFleetMode ? 'Fleet Operating Area:' : 'Your Area:'}
              </span>
              <span className="text-sm font-medium">{currentArea}</span>
            </div>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-gray-600">Demand</span>
              </div>
              <div className="font-medium text-green-600">{marketDemand}</div>
            </div>

            <div className="bg-gray-50 p-2 rounded">
              <div className="flex items-center gap-1 mb-1">
                <DollarSign className="h-3 w-3 text-blue-600" />
                <span className="text-gray-600">Avg Rate</span>
              </div>
              <div className="font-medium text-blue-600">${avgRate}/hr</div>
            </div>

            <div className="bg-gray-50 p-2 rounded">
              <div className="flex items-center gap-1 mb-1">
                <Users className="h-3 w-3 text-orange-600" />
                <span className="text-gray-600">Competition</span>
              </div>
              <div className="font-medium text-orange-600">{competition}</div>
            </div>

            <div className="bg-gray-50 p-2 rounded">
              <div className="flex items-center gap-1 mb-1">
                <AlertTriangle className="h-3 w-3 text-green-600" />
                <span className="text-gray-600">Opportunity</span>
              </div>
              <div className="font-medium text-green-600">{opportunityLevel}</div>
            </div>
          </div>

          {/* Market Insight */}
          <div className="p-2 bg-green-50 rounded border border-green-200">
            <div className="text-xs text-green-700 font-medium mb-1 flex items-center gap-1">
              <Target className="h-3 w-3" />
              Market Insight
            </div>
            <p className="text-xs text-green-600">
              {isFleetMode 
                ? 'High demand for handyman services. Consider expanding fleet to this area with 3+ vehicles.' 
                : 'High demand for handyman services. Great area with reliable client base and premium rates.'
              }
            </p>
          </div>

          {/* Action Button */}
          <Button size="sm" className="w-full" variant="outline">
            <Target className="h-3 w-3 mr-1" />
            {isFleetMode ? 'Deploy Fleet Here' : 'Target This Area'}
          </Button>
        </CardContent>
      </Card>
    </OverlayWrapper>
  );
};

export default LocationAnalyticsOverlay;
