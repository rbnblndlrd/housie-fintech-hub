
import React from 'react';
import { GoogleMap as ReactGoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import { Provider } from "@/types/service";

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  className?: string;
  providers?: Provider[];
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '300px'
};

const mapOptions = {
  styles: [
    {
      featureType: "all",
      elementType: "geometry.fill",
      stylers: [{ color: "#fef7cd" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17a2b8" }]
    }
  ]
};

export const GoogleMap: React.FC<GoogleMapProps> = ({ 
  center, 
  zoom, 
  className = "", 
  providers = [] 
}) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const getMarkerIcon = (availability: string) => {
    if (!isLoaded || typeof google === 'undefined') {
      return undefined;
    }
    
    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: availability === 'Available' ? '#10b981' : '#f59e0b',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2
    };
  };

  return (
    <div className={`w-full h-full rounded-lg ${className}`}>
      <LoadScript 
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
        onLoad={handleLoad}
      >
        <ReactGoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          options={mapOptions}
        >
          {isLoaded && providers.map(provider => (
            <Marker
              key={provider.id}
              position={{ lat: provider.lat, lng: provider.lng }}
              onClick={() => setSelectedProvider(provider)}
              icon={getMarkerIcon(provider.availability)}
            />
          ))}
          
          {selectedProvider && (
            <InfoWindow
              position={{ lat: selectedProvider.lat, lng: selectedProvider.lng }}
              onCloseClick={() => setSelectedProvider(null)}
            >
              <div className="p-2">
                <h3 className="font-bold">{selectedProvider.name}</h3>
                <p className="text-sm">{selectedProvider.service}</p>
                <p className="text-sm">Rating: {selectedProvider.rating}⭐</p>
                <p className="text-sm">Status: {selectedProvider.availability}</p>
              </div>
            </InfoWindow>
          )}
        </ReactGoogleMap>
      </LoadScript>
    </div>
  );
};
