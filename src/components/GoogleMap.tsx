
import React, { useEffect, useRef } from 'react';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  providers?: Array<{
    id: number;
    name: string;
    lat: number;
    lng: number;
    service: string;
  }>;
}

// Declare global google maps types
declare global {
  interface Window {
    google: typeof google;
  }
  const google: any;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  center = { lat: 45.5017, lng: -73.5673 }, // Montreal coordinates
  zoom = 12,
  className = "",
  providers = []
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the map
    const initMap = () => {
      if (!window.google || !window.google.maps) {
        console.error('Google Maps API not loaded');
        return;
      }

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current!, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Add markers for providers
      providers.forEach(provider => {
        const marker = new window.google.maps.Marker({
          position: { lat: provider.lat, lng: provider.lng },
          map: mapInstanceRef.current,
          title: provider.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#FF6B35" stroke="#FFFFFF" stroke-width="2"/>
                <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">H</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; color: #333;">${provider.name}</h3>
              <p style="margin: 0; color: #666; font-size: 14px;">${provider.service}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });
      });
    };

    // Load Google Maps API if not already loaded
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAJXkmufaWRLR5t4iFFp4qupryDKNZZO9o&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      // Cleanup is handled by Google Maps API
    };
  }, [center, zoom, providers]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full rounded-lg ${className}`}
      style={{ minHeight: '300px' }}
    />
  );
};
