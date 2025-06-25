
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Volume2, VolumeX, Minimize2, GripVertical } from 'lucide-react';
import OverlayWrapper from './OverlayWrapper';

interface EmergencyJobsOverlayProps {
  position: string;
  visible: boolean;
  minimized: boolean;
  draggable: boolean;
  onMinimize: () => void;
  onToggleAudio: () => void;
  audioEnabled: boolean;
  emergencyCount: number;
  isFleetMode: boolean;
}

const EmergencyJobsOverlay: React.FC<EmergencyJobsOverlayProps> = ({
  position,
  visible,
  minimized,
  draggable,
  onMinimize,
  onToggleAudio,
  audioEnabled,
  emergencyCount,
  isFleetMode
}) => {
  if (!visible) return null;

  if (minimized) {
    return (
      <div className={`absolute ${position} z-30`}>
        <Button
          variant="destructive"
          size="sm"
          onClick={onMinimize}
          className="bg-red-500/90 backdrop-blur-sm"
        >
          <Zap className="h-4 w-4 mr-1" />
          {emergencyCount}
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
      <Card className="w-80 bg-red-50/95 backdrop-blur-sm border-red-200 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between" data-draggable-header="true">
            <CardTitle className="text-red-700 flex items-center gap-2 text-sm">
              {draggable && (
                <GripVertical 
                  className="h-4 w-4 cursor-grab text-red-500" 
                  data-grip="true"
                />
              )}
              <Zap className="h-4 w-4 animate-pulse" />
              🚨 {isFleetMode ? 'Fleet Emergency Jobs' : 'Emergency Jobs Available'}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleAudio}
                className="h-6 w-6 p-0"
                title={audioEnabled ? "Mute notifications" : "Enable notifications"}
              >
                {audioEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMinimize}
                className="h-6 w-6 p-0"
                title="Minimize"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl font-bold text-red-600">{emergencyCount}</span>
            <div className="text-right">
              <Badge variant="destructive" className="animate-pulse mb-1">
                URGENT
              </Badge>
              <div className="text-xs text-red-600 font-medium">
                $150-200/hour
              </div>
            </div>
          </div>
          
          <p className="text-xs text-red-600 mb-3">
            {isFleetMode 
              ? 'High-priority emergency requests for your fleet within 10km radius'
              : 'Emergency and same-day requests available in your area with premium rates'
            }
          </p>
          
          <div className="space-y-2">
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full font-medium"
            >
              <Zap className="h-4 w-4 mr-2" />
              {isFleetMode ? 'Assign to Fleet' : 'Quick Accept'}
            </Button>
            
            {isFleetMode && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-red-600 border-red-200"
              >
                Auto-Distribute
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </OverlayWrapper>
  );
};

export default EmergencyJobsOverlay;
