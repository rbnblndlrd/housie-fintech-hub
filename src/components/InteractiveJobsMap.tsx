
import React, { useState } from 'react';
import { UnifiedMapboxMap } from "@/components/UnifiedMapboxMap";
import { useRealJobsData } from '@/hooks/useRealJobsData';
import { useRole } from '@/contexts/RoleContext';
import LiveStatsCard from './map/LiveStatsCard';
import SelectedJobCard from './map/SelectedJobCard';
import LoadingOverlay from './map/LoadingOverlay';
import { useJobAcceptance } from '@/contexts/JobAcceptanceContext';

const InteractiveJobsMap: React.FC = () => {
  const { jobs, liveStats, loading, acceptJob } = useRealJobsData();
  const { currentRole } = useRole();
  const { showJobAccepted } = useJobAcceptance();
  const [selectedJob, setSelectedJob] = useState<any>(null);

  console.log('🗺️ InteractiveJobsMap rendering with', jobs.length, 'real jobs');

  const handleJobSelect = (job: any) => {
    console.log('🎯 Job selected on InteractiveJobsMap:', job.title);
    setSelectedJob(job);
  };

  const handleAcceptJob = async (jobId: string) => {
    if (currentRole === 'provider') {
      const jobToAccept = selectedJob || jobs.find(job => job.id === jobId);
      console.log('🎯 Attempting to accept job:', jobToAccept?.title);
      
      const acceptedJob = await acceptJob(jobId);
      
      if (acceptedJob && jobToAccept) {
        // Use the global job acceptance system
        showJobAccepted({
          id: jobToAccept.id,
          title: jobToAccept.title || `${jobToAccept.category} – ${jobToAccept.location || 'Location'}`,
          price: jobToAccept.price || '$0',
          customer: jobToAccept.customerName || 'Customer',
          priority: jobToAccept.priority || 'normal',
          dueDate: jobToAccept.scheduledTime || 'TBD',
          location: jobToAccept.location
        });
        
        // Trigger Annette celebration message
        if ((window as any).triggerAnnetteMessage) {
          (window as any).triggerAnnetteMessage({
            text: `Job accepted! 🎉 "${jobToAccept.title}" is now confirmed and added to your active tickets.`,
            from: 'annette',
            source: 'job_acceptance'
          });
        }
        
        // Store accepted job for dashboard sync
        const acceptedJobData = {
          id: jobToAccept.id,
          title: jobToAccept.title,
          status: 'confirmed',
          priority: jobToAccept.priority,
          address: jobToAccept.location,
          scheduledTime: jobToAccept.scheduledTime,
          acceptedAt: new Date().toISOString()
        };
        localStorage.setItem('lastAcceptedJob', JSON.stringify(acceptedJobData));
        
        // Dispatch custom event to notify other components
        const event = new CustomEvent('jobAccepted', { 
          detail: acceptedJobData 
        });
        window.dispatchEvent(event);
        
        setSelectedJob(null);
        console.log('✅ Job accepted and synced to dashboard');
      }
    }
  };

  const handleSelectedJobClose = () => {
    setSelectedJob(null);
  };

  return (
    <div className="relative h-full w-full">
      {/* Unified Mapbox Map with Real Jobs */}
      <UnifiedMapboxMap
        center={{ lat: 45.5017, lng: -73.5673 }}
        zoom={12}
        className="w-full h-full rounded-lg"
        jobs={jobs}
        onJobClick={handleJobSelect}
        mode="real-jobs"
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
