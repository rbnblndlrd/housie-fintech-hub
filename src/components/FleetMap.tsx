
import React, { useState, useEffect } from 'react';
import { UnifiedMapboxMap } from "@/components/UnifiedMapboxMap";
import { montrealProviders } from '@/data/montrealProviders';
// import FleetVehicleMarkersOverlay from './map/FleetVehicleMarkersOverlay'; // Removed with Google Maps
import { FleetVehicle } from '@/hooks/useFleetVehicles';
// import { useMapTheme } from '@/hooks/useMapTheme'; // Removed with Google Maps

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
  // const { currentTheme, currentThemeConfig } = useMapTheme(); // Removed with Google Maps
  
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
    mapZoom
  });

  return (
    <UnifiedMapboxMap
      center={mapCenter}
      zoom={mapZoom}
      className="w-full h-full"
      providers={montrealProviders}
      mode="interactive"
    />
  );
};

export default FleetMap;
