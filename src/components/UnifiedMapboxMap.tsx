
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

interface RealJob {
  id: string;
  title: string;
  location: string;
  priority: string;
  price: string;
  customerName: string;
  scheduledTime: string;
  status: string;
  category: string;
  lat?: number;
  lng?: number;
  created_at: string;
  customer_id: string;
  provider_id?: string;
}

interface UnifiedMapboxMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  className?: string;
  providers?: Provider[];
  jobs?: RealJob[];
  hoveredProviderId?: string | null;
  onProviderClick?: (provider: Provider) => void;
  onJobClick?: (job: RealJob) => void;
  mode?: 'services' | 'interactive' | 'privacy' | 'heatZones' | 'real-jobs';
}

export const UnifiedMapboxMap: React.FC<UnifiedMapboxMapProps> = ({
  center,
  zoom,
  className = "",
  providers = [],
  jobs = [],
  hoveredProviderId = null,
  onProviderClick,
  onJobClick,
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

  // Update markers when providers or jobs change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Show jobs in real-jobs mode, otherwise show providers
    if (mode === 'real-jobs' && jobs.length > 0) {
      console.log('🗺️ Displaying', jobs.length, 'real jobs on map');
      
      // Add job markers
      jobs.forEach(job => {
        if (!job.lat || !job.lng) {
          console.log('⚠️ Job missing coordinates:', job.id, job.title);
          return;
        }
        
        // Create marker element for jobs
        const el = document.createElement('div');
        el.className = 'job-marker';
        
        // Color based on status
        const statusColors = {
          'pending': '#f59e0b',     // amber
          'confirmed': '#10b981',   // green
          'in_progress': '#3b82f6', // blue
          'completed': '#6b7280'    // gray
        };

        const priorityColors = {
          'high': '#ef4444',    // red
          'emergency': '#dc2626', // dark red
          'medium': '#f59e0b',  // amber  
          'normal': '#10b981',  // green
          'low': '#6b7280'      // gray
        };

        // Use status color primarily, fallback to priority color
        const markerColor = statusColors[job.status as keyof typeof statusColors] || 
                           priorityColors[job.priority as keyof typeof priorityColors] || 
                           '#10b981';

        el.style.backgroundColor = markerColor;
        el.style.width = '28px';
        el.style.height = '28px';
        el.style.borderRadius = '50%';
        el.style.border = '3px solid white';
        el.style.cursor = 'pointer';
        el.style.transition = 'all 0.2s ease';
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.fontSize = '11px';
        el.style.fontWeight = 'bold';
        el.style.color = 'white';
        
        // Show price or priority indicator
        if (job.priority === 'emergency') {
          el.innerText = '⚡';
        } else if (job.priority === 'high') {
          el.innerText = '!';
        } else {
          el.innerText = job.price.replace('$', '');
        }

        // Create popup for jobs
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-3 max-w-sm">
            <h3 class="font-semibold text-gray-900 mb-2">${job.title}</h3>
            <div class="space-y-1 text-sm text-gray-600">
              <div>👤 ${job.customerName}</div>
              <div>📍 ${job.location}</div>
              <div>💰 ${job.price}</div>
              <div>⏰ ${job.scheduledTime}</div>
              <div>📋 Status: <span class="capitalize font-medium" style="color: ${markerColor}">${job.status}</span></div>
              <div>🚨 Priority: <span class="capitalize font-medium">${job.priority}</span></div>
              <div>🏷️ Category: <span class="capitalize">${job.category}</span></div>
            </div>
          </div>
        `);

        // Create marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([job.lng, job.lat])
          .setPopup(popup)
          .addTo(map.current!);

        // Add click event for jobs
        el.addEventListener('click', () => {
          console.log('🎯 Job marker clicked:', job.title);
          if (onJobClick) {
            onJobClick(job);
          }
        });

        markers.current.push(marker);
      });
    } else if (providers.length > 0) {
      // Show providers (original logic)
      const uniqueProviders = providers.filter((provider, index, self) => 
        index === self.findIndex(p => p.id === provider.id)
      );

      console.log('🗺️ Displaying', uniqueProviders.length, 'providers on map');

      // Add provider markers
      uniqueProviders.forEach(provider => {
        const isHovered = hoveredProviderId === provider.id.toString();
        
        // Create marker element
        const el = document.createElement('div');
        el.className = 'provider-marker';
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
    }
  }, [providers, jobs, hoveredProviderId, onProviderClick, onJobClick, mode]);

  return (
    <div 
      ref={mapContainer} 
      className={`w-full h-full rounded-lg border-4 border-primary ${className}`}
      data-testid="map-container"
    />
  );
};
