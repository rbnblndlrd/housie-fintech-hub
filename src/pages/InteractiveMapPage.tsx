
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import Header from '@/components/Header';
import HeatZoneMap from '@/components/HeatZoneMap';
import NavigationOverlay from '@/components/map/NavigationOverlay';
import EmergencyJobsPanel from '@/components/map/EmergencyJobsPanel';
import MarketInsightsPanel from '@/components/map/MarketInsightsPanel';
import AIVoiceAssistantPanel from '@/components/map/AIVoiceAssistantPanel';
import LocationAnalyticsPanel from '@/components/map/LocationAnalyticsPanel';
import RouteManagementCard from '@/components/map/RouteManagementCard';
import InteractiveMapBottomPanel from '@/components/map/InteractiveMapBottomPanel';
import { useToast } from '@/hooks/use-toast';

const InteractiveMapPage = () => {
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { toast } = useToast();

  // Navigation state
  const [isNavigationMode, setIsNavigationMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Emergency jobs state
  const [emergencyJobs] = useState([
    { id: '1', title: 'Plumbing Emergency', distance: '1.2km', price: '150', urgency: 'high' as const },
    { id: '2', title: 'Electrical Repair', distance: '0.8km', price: '120', urgency: 'medium' as const }
  ]);
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState(true);

  // Market insights state
  const [showDemandLevels, setShowDemandLevels] = useState(true);
  const [showProviders, setShowProviders] = useState(true);
  const [showHighTrafficAreas, setShowHighTrafficAreas] = useState(false);

  // AI assistant state
  const [isListening, setIsListening] = useState(false);
  const [recentCommands] = useState([
    "What's the fastest route to my next job?",
    "Are there any emergency jobs nearby?",
    "Read my new messages"
  ]);

  // Route management state
  const [todaysJobs] = useState([
    {
      id: '1',
      title: 'Kitchen Renovation Consultation',
      address: '123 Rue Saint-Denis, Montreal',
      timeSlot: '9:00 AM - 10:30 AM',
      estimatedDuration: '1.5 hours',
      status: 'confirmed' as const,
      travelTime: '15 min'
    },
    {
      id: '2',
      title: 'Bathroom Tile Installation',
      address: '456 Avenue Mont-Royal, Montreal',
      timeSlot: '11:00 AM - 3:00 PM',
      estimatedDuration: '4 hours',
      status: 'pending' as const,
      travelTime: '20 min'
    }
  ]);

  console.log('🗺️ InteractiveMapPage render:', { user: !!user, currentRole });

  const handleQuickAction = (action: string) => {
    console.log('Quick action:', action);
    toast({
      title: "AI Assistant",
      description: `Processing: ${action.replace('_', ' ')}`,
    });
  };

  const handleOptimizeRoute = () => {
    toast({
      title: "Route Optimization",
      description: "Calculating optimal route for today's jobs...",
    });
  };

  const handleViewAllEmergencyJobs = () => {
    toast({
      title: "Emergency Jobs",
      description: "Opening emergency jobs dashboard...",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-16 h-screen flex flex-col">
        {/* Main Content Area - Desktop: Map + Right Sidebar, Mobile: Full Map */}
        <div className="flex flex-1">
          {/* Map Container - Takes remaining space after right panel */}
          <div className="flex-1 relative">
            <HeatZoneMap 
              userRole={currentRole} 
              showHeatZones={showDemandLevels}
            />
            
            {/* Navigation Overlay */}
            <NavigationOverlay
              isNavigationMode={isNavigationMode}
              onToggleNavigation={() => setIsNavigationMode(!isNavigationMode)}
              voiceEnabled={voiceEnabled}
              onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
            />
          </div>

          {/* Right Sidebar - Desktop only */}
          <div className="hidden md:flex w-80 bg-white border-l border-gray-200 flex-col overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Emergency Jobs Panel */}
              <EmergencyJobsPanel
                emergencyCount={emergencyJobs.length}
                audioEnabled={audioAlertsEnabled}
                onToggleAudio={setAudioAlertsEnabled}
                onViewAll={handleViewAllEmergencyJobs}
                recentJobs={emergencyJobs}
              />

              {/* Market Insights Panel */}
              <MarketInsightsPanel
                showDemandLevels={showDemandLevels}
                showProviders={showProviders}
                showHighTrafficAreas={showHighTrafficAreas}
                onToggleDemandLevels={setShowDemandLevels}
                onToggleProviders={setShowProviders}
                onToggleHighTrafficAreas={setShowHighTrafficAreas}
              />

              {/* AI Voice Assistant Panel */}
              <AIVoiceAssistantPanel
                isListening={isListening}
                onToggleListening={() => setIsListening(!isListening)}
                recentCommands={recentCommands}
                onQuickAction={handleQuickAction}
              />

              {/* Location Analytics Panel */}
              <LocationAnalyticsPanel
                currentArea="Plateau-Mont-Royal"
                marketDemand="High"
                averagePrice={65}
                competition="Medium"
                opportunityLevel="High"
                insights={[
                  "Peak demand for handyman services in this area",
                  "Weekend bookings typically 40% higher",
                  "Average response time: 2.3 hours"
                ]}
              />
            </div>
          </div>
        </div>

        {/* Bottom Cards - Analytics Only */}
        <div className="h-[28vh] border-t bg-white">
          <div className="h-full flex gap-4 p-4">
            {/* Route Management Card */}
            <div className="flex-1">
              <RouteManagementCard
                todaysJobs={todaysJobs}
                totalTravelTime="2h 35min"
                onOptimizeRoute={handleOptimizeRoute}
                onReorderJobs={() => {}}
                onAddStop={() => toast({ title: "Add Stop", description: "Opening location picker..." })}
              />
            </div>

            {/* Regional Market Trends & Recent Activity */}
            <div className="flex-1">
              <InteractiveMapBottomPanel currentRole={currentRole} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapPage;
