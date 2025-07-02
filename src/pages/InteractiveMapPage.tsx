
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
  const [isDragging, setIsDragging] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  const handleDraggingToggle = () => {
    setIsDragging(!isDragging);
    toast({
      title: isDragging ? "Dragging Disabled" : "Dragging Enabled",
      description: isDragging 
        ? "Map interactions restored to normal"
        : "You can now drag map elements"
    });
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

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      
      {/* Map Container */}
      <div className="fixed inset-0 pt-16">
        <div className="w-full h-full relative flex">
          {/* Map Section */}
          <div className="flex-1 relative">
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

            {/* Mapbox Map */}
            <MapboxMap
              center={quebecCenter}
              zoom={10}
              className="w-full h-full"
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

            {/* Top Controls Bar */}
            <div className="absolute top-4 right-4 z-50 pointer-events-auto">
              <div className="flex items-center gap-3">
                {/* Settings Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSettingsToggle}
                  className={`bg-white hover:bg-gray-50 border-2 border-gray-400 hover:border-gray-500 ${
                    showSettings ? 'bg-blue-50 border-blue-500' : ''
                  }`}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>

                {/* Dragging Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDraggingToggle}
                  className={`bg-white hover:bg-gray-50 border-2 border-gray-400 hover:border-gray-500 ${
                    isDragging ? 'bg-orange-50 border-orange-500' : ''
                  }`}
                >
                  <Move className="h-4 w-4 mr-2" />
                  {isDragging ? 'Dragging On' : 'Dragging Off'}
                </Button>
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="absolute top-20 right-4 z-50 pointer-events-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-gray-300 w-64">
                  <h3 className="font-semibold text-gray-900 mb-3">Map Settings</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>Map Engine: <span className="font-medium">Mapbox (Privacy First)</span></div>
                    <div>Dragging: <span className="font-medium">{isDragging ? 'Enabled' : 'Disabled'}</span></div>
                    <div className="pt-2 text-xs text-gray-500">
                      Real Quebec data with GPS navigation
                    </div>
                  </div>
                </div>
              </div>
            )}
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
