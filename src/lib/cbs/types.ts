// CBS (Canonical Broadcast System) Type Definitions

export interface CBSEvent {
  id: string;
  event_type: string;
  user_id: string;
  source_table: string;
  source_id: string;
  verified: boolean;
  broadcast_scope: string;
  visible_to_public: boolean;
  canon_confidence: number;
  metadata: any;
  geographic_location?: any;
  city?: string;
  processed_at: string;
  created_at: string;
  updated_at: string;
}

export interface CBSEventCreate {
  event_type: string;
  user_id: string;
  source_table: string;
  source_id: string;
  verified?: boolean;
  broadcast_scope?: 'local' | 'city' | 'global';
  visible_to_public?: boolean;
  canon_confidence?: number;
  metadata?: Record<string, any>;
  city?: string;
}

export interface CBSEventDetector {
  table: string;
  event_types: string[];
  detector: (payload: any) => CBSEventCreate | null;
  canonConfidence: number;
}

export interface CBSConfiguration {
  enableRealTimeDetection: boolean;
  defaultBroadcastScope: 'local' | 'city' | 'global';
  enablePublicBroadcast: boolean;
  minimumCanonConfidence: number;
}