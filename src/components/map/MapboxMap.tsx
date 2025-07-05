
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set the Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicmJuYmxuZGxyZCIsImEiOiJjbWNmdGYzN2wwY2RuMmtwd3M3d2hzM3NxIn0.MZfduMhwltc3eC8V5xYgcQ';

interface MapboxMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  markers?: Array<{
    lat: number;
    lng: number;
    title?: string;
    description?: string;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  center = { lat: 45.5017, lng: -73.5673 }, // Montreal coordinates
  zoom = 12,
  className = "w-full h-full",
  markers = [],
  onMapClick,
  onMapLoad
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [center.lng, center.lat],
      zoom: zoom,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Callback for external components to access map instance
    if (onMapLoad) {
      onMapLoad(map.current);
    }

    // Add markers
    markers.forEach(marker => {
      if (map.current) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div>
            <h3 class="font-semibold">${marker.title || 'Location'}</h3>
            ${marker.description ? `<p class="text-sm text-gray-600">${marker.description}</p>` : ''}
          </div>`
        );

        new mapboxgl.Marker()
          .setLngLat([marker.lng, marker.lat])
          .setPopup(popup)
          .addTo(map.current);
      }
    });

    // Handle map clicks
    if (onMapClick) {
      map.current.on('click', (e) => {
        onMapClick(e.lngLat.lat, e.lngLat.lng);
      });
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [center.lat, center.lng, zoom, markers, onMapClick, onMapLoad]);

  return <div 
    ref={mapContainer} 
    className={className}
    style={{ width: '100%', height: '100%' }}
  />;
};

export default MapboxMap;
