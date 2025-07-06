
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

  console.log('🗺️ InteractiveMapPage render:', { hasUser: !!user, currentRole });

  // State management
  const [userMode, setUserMode] = useState<UserMode>('customer');
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

  // Sample jobs data for Montreal area
  const sampleJobs: Job[] = [
    {
      id: '1',
      title: 'Plumbing Emergency',
      address: '123 Rue Saint-Catherine, Montreal',
      customerName: 'Marie Dubois',
      customerPhone: '+1 514-555-0123',
      estimatedDuration: '2-3 hours',
      priority: 'emergency',
      coordinates: { lat: 45.5088, lng: -73.5678 },
      price: 150
    },
    {
      id: '2',
      title: 'Electrical Repair',
      address: '456 Avenue Mont-Royal, Montreal',
      customerName: 'Jean Tremblay',
      customerPhone: '+1 514-555-0456',
      estimatedDuration: '1-2 hours',
      priority: 'high',
      coordinates: { lat: 45.5230, lng: -73.5800 },
      price: 85
    },
    {
      id: '3',
      title: 'House Cleaning',
      address: '789 Rue Sherbrooke, Montreal',
      customerName: 'Sophie Martin',
      customerPhone: '+1 514-555-0789',
      estimatedDuration: '3-4 hours',
      priority: 'medium',
      coordinates: { lat: 45.5000, lng: -73.5700 },
      price: 120
    }
  ];

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
            <MapboxMap
              center={quebecCenter}
              zoom={10}
              className="w-full h-full"
              onMapLoad={setMap}
            />

            {/* Revolutionary Neighborhood Arrow Navigation */}
            <NeighborhoodArrowNavigation
              map={map}
              jobs={sampleJobs}
              providers={[]} // Add provider data when available
              onNavigate={handleNeighborhoodNavigate}
            />

            {/* Jobs Overlay */}
            <MapboxJobsOverlay
              map={map}
              jobs={sampleJobs}
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
                customerName: "Mike Ross",
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
