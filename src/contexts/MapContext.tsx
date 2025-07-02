
import React, { createContext, useContext, useState } from 'react';

interface MapContextType {
  selectedLocation: { lat: number; lng: number } | null;
  setSelectedLocation: (location: { lat: number; lng: number } | null) => void;
  mapCenter: { lat: number; lng: number };
  setMapCenter: (center: { lat: number; lng: number }) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within MapProvider');
  }
  return context;
};

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 45.5017, lng: -73.5673 }); // Montreal default
  const [zoom, setZoom] = useState(12);

  return (
    <MapContext.Provider value={{
      selectedLocation,
      setSelectedLocation,
      mapCenter,
      setMapCenter,
      zoom,
      setZoom
    }}>
      {children}
    </MapContext.Provider>
  );
};
