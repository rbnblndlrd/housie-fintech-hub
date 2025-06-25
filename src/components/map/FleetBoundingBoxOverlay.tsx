
import React from 'react';
import { Rectangle } from '@react-google-maps/api';

interface FleetBoundingBoxOverlayProps {
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  } | null;
  visible: boolean;
}

const FleetBoundingBoxOverlay: React.FC<FleetBoundingBoxOverlayProps> = ({
  bounds,
  visible
}) => {
  if (!bounds || !visible) return null;

  const rectangleBounds = {
    north: bounds.north,
    south: bounds.south,
    east: bounds.east,
    west: bounds.west
  };

  return (
    <Rectangle
      bounds={rectangleBounds}
      options={{
        fillColor: '#3b82f6',
        fillOpacity: 0.05,
        strokeColor: '#3b82f6',
        strokeOpacity: 0.3,
        strokeWeight: 2
      }}
    />
  );
};

export default FleetBoundingBoxOverlay;
