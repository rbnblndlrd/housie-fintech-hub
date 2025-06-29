
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface Job {
  id: string;
  title: string;
  address: string;
  customerName: string;
  customerPhone: string;
  estimatedDuration: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  coordinates: { lat: number; lng: number };
  price: number;
}

interface MapboxJobsOverlayProps {
  map: mapboxgl.Map | null;
  jobs: Job[];
  onJobClick: (job: Job) => void;
}

const MapboxJobsOverlay: React.FC<MapboxJobsOverlayProps> = ({
  map,
  jobs,
  onJobClick
}) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  console.log('🎯 MapboxJobsOverlay render:', { hasMap: !!map, jobsCount: jobs.length });

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add job markers
    jobs.forEach(job => {
      const getPriorityColor = (priority: Job['priority']) => {
        switch (priority) {
          case 'emergency': return '#dc2626';
          case 'high': return '#ea580c';
          case 'medium': return '#ca8a04';
          default: return '#16a34a';
        }
      };

      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'job-marker';
      markerEl.innerHTML = `
        <div style="
          background: ${getPriorityColor(job.priority)};
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          min-width: 60px;
          text-align: center;
          border: 2px solid white;
        ">
          $${job.price}
        </div>
      `;

      // Add click handler
      markerEl.addEventListener('click', () => {
        console.log('🎯 Job marker clicked:', job.title);
        onJobClick(job);
      });

      // Create and add marker
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([job.coordinates.lng, job.coordinates.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [map, jobs, onJobClick]);

  return null; // This component doesn't render anything directly
};

export default MapboxJobsOverlay;
