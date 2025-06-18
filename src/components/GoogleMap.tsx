
import React from 'react';
import { GoogleMap as ReactGoogleMap, LoadScript, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { useState } from 'react';
import { Provider } from "@/types/service";

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  className?: string;
  providers?: Provider[];
  hoveredProviderId?: string | null;
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

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

export const GoogleMap: React.FC<GoogleMapProps> = ({ 
  center, 
  zoom, 
  className = "", 
  providers = [],
  hoveredProviderId = null
}) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    setLoadError(false);
  };

  const handleError = () => {
    setLoadError(true);
    console.error('Google Maps failed to load');
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

  const hoveredProvider = providers.find(p => p.id.toString() === hoveredProviderId);

  if (loadError) {
    return (
      <div className={`w-full h-full rounded-lg bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <p className="text-gray-600 mb-2">Map unavailable</p>
          <p className="text-sm text-gray-500">
            Please check your Google Maps API key configuration
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full rounded-lg ${className}`}>
      <LoadScript 
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
        libraries={libraries}
        onLoad={handleLoad}
        onError={handleError}
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

          {/* Service Radius Circle for Hovered Provider */}
          {isLoaded && hoveredProvider && (
            <Circle
              center={{ lat: hoveredProvider.lat, lng: hoveredProvider.lng }}
              radius={hoveredProvider.serviceRadius ? hoveredProvider.serviceRadius * 1000 : 10000} // Convert km to meters
              options={{
                fillColor: '#3b82f6',
                fillOpacity: 0.1,
                strokeColor: '#3b82f6',
                strokeOpacity: 0.4,
                strokeWeight: 2,
              }}
            />
          )}
          
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
                {selectedProvider.serviceRadius && (
                  <p className="text-sm">Service Radius: {selectedProvider.serviceRadius}km</p>
                )}
              </div>
            </InfoWindow>
          )}
        </ReactGoogleMap>
      </LoadScript>
    </div>
  );
};
