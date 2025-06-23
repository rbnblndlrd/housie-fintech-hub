
import React from 'react';
import { GoogleMap } from "@/components/GoogleMap";

interface PrivacyMapContainerProps {
  onMapError: (error: string) => void;
}

const PrivacyMapContainer: React.FC<PrivacyMapContainerProps> = ({ onMapError }) => {
  const handleMapError = (error: string) => {
    console.error('Map error:', error);
    onMapError(error);
  };

  return (
    <div className="h-full w-full">
      <GoogleMap
        center={{ lat: 45.5017, lng: -73.5673 }}
        zoom={11}
        className="w-full h-full rounded-lg"
      />
    </div>
  );
};

export default PrivacyMapContainer;
