
import React, { useState } from 'react';
import { GoogleMap } from "@/components/GoogleMap";
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
  const [mapError, setMapError] = useState<string | null>(null);

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

  const handleMapError = (error: string) => {
    console.error('Map error:', error);
    setMapError(error);
  };

  const handleSelectedJobClose = () => {
    setSelectedJob(null);
  };

  if (mapError) {
    return (
      <div className="relative h-96 w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-red-600 mb-2">🗺️ Map Unavailable</div>
          <p className="text-gray-600 mb-2">{mapError}</p>
          <p className="text-sm text-gray-500">
            Interactive map temporarily unavailable. Job listings still available below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Google Map */}
      <div className="h-full w-full">
        <GoogleMap
          center={{ lat: 45.5017, lng: -73.5673 }}
          zoom={12}
          className="w-full h-full rounded-lg"
          providers={montrealProviders}
        />
      </div>

      {/* Emergency Job Markers Overlay */}
      <EmergencyJobMarkersOverlay
        emergencyJobs={emergencyJobs}
        onJobSelect={handleJobSelect}
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
    </div>
  );
};

export default InteractiveJobsMap;
