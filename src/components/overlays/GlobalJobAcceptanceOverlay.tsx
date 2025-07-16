import React from 'react';
import { useJobAcceptance } from '@/contexts/JobAcceptanceContext';
import JobAcceptedOverlay from '@/components/feedback/JobAcceptedOverlay';

export const GlobalJobAcceptanceOverlay: React.FC = () => {
  const { acceptanceState, hideJobAccepted } = useJobAcceptance();

  const handleParseClick = () => {
    console.log('🧠 AI Parsing job:', acceptanceState.jobData?.title);
    // Here you would trigger AI parsing logic
  };

  const handleScheduleClick = () => {
    console.log('📅 Scheduling job:', acceptanceState.jobData?.title);
    // Here you would open scheduling interface
  };

  if (!acceptanceState.isVisible || !acceptanceState.jobData) {
    return null;
  }

  return (
    <JobAcceptedOverlay
      visible={acceptanceState.isVisible}
      jobTitle={acceptanceState.jobData.title}
      jobPrice={acceptanceState.jobData.price}
      customer={acceptanceState.jobData.customer}
      priority={acceptanceState.jobData.priority}
      dueDate={acceptanceState.jobData.dueDate}
      location={acceptanceState.jobData.location}
      onClose={hideJobAccepted}
      onParseClick={handleParseClick}
      onScheduleClick={handleScheduleClick}
    />
  );
};