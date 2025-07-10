
import React, { useState } from 'react';
import { UnifiedMapboxMap } from "@/components/UnifiedMapboxMap";
import { useEmergencyJobsData } from '@/hooks/useEmergencyJobsData';
import { useRole } from '@/contexts/RoleContext';
import { montrealProviders } from '@/data/montrealProviders';
import LiveStatsCard from './map/LiveStatsCard';
import SelectedJobCard from './map/SelectedJobCard';
import LoadingOverlay from './map/LoadingOverlay';
import JobAcceptedOverlay from './feedback/JobAcceptedOverlay';

const InteractiveJobsMap: React.FC = () => {
  const { emergencyJobs, liveStats, loading, acceptEmergencyJob } = useEmergencyJobsData();
  const { currentRole } = useRole();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showAcceptedOverlay, setShowAcceptedOverlay] = useState(false);
  const [lastAcceptedJob, setLastAcceptedJob] = useState<any>(null);

  const handleJobSelect = (job: any) => {
    setSelectedJob(job);
  };

  const handleAcceptJob = async (jobId: string) => {
    if (currentRole === 'provider') {
      const jobToAccept = selectedJob || emergencyJobs.find(job => job.id === jobId);
      const success = await acceptEmergencyJob(jobId);
      if (success && jobToAccept) {
        setLastAcceptedJob(jobToAccept);
        setShowAcceptedOverlay(true);
        setSelectedJob(null);
      }
    }
  };

  const handleSelectedJobClose = () => {
    setSelectedJob(null);
  };

  return (
    <div className="relative h-full w-full">
      {/* Unified Mapbox Map */}
      <UnifiedMapboxMap
        center={{ lat: 45.5017, lng: -73.5673 }}
        zoom={12}
        className="w-full h-full rounded-lg"
        providers={montrealProviders}
        mode="interactive"
      />

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

      {/* Job Accepted Overlay */}
      <JobAcceptedOverlay
        visible={showAcceptedOverlay}
        jobTitle={lastAcceptedJob?.title || 'Emergency Job'}
        jobPrice={lastAcceptedJob?.price || '$0'}
        onClose={() => setShowAcceptedOverlay(false)}
      />
    </div>
  );
};

export default InteractiveJobsMap;
