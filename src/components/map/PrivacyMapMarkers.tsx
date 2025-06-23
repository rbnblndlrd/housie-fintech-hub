
import React from 'react';
import { Marker, Circle } from '@react-google-maps/api';

interface PrivacyProvider {
  id: string;
  name: string;
  fuzzyLocation: { lat: number; lng: number };
  availability: string;
  rating: number;
  verified: boolean;
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
  if (!isMapReady) return null;

  const getProviderIcon = (availability: string, verified: boolean) => {
    if (!window.google) return undefined;
    
    try {
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

  return (
    <>
      {/* Privacy-protected provider markers (anonymous fuzzy locations) */}
      {providers.map(provider => (
        <Marker
          key={`provider-${provider.id}`}
          position={provider.fuzzyLocation}
          onClick={() => onProviderClick(provider)}
          icon={getProviderIcon(provider.availability, provider.verified)}
          title={`${provider.availability} Provider (${provider.rating}⭐)`}
        />
      ))}

      {/* Privacy-protected job service circles (approximate areas) */}
      {jobs.map(job => (
        <React.Fragment key={`job-${job.id}`}>
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
            icon={{
              path: window.google?.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: job.priority === 'emergency' ? '#ef4444' : '#3b82f6',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }}
            title={`${job.title} - ${job.zone} ($${job.price})`}
          />
        </React.Fragment>
      ))}
    </>
  );
};

export default PrivacyMapMarkers;
