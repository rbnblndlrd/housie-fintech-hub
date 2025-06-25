
import React from 'react';
import { Polygon, InfoWindow } from '@react-google-maps/api';
import { MontrealHeatZone } from '@/data/montrealHeatZones';

interface MontrealHeatZonesOverlayProps {
  heatZones: MontrealHeatZone[];
  onZoneClick: (zone: MontrealHeatZone) => void;
  selectedZone: MontrealHeatZone | null;
  onCloseInfo: () => void;
}

const MontrealHeatZonesOverlay: React.FC<MontrealHeatZonesOverlayProps> = ({
  heatZones,
  onZoneClick,
  selectedZone,
  onCloseInfo
}) => {
  const getZoneColor = (demandLevel: string) => {
    switch (demandLevel) {
      case 'Very High': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#d97706';
      case 'Low': return '#65a30d';
      default: return '#6b7280';
    }
  };

  const getZoneOpacity = (demandLevel: string) => {
    switch (demandLevel) {
      case 'Very High': return 0.4;
      case 'High': return 0.3;
      case 'Medium': return 0.25;
      case 'Low': return 0.2;
      default: return 0.15;
    }
  };

  return (
    <>
      {heatZones.map((zone) => (
        <Polygon
          key={zone.id}
          paths={zone.coordinates}
          onClick={() => onZoneClick(zone)}
          options={{
            fillColor: getZoneColor(zone.demandLevel),
            fillOpacity: getZoneOpacity(zone.demandLevel),
            strokeColor: getZoneColor(zone.demandLevel),
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
      ))}

      {selectedZone && (
        <InfoWindow
          position={selectedZone.center}
          onCloseClick={onCloseInfo}
        >
          <div className="p-3 min-w-[250px]">
            <h3 className="font-semibold text-gray-900 mb-2">{selectedZone.name}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Demand Level:</span>
                <span className={`font-medium ${
                  selectedZone.demandLevel === 'Very High' ? 'text-red-600' :
                  selectedZone.demandLevel === 'High' ? 'text-orange-600' :
                  selectedZone.demandLevel === 'Medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {selectedZone.demandLevel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Rate:</span>
                <span className="font-medium">${selectedZone.avgRate}/hour</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Competition:</span>
                <span className="font-medium">{selectedZone.competition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Opportunity:</span>
                <span className={`font-medium ${
                  selectedZone.opportunityLevel === 'High' ? 'text-green-600' :
                  selectedZone.opportunityLevel === 'Medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {selectedZone.opportunityLevel}
                </span>
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default MontrealHeatZonesOverlay;
