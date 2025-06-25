
import React, { useState } from 'react';
import { UnifiedGoogleMap } from "@/components/UnifiedGoogleMap";
import { montrealProviders } from '@/data/montrealProviders';
import { montrealHeatZones } from '@/data/montrealHeatZones';
import MontrealHeatZonesOverlay from './map/MontrealHeatZonesOverlay';
import FleetVehicleMarkersOverlay from './map/FleetVehicleMarkersOverlay';
import FleetBoundingBoxOverlay from './map/FleetBoundingBoxOverlay';
import { FleetVehicle } from '@/hooks/useFleetVehicles';

interface HeatZoneMapProps {
  userRole: string | null;
  showHeatZones?: boolean;
  fleetVehicles?: FleetVehicle[];
  selectedVehicle?: FleetVehicle | null;
  onVehicleSelect?: (vehicle: FleetVehicle) => void;
  onCloseVehicleInfo?: () => void;
  showFleetBounds?: boolean;
  fleetBounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  } | null;
  followFleet?: boolean;
  fleetCenter?: { lat: number; lng: number };
}

const HeatZoneMap: React.FC<HeatZoneMapProps> = ({
  userRole,
  showHeatZones = true,
  fleetVehicles = [],
  selectedVehicle,
  onVehicleSelect,
  onCloseVehicleInfo,
  showFleetBounds = false,
  fleetBounds,
  followFleet = false,
  fleetCenter
}) => {
  const [selectedZone, setSelectedZone] = useState<any>(null);

  // Dynamic center and zoom based on fleet tracking
  const mapCenter = followFleet && fleetCenter 
    ? fleetCenter 
    : { lat: 45.5017, lng: -73.5673 }; // Montreal center

  const mapZoom = followFleet && fleetVehicles.length > 0 
    ? (fleetVehicles.length === 1 ? 14 : 12) 
    : 11;

  console.log('🗺️ HeatZoneMap render:', { 
    userRole, 
    showHeatZones, 
    fleetVehiclesCount: fleetVehicles.length,
    followFleet,
    mapCenter,
    mapZoom
  });

  return (
    <UnifiedGoogleMap
      center={mapCenter}
      zoom={mapZoom}
      className="w-full h-full"
      providers={montrealProviders}
      mode="heatZones"
    >
      {/* Heat Zones Overlay */}
      {showHeatZones && (
        <MontrealHeatZonesOverlay
          heatZones={montrealHeatZones}
          onZoneClick={setSelectedZone}
          selectedZone={selectedZone}
          onCloseInfo={() => setSelectedZone(null)}
        />
      )}

      {/* Fleet Vehicle Markers */}
      {fleetVehicles.length > 0 && (
        <FleetVehicleMarkersOverlay
          fleetVehicles={fleetVehicles}
          onVehicleSelect={onVehicleSelect || (() => {})}
          selectedVehicle={selectedVehicle}
          onCloseInfo={onCloseVehicleInfo || (() => {})}
        />
      )}

      {/* Fleet Bounding Box */}
      {showFleetBounds && (
        <FleetBoundingBoxOverlay
          bounds={fleetBounds}
          visible={showFleetBounds}
        />
      )}
    </UnifiedGoogleMap>
  );
};

export default HeatZoneMap;
