
import React, { useState } from 'react';
import { Marker, Circle } from '@react-google-maps/api';
import ProviderHoverInfo from './ProviderHoverInfo';

interface PrivacyProvider {
  id: string;
  name: string;
  fuzzyLocation: { lat: number; lng: number };
  availability: string;
  rating: number;
  verified: boolean;
  showOnMap?: boolean;
  serviceRadius?: number;
  hourlyRate?: number;
  service?: string;
  reviewCount?: number;
}

interface PrivacyJob {
  id: string;
  title: string;
  serviceCircle: {
    lat: number;
    lng: number;
    radius: number;
  };
  zone: string;
  priority: string;
  price: string;
}

interface PrivacyMapMarkersProps {
  providers: PrivacyProvider[];
  jobs: PrivacyJob[];
  isMapReady: boolean;
  onProviderClick: (provider: PrivacyProvider) => void;
  onJobClick: (job: PrivacyJob) => void;
}

const PrivacyMapMarkers: React.FC<PrivacyMapMarkersProps> = ({
  providers,
  jobs,
  isMapReady,
  onProviderClick,
  onJobClick
}) => {
  const [hoveredProvider, setHoveredProvider] = useState<PrivacyProvider | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  if (!isMapReady || !window.google || !window.google.maps) return null;

  // Filter providers who have opted to show on map
  const visibleProviders = providers.filter(provider => 
    provider.showOnMap !== false // Show by default if not specified
  );

  const getProviderIcon = (availability: string, verified: boolean) => {
    try {
      if (!window.google?.maps?.SymbolPath) {
        console.warn('Google Maps SymbolPath not available, using default marker');
        return undefined;
      }
      
      return {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: verified ? 10 : 8,
        fillColor: availability === 'Available' ? '#10b981' : '#f59e0b',
        fillOpacity: 0.8,
        strokeColor: verified ? '#3b82f6' : '#ffffff',
        strokeWeight: verified ? 3 : 2
      };
    } catch (error) {
      console.error('Error creating provider icon:', error);
      return undefined;
    }
  };

  const getJobCircleOptions = (priority: string) => {
    const baseOptions = {
      strokeWeight: 2,
      fillOpacity: 0.15,
      strokeOpacity: 0.6,
      clickable: true
    };

    switch (priority) {
      case 'emergency':
        return {
          ...baseOptions,
          fillColor: '#ef4444',
          strokeColor: '#dc2626',
          strokeWeight: 3,
          fillOpacity: 0.25
        };
      case 'high':
        return {
          ...baseOptions,
          fillColor: '#f97316',
          strokeColor: '#ea580c'
        };
      default:
        return {
          ...baseOptions,
          fillColor: '#3b82f6',
          strokeColor: '#2563eb'
        };
    }
  };

  const getJobMarkerIcon = (priority: string) => {
    try {
      if (!window.google?.maps?.SymbolPath) {
        return undefined;
      }
      
      return {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 6,
        fillColor: priority === 'emergency' ? '#ef4444' : '#3b82f6',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2
      };
    } catch (error) {
      console.error('Error creating job marker icon:', error);
      return undefined;
    }
  };

  const handleProviderMouseOver = (provider: PrivacyProvider, event: google.maps.MapMouseEvent) => {
    if (event.domEvent && event.domEvent instanceof MouseEvent) {
      setHoveredProvider(provider);
      setHoverPosition({
        x: event.domEvent.clientX,
        y: event.domEvent.clientY
      });
    }
  };

  const handleProviderMouseOut = () => {
    setHoveredProvider(null);
    setHoverPosition(null);
  };

  return (
    <>
      {/* Privacy-protected provider markers (only show those who opted in) */}
      {visibleProviders.map(provider => (
        <div key={`provider-${provider.id}`}>
          <Marker
            position={provider.fuzzyLocation}
            onClick={() => onProviderClick(provider)}
            onMouseOver={(event) => handleProviderMouseOver(provider, event)}
            onMouseOut={handleProviderMouseOut}
            icon={getProviderIcon(provider.availability, provider.verified)}
            title={`${provider.availability} Provider (${provider.rating}⭐) - Position approximative`}
          />
          
          {/* Service Radius Circle - Only show on hover */}
          {hoveredProvider?.id === provider.id && provider.serviceRadius && (
            <Circle
              center={provider.fuzzyLocation}
              radius={provider.serviceRadius * 1000} // Convert km to meters
              options={{
                fillColor: '#3b82f6',
                fillOpacity: 0.1,
                strokeColor: '#3b82f6',
                strokeOpacity: 0.5,
                strokeWeight: 2,
                clickable: false
              }}
            />
          )}
        </div>
      ))}

      {/* Privacy-protected job service circles (approximate areas) */}
      {jobs.map(job => (
        <div key={`job-${job.id}`}>
          <Circle
            center={{
              lat: job.serviceCircle.lat,
              lng: job.serviceCircle.lng
            }}
            radius={job.serviceCircle.radius}
            options={getJobCircleOptions(job.priority)}
            onClick={() => onJobClick(job)}
          />
          {/* Center marker for job circle */}
          <Marker
            position={{
              lat: job.serviceCircle.lat,
              lng: job.serviceCircle.lng
            }}
            onClick={() => onJobClick(job)}
            icon={getJobMarkerIcon(job.priority)}
            title={`${job.title} - ${job.zone} ($${job.price})`}
          />
        </div>
      ))}

      {/* Hover Info Popup */}
      {hoveredProvider && hoverPosition && (
        <ProviderHoverInfo
          provider={{
            id: hoveredProvider.id,
            name: hoveredProvider.name,
            service: hoveredProvider.service || 'Service Provider',
            rating: hoveredProvider.rating,
            reviewCount: hoveredProvider.reviewCount,
            serviceRadius: hoveredProvider.serviceRadius || 15,
            hourlyRate: hoveredProvider.hourlyRate
          }}
          position={hoverPosition}
          onViewProfile={() => console.log('View profile:', hoveredProvider.name)}
          onBookNow={() => console.log('Book now:', hoveredProvider.name)}
        />
      )}
    </>
  );
};

export default PrivacyMapMarkers;
