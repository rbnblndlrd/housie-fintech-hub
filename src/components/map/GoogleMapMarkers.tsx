
import React from 'react';
import { Marker } from '@react-google-maps/api';
import { Provider } from "@/types/service";

interface GoogleMapMarkersProps {
  providers: Provider[];
  isMapReady: boolean;
  onMarkerClick: (provider: Provider) => void;
}

const GoogleMapMarkers: React.FC<GoogleMapMarkersProps> = ({
  providers,
  isMapReady,
  onMarkerClick
}) => {
  const getMarkerIcon = (availability: string) => {
    if (!isMapReady || !window.google || !window.google.maps) {
      return undefined;
    }
    
    try {
      if (!window.google.maps.SymbolPath) {
        console.warn('Google Maps SymbolPath not available');
        return undefined;
      }

      return {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: availability === 'Available' ? '#10b981' : '#f59e0b',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2
      };
    } catch (error) {
      console.error('Error creating marker icon:', error);
      return undefined;
    }
  };

  if (!isMapReady || !window.google || !window.google.maps) return null;

  return (
    <>
      {providers.map(provider => (
        <Marker
          key={provider.id}
          position={{ lat: provider.lat, lng: provider.lng }}
          onClick={() => {
            console.log('Provider marker clicked:', provider.name);
            onMarkerClick(provider);
          }}
          icon={getMarkerIcon(provider.availability)}
          title={`${provider.name} - ${provider.service}`}
        />
      ))}
    </>
  );
};

export default GoogleMapMarkers;
