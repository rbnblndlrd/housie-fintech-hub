import React, { createContext, useContext, useState, ReactNode } from 'react';

interface JobAcceptanceState {
  isVisible: boolean;
  jobData: {
    id: string;
    title: string;
    price: string;
    customer: string;
    priority: 'high' | 'medium' | 'low';
    dueDate?: string;
    location?: string;
  } | null;
}

interface JobAcceptanceContextType {
  acceptanceState: JobAcceptanceState;
  showJobAccepted: (jobData: JobAcceptanceState['jobData']) => void;
  hideJobAccepted: () => void;
}

const JobAcceptanceContext = createContext<JobAcceptanceContextType | undefined>(undefined);

export const useJobAcceptance = () => {
  const context = useContext(JobAcceptanceContext);
  if (!context) {
    throw new Error('useJobAcceptance must be used within JobAcceptanceProvider');
  }
  return context;
};

interface JobAcceptanceProviderProps {
  children: ReactNode;
}

export const JobAcceptanceProvider: React.FC<JobAcceptanceProviderProps> = ({ children }) => {
  const [acceptanceState, setAcceptanceState] = useState<JobAcceptanceState>({
    isVisible: false,
    jobData: null,
  });

  const showJobAccepted = (jobData: JobAcceptanceState['jobData']) => {
    setAcceptanceState({
      isVisible: true,
      jobData,
    });

    // Auto-dismiss after 7 seconds
    setTimeout(() => {
      hideJobAccepted();
    }, 7000);
  };

  const hideJobAccepted = () => {
    setAcceptanceState({
      isVisible: false,
      jobData: null,
    });
  };

  return (
    <JobAcceptanceContext.Provider
      value={{
        acceptanceState,
        showJobAccepted,
        hideJobAccepted,
      }}
    >
      {children}
    </JobAcceptanceContext.Provider>
  );
};