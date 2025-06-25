
import { useState, useEffect } from 'react';
import type { OverlayPosition } from '@/components/map/OverlayManager';

export interface OverlayConfig {
  id: string;
  title: string;
  position: OverlayPosition;
  visible: boolean;
  minimized: boolean;
  draggable: boolean;
}

const defaultOverlays: OverlayConfig[] = [
  {
    id: 'emergency-jobs',
    title: 'Emergency Jobs',
    position: 'top-right',
    visible: true,
    minimized: false,
    draggable: false
  },
  {
    id: 'market-insights',
    title: 'Market Insights',
    position: 'center-right',
    visible: true,
    minimized: false,
    draggable: false
  },
  {
    id: 'ai-assistant',
    title: 'AI Voice Assistant',
    position: 'bottom-right',
    visible: true,
    minimized: false,
    draggable: false
  },
  {
    id: 'location-analytics',
    title: 'Location Analytics',
    position: 'bottom-left',
    visible: true,
    minimized: false,
    draggable: false
  },
  {
    id: 'route-management',
    title: 'Route Management',
    position: 'bottom-center',
    visible: true,
    minimized: false,
    draggable: false
  },
  {
    id: 'fleet-management',
    title: 'Fleet Management',
    position: 'center-left',
    visible: true,
    minimized: false,
    draggable: false
  }
];

export const useOverlayManager = () => {
  const [overlays, setOverlays] = useState<OverlayConfig[]>(defaultOverlays);
  const [isFleetMode, setIsFleetMode] = useState(false);
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const [isPremium] = useState(true); // TODO: Connect to actual subscription status

  // Load saved layout from localStorage
  useEffect(() => {
    const savedLayout = localStorage.getItem('housie-overlay-layout');
    if (savedLayout) {
      try {
        const parsed = JSON.parse(savedLayout);
        setOverlays(parsed);
      } catch (error) {
        console.error('Failed to load saved layout:', error);
      }
    }
  }, []);

  // Save layout changes
  const saveLayout = () => {
    localStorage.setItem('housie-overlay-layout', JSON.stringify(overlays));
  };

  // Toggle individual overlay visibility
  const toggleOverlay = (id: string) => {
    setOverlays(prev => prev.map(overlay => 
      overlay.id === id 
        ? { ...overlay, minimized: overlay.visible && !overlay.minimized ? true : false, visible: !overlay.minimized }
        : overlay
    ));
  };

  // Toggle all overlays
  const toggleAllOverlays = () => {
    const allVisible = overlays.every(o => o.visible);
    setOverlays(prev => prev.map(overlay => ({
      ...overlay,
      visible: !allVisible,
      minimized: false
    })));
  };

  // Update overlay position
  const updateOverlayPosition = (id: string, position: OverlayPosition) => {
    setOverlays(prev => prev.map(overlay =>
      overlay.id === id ? { ...overlay, position } : overlay
    ));
  };

  // Reset to default layout
  const resetLayout = () => {
    setOverlays(defaultOverlays);
    localStorage.removeItem('housie-overlay-layout');
  };

  // Check if all overlays are visible
  const allOverlaysVisible = overlays.every(overlay => overlay.visible);

  return {
    overlays,
    isFleetMode,
    isCustomizeMode,
    isPremium,
    allOverlaysVisible,
    setIsFleetMode,
    setIsCustomizeMode,
    toggleOverlay,
    toggleAllOverlays,
    updateOverlayPosition,
    saveLayout,
    resetLayout
  };
};
