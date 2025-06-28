
import { useState, useEffect } from 'react';

export const useEmergencyJobsData = () => {
  const [emergencyJobs, setEmergencyJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const liveStats = {
    availableProviders: 12
  };

  const acceptEmergencyJob = async (jobId: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove job from list after acceptance
      setEmergencyJobs(prev => prev.filter((job: any) => job.id !== jobId));
      
      return true;
    } catch (error) {
      console.error('Error accepting job:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    emergencyJobs,
    liveStats,
    loading,
    acceptEmergencyJob
  };
};
