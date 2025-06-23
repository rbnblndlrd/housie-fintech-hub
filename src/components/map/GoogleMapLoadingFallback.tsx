
import React from 'react';

interface GoogleMapLoadingFallbackProps {
  className?: string;
}

const GoogleMapLoadingFallback: React.FC<GoogleMapLoadingFallbackProps> = ({
  className = ""
}) => {
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
};

export default GoogleMapLoadingFallback;
