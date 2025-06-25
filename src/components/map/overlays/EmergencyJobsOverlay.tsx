
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Volume2, VolumeX, Minimize2, GripVertical } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  if (!visible) return null;

  if (minimized) {
    return (
      <Button
        variant="destructive"
        size={isMobile ? "lg" : "sm"}
        onClick={onMinimize}
        className={`bg-red-500/90 backdrop-blur-sm ${isMobile ? 'min-h-[44px] px-4' : ''}`}
      >
        <Zap className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} mr-1`} />
        {emergencyCount}
      </Button>
    );
  }

  return (
    <Card className={`${isMobile ? 'w-full max-w-sm' : 'w-80'} bg-red-50/95 backdrop-blur-sm border-red-200 shadow-lg`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between" data-draggable-header="true">
          <CardTitle className="text-red-700 flex items-center gap-2 text-sm">
            {draggable && !isMobile && (
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
              size={isMobile ? "default" : "sm"}
              onClick={onToggleAudio}
              className={`${isMobile ? 'min-h-[44px] min-w-[44px]' : 'h-6 w-6'} p-0`}
              title={audioEnabled ? "Mute notifications" : "Enable notifications"}
            >
              {audioEnabled ? 
                <Volume2 className={`${isMobile ? 'h-5 w-5' : 'h-3 w-3'}`} /> : 
                <VolumeX className={`${isMobile ? 'h-5 w-5' : 'h-3 w-3'}`} />
              }
            </Button>
            <Button
              variant="ghost"
              size={isMobile ? "default" : "sm"}
              onClick={onMinimize}
              className={`${isMobile ? 'min-h-[44px] min-w-[44px]' : 'h-6 w-6'} p-0`}
              title="Minimize"
            >
              <Minimize2 className={`${isMobile ? 'h-5 w-5' : 'h-3 w-3'}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <span className={`${isMobile ? 'text-4xl' : 'text-3xl'} font-bold text-red-600`}>
            {emergencyCount}
          </span>
          <div className="text-right">
            <Badge variant="destructive" className="animate-pulse mb-1">
              URGENT
            </Badge>
            <div className={`${isMobile ? 'text-sm' : 'text-xs'} text-red-600 font-medium`}>
              $150-200/hour
            </div>
          </div>
        </div>
        
        <p className={`${isMobile ? 'text-sm' : 'text-xs'} text-red-600 ${isMobile ? 'mb-4' : 'mb-3'}`}>
          {isFleetMode 
            ? 'High-priority emergency requests for your fleet within 10km radius'
            : 'Emergency and same-day requests available in your area with premium rates'
          }
        </p>
        
        <div className="space-y-2">
          <Button 
            variant="destructive" 
            size={isMobile ? "lg" : "sm"}
            className={`w-full font-medium ${isMobile ? 'min-h-[44px] text-base' : ''}`}
          >
            <Zap className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} mr-2`} />
            {isFleetMode ? 'Assign to Fleet' : 'Quick Accept'}
          </Button>
          
          {isFleetMode && (
            <Button 
              variant="outline" 
              size={isMobile ? "lg" : "sm"}
              className={`w-full text-red-600 border-red-200 ${isMobile ? 'min-h-[44px] text-base' : ''}`}
            >
              Auto-Distribute
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyJobsOverlay;
