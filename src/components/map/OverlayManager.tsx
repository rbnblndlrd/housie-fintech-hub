
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, Settings, Users, User, Crown } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';

export type OverlayPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-left' | 'center-right' | 'bottom-center';

export interface OverlayConfig {
  id: string;
  title: string;
  position: OverlayPosition;
  visible: boolean;
  minimized: boolean;
  draggable: boolean;
}

interface OverlayManagerProps {
  overlays: OverlayConfig[];
  onToggleOverlay: (id: string) => void;
  onToggleAll: () => void;
  allVisible: boolean;
  isFleetMode: boolean;
  onToggleFleetMode: () => void;
  isCustomizeMode: boolean;
  onToggleCustomizeMode: () => void;
  isPremium: boolean;
}

const OverlayManager: React.FC<OverlayManagerProps> = ({
  overlays,
  onToggleOverlay,
  onToggleAll,
  allVisible,
  isFleetMode,
  onToggleFleetMode,
  isCustomizeMode,
  onToggleCustomizeMode,
  isPremium
}) => {
  const { currentRole } = useRole();
  const [showControls, setShowControls] = useState(false);

  const getPositionClass = (position: OverlayPosition) => {
    switch (position) {
      case 'top-left': return 'top-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'center-left': return 'top-1/2 left-4 -translate-y-1/2';
      case 'center-right': return 'top-1/2 right-4 -translate-y-1/2';
      case 'bottom-center': return 'bottom-4 left-1/2 -translate-x-1/2';
      default: return 'top-4 right-4';
    }
  };

  return (
    <>
      {/* Master Controls Overlay - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <Card className="bg-white/90 backdrop-blur-sm border shadow-lg p-3">
          <div className="flex items-center gap-2">
            {/* Mode Toggle */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-600" />
              <Switch
                checked={isFleetMode}
                onCheckedChange={onToggleFleetMode}
                disabled={!isPremium}
              />
              <Users className="h-4 w-4 text-blue-600" />
              {isPremium && isFleetMode && (
                <Badge variant="default" className="text-xs">
                  Fleet
                </Badge>
              )}
            </div>

            {/* Show/Hide All */}
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleAll}
              className="flex items-center gap-2"
            >
              {allVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {allVisible ? 'Hide' : 'Show'}
            </Button>

            {/* Customize Layout (Premium) */}
            {isPremium && (
              <Button
                variant={isCustomizeMode ? "default" : "outline"}
                size="sm"
                onClick={onToggleCustomizeMode}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Customize
                <Crown className="h-3 w-3 text-yellow-500" />
              </Button>
            )}

            {/* Settings Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowControls(!showControls)}
            >
              ⋮
            </Button>
          </div>

          {/* Detailed Controls */}
          {showControls && (
            <div className="mt-3 pt-3 border-t space-y-2">
              <div className="text-xs font-medium text-gray-600 mb-2">Overlay Controls:</div>
              {overlays.map(overlay => (
                <div key={overlay.id} className="flex items-center justify-between text-xs">
                  <span>{overlay.title}</span>
                  <Switch
                    checked={overlay.visible}
                    onCheckedChange={() => onToggleOverlay(overlay.id)}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Mode Indicator */}
      <div className="absolute top-4 left-4 z-40">
        <Badge 
          variant={isFleetMode ? "default" : "secondary"}
          className="bg-white/90 backdrop-blur-sm text-sm font-medium"
        >
          {isFleetMode ? (
            <>
              <Users className="h-4 w-4 mr-1" />
              Fleet Manager Mode
              {isPremium && <Crown className="h-3 w-3 ml-1 text-yellow-500" />}
            </>
          ) : (
            <>
              <User className="h-4 w-4 mr-1" />
              Individual Provider Mode
            </>
          )}
        </Badge>
      </div>

      {/* Customize Mode Indicator */}
      {isCustomizeMode && (
        <div className="absolute top-16 left-4 z-40">
          <Badge variant="outline" className="bg-blue-50/90 backdrop-blur-sm border-blue-200">
            <Settings className="h-3 w-3 mr-1" />
            Customize Layout Mode Active
          </Badge>
        </div>
      )}
    </>
  );
};

export default OverlayManager;
