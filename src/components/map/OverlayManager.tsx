
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Eye, EyeOff, Truck, User, Settings, Crown, X, RotateCcw, Menu, Move, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { OverlayConfig } from '@/hooks/useOverlayManager';
import MapThemeSelector from './MapThemeSelector';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface OverlayManagerProps {
  overlays: OverlayConfig[];
  onToggleOverlay: (overlayId: string) => void;
  onToggleAll: () => void;
  onResetLayout: () => void;
  onResetPositions: () => void;
  allVisible: boolean;
  isFleetMode: boolean;
  onToggleFleetMode: (enabled: boolean) => void;
  isCustomizeMode: boolean;
  onToggleCustomizeMode: (enabled: boolean) => void;
  isDraggableMode: boolean;
  onToggleDraggableMode: (enabled: boolean) => void;
  isPremium: boolean;
}

const OverlayManager: React.FC<OverlayManagerProps> = ({
  overlays,
  onToggleOverlay,
  onToggleAll,
  onResetLayout,
  onResetPositions,
  allVisible,
  isFleetMode,
  onToggleFleetMode,
  isCustomizeMode,
  onToggleCustomizeMode,
  isDraggableMode,
  onToggleDraggableMode,
  isPremium
}) => {
  const isMobile = useIsMobile();

  const handleFleetModeToggle = () => {
    onToggleFleetMode(!isFleetMode);
  };

  const handleCustomizeModeToggle = () => {
    onToggleCustomizeMode(!isCustomizeMode);
  };

  const handleDraggableModeToggle = () => {
    onToggleDraggableMode(!isDraggableMode);
  };

  console.log('🎛️ OverlayManager render:', { 
    overlaysCount: overlays.length,
    isFleetMode,
    isCustomizeMode,
    isDraggableMode,
    allVisible,
    isMobile,
    overlayStates: overlays.map(o => ({ id: o.id, visible: o.visible, minimized: o.minimized }))
  });

  // Mobile Bottom Sheet for Controls
  const MobileControls = () => (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 md:hidden pointer-events-auto">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="bg-white text-gray-900 border-2 border-gray-400 hover:bg-gray-50 hover:border-gray-500 shadow-lg min-h-[44px] px-6 pointer-events-auto"
          >
            <Menu className="h-5 w-5 mr-2 text-gray-900" />
            <span className="text-gray-900 font-medium">Controls</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto pointer-events-auto">
          <SheetHeader>
            <SheetTitle className="text-left">Map Controls</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-6 mt-6">
            {/* Mode Toggle */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">View Mode</h3>
              <Button
                variant={isFleetMode ? "default" : "outline"}
                size="lg"
                onClick={handleFleetModeToggle}
                className={`w-full min-h-[44px] justify-start pointer-events-auto ${
                  isFleetMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-400'
                }`}
              >
                {isFleetMode ? <Truck className="h-5 w-5 mr-3" /> : <User className="h-5 w-5 mr-3" />}
                <span className="text-base">
                  {isFleetMode ? 'Fleet Manager' : 'Individual Provider'}
                </span>
                {isFleetMode && !isPremium && (
                  <Crown className="h-4 w-4 ml-auto text-yellow-400" />
                )}
              </Button>
            </div>

            {/* Map Theme */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Map Theme</h3>
              <MapThemeSelector />
            </div>

            {/* Draggable Mode Toggle */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Layout Options</h3>
              <Button
                variant={isDraggableMode ? "default" : "outline"}
                size="lg"
                onClick={handleDraggableModeToggle}
                className={`w-full min-h-[44px] justify-start pointer-events-auto ${
                  isDraggableMode 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <Move className="h-5 w-5 mr-3" />
                <span className="text-base">
                  {isDraggableMode ? 'Free Drag Mode' : 'Enable Dragging'}
                </span>
              </Button>
              
              {isDraggableMode && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onResetPositions}
                  className="w-full min-h-[44px] justify-start pointer-events-auto"
                >
                  <RotateCcw className="h-5 w-5 mr-3" />
                  <span className="text-base">Reset Positions</span>
                </Button>
              )}
            </div>

            {/* Overlay Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Overlays</h3>
                <Badge variant="secondary" className="text-xs">
                  {overlays.length} available
                </Badge>
              </div>
              
              <Button
                variant="outline"
                size="lg"
                onClick={onToggleAll}
                className="w-full min-h-[44px] justify-start pointer-events-auto"
              >
                {allVisible ? <EyeOff className="h-5 w-5 mr-3" /> : <Eye className="h-5 w-5 mr-3" />}
                <span className="text-base">
                  {allVisible ? 'Hide All Overlays' : 'Show All Overlays'}
                </span>
              </Button>

              <div className="space-y-2">
                {overlays.map((overlay) => (
                  <div
                    key={overlay.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {overlay.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {overlay.hideable ? 
                          (overlay.visible ? 'Visible' : 'Hidden') : 
                          (overlay.minimized ? 'Minimized' : 'Expanded')
                        }
                        {overlay.hideable && (
                          <Badge variant="outline" className="text-xs ml-2">
                            Hideable
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant={overlay.hideable ? 
                        (overlay.visible ? "default" : "outline") :
                        (overlay.minimized ? "outline" : "default")
                      }
                      size="sm"
                      onClick={() => onToggleOverlay(overlay.id)}
                      className="min-h-[36px] min-w-[80px] text-xs pointer-events-auto"
                    >
                      {overlay.hideable ? (
                        overlay.visible ? (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Show
                          </>
                        )
                      ) : (
                        overlay.minimized ? 'Expand' : 'Minimize'
                      )}
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={onResetLayout}
                className="w-full min-h-[44px] justify-start mt-4 pointer-events-auto"
              >
                <RotateCcw className="h-5 w-5 mr-3" />
                <span className="text-base">Reset Layout</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  // Desktop Control Bar
  const DesktopControls = () => (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 hidden md:block pointer-events-auto">
      <div className="bg-white rounded-xl shadow-xl border-2 border-gray-300 p-4 pointer-events-auto">
        <div className="flex items-center gap-4 min-w-[700px] pointer-events-auto">
          
          {/* Fleet/Individual Mode Toggle */}
          <Button
            variant={isFleetMode ? "default" : "outline"}
            size="sm"
            onClick={handleFleetModeToggle}
            className={`transition-all duration-200 min-w-[140px] pointer-events-auto font-medium ${
              isFleetMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-400 hover:border-gray-500'
            }`}
          >
            {isFleetMode ? <Truck className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
            <span className="font-medium">{isFleetMode ? 'Fleet Manager' : 'Individual'}</span>
            {isFleetMode && !isPremium && (
              <Crown className="h-3 w-3 ml-1 text-yellow-400" />
            )}
          </Button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-400" />

          {/* Map Theme Selector */}
          <div className="pointer-events-auto">
            <MapThemeSelector />
          </div>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-400" />

          {/* Draggable Mode Toggle */}
          <Button
            variant={isDraggableMode ? "default" : "outline"}
            size="sm"
            onClick={handleDraggableModeToggle}
            className={`transition-all duration-200 min-w-[120px] pointer-events-auto font-medium ${
              isDraggableMode 
                ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-400 hover:border-gray-500'
            }`}
          >
            <Move className="h-4 w-4 mr-2" />
            <span className="font-medium">{isDraggableMode ? 'Dragging' : 'Drag Mode'}</span>
          </Button>

          {/* Reset Positions (only show when dragging is enabled) */}
          {isDraggableMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetPositions}
              className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-400 hover:border-gray-500 transition-all duration-200 min-w-[100px] pointer-events-auto font-medium"
              title="Reset overlay positions to organized layout"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              <span className="font-medium">Reset Pos</span>
            </Button>
          )}

          {/* Customize Mode Toggle */}
          <Button
            variant={isCustomizeMode ? "default" : "outline"}
            size="sm"
            onClick={handleCustomizeModeToggle}
            className={`transition-all duration-200 min-w-[120px] pointer-events-auto font-medium ${
              isCustomizeMode 
                ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600' 
                : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-400 hover:border-gray-500'
            }`}
          >
            <Settings className="h-4 w-4 mr-2" />
            <span className="font-medium">Customize</span>
          </Button>

          {/* Show/Hide All Overlays */}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleAll}
            className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-400 hover:border-gray-500 transition-all duration-200 min-w-[100px] pointer-events-auto font-medium"
          >
            {allVisible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            <span className="font-medium">{allVisible ? 'Hide All' : 'Show All'}</span>
          </Button>

        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Controls */}
      {isMobile ? <MobileControls /> : <DesktopControls />}

      {/* Desktop Customize Mode Panel */}
      {isCustomizeMode && !isMobile && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40 pointer-events-auto">
          <div className="bg-white rounded-xl shadow-xl border-2 border-gray-300 p-4 w-96 pointer-events-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Overlay Controls
              </h3>
              <Badge variant="secondary" className="text-xs">
                {overlays.length} overlays
              </Badge>
            </div>
            
            {/* Dragging Status Indicator */}
            {isDraggableMode && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-sm font-medium">Drag Mode Active</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Click and drag overlay headers to reposition them freely
                </p>
              </div>
            )}
            
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
                        className="text-xs h-7 min-w-[60px] pointer-events-auto"
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
                        className="text-xs h-7 min-w-[80px] pointer-events-auto"
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
                  className="flex-1 pointer-events-auto"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Layout
                </Button>
              </div>
              
              <div className="text-xs text-gray-600">
                <div className="mb-2">
                  <strong className="text-gray-900">Layout Rules:</strong>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>• Mobile: Single column stack with touch controls</li>
                  <li>• Desktop: Left/Right organized layout with 20px padding</li>
                  <li>• Fleet mode shows Team Management instead of Emergency Jobs</li>
                  <li>• {isDraggableMode ? 'Drag mode: Click headers to move overlays freely' : 'Organized mode: Fixed positioning system'}</li>
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
