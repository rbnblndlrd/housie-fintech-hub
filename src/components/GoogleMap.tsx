
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

// Fallback API key - users should set this in environment variables
const getGoogleMapsApiKey = () => {
  // In production, this should come from environment variables
  // For now, using the existing key but with better error handling
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyAJXkmufaWRLR5t4iFFp4qupryDKNZZO9o";
};

export const GoogleMap: React.FC<GoogleMapProps> = ({ 
  center, 
  zoom, 
  className = "", 
  providers = [],
  hoveredProviderId = null
}) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiKey = getGoogleMapsApiKey();

  const handleLoad = () => {
    console.log('Google Maps loaded successfully');
    setIsLoaded(true);
    setLoadError(null);
    setIsLoading(false);
  };

  const handleError = (error: Error) => {
    console.error('Google Maps failed to load:', error);
    let errorMessage = 'Failed to load Google Maps';
    
    if (error.message.includes('InvalidKeyMapError')) {
      errorMessage = 'Invalid Google Maps API key';
    } else if (error.message.includes('RefererNotAllowedMapError')) {
      errorMessage = 'Domain not authorized for this API key';
    } else if (error.message.includes('QuotaExceededError')) {
      errorMessage = 'Google Maps API quota exceeded';
    }
    
    setLoadError(errorMessage);
    setIsLoading(false);
  };

  const getMarkerIcon = (availability: string) => {
    if (!isLoaded || typeof google === 'undefined') {
      return undefined;
    }
    
    try {
      return {
        path: google.maps.SymbolPath.CIRCLE,
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

  // Find hovered provider with proper type checking
  const hoveredProvider = providers.find(p => p.id && p.id.toString() === hoveredProviderId);

  // Check if API key is available
  if (!apiKey) {
    return (
      <div className={`w-full h-full rounded-lg bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <div className="text-red-600 mb-2 text-lg">⚠️ Configuration Required</div>
          <p className="text-gray-700 mb-2">Google Maps API key not configured</p>
          <p className="text-sm text-gray-500">
            Please set VITE_GOOGLE_MAPS_API_KEY in your environment variables
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={`w-full h-full rounded-lg bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <div className="text-red-600 mb-2 text-lg">🗺️ Map Error</div>
          <p className="text-gray-700 mb-2">{loadError}</p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Please check:</p>
            <ul className="list-disc list-inside text-left">
              <li>Google Maps API key is valid</li>
              <li>Domain is authorized in Google Cloud Console</li>
              <li>Maps JavaScript API is enabled</li>
              <li>Billing is set up (if required)</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`w-full h-full rounded-lg bg-gray-50 flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interactive map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full rounded-lg ${className}`}>
      <LoadScript 
        googleMapsApiKey={apiKey}
        libraries={libraries}
        onLoad={handleLoad}
        onError={handleError}
        loadingElement={
          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Initializing map...</p>
            </div>
          </div>
        }
      >
        <ReactGoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          options={mapOptions}
          onLoad={() => console.log('Map instance loaded')}
        >
          {isLoaded && providers.map(provider => (
            <Marker
              key={provider.id}
              position={{ lat: provider.lat, lng: provider.lng }}
              onClick={() => {
                console.log('Marker clicked:', provider.name);
                setSelectedProvider(provider);
              }}
              icon={getMarkerIcon(provider.availability)}
              title={`${provider.name} - ${provider.service}`}
            />
          ))}

          {/* Service Radius Circle for Hovered Provider */}
          {isLoaded && hoveredProvider && (
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
          )}
          
          {selectedProvider && (
            <InfoWindow
              position={{ lat: selectedProvider.lat, lng: selectedProvider.lng }}
              onCloseClick={() => setSelectedProvider(null)}
            >
              <div className="p-2 max-w-xs">
                <h3 className="font-bold text-gray-900">{selectedProvider.name}</h3>
                <p className="text-sm text-gray-600">{selectedProvider.service}</p>
                <p className="text-sm text-gray-600">Rating: {selectedProvider.rating}⭐</p>
                <p className="text-sm text-gray-600">Status: {selectedProvider.availability}</p>
                {selectedProvider.serviceRadius && (
                  <p className="text-sm text-gray-600">Service Radius: {selectedProvider.serviceRadius}km</p>
                )}
              </div>
            </InfoWindow>
          )}
        </ReactGoogleMap>
      </LoadScript>
    </div>
  );
};
