
import React, { createContext, useContext, useState } from 'react';

interface MapContextType {
  selectedProvider: any | null;
  setSelectedProvider: (provider: any | null) => void;
  hoveredProviderId: string | null;
  setHoveredProviderId: (id: string | null) => void;
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
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);
  const [hoveredProviderId, setHoveredProviderId] = useState<string | null>(null);

  return (
    <MapContext.Provider value={{
      selectedProvider,
      setSelectedProvider,
      hoveredProviderId,
      setHoveredProviderId
    }}>
      {children}
    </MapContext.Provider>
  );
};
