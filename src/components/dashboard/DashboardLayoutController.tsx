import React from 'react';
import { ServiceLayoutType } from '@/hooks/useServiceLayout';

// Cleaning Layout Components
import CleaningActiveTickets from './layouts/cleaning/CleaningActiveTickets';
import CleaningTodaysRoute from './layouts/cleaning/CleaningTodaysRoute';
import CleaningEarningsTracker from './layouts/cleaning/CleaningEarningsTracker';
import CleaningRouteOptimization from './layouts/cleaning/CleaningRouteOptimization';

// Tattoo Layout Components  
import TattooUpcomingAppointments from './layouts/tattoo/TattooUpcomingAppointments';
import TattooClientProfiles from './layouts/tattoo/TattooClientProfiles';
import TattooPortfolioBuilder from './layouts/tattoo/TattooPortfolioBuilder';
import TattooSessionPrepNotes from './layouts/tattoo/TattooSessionPrepNotes';

// Default Layout Components
import JobHub from './JobHub';
import PerformanceWidgets from './PerformanceWidgets';
import { AnnetteInboxNotifications } from '@/components/annette/AnnetteInboxNotifications';
import { StampTrackerWidget } from '@/components/stamps/StampTrackerWidget';

interface DashboardLayoutControllerProps {
  layoutType: ServiceLayoutType;
  jobs: any[];
  className?: string;
}

const DashboardLayoutController: React.FC<DashboardLayoutControllerProps> = ({
  layoutType,
  jobs,
  className = ""
}) => {
  const renderCleaningLayout = () => (
    <div className={`space-y-6 ${className}`}>
      <CleaningActiveTickets jobs={jobs} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CleaningTodaysRoute jobs={jobs} />
        <CleaningEarningsTracker />
      </div>
      <CleaningRouteOptimization jobs={jobs} />
    </div>
  );

  const renderTattooLayout = () => (
    <div className={`space-y-6 ${className}`}>
      <TattooUpcomingAppointments jobs={jobs} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TattooClientProfiles jobs={jobs} />
        <TattooPortfolioBuilder />
      </div>
      <TattooSessionPrepNotes jobs={jobs} />
    </div>
  );

  const renderDefaultLayout = () => (
    <div className={`space-y-6 ${className}`}>
      <AnnetteInboxNotifications />
      <JobHub />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceWidgets />
        <StampTrackerWidget className="h-fit" />
      </div>
    </div>
  );

  switch (layoutType) {
    case 'cleaning':
      return renderCleaningLayout();
    case 'tattoo':
      return renderTattooLayout();
    default:
      return renderDefaultLayout();
  }
};

export default DashboardLayoutController;