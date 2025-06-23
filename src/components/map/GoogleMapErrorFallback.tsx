
import React from 'react';

interface GoogleMapErrorFallbackProps {
  error: string;
  className?: string;
}

const GoogleMapErrorFallback: React.FC<GoogleMapErrorFallbackProps> = ({
  error,
  className = ""
}) => {
  return (
    <div className={`w-full h-full rounded-lg bg-gray-100 flex items-center justify-center ${className}`}>
      <div className="text-center p-6 max-w-lg">
        <div className="text-red-600 mb-3 text-xl">🗺️ Map Loading Error</div>
        <p className="text-gray-800 mb-4 font-medium text-lg">{error}</p>
        
        <div className="text-sm text-gray-600 space-y-3 text-left">
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="font-medium text-blue-800 mb-2">Quick Solutions:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Check your Google Cloud Console billing is enabled</li>
              <li>Verify Maps JavaScript API is enabled</li>
              <li>Ensure API key has proper permissions</li>
              <li>Check domain restrictions (if any)</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapErrorFallback;
