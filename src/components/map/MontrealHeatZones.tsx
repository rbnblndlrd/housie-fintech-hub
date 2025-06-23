
import React from 'react';
import { Circle } from '@react-google-maps/api';
import type { MontrealZone } from '@/utils/locationPrivacy';

interface MontrealHeatZonesProps {
  zones: MontrealZone[];
  isMapReady: boolean;
  onZoneClick: (zone: MontrealZone) => void;
  showLabels?: boolean;
}

const MontrealHeatZones: React.FC<MontrealHeatZonesProps> = ({
  zones,
  isMapReady,
  onZoneClick,
  showLabels = true
}) => {
  if (!isMapReady) return null;

  const getZoneColor = (demandLevel: string, zoneType: string) => {
    switch (demandLevel) {
      case 'high':
        return {
          fillColor: zoneType === 'premium' ? '#8b5cf6' : '#ef4444',
          strokeColor: zoneType === 'premium' ? '#7c3aed' : '#dc2626'
        };
      case 'medium':
        return {
          fillColor: zoneType === 'premium' ? '#a855f7' : '#f97316',
          strokeColor: zoneType === 'premium' ? '#9333ea' : '#ea580c'
        };
      case 'low':
        return {
          fillColor: '#10b981',
          strokeColor: '#059669'
        };
      default:
        return {
          fillColor: '#6b7280',
          strokeColor: '#4b5563'
        };
    }
  };

  const getZoneOptions = (zone: MontrealZone) => {
    const colors = getZoneColor(zone.demand_level, zone.zone_type);
    return {
      ...colors,
      fillOpacity: 0.1,
      strokeOpacity: 0.4,
      strokeWeight: 2,
      clickable: true
    };
  };

  return (
    <div>
      {zones.map(zone => (
        <div key={zone.id}>
          <Circle
            center={zone.center_coordinates}
            radius={zone.zone_radius}
            options={getZoneOptions(zone)}
            onClick={() => onZoneClick(zone)}
          />
          
          {showLabels && (
            <div
              style={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                color: '#1f2937',
                fontWeight: 'bold',
                fontSize: '12px',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '4px 8px',
                borderRadius: '4px',
                pointerEvents: 'none',
                zIndex: 1000
              }}
            >
              {zone.zone_code}
              <br />
              <span style={{ fontSize: '10px', opacity: 0.8 }}>
                {zone.demand_level} • ${zone.pricing_multiplier}x
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MontrealHeatZones;
