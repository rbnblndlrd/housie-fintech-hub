
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import Header from '@/components/Header';
import HeatZoneMap from '@/components/HeatZoneMap';
import { useToast } from '@/hooks/use-toast';
import { useOverlayManager } from '@/hooks/useOverlayManager';
import { useFleetVehicles, FleetVehicle } from '@/hooks/useFleetVehicles';

// Overlay Components
import OverlayManager from '@/components/map/OverlayManager';
import EmergencyJobsOverlay from '@/components/map/overlays/EmergencyJobsOverlay';
import MarketInsightsOverlay from '@/components/map/overlays/MarketInsightsOverlay';
import AIVoiceAssistantOverlay from '@/components/map/overlays/AIVoiceAssistantOverlay';
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
  const [showHeatZones, setShowHeatZones] = useState(true);
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
    
    // This would trigger map centering in a real implementation
    // For now, we'll show a toast
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

  const getOverlayPosition = (overlayId: string): string => {
    const overlay = overlays.find(o => o.id === overlayId);
    const position = overlay?.position || 'top-right';
    
    // Convert position to CSS classes
    switch (position) {
      case 'top-left': return 'top-20 left-4';
      case 'top-right': return 'top-20 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'center-left': return 'top-1/2 left-4 -translate-y-1/2';
      case 'center-right': return 'top-1/2 right-4 -translate-y-1/2';
      case 'bottom-center': return 'bottom-4 left-1/2 -translate-x-1/2';
      default: return 'top-20 right-4';
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
        <HeatZoneMap 
          userRole={currentRole} 
          showHeatZones={showHeatZones}
          fleetVehicles={fleetVehicles}
          selectedVehicle={selectedVehicle}
          onVehicleSelect={setSelectedVehicle}
          onCloseVehicleInfo={() => setSelectedVehicle(null)}
          showFleetBounds={showFleetBounds && isFleetMode}
          fleetBounds={calculateFleetBounds()}
          followFleet={followFleet}
          fleetCenter={getFleetCenter()}
        />
        
        {/* Overlay Manager Controls */}
        <OverlayManager
          overlays={overlays.map(overlay => ({
            ...overlay,
            draggable: isCustomizeMode && isPremium
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

        {/* Emergency Jobs Overlay */}
        <EmergencyJobsOverlay
          position={getOverlayPosition('emergency-jobs')}
          visible={getOverlayConfig('emergency-jobs').visible}
          minimized={getOverlayConfig('emergency-jobs').minimized}
          draggable={isCustomizeMode && isPremium}
          onMinimize={() => toggleOverlay('emergency-jobs')}
          onToggleAudio={() => setAudioEnabled(!audioEnabled)}
          audioEnabled={audioEnabled}
          emergencyCount={emergencyCount}
          isFleetMode={isFleetMode}
        />

        {/* Market Insights Overlay */}
        <MarketInsightsOverlay
          position={getOverlayPosition('market-insights')}
          visible={getOverlayConfig('market-insights').visible}
          minimized={getOverlayConfig('market-insights').minimized}
          draggable={isCustomizeMode && isPremium}
          onMinimize={() => toggleOverlay('market-insights')}
          showHeatZones={showHeatZones}
          showProviders={showProviders}
          showTrafficAreas={showTrafficAreas}
          onToggleHeatZones={setShowHeatZones}
          onToggleProviders={setShowProviders}
          onToggleTrafficAreas={setShowTrafficAreas}
          isFleetMode={isFleetMode}
        />

        {/* AI Voice Assistant Overlay */}
        <AIVoiceAssistantOverlay
          position={getOverlayPosition('ai-assistant')}
          visible={getOverlayConfig('ai-assistant').visible}
          minimized={getOverlayConfig('ai-assistant').minimized}
          draggable={isCustomizeMode && isPremium}
          onMinimize={() => toggleOverlay('ai-assistant')}
          isFleetMode={isFleetMode}
        />

        {/* Location Analytics Overlay */}
        <LocationAnalyticsOverlay
          position={getOverlayPosition('location-analytics')}
          visible={getOverlayConfig('location-analytics').visible}
          minimized={getOverlayConfig('location-analytics').minimized}
          draggable={isCustomizeMode && isPremium}
          onMinimize={() => toggleOverlay('location-analytics')}
          currentArea={currentArea}
          marketDemand={marketDemand}
          avgRate={avgRate}
          competition={competition}
          opportunityLevel={opportunityLevel}
          isFleetMode={isFleetMode}
        />

        {/* Route Management Overlay */}
        <RouteManagementOverlay
          position={getOverlayPosition('route-management')}
          visible={getOverlayConfig('route-management').visible}
          minimized={getOverlayConfig('route-management').minimized}
          draggable={isCustomizeMode && isPremium}
          onMinimize={() => toggleOverlay('route-management')}
          jobs={sampleJobs}
          totalTravelTime={totalTravelTime}
          nextJobCountdown={nextJobCountdown}
          isFleetMode={isFleetMode}
        />

        {/* Fleet Management Overlay */}
        <FleetManagementOverlay
          position={getOverlayPosition('fleet-management')}
          visible={getOverlayConfig('fleet-management').visible}
          minimized={getOverlayConfig('fleet-management').minimized}
          draggable={isCustomizeMode && isPremium}
          onMinimize={() => toggleOverlay('fleet-management')}
          isFleetMode={isFleetMode}
        />

        {/* Fleet Vehicles View Overlay - NEW */}
        <FleetVehiclesViewOverlay
          position={getOverlayPosition('fleet-vehicles-view')}
          visible={getOverlayConfig('fleet-vehicles-view')?.visible || isFleetMode}
          minimized={getOverlayConfig('fleet-vehicles-view')?.minimized || false}
          draggable={isCustomizeMode && isPremium}
          onMinimize={() => toggleOverlay('fleet-vehicles-view')}
          fleetVehicles={fleetVehicles}
          followFleet={followFleet}
          onToggleFollowFleet={handleToggleFollowFleet}
          onCenterOnFleet={handleCenterOnFleet}
          onFocusVehicle={handleFocusVehicle}
        />
      </div>
    </div>
  );
};

export default InteractiveMapPage;
