
import React from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { FleetVehicle } from '@/hooks/useFleetVehicles';

interface FleetVehicleMarkersOverlayProps {
  fleetVehicles: FleetVehicle[];
  onVehicleSelect: (vehicle: FleetVehicle) => void;
  selectedVehicle?: FleetVehicle | null;
  onCloseInfo: () => void;
}

const FleetVehicleMarkersOverlay: React.FC<FleetVehicleMarkersOverlayProps> = ({
  fleetVehicles,
  onVehicleSelect,
  selectedVehicle,
  onCloseInfo
}) => {
  const createVehicleIcon = (vehicle: FleetVehicle) => {
    if (!window.google?.maps?.SymbolPath) {
      return undefined;
    }

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'available': return '🚛';
        case 'en-route': return '🚐';
        case 'on-job': return '🔧';
        case 'returning': return '🏠';
        case 'offline': return '⚫';
        default: return '🚛';
      }
    };

    // Create custom vehicle marker
    return {
      url: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="${vehicle.color}" stroke="white" stroke-width="3"/>
          <text x="20" y="26" text-anchor="middle" font-size="16" font-weight="bold" fill="white">
            ${vehicle.vehicleNumber.split('-')[1] || 'V'}
          </text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(40, 40),
      anchor: new google.maps.Point(20, 20)
    };
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'en-route': return 'En Route';
      case 'on-job': return 'On Job';
      case 'returning': return 'Returning';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <>
      {fleetVehicles.map(vehicle => (
        <Marker
          key={vehicle.id}
          position={{ lat: vehicle.lat, lng: vehicle.lng }}
          onClick={() => onVehicleSelect(vehicle)}
          icon={createVehicleIcon(vehicle)}
          title={`${vehicle.driverName} - ${vehicle.vehicleNumber}`}
        />
      ))}

      {selectedVehicle && (
        <InfoWindow
          position={{ lat: selectedVehicle.lat, lng: selectedVehicle.lng }}
          onCloseClick={onCloseInfo}
        >
          <div className="p-3 min-w-[250px]">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedVehicle.color }}
              />
              <div>
                <h3 className="font-semibold text-gray-900">{selectedVehicle.driverName}</h3>
                <p className="text-sm text-gray-600">{selectedVehicle.vehicleNumber}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium text-white ${
                  selectedVehicle.status === 'available' ? 'bg-green-500' :
                  selectedVehicle.status === 'en-route' ? 'bg-blue-500' :
                  selectedVehicle.status === 'on-job' ? 'bg-orange-500' :
                  selectedVehicle.status === 'returning' ? 'bg-purple-500' :
                  'bg-gray-500'
                }`}>
                  {getStatusLabel(selectedVehicle.status)}
                </span>
              </div>
              
              {selectedVehicle.currentJob && (
                <div>
                  <span className="text-gray-600">Current Job:</span>
                  <p className="text-blue-600 font-medium mt-1">{selectedVehicle.currentJob}</p>
                </div>
              )}
              
              <div className="pt-2 border-t">
                <span className="text-xs text-gray-500">
                  Last update: {selectedVehicle.lastUpdate.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default FleetVehicleMarkersOverlay;
