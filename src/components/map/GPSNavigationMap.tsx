import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicmJuYmxuZGxyZCIsImEiOiJjbWNmdGYzN2wwY2RuMmtwd3M3d2hzM3NxIn0.MZfduMhwltc3eC8V5xYgcQ';

const GPSNavigationMap: React.FC = () => {
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

  return (
    <div 
      ref={mapContainer} 
      className="absolute inset-0 w-full h-full"
      style={{ width: '100%', height: '100vh' }}
    />
  );
};

export default GPSNavigationMap;