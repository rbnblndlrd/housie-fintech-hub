import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicmJuYmxuZGxyZCIsImEiOiJjbWNmdGYzN2wwY2RuMmtwd3M3d2hzM3NxIn0.MZfduMhwltc3eC8V5xYgcQ';

interface GPSNavigationMapProps {
  isDashboard?: boolean;
}

const GPSNavigationMap: React.FC<GPSNavigationMapProps> = ({ isDashboard = false }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-73.5673, 45.5017], // Montreal coordinates
      zoom: 10
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add a simple marker at Montreal
    new mapboxgl.Marker()
      .setLngLat([-73.5673, 45.5017])
      .addTo(map.current);

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Responsive container classes and styles based on usage context
  const containerClasses = isDashboard 
    ? "relative w-full h-full overflow-hidden" 
    : "absolute inset-0 w-full h-full overflow-hidden";

  const containerStyles = isDashboard
    ? { 
        width: '100%', 
        height: '100%',
        minHeight: '100%' // Fill the container completely
      }
    : { 
        width: '100%', 
        height: '100vh' // Full viewport for standalone
      };

  return (
    <div 
      ref={mapContainer} 
      className={containerClasses}
      style={containerStyles}
    />
  );
};

export default GPSNavigationMap;