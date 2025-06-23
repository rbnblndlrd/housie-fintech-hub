
import React from 'react';

interface MapErrorFallbackProps {
  error: string;
}

const MapErrorFallback: React.FC<MapErrorFallbackProps> = ({ error }) => {
  return (
    <div className="relative h-96 w-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center p-6">
        <div className="text-red-600 mb-2">🗺️ Map Unavailable</div>
        <p className="text-gray-600 mb-2">{error}</p>
        <p className="text-sm text-gray-500">
          Privacy-protected map temporarily unavailable. Job listings still available below.
        </p>
      </div>
    </div>
  );
};

export default MapErrorFallback;
