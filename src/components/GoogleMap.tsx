
import React, { useEffect, useRef, useState } from 'react';

interface Provider {
  id: number;
  name: string;
  lat: number;
  lng: number;
  service: string;
  rating: number;
  availability: string;
}

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  className?: string;
  providers?: Provider[];
}

export const GoogleMap: React.FC<GoogleMapProps> = ({ 
  center, 
  zoom, 
  className = "", 
  providers = [] 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: "all",
          elementType: "geometry.fill",
          stylers: [{ color: "#fef7cd" }]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17a2b8" }]
        }
      ]
    });

    setMap(mapInstance);

    // Add markers for providers
    providers.forEach(provider => {
      const marker = new window.google.maps.Marker({
        position: { lat: provider.lat, lng: provider.lng },
        map: mapInstance,
        title: provider.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: provider.availability === 'Available' ? '#10b981' : '#f59e0b',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-bold">${provider.name}</h3>
            <p class="text-sm">${provider.service}</p>
            <p class="text-sm">Rating: ${provider.rating}⭐</p>
            <p class="text-sm">Status: ${provider.availability}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
      });
    });

  }, [center, zoom, providers]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full rounded-lg ${className}`}
      style={{ minHeight: '300px' }}
    />
  );
};
