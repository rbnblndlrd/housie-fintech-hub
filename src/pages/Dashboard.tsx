import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import JobTicketTable from '@/components/dashboard/JobTicketTable';
import TodaysRoutePanel from '@/components/dashboard/TodaysRoutePanel';
import PerformanceWidgets from '@/components/dashboard/PerformanceWidgets';
import JobHub from '@/components/dashboard/JobHub';
import { AnnetteInboxNotifications } from '@/components/annette/AnnetteInboxNotifications';
import { TodaysRouteAnchor } from '@/components/dashboard/TacticalHUD/TodaysRouteAnchor';
import { StampTrackerWidget } from '@/components/stamps/StampTrackerWidget';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreateJobTicketButton } from '@/components/ui/CreateJobTicketButton';
import { UXModeSelector } from '@/components/dashboard/UXModeSelector';
import { UXModeJobCard } from '@/components/dashboard/UXModeJobCard';
import { useUXMode } from '@/hooks/useUXMode';
import DashboardLayoutController from '@/components/dashboard/DashboardLayoutController';
import ServiceLayoutSelector from '@/components/dashboard/ServiceLayoutSelector';
import { useServiceLayout } from '@/hooks/useServiceLayout';

const Dashboard = () => {
  // Mock jobs data for UX mode detection
  const mockJobs = [
    { id: '1', title: 'Kitchen Sink Repair', service_subcategory: 'plumbing', customer: 'Marie Dubois', priority: 'high' },
    { id: '2', title: 'Electrical Outlet Install', service_subcategory: 'electrical', customer: 'Jean Tremblay', priority: 'medium' },
    { id: '3', title: 'Bathroom Cleaning', service_subcategory: 'cleaning', customer: 'Sophie Martin', priority: 'low' }
  ];

  const { 
    currentMode, 
    currentModeDefinition, 
    setUXMode, 
    availableModes, 
    isAutoDetected,
    detectedMode 
  } = useUXMode(mockJobs);

  const {
    currentLayout,
    layoutDefinition,
    detectedLayout,
    isManualOverride,
    setLayoutOverride,
    availableLayouts
  } = useServiceLayout(mockJobs);

  const handleAnnetteRecommendation = () => {
    // This would open the chat bubble with a specific context
    console.log('Opening Annette recommendations...');
  };

  const handleJobAction = (jobId: string, action: string) => {
    console.log(`🎯 Job action: ${action} for job ${jobId}`);
    // Handle different actions based on UX mode
  };

  const annetteCard = (
    <Card className="fintech-card border-purple-200 bg-purple-50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">A</span>
          </div>
          <div className="flex-1">
            <p className="text-purple-700 font-medium mb-1">Annette says:</p>
            <p className="text-purple-600 text-sm mb-3">
              "You've got 3 active jobs and 2 scheduled for today. Want me to recommend your next move? 
              I'd suggest prioritizing the high-priority job on Rue Saint-Denis first!"
            </p>
            <Button 
              onClick={handleAnnetteRecommendation}
              size="sm" 
              variant="outline" 
              className="border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              Get Recommendations
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <DashboardLayout
        title="Dashboard"
        rightPanelTitle="Today's Route"
        rightPanelContent={<TodaysRoutePanel />}
        bottomWidgets={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceWidgets />
            <StampTrackerWidget className="h-fit" />
          </div>
        }
        headerAction={
          <div className="flex items-center gap-3">
            <ServiceLayoutSelector
              currentLayout={currentLayout}
              detectedLayout={detectedLayout}
              isManualOverride={isManualOverride}
              onLayoutChange={setLayoutOverride}
              availableLayouts={availableLayouts}
            />
            <CreateJobTicketButton size="sm" />
          </div>
        }
      >
        {annetteCard}
        <DashboardLayoutController
          layoutType={currentLayout}
          jobs={mockJobs}
        />
      </DashboardLayout>
      
      {/* Tactical HUD Anchor Card */}
      <TodaysRouteAnchor />
    </>
  );
};

export default Dashboard;