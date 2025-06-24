
import React from 'react';
import { Polygon } from '@react-google-maps/api';
import { MontrealHeatZone } from '@/data/montrealHeatZones';

interface MontrealHeatZonesProps {
  zones: MontrealHeatZone[];
  isMapReady: boolean;
  onZoneClick: (zone: MontrealHeatZone) => void;
  showLabels?: boolean;
}

const MontrealHeatZones: React.FC<MontrealHeatZonesProps> = ({
  zones,
  isMapReady,
  onZoneClick,
  showLabels = true
}) => {
  if (!isMapReady) return null;

  const getZoneColor = (demandLevel: 'high' | 'medium' | 'low') => {
    switch (demandLevel) {
      case 'high':
        return {
          fillColor: '#ef4444',
          strokeColor: '#dc2626',
          fillOpacity: 0.25,
          strokeOpacity: 0.8
        };
      case 'medium':
        return {
          fillColor: '#f97316',
          strokeColor: '#ea580c',
          fillOpacity: 0.2,
          strokeOpacity: 0.7
        };
      case 'low':
        return {
          fillColor: '#22c55e',
          strokeColor: '#16a34a',
          fillOpacity: 0.15,
          strokeOpacity: 0.6
        };
      default:
        return {
          fillColor: '#6b7280',
          strokeColor: '#4b5563',
          fillOpacity: 0.1,
          strokeOpacity: 0.5
        };
    }
  };

  return (
    <>
      {zones.map((zone) => {
        const colors = getZoneColor(zone.demandLevel);

        return (
          <Polygon
            key={zone.id}
            paths={zone.coordinates}
            options={{
              ...colors,
              strokeWeight: 2,
              clickable: true,
              zIndex: 1
            }}
            onClick={() => onZoneClick(zone)}
          />
        );
      })}
    </>
  );
};

export default MontrealHeatZones;
