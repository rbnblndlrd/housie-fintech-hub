
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

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const handleLoad = () => {
    console.log('✅ Google Maps loaded successfully!');
    console.log('📍 Current domain:', window.location.hostname);
    console.log('🌐 Full URL:', window.location.href);
    setIsLoaded(true);
    setLoadError(null);
    setIsLoading(false);
    setDebugInfo('Maps loaded successfully');
  };

  const handleError = (error: Error) => {
    console.error('❌ Google Maps failed to load:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      apiKey: GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing',
      currentDomain: window.location.hostname,
      currentURL: window.location.href
    });
    
    let errorMessage = 'Failed to load Google Maps';
    let debugMessage = `Error: ${error.message}`;
    
    if (error.message.includes('InvalidKeyMapError')) {
      errorMessage = 'Invalid Google Maps API key';
      debugMessage = 'API Key is invalid or malformed';
    } else if (error.message.includes('RefererNotAllowedMapError')) {
      errorMessage = 'Domain not authorized for this API key';
      debugMessage = `Current domain (${window.location.hostname}) is not allowed. Add *.lovable.app to your API key restrictions in Google Cloud Console.`;
    } else if (error.message.includes('QuotaExceededError')) {
      errorMessage = 'Google Maps API quota exceeded';
      debugMessage = 'Daily quota limit reached. Check your Google Cloud Console billing and quotas.';
    } else if (error.message.includes('RequestDeniedMapError')) {
      errorMessage = 'Maps JavaScript API not enabled';
      debugMessage = 'Enable Maps JavaScript API in Google Cloud Console under APIs & Services.';
    } else if (error.message.includes('BillingNotEnabledMapError')) {
      errorMessage = 'Billing not enabled';
      debugMessage = 'Enable billing in Google Cloud Console - required even for free usage.';
    } else if (error.message.includes('ApiNotActivatedMapError')) {
      errorMessage = 'Maps API not activated';
      debugMessage = 'Activate the Maps JavaScript API in Google Cloud Console.';
    }
    
    setLoadError(errorMessage);
    setDebugInfo(debugMessage);
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

  if (loadError) {
    return (
      <div className={`w-full h-full rounded-lg bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-6 max-w-lg">
          <div className="text-red-600 mb-3 text-xl">🗺️ Map Loading Error</div>
          <p className="text-gray-800 mb-4 font-medium text-lg">{loadError}</p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 font-medium mb-2">Debug Information:</p>
            <p className="text-xs text-gray-600 break-words">{debugInfo}</p>
            <p className="text-xs text-gray-500 mt-2">Domain: {window.location.hostname}</p>
          </div>

          <div className="text-sm text-gray-600 space-y-3 text-left">
            <p className="font-medium text-center">Quick Solutions:</p>
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="font-medium text-blue-800 mb-2">Most Likely Fix:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Go to Google Cloud Console</li>
                <li>Find your API key settings</li>
                <li>Set "Application restrictions" to <strong>"None"</strong> temporarily</li>
                <li>Or add <strong>*.lovable.app</strong> to domain restrictions</li>
              </ol>
            </div>
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p className="font-medium text-green-800 mb-2">Also Check:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Maps JavaScript API is enabled</li>
                <li>Billing account is set up</li>
                <li>Daily quotas not exceeded</li>
              </ul>
            </div>
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
          <p className="text-gray-700 font-medium mb-2">Loading Montreal interactive map...</p>
          <p className="text-sm text-gray-500 mb-2">Connecting to Google Maps API...</p>
          <div className="text-xs text-gray-400 mt-3 space-y-1">
            <p>API Key: {GOOGLE_MAPS_API_KEY ? '✓ Present' : '✗ Missing'}</p>
            <p>Domain: {window.location.hostname}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full rounded-lg ${className}`}>
      <LoadScript 
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        libraries={libraries}
        onLoad={handleLoad}
        onError={handleError}
        loadingElement={
          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Initializing Montreal map...</p>
              <p className="text-xs text-gray-400 mt-2">Loading Google Maps SDK...</p>
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
          {isLoaded && providers.map(provider => (
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
