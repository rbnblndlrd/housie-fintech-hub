
import React, { useState, useEffect } from 'react';
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

  // Debug logging for theme changes
  useEffect(() => {
    console.log('🎨 FleetMap theme changed:', { 
      currentTheme, 
      themeConfig: currentThemeConfig,
      stylesLength: currentThemeConfig.styles?.length || 0
    });
  }, [currentTheme, currentThemeConfig]);

  console.log('🗺️ FleetMap render:', { 
    userRole, 
    fleetVehiclesCount: fleetVehicles.length,
    followFleet,
    mapCenter,
    mapZoom,
    currentTheme,
    mapStyles: currentThemeConfig.styles
  });

  return (
    <UnifiedGoogleMap
      key={`map-${currentTheme}`} // Force re-render when theme changes
      center={mapCenter}
      zoom={mapZoom}
      className="w-full h-full"
      providers={montrealProviders}
      mode="interactive"
      mapStyles={currentThemeConfig.styles}
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
