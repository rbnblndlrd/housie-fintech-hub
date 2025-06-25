
import { useState } from 'react';

export type OverlayPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-left' | 'center-right' | 'bottom-center';

export interface OverlayConfig {
  id: string;
  title: string;
  position: OverlayPosition;
  visible: boolean;
  minimized: boolean;
  fleetOnly?: boolean; // New property to mark fleet-only overlays
}

export const useOverlayManager = () => {
  const [overlays, setOverlays] = useState<OverlayConfig[]>([
    {
      id: 'emergency-jobs',
      title: 'Emergency Jobs',
      position: 'top-left',
      visible: true,
      minimized: false,
      fleetOnly: false
    },
    {
      id: 'market-insights',
      title: 'Market Insights',
      position: 'top-right',
      visible: true,
      minimized: false,
      fleetOnly: false
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      position: 'bottom-left',
      visible: true,
      minimized: false,
      fleetOnly: false
    },
    {
      id: 'location-analytics',
      title: 'Location Analytics',
      position: 'bottom-right',
      visible: true,
      minimized: false,
      fleetOnly: false
    },
    {
      id: 'route-management',
      title: 'Route Management',
      position: 'center-left',
      visible: true,
      minimized: false,
      fleetOnly: false
    },
    {
      id: 'fleet-management',
      title: 'Team Management',
      position: 'center-right',
      visible: true,
      minimized: false,
      fleetOnly: true // Fleet-only overlay
    },
    {
      id: 'fleet-vehicles-view',
      title: 'Fleet Vehicles View',
      position: 'bottom-center',
      visible: true,
      minimized: false,
      fleetOnly: true // Fleet-only overlay
    }
  ]);

  const [isFleetMode, setIsFleetMode] = useState(false);
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const [isPremium] = useState(true); // Mock premium status

  // Filter overlays based on fleet mode
  const getVisibleOverlays = () => {
    return overlays.filter(overlay => {
      if (overlay.fleetOnly && !isFleetMode) {
        return false; // Hide fleet-only overlays in individual mode
      }
      return true;
    });
  };

  const toggleOverlay = (overlayId: string) => {
    setOverlays(prev => prev.map(overlay => 
      overlay.id === overlayId 
        ? { ...overlay, minimized: !overlay.minimized }
        : overlay
    ));
  };

  const visibleOverlays = getVisibleOverlays();
  const allOverlaysVisible = visibleOverlays.every(overlay => overlay.visible);

  const toggleAllOverlays = () => {
    const newVisibility = !allOverlaysVisible;
    setOverlays(prev => prev.map(overlay => ({
      ...overlay,
      visible: newVisibility
    })));
  };

  const saveLayout = () => {
    localStorage.setItem('overlay-layout', JSON.stringify(overlays));
    console.log('💾 Overlay layout saved');
  };

  const resetLayout = () => {
    // Reset to default positions
    setOverlays(prev => prev.map(overlay => ({
      ...overlay,
      visible: true,
      minimized: false
    })));
    localStorage.removeItem('overlay-layout');
    console.log('🔄 Overlay layout reset');
  };

  return {
    overlays: visibleOverlays, // Return filtered overlays
    allOverlays: overlays, // All overlays for internal use
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
  };
};
