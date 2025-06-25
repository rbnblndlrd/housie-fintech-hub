
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Eye, EyeOff, Truck, User, Settings, Crown, X, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { OverlayConfig } from '@/hooks/useOverlayManager';
import MapThemeSelector from './MapThemeSelector';

interface OverlayManagerProps {
  overlays: OverlayConfig[];
  onToggleOverlay: (overlayId: string) => void;
  onToggleAll: () => void;
  onResetLayout: () => void;
  allVisible: boolean;
  isFleetMode: boolean;
  onToggleFleetMode: (enabled: boolean) => void;
  isCustomizeMode: boolean;
  onToggleCustomizeMode: (enabled: boolean) => void;
  isPremium: boolean;
}

const OverlayManager: React.FC<OverlayManagerProps> = ({
  overlays,
  onToggleOverlay,
  onToggleAll,
  onResetLayout,
  allVisible,
  isFleetMode,
  onToggleFleetMode,
  isCustomizeMode,
  onToggleCustomizeMode,
  isPremium
}) => {
  const handleFleetModeToggle = () => {
    onToggleFleetMode(!isFleetMode);
  };

  const handleCustomizeModeToggle = () => {
    onToggleCustomizeMode(!isCustomizeMode);
  };

  console.log('🎛️ OverlayManager render:', { 
    overlaysCount: overlays.length,
    isFleetMode,
    isCustomizeMode,
    allVisible,
    overlayStates: overlays.map(o => ({ id: o.id, visible: o.visible, minimized: o.minimized }))
  });

  return (
    <>
      {/* Top Control Bar - Fixed position and width */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-3">
          <div className="flex items-center gap-3 min-w-[600px]">
            
            {/* Fleet/Individual Mode Toggle */}
            <Button
              variant={isFleetMode ? "default" : "outline"}
              size="sm"
              onClick={handleFleetModeToggle}
              className={`transition-all duration-200 min-w-[140px] ${
                isFleetMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {isFleetMode ? <Truck className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
              {isFleetMode ? 'Fleet Manager' : 'Individual'}
              {isFleetMode && !isPremium && (
                <Crown className="h-3 w-3 ml-1 text-yellow-400" />
              )}
            </Button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-300" />

            {/* Map Theme Selector */}
            <MapThemeSelector />

            {/* Separator */}
            <div className="h-6 w-px bg-gray-300" />

            {/* Customize Mode Toggle */}
            <Button
              variant={isCustomizeMode ? "default" : "outline"}
              size="sm"
              onClick={handleCustomizeModeToggle}
              className={`transition-all duration-200 min-w-[120px] ${
                isCustomizeMode 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </Button>

            {/* Show/Hide All Overlays */}
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleAll}
              className="bg-white hover:bg-gray-50 transition-all duration-200 min-w-[100px]"
            >
              {allVisible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {allVisible ? 'Hide All' : 'Show All'}
            </Button>

          </div>
        </div>
      </div>

      {/* Customize Mode Panel */}
      {isCustomizeMode && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 w-96">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Overlay Controls
              </h3>
              <Badge variant="secondary" className="text-xs">
                {overlays.length} overlays
              </Badge>
            </div>
            
            <div className="space-y-2">
              {overlays.map((overlay) => (
                <div
                  key={overlay.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                      {overlay.title}
                    </span>
                    {overlay.hideable && (
                      <Badge variant="outline" className="text-xs">
                        Hideable
                      </Badge>
                    )}
                    <div className="text-xs text-gray-500">
                      {overlay.hideable ? 
                        (overlay.visible ? 'Visible' : 'Hidden') : 
                        (overlay.minimized ? 'Minimized' : 'Expanded')
                      }
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {overlay.hideable ? (
                      <Button
                        variant={overlay.visible ? "default" : "outline"}
                        size="sm"
                        onClick={() => onToggleOverlay(overlay.id)}
                        className="text-xs h-7 min-w-[60px]"
                      >
                        {overlay.visible ? (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Show
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant={overlay.minimized ? "outline" : "default"}
                        size="sm"
                        onClick={() => onToggleOverlay(overlay.id)}
                        className="text-xs h-7 min-w-[80px]"
                      >
                        {overlay.minimized ? 'Expand' : 'Minimize'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onResetLayout}
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Layout
                </Button>
              </div>
              
              <div className="text-xs text-gray-600">
                <div className="mb-2">
                  <strong>Layout Rules:</strong>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>• Left: Emergency Jobs (hideable) + Route Management</li>
                  <li>• Right: Market Insights + Location Analytics</li>
                  <li>• 20px edge padding, 16px gaps between overlays</li>
                  <li>• Fleet mode shows Team Management instead</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OverlayManager;
