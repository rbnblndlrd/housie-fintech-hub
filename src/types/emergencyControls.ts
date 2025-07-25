
export interface EmergencyControlsState {
  id?: string;
  // Platform Controls
  bookings_paused: boolean;
  maintenance_mode: boolean;
  new_registrations_disabled: boolean;
  force_logout_users: boolean;
  
  // Security Controls
  fraud_lockdown_active: boolean;
  manual_review_all_bookings: boolean;
  geographic_blocking_enabled: boolean;
  payment_restrictions_active: boolean;
  blocked_countries: string[];
  allowed_payment_methods: string[];
  
  // Annette API Controls (mapping to existing fields)
  claude_api_killswitch: boolean; // maps to !claude_api_enabled
  claude_api_rate_limiting: boolean; // derived from current_daily_spend vs daily_spend_limit
  claude_response_filtering: boolean; // frontend logic
  claude_api_cost_monitor: boolean; // uses daily_spend_limit monitoring
  
  // Communication Controls
  messaging_disabled: boolean;
  emergency_notification_active: boolean;
  provider_broadcast_active: boolean;
  
  // System Status
  normal_operations: boolean;
  last_backup_triggered: string | null;
  
  // Annette API existing fields
  claude_api_enabled?: boolean;
  daily_spend_limit?: number;
  current_daily_spend?: number;
  
  // Metadata
  activated_by: string | null;
  activated_at: string | null;
  deactivated_by: string | null;
  deactivated_at: string | null;
  reason: string | null;
  created_at?: string;
  updated_at?: string;
}

export type EmergencyControlAction = 
  | 'bookings_paused'
  | 'maintenance_mode'
  | 'new_registrations_disabled'
  | 'force_logout_users'
  | 'fraud_lockdown_active'
  | 'manual_review_all_bookings'
  | 'geographic_blocking_enabled'
  | 'payment_restrictions_active'
  | 'messaging_disabled'
  | 'emergency_notification_active'
  | 'provider_broadcast_active'
  | 'claude_api_killswitch'
  | 'claude_api_rate_limiting'
  | 'claude_response_filtering'
  | 'claude_api_cost_monitor';
