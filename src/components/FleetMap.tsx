
import React, { useState } from 'react';
import { UnifiedGoogleMap } from "@/components/UnifiedGoogleMap";
import { montrealProviders } from '@/data/montrealProviders';
import FleetVehicleMarkersOverlay from './map/FleetVehicleMarkersOverlay';
import FleetBoundingBoxOverlay from './map/FleetBoundingBoxOverlay';
import { FleetVehicle } from '@/hooks/useFleetVehicles';
import { useMapTheme } from '@/hooks/useMapTheme';

interface FleetMapProps {
  userRole: string | null;
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

const FleetMap: React.FC<FleetMapProps> = ({
  userRole,
  fleetVehicles = [],
  selectedVehicle,
  onVehicleSelect,
  onCloseVehicleInfo,
  showFleetBounds = false,
  fleetBounds,
  followFleet = false,
  fleetCenter
}) => {
  const { currentTheme, currentThemeConfig } = useMapTheme();
  
  // Dynamic center and zoom based on fleet tracking
  const mapCenter = followFleet && fleetCenter 
    ? fleetCenter 
    : { lat: 45.5017, lng: -73.5673 }; // Montreal center

  const mapZoom = followFleet && fleetVehicles.length > 0 
    ? (fleetVehicles.length === 1 ? 14 : 12) 
    : 11;

  console.log('🗺️ FleetMap render:', { 
    userRole, 
    fleetVehiclesCount: fleetVehicles.length,
    followFleet,
    mapCenter,
    mapZoom,
    currentTheme
  });

  return (
    <UnifiedGoogleMap
      center={mapCenter}
      zoom={mapZoom}
      className="w-full h-full"
      providers={montrealProviders}
      mode="interactive"
      options={{
        styles: currentThemeConfig.styles,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      }}
    >
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

export default FleetMap;
