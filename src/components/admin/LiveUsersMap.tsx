
import React, { useEffect, useRef } from 'react';

interface UserSession {
  id: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  user?: {
    full_name: string;
    email: string;
  };
}

interface LiveUsersMapProps {
  sessions: UserSession[];
}

export const LiveUsersMap: React.FC<LiveUsersMapProps> = ({ sessions }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Quebec center coordinates
    const quebecCenter = { lat: 46.8139, lng: -71.2080 };

    map.current = new google.maps.Map(mapContainer.current, {
      zoom: 6,
      center: quebecCenter,
      styles: [
        {
          featureType: "all",
          elementType: "geometry.fill",
          stylers: [{ color: "#f8fafc" }]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#3b82f6" }]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#e2e8f0" }]
        }
      ]
    });
  }, []);

  // Update markers when sessions change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];

    // Add new markers for each session with location
    sessions
      .filter(session => session.latitude && session.longitude)
      .forEach(session => {
        const marker = new google.maps.Marker({
          position: { lat: session.latitude, lng: session.longitude },
          map: map.current,
          title: `${session.user?.full_name || 'Utilisateur'} - ${session.city}`,
          icon: {
            url: 'data:image/svg+xml,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#10b981" stroke="#ffffff" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" fill="#ffffff"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24)
          }
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-3 min-w-[200px]">
              <h3 class="font-semibold text-gray-900 mb-2">
                ${session.user?.full_name || 'Utilisateur Anonyme'}
              </h3>
              <div class="space-y-1 text-sm text-gray-600">
                <div>📧 ${session.user?.email || 'Non connecté'}</div>
                <div>📍 ${session.city}, ${session.region}</div>
                <div>🌐 Actif maintenant</div>
              </div>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map.current, marker);
        });

        markers.current.push(marker);
      });

    // Adjust map bounds to show all markers
    if (markers.current.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markers.current.forEach(marker => {
        bounds.extend(marker.getPosition()!);
      });
      map.current.fitBounds(bounds);
      
      // Don't zoom in too much for single markers
      google.maps.event.addListenerOnce(map.current, 'bounds_changed', () => {
        if (map.current!.getZoom()! > 10) {
          map.current!.setZoom(10);
        }
      });
    }
  }, [sessions]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      {!window.google && (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 mb-2">Carte Google Maps non disponible</div>
            <div className="text-sm text-gray-500">
              Veuillez configurer votre clé API Google Maps
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
