
import { useState, useEffect } from 'react';

export type UIMode = 'normal' | 'borderless' | 'transparent';

export const useUIMode = () => {
  const [uiMode, setUIMode] = useState<UIMode>('normal');

  // Load saved UI mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('housie-ui-mode') as UIMode;
    if (savedMode && ['normal', 'borderless', 'transparent'].includes(savedMode)) {
      setUIMode(savedMode);
    }
  }, []);

  // Save UI mode changes
  const changeUIMode = () => {
    const modes: UIMode[] = ['normal', 'borderless', 'transparent'];
    const currentIndex = modes.indexOf(uiMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    
    setUIMode(nextMode);
    localStorage.setItem('housie-ui-mode', nextMode);
  };

  // Get CSS classes based on current UI mode
  const getOverlayClasses = () => {
    switch (uiMode) {
      case 'borderless':
        return 'border-0 bg-cream/95';
      case 'transparent':
        return 'border-0 bg-cream/30';
      default:
        return 'border-3 border-black bg-cream/95';
    }
  };

  // Get button text for UI mode toggle
  const getUIModeButtonText = () => {
    switch (uiMode) {
      case 'normal':
        return 'Minimal Mode';
      case 'borderless':
        return 'Borderless';
      case 'transparent':
        return 'Transparent';
      default:
        return 'Normal';
    }
  };

  return {
    uiMode,
    changeUIMode,
    getOverlayClasses,
    getUIModeButtonText
  };
};
