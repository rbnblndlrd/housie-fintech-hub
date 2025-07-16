import { useState, useEffect, useMemo } from 'react';
import { UX_MODES, UXModeState, JobType } from '@/types/uxModes';

interface Job {
  id: string;
  service_id?: string;
  service_subcategory?: string;
  category?: string;
  service_type?: string;
}

export function useUXMode(jobs: Job[]) {
  const [uxModeState, setUXModeState] = useState<UXModeState>({
    currentMode: 'auto',
    isAutoDetected: true,
    availableModes: Object.keys(UX_MODES),
    sessionPersisted: false
  });

  // Auto-detection logic
  const detectedMode = useMemo(() => {
    if (!jobs || jobs.length === 0) return 'route-hero'; // Default fallback

    // Extract job types from various possible fields
    const jobTypes = jobs.map(job => {
      return job.service_subcategory || 
             job.category || 
             job.service_type || 
             job.service_id || 
             'general';
    }).map(type => type.toLowerCase());

    console.log('🎯 Detected job types:', jobTypes);

    // Find the first UX mode that matches all job types
    const matchingMode = Object.entries(UX_MODES).find(([modeId, mode]) => {
      const isMatch = jobTypes.every(jobType => 
        mode.applicableTo.some(applicable => 
          jobType.includes(applicable) || applicable.includes(jobType)
        )
      );
      return isMatch;
    });

    const detected = matchingMode?.[0] || 'route-hero';
    console.log('🎯 Auto-detected UX mode:', detected);
    return detected;
  }, [jobs]);

  // Load persisted mode from sessionStorage
  useEffect(() => {
    const persistedMode = sessionStorage.getItem('housie-ux-mode');
    if (persistedMode && persistedMode !== 'auto') {
      setUXModeState(prev => ({
        ...prev,
        currentMode: persistedMode,
        isAutoDetected: false,
        sessionPersisted: true
      }));
    }
  }, []);

  // Save mode to sessionStorage when changed
  const setUXMode = (mode: string, saveForJobType: boolean = false) => {
    setUXModeState(prev => ({
      ...prev,
      currentMode: mode,
      isAutoDetected: mode === 'auto',
      sessionPersisted: mode !== 'auto'
    }));

    if (mode === 'auto') {
      sessionStorage.removeItem('housie-ux-mode');
    } else {
      sessionStorage.setItem('housie-ux-mode', mode);
      
      // Optional: Save preference for specific job types
      if (saveForJobType && jobs.length > 0) {
        const jobTypes = jobs.map(job => 
          job.service_subcategory || job.category || 'general'
        );
        const preferences = JSON.parse(
          localStorage.getItem('housie-ux-mode-preferences') || '{}'
        );
        
        jobTypes.forEach(type => {
          preferences[type] = mode;
        });
        
        localStorage.setItem('housie-ux-mode-preferences', JSON.stringify(preferences));
      }
    }
  };

  // Resolve the actual mode to use
  const resolvedMode = uxModeState.currentMode === 'auto' ? detectedMode : uxModeState.currentMode;
  const currentModeDefinition = UX_MODES[resolvedMode] || UX_MODES['route-hero'];

  return {
    currentMode: resolvedMode,
    currentModeDefinition,
    uxModeState,
    setUXMode,
    availableModes: Object.keys(UX_MODES),
    isAutoDetected: uxModeState.isAutoDetected,
    detectedMode
  };
}