
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

  const handleLoad = () => {
    console.log('Google Maps loaded successfully for Montreal interactive map');
    setIsLoaded(true);
    setLoadError(null);
    setIsLoading(false);
  };

  const handleError = (error: Error) => {
    console.error('Google Maps failed to load:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      apiKey: GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing'
    });
    
    let errorMessage = 'Failed to load Google Maps';
    
    if (error.message.includes('InvalidKeyMapError')) {
      errorMessage = 'Invalid Google Maps API key - Please check your API key configuration';
      console.error('API Key issue: The provided API key may be invalid or restricted');
    } else if (error.message.includes('RefererNotAllowedMapError')) {
      errorMessage = 'Domain not authorized - Please add *.lovable.app to your API key restrictions';
      console.error('Domain restriction: Current domain not allowed for this API key');
    } else if (error.message.includes('QuotaExceededError')) {
      errorMessage = 'Google Maps API quota exceeded - Check your billing and usage limits';
      console.error('Quota exceeded: API usage limits reached');
    } else if (error.message.includes('RequestDeniedMapError')) {
      errorMessage = 'Maps JavaScript API not enabled - Enable it in Google Cloud Console';
      console.error('API not enabled: Maps JavaScript API needs to be enabled');
    } else if (error.message.includes('BillingNotEnabledMapError')) {
      errorMessage = 'Billing not enabled - Enable billing in Google Cloud Console';
      console.error('Billing issue: Billing account required for Maps API');
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
        <div className="text-center p-6 max-w-md">
          <div className="text-red-600 mb-2 text-lg">🗺️ Map Error</div>
          <p className="text-gray-700 mb-3 font-medium">{loadError}</p>
          <div className="text-sm text-gray-600 space-y-2">
            <p className="font-medium">Common solutions:</p>
            <ul className="list-disc list-inside text-left space-y-1">
              <li>Enable Maps JavaScript API in Google Cloud Console</li>
              <li>Set up billing (required even for free usage)</li>
              <li>Add *.lovable.app to API key restrictions</li>
              <li>Check daily usage quotas</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              Check browser console for detailed error information
            </p>
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
          <p className="text-gray-600">Loading Montreal interactive map...</p>
          <p className="text-xs text-gray-500 mt-2">Connecting to Google Maps API...</p>
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
            </div>
          </div>
        }
      >
        <ReactGoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          options={mapOptions}
          onLoad={() => console.log('Montreal map instance ready with', providers.length, 'providers')}
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
