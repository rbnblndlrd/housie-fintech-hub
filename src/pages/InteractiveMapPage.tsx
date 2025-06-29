import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { preventWalletConflicts } from '@/components/map/GoogleMapConfig';
import { UnifiedGoogleMap } from '@/components/UnifiedGoogleMap';
import { useMapTheme } from '@/hooks/useMapTheme';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Move } from 'lucide-react';
import MapThemeSelector from '@/components/map/MapThemeSelector';
import CustomerMapMode from '@/components/map/modes/CustomerMapMode';
import ProviderMapMode from '@/components/map/modes/ProviderMapMode';
import FleetManagerMode from '@/components/map/modes/FleetManagerMode';

type UserMode = 'customer' | 'provider' | 'fleet-manager';

const InteractiveMapPage = () => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();
  const { toast } = useToast();
  const { currentThemeConfig } = useMapTheme();

  console.log('🗺️ InteractiveMapPage render:', { hasUser: !!user, currentRole });

  // Prevent wallet conflicts on mount
  useEffect(() => {
    preventWalletConflicts();
  }, []);

  // Clean state management
  const [userMode, setUserMode] = useState<UserMode>('customer');
  const [isDragging, setIsDragging] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [enabledLayers, setEnabledLayers] = useState<Record<string, boolean>>({
    // Customer layers
    crime: false,
    demographics: false,
    services: false,
    // Provider layers
    demand: false,
    competition: false,
    tips: false,
    opportunity: false,
    // Fleet Manager layers
    fleetTracking: false,
    jobDistribution: false,
    performanceZones: false,
    routeOptimization: false
  });

  // Quebec/Montreal center coordinates
  const quebecCenter = { lat: 45.5017, lng: -73.5673 };

  const handleUserModeChange = (mode: UserMode) => {
    console.log('🗺️ User mode changed to:', mode);
    setUserMode(mode);
    toast({
      title: "Mode Changed",
      description: `Switched to ${mode.replace('-', ' ')} mode`,
    });
  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  const handleDraggingToggle = () => {
    setIsDragging(!isDragging);
    toast({
      title: isDragging ? "Dragging Disabled" : "Dragging Enabled",
      description: isDragging 
        ? "Map interactions restored to normal"
        : "You can now drag map elements"
    });
  };

  const handleDataLayerToggle = (layer: string, enabled: boolean) => {
    console.log('🎛️ Layer toggle:', layer, enabled);
    setEnabledLayers(prev => ({
      ...prev,
      [layer]: enabled
    }));
    
    toast({
      title: `${layer} Layer ${enabled ? 'Enabled' : 'Disabled'}`,
      description: `${layer} data ${enabled ? 'now showing' : 'hidden'} on map`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      
      {/* Clean Map Container */}
      <div className="fixed inset-0 pt-16">
        <div className="w-full h-full relative flex">
          {/* Map Section */}
          <div className="flex-1 relative">
            {/* Clean Google Map with Teal & Cream Theme */}
            <UnifiedGoogleMap
              center={quebecCenter}
              zoom={10}
              className="w-full h-full"
              mode="interactive"
              mapStyles={currentThemeConfig.styles}
              enabledLayers={enabledLayers}
            />

            {/* Top Controls Bar */}
            <div className="absolute top-4 left-4 right-4 z-50 pointer-events-none">
              <div className="flex items-center justify-between">
                {/* Left Controls */}
                <div className="flex items-center gap-3 pointer-events-auto">
                  {/* User Mode Selector */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-300 p-2">
                    <Select value={userMode} onValueChange={handleUserModeChange}>
                      <SelectTrigger className="w-40 border-none bg-transparent">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="provider">Provider</SelectItem>
                        <SelectItem value="fleet-manager">Fleet Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3 pointer-events-auto">
                  {/* Map Theme Selector */}
                  <MapThemeSelector />
                  
                  {/* Settings Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSettingsToggle}
                    className={`bg-white hover:bg-gray-50 border-2 border-gray-400 hover:border-gray-500 ${
                      showSettings ? 'bg-blue-50 border-blue-500' : ''
                    }`}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>

                  {/* Dragging Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDraggingToggle}
                    className={`bg-white hover:bg-gray-50 border-2 border-gray-400 hover:border-gray-500 ${
                      isDragging ? 'bg-orange-50 border-orange-500' : ''
                    }`}
                  >
                    <Move className="h-4 w-4 mr-2" />
                    {isDragging ? 'Dragging On' : 'Dragging Off'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Settings Panel (when enabled) */}
            {showSettings && (
              <div className="absolute top-20 right-4 z-50 pointer-events-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-gray-300 w-64">
                  <h3 className="font-semibold text-gray-900 mb-3">Map Settings</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>Current Mode: <span className="font-medium capitalize">{userMode.replace('-', ' ')}</span></div>
                    <div>Theme: <span className="font-medium">{currentThemeConfig.name}</span></div>
                    <div>Dragging: <span className="font-medium">{isDragging ? 'Enabled' : 'Disabled'}</span></div>
                    <div className="pt-2 text-xs text-gray-500">
                      Real Quebec data integration active
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mode-specific Right Panel */}
          {userMode === 'customer' && (
            <CustomerMapMode 
              onDataLayerToggle={handleDataLayerToggle}
              enabledLayers={enabledLayers}
            />
          )}

          {userMode === 'provider' && (
            <ProviderMapMode 
              onDataLayerToggle={handleDataLayerToggle}
              enabledLayers={enabledLayers}
            />
          )}

          {userMode === 'fleet-manager' && (
            <FleetManagerMode 
              onDataLayerToggle={handleDataLayerToggle}
              enabledLayers={enabledLayers}
            />
          )}
        </div>

        {/* Chat Bubble */}
        <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
          <div className="pointer-events-auto">
            <ChatBubble defaultTab="voice" showMicIcon={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapPage;
