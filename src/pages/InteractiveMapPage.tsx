
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
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

type UserMode = 'customer' | 'provider' | 'fleet-manager';

const InteractiveMapPage = () => {
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { toast } = useToast();
  const { currentThemeConfig } = useMapTheme();

  // Prevent wallet conflicts on mount
  useEffect(() => {
    preventWalletConflicts();
  }, []);

  // Clean state management
  const [userMode, setUserMode] = useState<UserMode>('customer');
  const [isDragging, setIsDragging] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Quebec/Montreal center coordinates
  const quebecCenter = { lat: 45.5017, lng: -73.5673 };

  const handleUserModeChange = (mode: UserMode) => {
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

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      
      {/* Clean Map Container */}
      <div className="fixed inset-0 pt-16">
        <div className="w-full h-full relative">
          {/* Clean Google Map with Teal & Cream Theme */}
          <UnifiedGoogleMap
            center={quebecCenter}
            zoom={10}
            className="w-full h-full"
            mode="interactive"
            mapStyles={currentThemeConfig.styles}
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

          {/* Mode-specific Content Area (placeholder for future overlays) */}
          <div className="absolute inset-0 pointer-events-none z-40">
            {userMode === 'customer' && (
              <div className="absolute bottom-4 left-4 pointer-events-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-gray-300">
                  <h3 className="font-semibold text-gray-900 mb-2">Customer Mode</h3>
                  <p className="text-sm text-gray-600">Find services in your area</p>
                </div>
              </div>
            )}

            {userMode === 'provider' && (
              <div className="absolute bottom-4 left-4 pointer-events-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-gray-300">
                  <h3 className="font-semibold text-gray-900 mb-2">Provider Mode</h3>
                  <p className="text-sm text-gray-600">Manage your service area</p>
                </div>
              </div>
            )}

            {userMode === 'fleet-manager' && (
              <div className="absolute bottom-4 left-4 pointer-events-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-gray-300">
                  <h3 className="font-semibold text-gray-900 mb-2">Fleet Manager Mode</h3>
                  <p className="text-sm text-gray-600">Coordinate your fleet operations</p>
                </div>
              </div>
            )}
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
                    More settings and overlays coming soon...
                  </div>
                </div>
              </div>
            </div>
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
