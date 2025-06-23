
import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { Provider } from "@/types/service";

interface GoogleMapInfoWindowProps {
  selectedProvider: Provider | null;
  onClose: () => void;
}

const GoogleMapInfoWindow: React.FC<GoogleMapInfoWindowProps> = ({
  selectedProvider,
  onClose
}) => {
  if (!selectedProvider) return null;

  return (
    <InfoWindow
      position={{ lat: selectedProvider.lat, lng: selectedProvider.lng }}
      onCloseClick={onClose}
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
  );
};

export default GoogleMapInfoWindow;
