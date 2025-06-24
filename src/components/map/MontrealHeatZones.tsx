
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

  const getHoverColor = (demandLevel: 'high' | 'medium' | 'low') => {
    const colors = getZoneColor(demandLevel);
    return {
      ...colors,
      fillOpacity: colors.fillOpacity + 0.1,
      strokeOpacity: 1,
      strokeWeight: 3
    };
  };

  return (
    <>
      {zones.map((zone) => {
        const colors = getZoneColor(zone.demandLevel);
        const hoverColors = getHoverColor(zone.demandLevel);

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
            onMouseOver={() => {
              // Update polygon styles on hover - using the polygon instance directly
              const polygon = window.google?.maps?.event?.target;
              if (polygon && polygon.setOptions) {
                polygon.setOptions(hoverColors);
              }
            }}
            onMouseOut={() => {
              // Reset polygon styles on mouse out
              const polygon = window.google?.maps?.event?.target;
              if (polygon && polygon.setOptions) {
                polygon.setOptions({
                  ...colors,
                  strokeWeight: 2
                });
              }
            }}
          />
        );
      })}
    </>
  );
};

export default MontrealHeatZones;
