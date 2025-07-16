import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type ServiceLayoutType = 'cleaning' | 'tattoo' | 'home_services' | 'petcare' | 'default';

interface ServiceLayoutDefinition {
  id: ServiceLayoutType;
  name: string;
  annetteVoiceLine: string;
  dashboardWidgets: string[];
  bookingsFeatures: string[];
}

export const SERVICE_LAYOUTS: Record<ServiceLayoutType, ServiceLayoutDefinition> = {
  cleaning: {
    id: 'cleaning',
    name: 'Cleaner Dashboard',
    annetteVoiceLine: "Layout updated for a cleaner's flow. Let's scrub this day to perfection, sugar.",
    dashboardWidgets: ['active_tickets', 'todays_route', 'earnings_tracker', 'route_optimization'],
    bookingsFeatures: ['incoming_jobs_table', 'mini_calendar', 'accept_decline_widget', 'suggested_rebook']
  },
  tattoo: {
    id: 'tattoo',
    name: 'Tattoo Artist Studio',
    annetteVoiceLine: "Tattoo mode active. Let's ink your legacy — one appointment at a time.",
    dashboardWidgets: ['upcoming_appointments', 'client_profiles', 'portfolio_builder', 'session_prep_notes'],
    bookingsFeatures: ['visual_calendar', 'prep_sheets', 'rebooking_reminders', 'recent_reviews']
  },
  home_services: {
    id: 'home_services',
    name: 'Home Services Pro',
    annetteVoiceLine: "Circuit integrity > ego integrity. Safety protocols active.",
    dashboardWidgets: ['diagnostic_checklist', 'safety_guidelines', 'booking_table', 'route_map'],
    bookingsFeatures: ['booking_table', 'calendar_toggle', 'diagnostic_prefill', 'safety_reminders']
  },
  petcare: {
    id: 'petcare',
    name: 'Pet Care Specialist',
    annetteVoiceLine: "Rebook before that puppy pees on Yelp. Tail-wagging efficiency mode activated!",
    dashboardWidgets: ['walks_timeline', 'pet_profiles', 'rebooking_reminders', 'route_preview'],
    bookingsFeatures: ['pet_cards', 'walk_schedule', 'rebooking_alerts', 'travel_map']
  },
  default: {
    id: 'default',
    name: 'Default Layout',
    annetteVoiceLine: "Standard mode active. Ready to tackle whatever comes your way!",
    dashboardWidgets: ['general_overview', 'job_hub', 'performance_widgets', 'notifications'],
    bookingsFeatures: ['booking_list', 'calendar_preview', 'status_cards', 'job_parser']
  }
};

export function useServiceLayout(jobs: any[] = []) {
  const { user } = useAuth();
  const [manualOverride, setManualOverride] = useState<ServiceLayoutType | null>(null);

  // Auto-detect layout based on service_id or job types
  const detectedLayout = useMemo((): ServiceLayoutType => {
    if (!jobs || jobs.length === 0) return 'default';

    // Extract service types from jobs
    const serviceTypes = jobs.map(job => {
      const serviceType = job.service_id || job.service_subcategory || job.category || job.title || '';
      return serviceType.toLowerCase();
    });

    console.log('🎯 Detected service types:', serviceTypes);

    // Check for cleaning services
    if (serviceTypes.some(type => 
      type.includes('clean') || 
      type.includes('housekeeping') || 
      type.includes('maid') ||
      type.includes('janitorial')
    )) {
      return 'cleaning';
    }

    // Check for tattoo services
    if (serviceTypes.some(type => 
      type.includes('tattoo') || 
      type.includes('ink') || 
      type.includes('piercing') ||
      type.includes('body art')
    )) {
      return 'tattoo';
    }

    // Check for home services
    if (serviceTypes.some(type => 
      type.includes('plumb') || 
      type.includes('electric') || 
      type.includes('hvac') ||
      type.includes('repair') ||
      type.includes('maintenance')
    )) {
      return 'home_services';
    }

    // Check for pet care services
    if (serviceTypes.some(type => 
      type.includes('pet') || 
      type.includes('dog') || 
      type.includes('cat') ||
      type.includes('walk') ||
      type.includes('grooming')
    )) {
      return 'petcare';
    }

    return 'default';
  }, [jobs]);

  // Load manual override from sessionStorage
  useEffect(() => {
    const savedOverride = sessionStorage.getItem('housie-service-layout-override');
    if (savedOverride && Object.keys(SERVICE_LAYOUTS).includes(savedOverride)) {
      setManualOverride(savedOverride as ServiceLayoutType);
    }
  }, []);

  // Set manual override
  const setLayoutOverride = (layout: ServiceLayoutType | null) => {
    setManualOverride(layout);
    
    if (layout) {
      sessionStorage.setItem('housie-service-layout-override', layout);
    } else {
      sessionStorage.removeItem('housie-service-layout-override');
    }
  };

  // Resolve the actual layout to use
  const currentLayout = manualOverride || detectedLayout;
  const layoutDefinition = SERVICE_LAYOUTS[currentLayout];

  return {
    currentLayout,
    layoutDefinition,
    detectedLayout,
    isManualOverride: !!manualOverride,
    setLayoutOverride,
    availableLayouts: Object.keys(SERVICE_LAYOUTS) as ServiceLayoutType[]
  };
}