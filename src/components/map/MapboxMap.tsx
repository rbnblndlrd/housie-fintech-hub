
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  onMapLoad?: (map: mapboxgl.Map) => void;
  style?: string;
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  center = { lat: 45.5017, lng: -73.5673 }, // Montreal center
  zoom = 10,
  className = 'w-full h-full',
  onMapLoad,
  style = 'mapbox://styles/mapbox/light-v11'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  console.log('🗺️ MapboxMap render:', { center, zoom });

  useEffect(() => {
    // Check for Mapbox token from environment or prompt user
    const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
    if (token) {
      setMapboxToken(token);
    } else {
      // For now, we'll use a demo token - user should add their own
      console.warn('⚠️ No Mapbox token found. Please add VITE_MAPBOX_PUBLIC_TOKEN to your environment.');
      // You can get your token from https://mapbox.com/
      const userToken = prompt('Please enter your Mapbox public token (get it from https://mapbox.com/):');
      if (userToken) {
        setMapboxToken(userToken);
      }
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Set access token
    mapboxgl.accessToken = mapboxToken;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: style,
      center: [center.lng, center.lat],
      zoom: zoom,
      attributionControl: false // Remove for cleaner look
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
      }),
      'top-right'
    );

    // Custom Quebec/Montreal styling
    map.current.on('style.load', () => {
      if (!map.current) return;

      // Add custom styling for Quebec region
      map.current.setPaintProperty('water', 'fill-color', '#2563eb');
      
      // Call onMapLoad callback
      if (onMapLoad) {
        onMapLoad(map.current);
      }
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, center.lat, center.lng, zoom, style, onMapLoad]);

  if (!mapboxToken) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center p-6">
          <div className="text-gray-600 mb-4">🗺️ Privacy-First Mapping</div>
          <p className="text-sm text-gray-500 mb-4">
            Using Mapbox for better privacy and GPS capabilities
          </p>
          <p className="text-xs text-gray-400">
            Configure your Mapbox token to get started
          </p>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className={className} />;
};

export default MapboxMap;
