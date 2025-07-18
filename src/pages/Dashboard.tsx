
import React from 'react';
import { UnifiedDashboardLayout } from '@/components/layout/UnifiedDashboardLayout';
import { AnnetteHalo } from '@/components/chat/AnnetteHalo';
import { RevolverMenu } from '@/components/chat/RevolverMenuFixed';
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
import { useRevolverVisibility } from '@/hooks/useRevolverVisibility';
import { useActiveBookings } from '@/hooks/useActiveBookings';

import { JobAcceptanceProvider } from '@/contexts/JobAcceptanceContext';
import { GlobalJobAcceptanceOverlay } from '@/components/overlays/GlobalJobAcceptanceOverlay';
import { BookingsProvider } from '@/contexts/BookingsContext';
import { AnnetteIntegration } from '@/components/assistant/AnnetteIntegration';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  // Use real bookings data instead of mock data
  const { bookings: activeBookings, loading: bookingsLoading } = useActiveBookings();
  
  // Convert bookings to the format expected by the UX mode system
  const jobs = activeBookings.map(booking => ({
    id: booking.id,
    title: booking.title,
    service_subcategory: booking.service_subcategory || 'general',
    customer: booking.customer_name || 'Customer',
    priority: booking.priority
  }));

  const { 
    currentMode, 
    currentModeDefinition, 
    setUXMode, 
    availableModes, 
    isAutoDetected,
    detectedMode 
  } = useUXMode(jobs);

  const {
    currentLayout,
    layoutDefinition,
    detectedLayout,
    isManualOverride,
    setLayoutOverride,
    availableLayouts
  } = useServiceLayout(jobs);

  const { isRevolverOpen } = useRevolverVisibility();

  const handleAnnetteRecommendation = () => {
    console.log('Opening Annette recommendations...');
  };

  const handleJobAction = (jobId: string, action: string) => {
    console.log(`🎯 Job action: ${action} for job ${jobId}`);
  };

  // Left Dock Content - Annette's BubbleChat (invisible but space reserved)
  const leftDockContent = (
    <div className="w-0 h-0 opacity-0 pointer-events-none">
      {/* Space reserved for floating Annette BubbleChat */}
    </div>
  );

  // Right Dock Content - Today's Route + Space for RevolverMenu
  const rightDockContent = (
    <div className="space-y-4">
      {/* Today's Route Panel */}
      <Card className="fintech-card">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4 text-slate-800">Today's Route</h3>
          <TodaysRoutePanel />
        </CardContent>
      </Card>
      
      {/* Space reserved for RevolverMenu */}
      <div className="w-0 h-0 opacity-0 pointer-events-none">
        {/* Space reserved for floating RevolverMenu */}
      </div>
    </div>
  );

  // Bottom Row Content - Performance Metrics (auto-hide when revolver open)
  const bottomRowContent = (
    <div className={`transition-all duration-500 ${isRevolverOpen ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceWidgets />
        <StampTrackerWidget className="h-fit" />
      </div>
    </div>
  );

  return (
    <JobAcceptanceProvider>
      <BookingsProvider>
        <UnifiedDashboardLayout
          leftDock={leftDockContent}
          rightDock={rightDockContent}
          bottomRow={bottomRowContent}
        >
          {/* Main Pane Content */}
          <div className="main-pane space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
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
            </div>

            {/* Loading State */}
            {bookingsLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading active jobs...</p>
              </div>
            )}

            {/* Main Dashboard Content with Real Data */}
            {!bookingsLoading && (
              <DashboardLayoutController
                layoutType={currentLayout}
                jobs={jobs}
              />
            )}
          </div>
        </UnifiedDashboardLayout>
        
        {/* Tactical HUD Anchor Card */}
        <TodaysRouteAnchor />
        
        {/* Full Annette Integration with voice lines and Revolver actions */}
        <AnnetteIntegration />

        {/* Global Job Acceptance Overlay */}
        <GlobalJobAcceptanceOverlay />
      </BookingsProvider>
    </JobAcceptanceProvider>
  );
};

export default Dashboard;
