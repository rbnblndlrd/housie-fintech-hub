// Hook for CBS Engine integration

import { useEffect, useState } from 'react';
import { cbsEngine } from '@/lib/cbs/engine';
import { CBSEvent } from '@/lib/cbs/types';

export const useCBSEngine = (options: {
  autoInitialize?: boolean;
  userId?: string;
  eventTypes?: string[];
} = {}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [recentEvents, setRecentEvents] = useState<CBSEvent[]>([]);
  const [eventStats, setEventStats] = useState({
    totalEvents: 0,
    verifiedEvents: 0,
    eventsByType: {} as Record<string, number>,
    recentEvents: [] as CBSEvent[]
  });

  // Initialize CBS Engine
  useEffect(() => {
    if (options.autoInitialize !== false) {
      initializeCBS();
    }

    return () => {
      cbsEngine.cleanup();
    };
  }, [options.autoInitialize]);

  // Load initial events and stats
  useEffect(() => {
    if (isInitialized) {
      loadRecentEvents();
      loadEventStats();
    }
  }, [isInitialized, options.userId, options.eventTypes]);

  const initializeCBS = async () => {
    try {
      await cbsEngine.initialize();
      setIsInitialized(true);
      console.log('✅ CBS Engine initialized via hook');
    } catch (error) {
      console.error('❌ Failed to initialize CBS Engine:', error);
    }
  };

  const loadRecentEvents = async () => {
    try {
      const events = await cbsEngine.getCanonEvents({
        userId: options.userId,
        eventTypes: options.eventTypes,
        limit: 20,
        verifiedOnly: true
      });
      setRecentEvents(events);
    } catch (error) {
      console.error('Error loading recent CBS events:', error);
    }
  };

  const loadEventStats = async () => {
    try {
      const stats = await cbsEngine.getEventStats(options.userId);
      setEventStats(stats);
    } catch (error) {
      console.error('Error loading CBS event stats:', error);
    }
  };

  const broadcastEvent = async (event: Parameters<typeof cbsEngine.broadcastCanonEvent>[0]) => {
    try {
      const result = await cbsEngine.broadcastCanonEvent(event);
      if (result) {
        // Refresh events after broadcasting
        await loadRecentEvents();
        await loadEventStats();
      }
      return result;
    } catch (error) {
      console.error('Error broadcasting CBS event:', error);
      return null;
    }
  };

  return {
    isInitialized,
    recentEvents,
    eventStats,
    broadcastEvent,
    loadRecentEvents,
    loadEventStats,
    initialize: initializeCBS
  };
};