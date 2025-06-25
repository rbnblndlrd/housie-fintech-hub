
import { useState } from 'react';

export type OverlayPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-left' | 'center-right' | 'bottom-center';

export interface OverlayConfig {
  id: string;
  title: string;
  position: OverlayPosition;
  visible: boolean;
  minimized: boolean;
  hideable?: boolean; // New property for hideable overlays
  fleetOnly?: boolean;
  individualOnly?: boolean;
}

export const useOverlayManager = () => {
  const [overlays, setOverlays] = useState<OverlayConfig[]>([
    {
      id: 'emergency-jobs',
      title: 'Emergency Jobs',
      position: 'top-left',
      visible: true,
      minimized: false,
      hideable: true, // Emergency jobs can be hidden/shown
      fleetOnly: false
    },
    {
      id: 'market-insights',
      title: 'Market Insights',
      position: 'top-right',
      visible: true,
      minimized: false,
      hideable: false, // Always visible
      fleetOnly: false
    },
    {
      id: 'location-analytics',
      title: 'Location Analytics',
      position: 'bottom-right',
      visible: true,
      minimized: false,
      hideable: false, // Always visible
      fleetOnly: false,
      individualOnly: true
    },
    {
      id: 'route-management',
      title: 'Route Management',
      position: 'bottom-left',
      visible: true,
      minimized: false,
      hideable: false, // Always visible
      fleetOnly: false,
      individualOnly: true
    },
    {
      id: 'fleet-management',
      title: 'Team Management',
      position: 'top-left', // Takes emergency jobs position in fleet mode
      visible: true,
      minimized: false,
      hideable: false, // Always visible in fleet mode
      fleetOnly: true
    },
    {
      id: 'fleet-vehicles-view',
      title: 'Fleet Vehicles View',
      position: 'bottom-center',
      visible: true,
      minimized: false,
      hideable: false, // Always visible in fleet mode
      fleetOnly: true
    }
  ]);

  const [isFleetMode, setIsFleetMode] = useState(false);
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const [isPremium] = useState(true);

  // Filter overlays based on fleet mode
  const getVisibleOverlays = () => {
    return overlays.filter(overlay => {
      if (overlay.fleetOnly && !isFleetMode) {
        return false;
      }
      if (overlay.individualOnly && isFleetMode) {
        return false;
      }
      return true;
    });
  };

  const toggleOverlay = (overlayId: string) => {
    console.log('🎛️ Toggling overlay:', overlayId);
    setOverlays(prev => prev.map(overlay => {
      if (overlay.id === overlayId) {
        const newState = { ...overlay };
        // For hideable overlays, toggle visibility instead of minimized
        if (overlay.hideable) {
          newState.visible = !overlay.visible;
          console.log(`📦 ${overlayId} visibility changed to:`, newState.visible);
        } else {
          newState.minimized = !overlay.minimized;
          console.log(`📦 ${overlayId} minimized changed to:`, newState.minimized);
        }
        return newState;
      }
      return overlay;
    }));
  };

  const visibleOverlays = getVisibleOverlays();
  const allOverlaysVisible = visibleOverlays.every(overlay => overlay.visible);

  const toggleAllOverlays = () => {
    const newVisibility = !allOverlaysVisible;
    console.log('🎛️ Toggling all overlays to:', newVisibility);
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
    console.log('🔄 Resetting overlay layout to defaults');
    setOverlays(prev => prev.map(overlay => ({
      ...overlay,
      visible: true,
      minimized: false
    })));
    localStorage.removeItem('overlay-layout');
    console.log('✅ All overlays restored to visible state');
  };

  return {
    overlays: visibleOverlays,
    allOverlays: overlays,
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
