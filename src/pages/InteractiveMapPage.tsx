
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Move, Shield } from 'lucide-react';
import MapboxMap from '@/components/map/MapboxMap';
import MapboxJobsOverlay from '@/components/map/MapboxJobsOverlay';
import GPSNavigationOverlay from '@/components/map/GPSNavigationOverlay';
import NavigationOverlay from '@/components/map/NavigationOverlay';
import CustomerMapMode from '@/components/map/modes/CustomerMapMode';
import ProviderMapMode from '@/components/map/modes/ProviderMapMode';
import FleetManagerMode from '@/components/map/modes/FleetManagerMode';
import NeighborhoodArrowNavigation from '@/components/map/NeighborhoodArrowNavigation';
import { useRealJobsData } from '@/hooks/useRealJobsData';
import mapboxgl from 'mapbox-gl';

type UserMode = 'customer' | 'provider' | 'fleet-manager';

interface Job {
  id: string;
  title: string;
  address: string;
  customerName: string;
  customerPhone: string;
  estimatedDuration: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  coordinates: { lat: number; lng: number };
  price: number;
}

const InteractiveMapPage = () => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();
  const { toast } = useToast();
  const { jobs: realJobs, loading: jobsLoading } = useRealJobsData();

  console.log('🗺️ InteractiveMapPage render:', { hasUser: !!user, currentRole });

  // State management
  const [userMode, setUserMode] = useState<UserMode>('provider');
  const [showNavigation, setShowNavigation] = useState(false);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [enabledLayers, setEnabledLayers] = useState<Record<string, boolean>>({
    // Customer layers
    crime: false,
    demographics: false,
    services: false,
    // Provider layers
    demand: false,
    competition: false,
    tips: false,
    opportunity: false,
    // Fleet Manager layers
    fleetTracking: false,
    jobDistribution: false,
    performanceZones: false,
    routeOptimization: false
  });

  // Convert real jobs to the format expected by the map
  const mapJobs: Job[] = realJobs.map(job => ({
    id: job.id,
    title: job.title,
    address: job.location,
    customerName: job.customerName,
    customerPhone: '+1 514-555-0000', // Mock phone for now
    estimatedDuration: '2-3 hours', // Mock duration for now
    priority: job.priority === 'high' ? 'high' : job.priority === 'emergency' ? 'emergency' : 'medium',
    coordinates: { lat: job.lat || 45.5017, lng: job.lng || -73.5673 },
    price: parseInt(job.price.replace('$', '')) || 100
  }));

  // Quebec/Montreal center coordinates
  const quebecCenter = { lat: 45.5017, lng: -73.5673 };

  const handleUserModeChange = (mode: UserMode) => {
    console.log('🗺️ User mode changed to:', mode);
    setUserMode(mode);
    toast({
      title: "Mode Changed",
      description: `Switched to ${mode.replace('-', ' ')} mode`,
    });
  };

  const handleJobClick = (job: Job) => {
    console.log('🎯 Job selected:', job.title);
    setSelectedJob(job);
    toast({
      title: "Job Selected",
      description: `Selected: ${job.title}`,
    });
  };

  const handleStartNavigation = (job: Job) => {
    console.log('🧭 Starting navigation to:', job.address);
    toast({
      title: "Navigation Started",
      description: `GPS navigation to ${job.address}`,
    });
  };

  const handleCompleteJob = (jobId: string) => {
    console.log('✅ Job completed:', jobId);
    setSelectedJob(null);
    toast({
      title: "Job Completed",
      description: "Great work! Job marked as complete.",
    });
  };

  const handleCancelNavigation = () => {
    setSelectedJob(null);
  };

  const handleDataLayerToggle = (layer: string, enabled: boolean) => {
    console.log('🎛️ Layer toggle:', layer, enabled);
    setEnabledLayers(prev => ({
      ...prev,
      [layer]: enabled
    }));
    
    toast({
      title: `${layer} Layer ${enabled ? 'Enabled' : 'Disabled'}`,
      description: `${layer} data ${enabled ? 'now showing' : 'hidden'} on map`,
    });
  };

  const handleNavigationToggle = () => {
    setShowNavigation(!showNavigation);
  };

  const handleNeighborhoodNavigate = (neighborhoodName: string, coordinates: { lat: number; lng: number }) => {
    console.log('🏘️ Navigating to neighborhood:', neighborhoodName, coordinates);
    toast({
      title: "Neighborhood Navigation",
      description: `Moving to ${neighborhoodName}`,
    });
  };

  if (jobsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      
      {/* Map Container - Full Viewport with Border */}
      <div className="fixed inset-0 pt-16 p-4" style={{
        height: 'calc(100vh - 64px)' // Account for header
      }}>
        <div className="w-full h-full border-2 border-border rounded-lg overflow-hidden bg-background shadow-lg relative flex">
          {/* Map Section - Full Container */}
          <div className="flex-1 relative overflow-hidden">
            {/* Privacy Notice */}
            <div className="absolute top-4 left-4 z-50 pointer-events-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs">
                <div className="flex items-center gap-2 text-blue-800 text-sm font-medium mb-1">
                  <Shield className="h-4 w-4" />
                  Privacy First
                </div>
                <p className="text-xs text-blue-600">
                  Your data stays private with Mapbox. No Google tracking.
                </p>
              </div>
            </div>

            {/* Mapbox Map - Full Container */}
            <div className="border-2 border-border rounded-lg overflow-hidden">
              <MapboxMap
                center={quebecCenter}
                zoom={10}
                className="w-full h-full"
                onMapLoad={setMap}
              />
            </div>

            {/* Revolutionary Neighborhood Arrow Navigation */}
            <NeighborhoodArrowNavigation
              map={map}
              jobs={mapJobs}
              providers={[]} // Add provider data when available
              onNavigate={handleNeighborhoodNavigate}
            />

            {/* Jobs Overlay - Now using real jobs */}
            <MapboxJobsOverlay
              map={map}
              jobs={mapJobs}
              onJobClick={handleJobClick}
            />

            {/* GPS Navigation Overlay */}
            <GPSNavigationOverlay
              selectedJob={selectedJob}
              onStartNavigation={handleStartNavigation}
              onCompleteJob={handleCompleteJob}
              onCancelNavigation={handleCancelNavigation}
            />

            {/* Navigation Overlay */}
            <NavigationOverlay
              isOpen={showNavigation}
              onToggle={handleNavigationToggle}
              currentJob={selectedJob ? {
                id: selectedJob.id,
                customerName: selectedJob.customerName,
                address: selectedJob.address,
                distance: "2.3 km",
                estimatedTime: selectedJob.estimatedDuration
              } : undefined}
              nextJob={{
                customerName: "Next Customer",
                distance: "5.1 km",
                estimatedTime: "12 min"
              }}
            />

          </div>

          {/* Mode-specific Right Panel - Show provider mode by default */}
          <ProviderMapMode 
            onDataLayerToggle={handleDataLayerToggle}
            enabledLayers={enabledLayers}
          />
        </div>

        {/* Chat Bubble */}
        <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
          <div className="pointer-events-auto">
            <ChatBubble defaultTab="voice" showMicIcon={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapPage;
