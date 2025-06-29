
import React, { useState } from 'react';
import { UnifiedGoogleMap } from "@/components/UnifiedGoogleMap";
import { useEmergencyJobsData } from '@/hooks/useEmergencyJobsData';
import { useRole } from '@/contexts/RoleContext';
import { montrealProviders } from '@/data/montrealProviders';
import EmergencyJobMarkersOverlay from './map/EmergencyJobMarkersOverlay';
import LiveStatsCard from './map/LiveStatsCard';
import SelectedJobCard from './map/SelectedJobCard';
import LoadingOverlay from './map/LoadingOverlay';

const InteractiveJobsMap: React.FC = () => {
  const { emergencyJobs, liveStats, loading, acceptEmergencyJob } = useEmergencyJobsData();
  const { currentRole } = useRole();
  const [selectedJob, setSelectedJob] = useState<any>(null);

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

  const handleSelectedJobClose = () => {
    setSelectedJob(null);
  };

  return (
    <div className="relative h-full w-full">
      {/* Unified Google Map */}
      <UnifiedGoogleMap
        center={{ lat: 45.5017, lng: -73.5673 }}
        zoom={12}
        className="w-full h-full rounded-lg"
        providers={montrealProviders}
        mode="interactive"
      >
        {/* Emergency Job Markers Overlay as children */}
        <EmergencyJobMarkersOverlay
          emergencyJobs={emergencyJobs}
          onJobSelect={handleJobSelect}
        />
      </UnifiedGoogleMap>

      {/* Live Stats Card */}
      <LiveStatsCard liveStats={liveStats} />

      {/* Selected Job Details Card */}
      <SelectedJobCard
        selectedJob={selectedJob}
        currentRole={currentRole}
        onClose={handleSelectedJobClose}
        onAcceptJob={handleAcceptJob}
      />

      {/* Loading Overlay */}
      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default InteractiveJobsMap;
