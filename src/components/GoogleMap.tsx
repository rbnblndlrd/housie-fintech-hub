
import React from 'react';
import { UnifiedGoogleMap } from './UnifiedGoogleMap';
import { Provider } from "@/types/service";

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  className?: string;
  providers?: Provider[];
  hoveredProviderId?: string | null;
}

export const GoogleMap: React.FC<GoogleMapProps> = (props) => {
  return <UnifiedGoogleMap {...props} mode="services" />;
};
