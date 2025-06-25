
import React, { useState } from 'react';
import { usePrivacyEmergencyJobs } from '@/hooks/usePrivacyEmergencyJobs';
import { useRole } from '@/contexts/RoleContext';
import { getProviderWithServiceRadius } from '@/utils/locationPrivacy';
import { montrealProviders } from '@/data/montrealProviders';
import { UnifiedGoogleMap } from './UnifiedGoogleMap';
import PrivacyMapMarkers from './map/PrivacyMapMarkers';
import LiveStatsCard from './map/LiveStatsCard';
import LoadingOverlay from './map/LoadingOverlay';
import SelectedJobCard from './map/SelectedJobCard';

interface PrivacyInteractiveJobsMapProps {
  showHeatZones: boolean;
}

const PrivacyInteractiveJobsMap: React.FC<PrivacyInteractiveJobsMapProps> = ({ showHeatZones }) => {
  const { emergencyJobs, liveStats, loading, acceptEmergencyJob } = usePrivacyEmergencyJobs();
  const { currentRole } = useRole();
  const [selectedJob, setSelectedJob] = useState<any>(null);

  console.log('🗺️ PrivacyInteractiveJobsMap render:', { 
    showHeatZones, 
    currentRole, 
    jobsCount: emergencyJobs.length 
  });

  // Convert providers to privacy-protected format with service radius
  const privacyProviders = montrealProviders.map(provider => {
    const enhancedProvider = getProviderWithServiceRadius(provider);
    return {
      id: provider.id.toString(),
      name: `${enhancedProvider.service} Provider`,
      fuzzyLocation: enhancedProvider.fuzzyLocation,
      availability: provider.availability,
      rating: provider.rating,
      verified: provider.verified || false,
      serviceRadius: enhancedProvider.serviceRadius,
      hourlyRate: enhancedProvider.hourlyRate,
      service: enhancedProvider.service,
      reviewCount: enhancedProvider.reviewCount,
      showOnMap: provider.show_on_map !== false
    };
  });

  const handleJobSelect = (job: any) => {
    setSelectedJob(job);
  };

  const handleAcceptJob = async (jobId: string) => {
    if (currentRole === 'provider') {
      const success = await acceptEmergencyJob(jobId);
      if (success) {
        setSelectedJob(null);
      }
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Unified Google Map Container */}
      <UnifiedGoogleMap
        center={{ lat: 45.5017, lng: -73.5673 }}
        zoom={11}
        className="w-full h-full rounded-lg"
        mode="privacy"
      >
        {/* Privacy-Protected Map Markers */}
        <PrivacyMapMarkers
          providers={privacyProviders}
          jobs={emergencyJobs}
          isMapReady={true}
          onProviderClick={(provider) => console.log('Provider clicked:', provider.name)}
          onJobClick={handleJobSelect}
        />
      </UnifiedGoogleMap>

      {/* Live Stats Card */}
      <LiveStatsCard liveStats={liveStats} />

      {/* Selected Job Details Card */}
      <SelectedJobCard
        selectedJob={selectedJob}
        currentRole={currentRole}
        onClose={() => setSelectedJob(null)}
        onAcceptJob={handleAcceptJob}
      />

      {/* Loading Overlay */}
      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default PrivacyInteractiveJobsMap;
