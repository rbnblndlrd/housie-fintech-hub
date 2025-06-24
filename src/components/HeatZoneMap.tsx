
import React, { useState } from 'react';
import { UnifiedGoogleMap } from './UnifiedGoogleMap';
import MontrealHeatZonesOverlay from './map/MontrealHeatZonesOverlay';
import { montrealHeatZones, MontrealHeatZone } from '@/data/montrealHeatZones';

interface HeatZoneMapProps {
  userRole: 'customer' | 'provider';
  showHeatZones?: boolean;
  selectedProfession?: string;
  demandThreshold?: number[];
  onProfessionChange?: (profession: string) => void;
  onDemandThresholdChange?: (threshold: number[]) => void;
}

const HeatZoneMap: React.FC<HeatZoneMapProps> = ({ 
  userRole, 
  showHeatZones = true,
  selectedProfession = 'all',
  demandThreshold = [0],
  onProfessionChange,
  onDemandThresholdChange
}) => {
  const [selectedZone, setSelectedZone] = useState<MontrealHeatZone | null>(null);

  console.log('🗺️ HeatZoneMap render:', { userRole, showHeatZones, zonesCount: montrealHeatZones.length });

  const filteredZones = montrealHeatZones.filter(zone => {
    if (selectedProfession === 'all') return zone.demandScore >= demandThreshold[0];
    
    const professionData = zone.keyServices[selectedProfession];
    return professionData && professionData.demand >= demandThreshold[0];
  });

  const center = { lat: 45.5017, lng: -73.5673 };

  return (
    <div className="w-full h-full relative">
      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg shadow-lg p-3">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>High Opportunity</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>Low</span>
          </div>
        </div>
      </div>

      {/* Unified Map with Heat Zones */}
      <UnifiedGoogleMap
        center={center}
        zoom={11}
        className="w-full h-full"
        mode="heatZones"
      >
        {showHeatZones && (
          <MontrealHeatZonesOverlay
            zones={filteredZones}
            userRole={userRole}
            onZoneSelect={setSelectedZone}
          />
        )}
      </UnifiedGoogleMap>
    </div>
  );
};

export default HeatZoneMap;
