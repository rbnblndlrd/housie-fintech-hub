
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import Header from '@/components/Header';
import FleetMap from '@/components/FleetMap';
import { useToast } from '@/hooks/use-toast';
import { useOverlayManager } from '@/hooks/useOverlayManager';
import { useFleetVehicles, FleetVehicle } from '@/hooks/useFleetVehicles';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { preventWalletConflicts } from '@/components/map/GoogleMapConfig';

// Overlay Components
import OverlayManager from '@/components/map/OverlayManager';
import OverlayWrapper from '@/components/map/overlays/OverlayWrapper';
import EmergencyJobsOverlay from '@/components/map/overlays/EmergencyJobsOverlay';
import MarketInsightsOverlay from '@/components/map/overlays/MarketInsightsOverlay';
import LocationAnalyticsOverlay from '@/components/map/overlays/LocationAnalyticsOverlay';
import RouteManagementOverlay from '@/components/map/overlays/RouteManagementOverlay';
import FleetManagementOverlay from '@/components/map/overlays/FleetManagementOverlay';
import FleetVehiclesViewOverlay from '@/components/map/overlays/FleetVehiclesViewOverlay';

const InteractiveMapPage = () => {
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { toast } = useToast();

  // Prevent wallet conflicts on mount
  useEffect(() => {
    preventWalletConflicts();
  }, []);
  
  // Fleet Vehicles Hook
  const {
    fleetVehicles,
    followFleet,
    setFollowFleet,
    calculateFleetBounds,
    getFleetCenter
  } = useFleetVehicles();

  // Overlay Management
  const {
    overlays,
    allOverlays,
    isFleetMode,
    isCustomizeMode,
    isDraggableMode,
    isPremium,
    allOverlaysVisible,
    setIsFleetMode,
    setIsCustomizeMode,
    setIsDraggableMode,
    toggleOverlay,
    toggleAllOverlays,
    saveLayout,
    resetLayout,
    resetPositions
  } = useOverlayManager();

  // Map state
  const [showProviders, setShowProviders] = useState(true);
  const [showTrafficAreas, setShowTrafficAreas] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [showFleetBounds, setShowFleetBounds] = useState(false);

  // Sample data
  const emergencyCount = isFleetMode ? 8 : 4;
  const currentArea = "Plateau-Mont-Royal";
  const marketDemand = "High";
  const avgRate = isFleetMode ? 52 : 45;
  const competition = "Medium";
  const opportunityLevel = "High";
  const totalTravelTime = "2h 15m";
  const nextJobCountdown = "45 min";

  const sampleJobs = [
    {
      id: '1',
      title: 'Apartment Cleaning',
      location: 'Downtown',
      time: '10:00 AM',
      duration: '2h',
      status: 'pending' as const
    },
    {
      id: '2',
      title: 'Handyman Repair',
      location: 'Plateau',
      time: '1:00 PM', 
      duration: '3h',
      status: 'pending' as const
    },
    {
      id: '3',
      title: 'Garden Maintenance',
      location: 'Westmount',
      time: '4:00 PM',
      duration: '1.5h',
      status: 'completed' as const
    }
  ];

  const handleFleetModeToggle = (enabled: boolean) => {
    if (!isPremium && enabled) {
      toast({
        title: "Premium Feature",
        description: "Fleet Management requires a premium subscription",
        variant: "destructive"
      });
      return;
    }
    
    setIsFleetMode(enabled);
    if (enabled) {
      setShowFleetBounds(true);
    }
    toast({
      title: enabled ? "Fleet Manager Mode" : "Individual Provider Mode",
      description: enabled 
        ? "Now showing fleet management tools and multi-vehicle view"
        : "Switched to individual provider interface"
    });
  };

  const handleToggleDraggableMode = (enabled: boolean) => {
    setIsDraggableMode(enabled);
    toast({
      title: enabled ? "Drag Mode Enabled" : "Drag Mode Disabled",
      description: enabled 
        ? "You can now drag overlays freely around the screen"
        : "Overlays returned to organized layout positions"
    });
  };

  const handleToggleFollowFleet = (enabled: boolean) => {
    setFollowFleet(enabled);
    if (enabled) {
      handleCenterOnFleet();
    }
    toast({
      title: enabled ? "Fleet Auto-Tracking On" : "Fleet Auto-Tracking Off",
      description: enabled 
        ? "Map will automatically center on your fleet vehicles"
        : "Fleet auto-tracking disabled"
    });
  };

  const handleCenterOnFleet = () => {
    const bounds = calculateFleetBounds();
    const center = getFleetCenter();
    
    console.log('🎯 Centering on fleet:', { bounds, center, vehicleCount: fleetVehicles.length });
    
    toast({
      title: "Fleet Centered",
      description: `Map centered on ${fleetVehicles.length} fleet vehicles`,
    });
  };

  const handleFocusVehicle = (vehicleId: string) => {
    const vehicle = fleetVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      console.log('🚛 Focusing on vehicle:', vehicle.driverName);
      toast({
        title: "Vehicle Focused",
        description: `Centered on ${vehicle.driverName} (${vehicle.vehicleNumber})`,
      });
    }
  };

  // Check if overlay should be rendered (exists in filtered overlays and is visible)
  const shouldRenderOverlay = (overlayId: string) => {
    const overlay = overlays.find(o => o.id === overlayId);
    const shouldRender = overlay && overlay.visible;
    console.log(`🔍 shouldRenderOverlay(${overlayId}):`, { overlay, shouldRender });
    return shouldRender;
  };

  const getOverlayConfig = (overlayId: string) => {
    return overlays.find(o => o.id === overlayId) || overlays[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      
      {/* Fullscreen Map Container */}
      <div className="fixed inset-0 pt-16 pointer-events-none">
        <div className="pointer-events-auto w-full h-full">
          <FleetMap 
            userRole={currentRole} 
            fleetVehicles={fleetVehicles}
            selectedVehicle={selectedVehicle}
            onVehicleSelect={setSelectedVehicle}
            onCloseVehicleInfo={() => setSelectedVehicle(null)}
            showFleetBounds={showFleetBounds && isFleetMode}
            fleetBounds={calculateFleetBounds()}
            followFleet={followFleet}
            fleetCenter={getFleetCenter()}
          />
        </div>
        
        {/* Overlay Manager Controls */}
        <div className="pointer-events-none absolute inset-0" style={{ zIndex: 60 }}>
          <div className="pointer-events-auto">
            <OverlayManager
              overlays={overlays.map(overlay => ({
                ...overlay,
                draggable: isDraggableMode
              }))}
              onToggleOverlay={toggleOverlay}
              onToggleAll={toggleAllOverlays}
              onResetLayout={resetLayout}
              onResetPositions={resetPositions}
              allVisible={allOverlaysVisible}
              isFleetMode={isFleetMode}
              onToggleFleetMode={handleFleetModeToggle}
              isCustomizeMode={isCustomizeMode}
              onToggleCustomizeMode={(enabled) => setIsCustomizeMode(enabled)}
              isDraggableMode={isDraggableMode}
              onToggleDraggableMode={handleToggleDraggableMode}
              isPremium={isPremium}
            />
          </div>
        </div>

        {/* Emergency Jobs Overlay - Individual Mode Only */}
        {!isFleetMode && shouldRenderOverlay('emergency-jobs') && (
          <OverlayWrapper
            position="top-20 left-4"
            draggable={isDraggableMode}
            className="z-40"
          >
            <EmergencyJobsOverlay
              position=""
              visible={true}
              minimized={getOverlayConfig('emergency-jobs').minimized}
              draggable={isDraggableMode}
              onMinimize={() => toggleOverlay('emergency-jobs')}
              onToggleAudio={() => setAudioEnabled(!audioEnabled)}
              audioEnabled={audioEnabled}
              emergencyCount={emergencyCount}
              isFleetMode={isFleetMode}
            />
          </OverlayWrapper>
        )}

        {/* Location Analytics Overlay */}
        {!isFleetMode && shouldRenderOverlay('location-analytics') && (
          <OverlayWrapper
            position="top-96 left-4"
            draggable={isDraggableMode}
            className="z-40"
          >
            <LocationAnalyticsOverlay
              position=""
              visible={true}
              minimized={getOverlayConfig('location-analytics').minimized}
              draggable={isDraggableMode}
              onMinimize={() => toggleOverlay('location-analytics')}
              currentArea={currentArea}
              marketDemand={marketDemand}
              avgRate={avgRate}
              competition={competition}
              opportunityLevel={opportunityLevel}
              isFleetMode={isFleetMode}
            />
          </OverlayWrapper>
        )}

        {/* Route Management Overlay - Individual Mode Only */}
        {!isFleetMode && shouldRenderOverlay('route-management') && (
          <OverlayWrapper
            position="bottom-20 left-80"
            draggable={isDraggableMode}
            className="z-40"
          >
            <RouteManagementOverlay
              position=""
              visible={true}
              minimized={getOverlayConfig('route-management').minimized}
              draggable={isDraggableMode}
              onMinimize={() => toggleOverlay('route-management')}
              jobs={sampleJobs}
              totalTravelTime={totalTravelTime}
              nextJobCountdown={nextJobCountdown}
              isFleetMode={isFleetMode}
            />
          </OverlayWrapper>
        )}

        {/* Fleet Management Overlay - Fleet Mode Only */}
        {isFleetMode && shouldRenderOverlay('fleet-management') && (
          <OverlayWrapper
            position="top-20 left-4"
            draggable={isDraggableMode}
            className="z-40"
          >
            <FleetManagementOverlay
              position=""
              visible={true}
              minimized={getOverlayConfig('fleet-management').minimized}
              draggable={isDraggableMode}
              onMinimize={() => toggleOverlay('fleet-management')}
              isFleetMode={isFleetMode}
            />
          </OverlayWrapper>
        )}

        {/* Market Insights Overlay - Always Visible */}
        {shouldRenderOverlay('market-insights') && (
          <OverlayWrapper
            position="top-20 right-4"
            draggable={isDraggableMode}
            className="z-40"
          >
            <MarketInsightsOverlay
              position=""
              visible={true}
              minimized={getOverlayConfig('market-insights').minimized}
              draggable={isDraggableMode}
              onMinimize={() => toggleOverlay('market-insights')}
              showHeatZones={false}
              showProviders={showProviders}
              showTrafficAreas={showTrafficAreas}
              onToggleHeatZones={() => {}}
              onToggleProviders={setShowProviders}
              onToggleTrafficAreas={setShowTrafficAreas}
              isFleetMode={isFleetMode}
            />
          </OverlayWrapper>
        )}

        {/* Fleet Vehicles View Overlay - Fleet Mode Only */}
        {isFleetMode && shouldRenderOverlay('fleet-vehicles-view') && (
          <OverlayWrapper
            position="bottom-20 left-1/2 -translate-x-1/2"
            draggable={isDraggableMode}
            className="z-40"
          >
            <FleetVehiclesViewOverlay
              position=""
              visible={true}
              minimized={getOverlayConfig('fleet-vehicles-view').minimized}
              draggable={isDraggableMode}
              onMinimize={() => toggleOverlay('fleet-vehicles-view')}
              fleetVehicles={fleetVehicles}
              followFleet={followFleet}
              onToggleFollowFleet={handleToggleFollowFleet}
              onCenterOnFleet={handleCenterOnFleet}
              onFocusVehicle={handleFocusVehicle}
            />
          </OverlayWrapper>
        )}

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
