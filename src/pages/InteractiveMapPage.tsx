
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import Header from '@/components/Header';
import HeatZoneMap from '@/components/HeatZoneMap';
import InteractiveMapRightPanel from '@/components/map/InteractiveMapRightPanel';
import InteractiveMapBottomPanel from '@/components/map/InteractiveMapBottomPanel';
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
      
      <div className="pt-16 h-screen flex flex-col">
        {/* Main Content Area with Map and Right Panel */}
        <div className="flex flex-1">
          {/* Map Container - Takes remaining space after right panel */}
          <div className="flex-1 relative">
            <HeatZoneMap 
              userRole={currentRole} 
              showHeatZones={showHeatZones}
            />
          </div>

          {/* Right Side Panel */}
          <InteractiveMapRightPanel
            currentRole={currentRole}
            showHeatZones={showHeatZones}
            onHeatZonesToggle={handleHeatZonesToggle}
          />
        </div>

        {/* Bottom Panel - Increased height */}
        <div className="h-[28vh] border-t bg-white">
          <InteractiveMapBottomPanel currentRole={currentRole} />
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapPage;
