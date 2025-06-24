
import React from 'react';
import { UnifiedGoogleMap } from "@/components/UnifiedGoogleMap";

interface PrivacyMapContainerProps {
  onMapError: (error: string) => void;
}

const PrivacyMapContainer: React.FC<PrivacyMapContainerProps> = ({ onMapError }) => {
  return (
    <div className="h-full w-full">
      <UnifiedGoogleMap
        center={{ lat: 45.5017, lng: -73.5673 }}
        zoom={11}
        className="w-full h-full rounded-lg"
        mode="privacy"
      />
    </div>
  );
};

export default PrivacyMapContainer;
