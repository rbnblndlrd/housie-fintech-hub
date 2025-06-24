
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import Header from '@/components/Header';
import PrivacyMapContainer from '@/components/map/PrivacyMapContainer';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GoogleMapsProvider } from '@/components/map/GoogleMapsProvider';
import { useToast } from '@/hooks/use-toast';

const InteractiveMapPage = () => {
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { toast } = useToast();
  const [showHeatZones, setShowHeatZones] = useState(true);

  console.log('🗺️ InteractiveMapPage render:', { user: !!user, currentRole });

  const handleHeatZonesToggle = (checked: boolean) => {
    setShowHeatZones(checked);
    console.log('Heat zones visibility changed:', checked);
    
    toast({
      title: checked ? "Heat Zones Enabled" : "Heat Zones Disabled",
      description: checked 
        ? "Now showing market demand by Montreal neighborhood" 
        : "Heat zones are now hidden from the map",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="relative h-screen pt-16">
        <GoogleMapsProvider>
          <PrivacyMapContainer 
            showHeatZones={showHeatZones}
            userRole={currentRole}
          />
        </GoogleMapsProvider>

        {/* Control Panel - Heat Zones only */}
        <div className="absolute bottom-4 left-4 z-10 space-y-3">
          {/* Heat Zones Control */}
          <Card className="p-4 bg-white/95 backdrop-blur-sm border shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-red-500 rounded-full"></div>
                <Label htmlFor="heat-zones" className="text-sm font-medium">
                  Heat Zones
                </Label>
              </div>
              <Switch
                id="heat-zones"
                checked={showHeatZones}
                onCheckedChange={handleHeatZonesToggle}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              View market demand by Montreal neighborhood
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapPage;
