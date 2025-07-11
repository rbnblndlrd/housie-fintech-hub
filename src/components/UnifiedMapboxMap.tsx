
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set the Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicmJuYmxuZGxyZCIsImEiOiJjbWNmdGYzN2wwY2RuMmtwd3M3d2hzM3NxIn0.MZfduMhwltc3eC8V5xYgcQ';

interface Provider {
  id: number | string;
  name: string;
  lat: number;
  lng: number;
  service: string;
  rating: number;
  availability: string;
  serviceRadius?: number;
  verified?: boolean;
  hourlyRate?: number;
  distance?: string;
}

interface UnifiedMapboxMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  className?: string;
  providers?: Provider[];
  hoveredProviderId?: string | null;
  onProviderClick?: (provider: Provider) => void;
  mode?: 'services' | 'interactive' | 'privacy' | 'heatZones';
}

export const UnifiedMapboxMap: React.FC<UnifiedMapboxMapProps> = ({
  center,
  zoom,
  className = "",
  providers = [],
  hoveredProviderId = null,
  onProviderClick,
  mode = 'services'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

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

    // Cleanup function
    return () => {
      // Clear markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      
      if (map.current) {
        map.current.remove();
      }
    };
  }, [center.lat, center.lng, zoom]);

  // Update markers when providers change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Deduplicate providers by ID to prevent pin duplication
    const uniqueProviders = providers.filter((provider, index, self) => 
      index === self.findIndex(p => p.id === provider.id)
    );

    // Add new markers
    uniqueProviders.forEach(provider => {
      const isHovered = hoveredProviderId === provider.id.toString();
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = provider.availability === 'Available' ? '#10b981' : '#f59e0b';
      el.style.width = isHovered ? '16px' : '12px';
      el.style.height = isHovered ? '16px' : '12px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.transition = 'all 0.2s ease';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-3">
          <h3 class="font-semibold text-gray-900 mb-2">${provider.name}</h3>
          <div class="space-y-1 text-sm text-gray-600">
            <div>🔧 ${provider.service}</div>
            <div>⭐ ${provider.rating}/5</div>
            <div>📍 ${provider.availability}</div>
            ${provider.hourlyRate ? `<div>💰 $${provider.hourlyRate}/hour</div>` : ''}
          </div>
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([provider.lng, provider.lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click event
      el.addEventListener('click', () => {
        if (onProviderClick) {
          onProviderClick(provider);
        }
      });

      markers.current.push(marker);
    });
  }, [providers, hoveredProviderId, onProviderClick]);

  return <div ref={mapContainer} className={`w-full h-full rounded-lg ${className}`} />;
};
