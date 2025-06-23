
import React from 'react';
import { Circle } from '@react-google-maps/api';
import { Provider } from "@/types/service";

interface GoogleMapCircleProps {
  hoveredProvider: Provider | null;
  isMapReady: boolean;
}

const GoogleMapCircle: React.FC<GoogleMapCircleProps> = ({
  hoveredProvider,
  isMapReady
}) => {
  if (!isMapReady || !hoveredProvider) return null;

  return (
    <Circle
      center={{ lat: hoveredProvider.lat, lng: hoveredProvider.lng }}
      radius={hoveredProvider.serviceRadius ? hoveredProvider.serviceRadius * 1000 : 10000}
      options={{
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        strokeColor: '#3b82f6',
        strokeOpacity: 0.4,
        strokeWeight: 2,
      }}
    />
  );
};

export default GoogleMapCircle;
