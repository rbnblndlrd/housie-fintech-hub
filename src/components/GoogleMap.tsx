
import React from 'react';
import { GoogleMap as ReactGoogleMap } from '@react-google-maps/api';
import { useState } from 'react';
import { Provider } from "@/types/service";
import { GoogleMapLoader } from './GoogleMapLoader';
import GoogleMapMarkers from './map/GoogleMapMarkers';
import GoogleMapInfoWindow from './map/GoogleMapInfoWindow';
import GoogleMapCircle from './map/GoogleMapCircle';
import GoogleMapErrorFallback from './map/GoogleMapErrorFallback';
import GoogleMapLoadingFallback from './map/GoogleMapLoadingFallback';
import { 
  mapContainerStyle, 
  mapOptions, 
  libraries, 
  GOOGLE_MAPS_API_KEY 
} from './map/GoogleMapConfig';

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  className?: string;
  providers?: Provider[];
  hoveredProviderId?: string | null;
}

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

  const handleMarkerClick = (provider: Provider) => {
    setSelectedProvider(provider);
  };

  const handleInfoWindowClose = () => {
    setSelectedProvider(null);
  };

  // Find hovered provider with proper type checking
  const hoveredProvider = providers.find(p => p.id && p.id.toString() === hoveredProviderId);

  if (!GOOGLE_MAPS_API_KEY) {
    return <GoogleMapLoadingFallback className={className} />;
  }

  if (mapError) {
    return <GoogleMapErrorFallback error={mapError} className={className} />;
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
          <GoogleMapMarkers
            providers={providers}
            isMapReady={isMapReady}
            onMarkerClick={handleMarkerClick}
          />

          <GoogleMapCircle
            hoveredProvider={hoveredProvider}
            isMapReady={isMapReady}
          />
          
          <GoogleMapInfoWindow
            selectedProvider={selectedProvider}
            onClose={handleInfoWindowClose}
          />
        </ReactGoogleMap>
      </GoogleMapLoader>
    </div>
  );
};
