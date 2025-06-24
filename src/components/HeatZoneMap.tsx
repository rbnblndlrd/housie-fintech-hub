
import React, { useState } from 'react';
import { UnifiedGoogleMap } from './UnifiedGoogleMap';
import MontrealHeatZonesOverlay from './map/MontrealHeatZonesOverlay';
import { montrealHeatZones, MontrealHeatZone } from '@/data/montrealHeatZones';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Filter
} from 'lucide-react';

interface HeatZoneMapProps {
  userRole: 'customer' | 'provider';
}

const professionOptions = [
  { value: 'all', label: 'All Services' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'handyman', label: 'Handyman' },
  { value: 'lawncare', label: 'Lawn Care' },
  { value: 'moving', label: 'Moving' },
  { value: 'concierge', label: 'Concierge' },
  { value: 'security', label: 'Security' }
];

const HeatZoneMap: React.FC<HeatZoneMapProps> = ({ userRole }) => {
  const [selectedProfession, setSelectedProfession] = useState('all');
  const [demandThreshold, setDemandThreshold] = useState([0]);
  const [selectedZone, setSelectedZone] = useState<MontrealHeatZone | null>(null);

  const filteredZones = montrealHeatZones.filter(zone => {
    if (selectedProfession === 'all') return zone.demandScore >= demandThreshold[0];
    
    const professionData = zone.keyServices[selectedProfession];
    return professionData && professionData.demand >= demandThreshold[0];
  });

  const center = { lat: 45.5017, lng: -73.5673 };

  return (
    <div className="w-full h-full relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={selectedProfession} onValueChange={setSelectedProfession}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {professionOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">Min Demand:</span>
            <Slider
              value={demandThreshold}
              onValueChange={setDemandThreshold}
              max={100}
              step={10}
              className="w-20"
            />
            <span className="text-xs text-gray-600">{demandThreshold[0]}%</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3">
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
        <MontrealHeatZonesOverlay
          zones={filteredZones}
          userRole={userRole}
          onZoneSelect={setSelectedZone}
        />
      </UnifiedGoogleMap>
    </div>
  );
};

export default HeatZoneMap;
