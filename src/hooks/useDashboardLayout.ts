import { useState, useEffect } from 'react';

interface WidgetConfig {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isLocked: boolean;
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: 'performance',
    position: { x: 20, y: 100 },
    size: { width: 250, height: 200 },
    isLocked: false
  },
  {
    id: 'earnings',
    position: { x: 290, y: 100 },
    size: { width: 250, height: 200 },
    isLocked: false
  },
  {
    id: 'rating',
    position: { x: 560, y: 100 },
    size: { width: 250, height: 200 },
    isLocked: false
  },
  {
    id: 'active-jobs',
    position: { x: 830, y: 100 },
    size: { width: 250, height: 200 },
    isLocked: false
  },
  {
    id: 'recent-activity',
    position: { x: 20, y: 320 },
    size: { width: 800, height: 300 },
    isLocked: false
  },
  {
    id: 'route-optimizer',
    position: { x: 840, y: 320 },
    size: { width: 500, height: 400 },
    isLocked: false
  },
  {
    id: 'pending-jobs',
    position: { x: 20, y: 640 },
    size: { width: 600, height: 350 },
    isLocked: false
  },
  {
    id: 'floating-calendar',
    position: { x: window.innerWidth - 450, y: 50 },
    size: { width: 400, height: 320 },
    isLocked: false
  },
  {
    id: 'dashboard-title',
    position: { x: Math.max(0, window.innerWidth/2 - 200), y: 200 },
    size: { width: 400, height: 80 },
    isLocked: false
  },
  {
    id: 'welcome-text',
    position: { x: Math.max(0, window.innerWidth/2 - 250), y: 290 },
    size: { width: 500, height: 60 },
    isLocked: false
  },
  {
    id: 'tabs-navigation',
    position: { x: 188, y: 560 },
    size: { width: 600, height: 80 },
    isLocked: false
  }
];

export const useDashboardLayout = () => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(DEFAULT_WIDGETS);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load saved layout from localStorage
  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboard-layout');
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        setWidgets(parsedLayout);
      } catch (error) {
        console.error('Failed to load dashboard layout:', error);
      }
    }
  }, []);

  // Save layout to localStorage whenever widgets change
  useEffect(() => {
    localStorage.setItem('dashboard-layout', JSON.stringify(widgets));
  }, [widgets]);

  const updateWidgetPosition = (id: string, position: { x: number; y: number }) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, position } : widget
    ));
  };

  const updateWidgetSize = (id: string, size: { width: number; height: number }) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, size } : widget
    ));
  };

  const toggleWidgetLock = (id: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, isLocked: !widget.isLocked } : widget
    ));
  };

  const lockAllWidgets = () => {
    setWidgets(prev => prev.map(widget => ({ ...widget, isLocked: true })));
    setIsEditMode(false);
  };

  const unlockAllWidgets = () => {
    setWidgets(prev => prev.map(widget => ({ ...widget, isLocked: false })));
    setIsEditMode(true);
  };

  const resetLayout = () => {
    setWidgets(DEFAULT_WIDGETS);
    localStorage.removeItem('dashboard-layout');
  };

  const getWidgetConfig = (id: string) => {
    return widgets.find(widget => widget.id === id) || DEFAULT_WIDGETS.find(w => w.id === id)!;
  };

  return {
    widgets,
    isEditMode,
    setIsEditMode,
    updateWidgetPosition,
    updateWidgetSize,
    toggleWidgetLock,
    lockAllWidgets,
    unlockAllWidgets,
    resetLayout,
    getWidgetConfig
  };
};