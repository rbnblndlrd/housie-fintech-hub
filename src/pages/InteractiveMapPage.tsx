
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import Header from '@/components/Header';
import FleetMap from '@/components/FleetMap';
import { useToast } from '@/hooks/use-toast';
import { useOverlayManager } from '@/hooks/useOverlayManager';
import { useFleetVehicles, FleetVehicle } from '@/hooks/useFleetVehicles';
import { ChatBubble } from '@/components/chat/ChatBubble';

// Overlay Components
import OverlayManager from '@/components/map/OverlayManager';
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
    isPremium,
    allOverlaysVisible,
    setIsFleetMode,
    setIsCustomizeMode,
    toggleOverlay,
    toggleAllOverlays,
    saveLayout,
    resetLayout
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

  console.log('🗺️ InteractiveMapPage render:', { user: !!user, currentRole, isFleetMode, overlaysCount: overlays.length });

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
    return overlay && overlay.visible;
  };

  // Organized positioning system with proper spacing and collision detection
  const getOverlayPosition = (overlayId: string): string => {
    const overlay = overlays.find(o => o.id === overlayId);
    if (!overlay) return 'top-20 right-4';
    
    const baseSpacing = 20; // 20px from edges
    const gapSpacing = 16; // 16px gaps between overlays
    
    switch (overlay.position) {
      case 'top-left':
        return `top-[${baseSpacing + 64}px] left-[${baseSpacing}px]`; // 64px for header height
      case 'top-right':
        return `top-[${baseSpacing + 64}px] right-[${baseSpacing}px]`;
      case 'bottom-left':
        return `bottom-[${baseSpacing}px] left-[${baseSpacing}px]`;
      case 'bottom-right':
        // Stack bottom-right overlays with proper spacing
        const bottomRightOverlays = overlays.filter(o => 
          o.position === 'bottom-right' && o.visible && shouldRenderOverlay(o.id)
        );
        const overlayIndex = bottomRightOverlays.findIndex(o => o.id === overlayId);
        const stackOffset = overlayIndex * (300 + gapSpacing); // 300px height + gap
        return `bottom-[${baseSpacing + stackOffset}px] right-[${baseSpacing}px]`;
      case 'bottom-center':
        return `bottom-[${baseSpacing}px] left-1/2 -translate-x-1/2`;
      default:
        return `top-[${baseSpacing + 64}px] right-[${baseSpacing}px]`;
    }
  };

  const getOverlayConfig = (overlayId: string) => {
    return overlays.find(o => o.id === overlayId) || overlays[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      
      {/* Fullscreen Map Container */}
      <div className="fixed inset-0 pt-16">
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
        
        <OverlayManager
          overlays={overlays.map(overlay => ({
            ...overlay,
            draggable: false // Disable dragging for organized layout
          }))}
          onToggleOverlay={toggleOverlay}
          onToggleAll={toggleAllOverlays}
          allVisible={allOverlaysVisible}
          isFleetMode={isFleetMode}
          onToggleFleetMode={handleFleetModeToggle}
          isCustomizeMode={isCustomizeMode}
          onToggleCustomizeMode={(enabled) => setIsCustomizeMode(enabled)}
          isPremium={isPremium}
        />

        {/* LEFT SIDE OVERLAYS */}
        
        {/* Emergency Jobs Overlay - TOP-LEFT (Individual Mode Only, Hideable) */}
        {!isFleetMode && shouldRenderOverlay('emergency-jobs') && (
          <div className={getOverlayPosition('emergency-jobs')}>
            <EmergencyJobsOverlay
              position=""
              visible={true}
              minimized={getOverlayConfig('emergency-jobs').minimized}
              draggable={false}
              onMinimize={() => toggleOverlay('emergency-jobs')}
              onToggleAudio={() => setAudioEnabled(!audioEnabled)}
              audioEnabled={audioEnabled}
              emergencyCount={emergencyCount}
              isFleetMode={isFleetMode}
            />
          </div>
        )}

        {/* Route Management Overlay - BOTTOM-LEFT (Individual Mode Only) */}
        {!isFleetMode && shouldRenderOverlay('route-management') && (
          <div className={getOverlayPosition('route-management')}>
            <RouteManagementOverlay
              position=""
              visible={true}
              minimized={getOverlayConfig('route-management').minimized}
              draggable={false}
              onMinimize={() => toggleOverlay('route-management')}
              jobs={sampleJobs}
              totalTravelTime={totalTravelTime}
              nextJobCountdown={nextJobCountdown}
              isFleetMode={isFleetMode}
            />
          </div>
        )}

        {/* Fleet Management Overlay - TOP-LEFT (Fleet Mode Only) */}
        {isFleetMode && shouldRenderOverlay('fleet-management') && (
          <div className={getOverlayPosition('fleet-management')}>
            <FleetManagementOverlay
              position=""
              visible={true}
              minimized={getOverlayConfig('fleet-management').minimized}
              draggable={false}
              onMinimize={() => toggleOverlay('fleet-management')}
              isFleetMode={isFleetMode}
            />
          </div>
        )}

        {/* RIGHT SIDE OVERLAYS - Organized Stack */}
        
        {/* Market Insights Overlay - TOP-RIGHT */}
        {shouldRenderOverlay('market-insights') && (
          <div className={getOverlayPosition('market-insights')}>
            <MarketInsightsOverlay
              position=""
              visible={true}
              minimized={getOverlayConfig('market-insights').minimized}
              draggable={false}
              onMinimize={() => toggleOverlay('market-insights')}
              showHeatZones={false}
              showProviders={showProviders}
              showTrafficAreas={showTrafficAreas}
              onToggleHeatZones={() => {}}
              onToggleProviders={setShowProviders}
              onToggleTrafficAreas={setShowTrafficAreas}
              isFleetMode={isFleetMode}
            />
          </div>
        )}

        {/* Location Analytics Overlay - BOTTOM-RIGHT (Individual Mode Only) */}
        {!isFleetMode && shouldRenderOverlay('location-analytics') && (
          <div className={getOverlayPosition('location-analytics')}>
            <LocationAnalyticsOverlay
              position=""
              visible={true}
              minimized={getOverlayConfig('location-analytics').minimized}
              draggable={false}
              onMinimize={() => toggleOverlay('location-analytics')}
              currentArea={currentArea}
              marketDemand={marketDemand}
              avgRate={avgRate}
              competition={competition}
              opportunityLevel={opportunityLevel}
              isFleetMode={isFleetMode}
            />
          </div>
        )}

        {/* BOTTOM CENTER OVERLAYS */}
        
        {/* Fleet Vehicles View Overlay - BOTTOM-CENTER (Fleet Mode Only) */}
        {isFleetMode && shouldRenderOverlay('fleet-vehicles-view') && (
          <div className={getOverlayPosition('fleet-vehicles-view')}>
            <FleetVehiclesViewOverlay
              position=""
              visible={true}
              minimized={getOverlayConfig('fleet-vehicles-view').minimized}
              draggable={false}
              onMinimize={() => toggleOverlay('fleet-vehicles-view')}
              fleetVehicles={fleetVehicles}
              followFleet={followFleet}
              onToggleFollowFleet={handleToggleFollowFleet}
              onCenterOnFleet={handleCenterOnFleet}
              onFocusVehicle={handleFocusVehicle}
            />
          </div>
        )}

        {/* Chat Bubble with integrated AI Voice Assistant */}
        <ChatBubble />
      </div>
    </div>
  );
};

export default InteractiveMapPage;
