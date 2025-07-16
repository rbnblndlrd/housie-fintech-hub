// UX Mode Type Definitions for Dynamic Job Layouts

export interface UXModeFeature {
  id: string;
  name: string;
  description?: string;
}

export interface UXModeDefinition {
  id: string;
  name: string;
  applicableTo: string[];
  features: string[];
  annetteVoiceLine: string;
  cardStyle: 'compact' | 'detailed' | 'checklist' | 'timeline' | 'gallery' | 'diagnostic';
  primaryActions: string[];
  secondaryActions?: string[];
}

export const UX_MODES: Record<string, UXModeDefinition> = {
  'route-hero': {
    id: 'route-hero',
    name: 'Route Hero',
    applicableTo: ['lawncare', 'snow_removal', 'cleaning', 'maintenance'],
    features: ['gps-start', 'route-optimizer', 'job-checklist', 'photo-uploads', 'recurrence'],
    annetteVoiceLine: "We're in sweep mode, baby. Let's make this block sparkle.",
    cardStyle: 'checklist',
    primaryActions: ['start-gps', 'mark-complete'],
    secondaryActions: ['view-checklist', 'upload-photos']
  },
  'client-room': {
    id: 'client-room',
    name: 'Client Room',
    applicableTo: ['massage', 'tattoo', 'esthetics', 'wellness'],
    features: ['appointment-timeline', 'client-profile-popouts', 'rebooking', 'ambiance-picker'],
    annetteVoiceLine: "Lighting: soft. Music: on. Mood: client-first. We're live.",
    cardStyle: 'timeline',
    primaryActions: ['view-client', 'start-session'],
    secondaryActions: ['set-ambiance', 'schedule-follow-up']
  },
  'fixit-fieldboard': {
    id: 'fixit-fieldboard',
    name: 'FixIt Fieldboard',
    applicableTo: ['appliance', 'it', 'home_repairs', 'electrical', 'plumbing'],
    features: ['diagnostic-form', 'part-input', 'fix-log', 'photo-comparison'],
    annetteVoiceLine: "Let's break it down and build it better. You fix. I'll log.",
    cardStyle: 'diagnostic',
    primaryActions: ['start-diagnostic', 'log-fix'],
    secondaryActions: ['order-parts', 'take-photos']
  },
  'showtime-panel': {
    id: 'showtime-panel',
    name: 'Showtime Panel',
    applicableTo: ['events', 'dj', 'makeup', 'photography', 'entertainment'],
    features: ['event-timeline', 'crew-roles', 'gear-checklist', 'moodboard-uploads'],
    annetteVoiceLine: "We're live in 3... 2... You already nailed it, sugar.",
    cardStyle: 'timeline',
    primaryActions: ['check-gear', 'go-live'],
    secondaryActions: ['assign-crew', 'upload-mood']
  },
  'heavy-hauler': {
    id: 'heavy-hauler',
    name: 'Heavy Hauler',
    applicableTo: ['moving', 'packing', 'logistics', 'delivery'],
    features: ['load-estimator', 'fragility-tags', 'segment-routing', 'hour-tracker'],
    annetteVoiceLine: "Lift with your legs. Route with your brain. I got the rest.",
    cardStyle: 'detailed',
    primaryActions: ['estimate-load', 'start-move'],
    secondaryActions: ['tag-fragile', 'track-hours']
  },
  'agent-build-mode': {
    id: 'agent-build-mode',
    name: 'Agent Build Mode',
    applicableTo: ['ai_setup', 'gpt_training', 'founder_jobs', 'consulting'],
    features: ['vault-path-viewer', 'agent-config-display', 'sop-input', 'canon-toggle'],
    annetteVoiceLine: "Founder Mode engaged. Pulling vault metadata…",
    cardStyle: 'gallery',
    primaryActions: ['view-vault', 'config-agent'],
    secondaryActions: ['input-sop', 'toggle-canon']
  }
};

export interface UXModeState {
  currentMode: string;
  isAutoDetected: boolean;
  availableModes: string[];
  sessionPersisted: boolean;
}

export type JobType = string;
export type ServiceCategory = string;