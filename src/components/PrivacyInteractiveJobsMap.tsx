
import React, { useState } from 'react';
import { usePrivacyEmergencyJobs } from '@/hooks/usePrivacyEmergencyJobs';
import { useRole } from '@/contexts/RoleContext';
import { montrealProviders } from '@/data/montrealProviders';
import { UnifiedGoogleMap } from './UnifiedGoogleMap';
import SelectedJobCard from './map/SelectedJobCard';
import LoadingOverlay from './map/LoadingOverlay';

const PrivacyInteractiveJobsMap: React.FC = () => {
  const { emergencyJobs, loading, acceptEmergencyJob } = usePrivacyEmergencyJobs();
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

  return (
    <div className="relative h-full w-full">
      <UnifiedGoogleMap
        center={{ lat: 45.5017, lng: -73.5673 }}
        zoom={11}
        className="w-full h-full rounded-lg"
        providers={montrealProviders}
        mode="privacy"
      />

      <SelectedJobCard
        selectedJob={selectedJob}
        currentRole={currentRole}
        onClose={() => setSelectedJob(null)}
        onAcceptJob={handleAcceptJob}
      />

      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default PrivacyInteractiveJobsMap;
