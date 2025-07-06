import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapTheme } from '@/hooks/useMapTheme';
import MapThemeSelector from '@/components/map/MapThemeSelector';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicmJuYmxuZGxyZCIsImEiOiJjbWNmdGYzN2wwY2RuMmtwd3M3d2hzM3NxIn0.MZfduMhwltc3eC8V5xYgcQ';

interface GPSNavigationMapProps {
  isDashboard?: boolean;
}

const GPSNavigationMap: React.FC<GPSNavigationMapProps> = ({ isDashboard = false }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { isDark } = useMapTheme();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with theme-based style
    const mapStyle = isDark 
      ? 'mapbox://styles/mapbox/dark-v11'
      : 'mapbox://styles/mapbox/streets-v11';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
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
  }, [isDark]); // Re-initialize when theme changes

  // Responsive container classes and styles based on usage context
  const containerClasses = isDashboard 
    ? "w-full h-full" 
    : "absolute inset-0 w-full h-full";

  const containerStyles = isDashboard
    ? { 
        width: '100%', 
        height: '100%'
      }
    : { 
        width: '100%', 
        height: '100vh'
      };

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className={containerClasses}
        style={containerStyles}
      />
      
      {/* Theme Toggle - positioned in top-left */}
      <div className="absolute top-4 left-4 z-10">
        <MapThemeSelector />
      </div>
    </div>
  );
};

export default GPSNavigationMap;