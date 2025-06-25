import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, Circle, InfoWindow } from '@react-google-maps/api';
import { Provider } from "@/types/service";
import { GOOGLE_MAPS_API_KEY, mapOptions } from './map/GoogleMapConfig';
import { useGoogleMaps } from './map/GoogleMapsProvider';

interface UnifiedGoogleMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  className?: string;
  providers?: Provider[];
  hoveredProviderId?: string | null;
  onProviderClick?: (provider: Provider) => void;
  mode?: 'services' | 'interactive' | 'privacy' | 'heatZones';
  children?: React.ReactNode;
  mapStyles?: google.maps.MapTypeStyle[];
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '300px'
};

export const UnifiedGoogleMap: React.FC<UnifiedGoogleMapProps> = ({
  center,
  zoom,
  className = "",
  providers = [],
  hoveredProviderId = null,
  onProviderClick,
  mode = 'services',
  children,
  mapStyles
}) => {
  const { isLoaded, loadError } = useGoogleMaps();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log('✅ Unified Google Map loaded successfully');
    setMap(map);
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    console.log('🧹 Cleaning up Unified Google Map');
    setMap(null);
  }, []);

  const handleMarkerClick = (provider: Provider) => {
    setSelectedProvider(provider);
    if (onProviderClick) {
      onProviderClick(provider);
    }
  };

  const getMarkerIcon = (availability: string) => {
    if (!window.google?.maps?.SymbolPath) {
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

  // Create map options with custom styles if provided
  const customMapOptions = {
    ...mapOptions,
    ...(mapStyles && { styles: mapStyles })
  };

  // Find hovered provider
  const hoveredProvider = providers.find(p => p.id && p.id.toString() === hoveredProviderId);

  if (loadError) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center p-6">
          <div className="text-red-600 mb-3 text-xl">🗺️ Maps Loading Error</div>
          <p className="text-gray-700 mb-2 font-medium">Google Maps failed to load</p>
          
          <div className="text-sm text-gray-600 space-y-1">
            {loadError.message.includes('RefererNotAllowedMapError') ? (
              <>
                <p className="text-red-600 font-medium">🚨 Domain Authorization Error</p>
                <p>Your Google Maps API key is not authorized for this domain</p>
                <p className="mt-2"><strong>Fix:</strong> Go to Google Cloud Console → APIs & Services → Credentials</p>
                <p>Add this domain to your API key restrictions:</p>
                <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                  *.lovable.app
                </p>
              </>
            ) : (
              <>
                <p className="text-red-600 font-medium">Error: {loadError.message}</p>
                {import.meta.env.DEV ? (
                  <p>🏠 <strong>Development:</strong> Check your .env file and API key</p>
                ) : (
                  <p>🚀 <strong>Production:</strong> Check GitHub Actions environment variables</p>
                )}
              </>
            )}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
            <p><strong>Build Mode:</strong> {import.meta.env.MODE}</p>
            <p><strong>Environment:</strong> {import.meta.env.DEV ? 'Development' : 'Production'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center p-6">
          <div className="text-red-600 mb-3 text-xl">🗺️ Maps Configuration Required</div>
          <p className="text-gray-700 mb-2 font-medium">Google Maps API key not configured</p>
          
          <div className="text-sm text-gray-600 space-y-1">
            {import.meta.env.DEV ? (
              <>
                <p>🏠 <strong>Development:</strong> Add VITE_GOOGLE_MAPS_API_KEY to your .env file</p>
                <p>📁 Create .env in project root with your API key</p>
              </>
            ) : (
              <>
                <p>🚀 <strong>Production:</strong> Check GitHub Actions workflow</p>
                <p>🔐 Ensure VITE_GOOGLE_MAPS_API_KEY secret is set in GitHub</p>
                <p>⚙️ Verify workflow injects the environment variable during build</p>
              </>
            )}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
            <p><strong>Build Mode:</strong> {import.meta.env.MODE}</p>
            <p><strong>Environment:</strong> {import.meta.env.DEV ? 'Development' : 'Production'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Montreal map...</p>
          <p className="text-xs text-gray-500 mt-1">
            {import.meta.env.DEV ? 'Development' : 'Production'} Mode
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full rounded-lg ${className}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={customMapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Provider Markers - Only show in services/interactive modes */}
        {(mode === 'services' || mode === 'interactive') && providers.map(provider => (
          <Marker
            key={provider.id}
            position={{ lat: provider.lat, lng: provider.lng }}
            onClick={() => handleMarkerClick(provider)}
            icon={getMarkerIcon(provider.availability)}
            title={`${provider.name} - ${provider.service}`}
          />
        ))}

        {/* Service Radius Circle for Hovered Provider */}
        {hoveredProvider && (mode === 'services' || mode === 'interactive') && (
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

        {/* Info Window for Selected Provider */}
        {selectedProvider && (mode === 'services' || mode === 'interactive') && (
          <InfoWindow
            position={{ lat: selectedProvider.lat, lng: selectedProvider.lng }}
            onCloseClick={() => setSelectedProvider(null)}
          >
            <div className="p-3 min-w-[200px]">
              <h3 className="font-semibold text-gray-900 mb-2">{selectedProvider.name}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div>🔧 {selectedProvider.service}</div>
                <div>⭐ {selectedProvider.rating}/5</div>
                <div>📍 {selectedProvider.availability}</div>
                {selectedProvider.hourlyRate && (
                  <div>💰 ${selectedProvider.hourlyRate}/hour</div>
                )}
              </div>
            </div>
          </InfoWindow>
        )}

        {/* Custom children (for privacy markers, job overlays, heat zones, etc.) */}
        {children}
      </GoogleMap>
    </div>
  );
};
