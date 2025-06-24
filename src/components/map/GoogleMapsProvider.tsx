
import React, { createContext, useContext, useState, useCallback } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, libraries, debugApiKeyStatus } from './GoogleMapConfig';

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | null;
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined);

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within GoogleMapsProvider');
  }
  return context;
};

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const handleLoad = useCallback(() => {
    console.log('✅ Google Maps API loaded globally');
    debugApiKeyStatus();
    setIsLoaded(true);
    setLoadError(null);
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error('❌ Google Maps API failed to load:', error);
    setLoadError(error);
    setIsLoaded(false);
  }, []);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <GoogleMapsContext.Provider value={{ isLoaded: false, loadError: new Error('API key missing') }}>
        {children}
      </GoogleMapsContext.Provider>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      onLoad={handleLoad}
      onError={handleError}
      loadingElement={
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading Google Maps...</p>
            <p className="text-xs text-gray-500 mt-1">
              {import.meta.env.DEV ? 'Development' : 'Production'} Mode
            </p>
          </div>
        </div>
      }
    >
      <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
        {children}
      </GoogleMapsContext.Provider>
    </LoadScript>
  );
};
