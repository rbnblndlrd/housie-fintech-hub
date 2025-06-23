
import React from 'react';
import { GoogleMap as ReactGoogleMap, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { useState } from 'react';
import { Provider } from "@/types/service";
import { GoogleMapLoader } from './GoogleMapLoader';

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

// Montreal-specific map styling
const mapOptions = {
  styles: [
    {
      featureType: "all",
      elementType: "geometry.fill",
      stylers: [{ color: "#f8fafc" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#3b82f6" }]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#e2e8f0" }]
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#1f2937" }]
    }
  ],
  restriction: {
    latLngBounds: {
      north: 46.0,
      south: 45.0,
      east: -73.0,
      west: -74.5,
    },
    strictBounds: false,
  }
};

const libraries: string[] = ["places", "geometry"];

// Use your Web API key directly
const GOOGLE_MAPS_API_KEY = "AIzaSyAJXkmufaWRLR5t4iFFp4qupryDKNZZO9o";

export const GoogleMap: React.FC<GoogleMapProps> = ({ 
  center, 
  zoom, 
  className = "", 
  providers = [],
  hoveredProviderId = null
}) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const handleLoad = () => {
    console.log('✅ Google Maps API loaded successfully!');
    setIsMapReady(true);
    setMapError(null);
  };

  const handleError = (error: Error) => {
    console.error('❌ Google Maps failed to load:', error);
    let errorMessage = 'Failed to load Google Maps';
    
    if (error.message.includes('timeout')) {
      errorMessage = 'Maps loading timeout - check API key and billing';
    } else if (error.message.includes('script')) {
      errorMessage = 'Failed to load Maps script - check network connection';
    }
    
    setMapError(errorMessage);
  };

  const getMarkerIcon = (availability: string) => {
    if (!isMapReady || typeof window.google === 'undefined') {
      return undefined;
    }
    
    try {
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

  // Find hovered provider with proper type checking
  const hoveredProvider = providers.find(p => p.id && p.id.toString() === hoveredProviderId);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className={`w-full h-full rounded-lg bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <div className="text-red-600 mb-2 text-lg">⚠️ Configuration Required</div>
          <p className="text-gray-700 mb-2">Google Maps API key not configured</p>
          <p className="text-sm text-gray-500">
            Please set your Google Maps API key in the component
          </p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className={`w-full h-full rounded-lg bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-6 max-w-lg">
          <div className="text-red-600 mb-3 text-xl">🗺️ Map Loading Error</div>
          <p className="text-gray-800 mb-4 font-medium text-lg">{mapError}</p>
          
          <div className="text-sm text-gray-600 space-y-3 text-left">
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="font-medium text-blue-800 mb-2">Quick Solutions:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Check your Google Cloud Console billing is enabled</li>
                <li>Verify Maps JavaScript API is enabled</li>
                <li>Ensure API key has proper permissions</li>
                <li>Check domain restrictions (if any)</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full rounded-lg ${className}`}>
      <GoogleMapLoader
        apiKey={GOOGLE_MAPS_API_KEY}
        libraries={libraries}
        onLoad={handleLoad}
        onError={handleError}
        loadingElement={
          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading Montreal interactive map...</p>
              <p className="text-xs text-gray-400 mt-2">Initializing Google Maps...</p>
            </div>
          </div>
        }
      >
        <ReactGoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          options={mapOptions}
          onLoad={() => console.log('🗺️ Montreal map instance ready with', providers.length, 'providers')}
        >
          {isMapReady && providers.map(provider => (
            <Marker
              key={provider.id}
              position={{ lat: provider.lat, lng: provider.lng }}
              onClick={() => {
                console.log('Provider marker clicked:', provider.name);
                setSelectedProvider(provider);
              }}
              icon={getMarkerIcon(provider.availability)}
              title={`${provider.name} - ${provider.service}`}
            />
          ))}

          {/* Service Radius Circle for Hovered Provider */}
          {isMapReady && hoveredProvider && (
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
      </GoogleMapLoader>
    </div>
  );
};
