export interface UnifiedUserProfile {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  bio?: string;
  profile_image_url?: string;
  location?: string;
  phone?: string;
  website?: string;
  company?: string;
  profession?: string;
  
  // Role capabilities - simplified to customer/provider only
  can_provide_services?: boolean;
  can_book_services?: boolean;
  active_role?: 'customer' | 'provider';
  profile_type?: 'individual' | 'business';
  
  // Provider-specific fields
  business_name?: string;
  description?: string;
  years_experience?: number;
  hourly_rate?: number;
  service_radius_km?: number;
  verification_level?: string;
  verified?: boolean;
  background_check_verified?: boolean;
  professional_license_verified?: boolean;
  professional_license_type?: string;
  insurance_verified?: boolean;
  cra_compliant?: boolean;
  rbq_verified?: boolean;
  ccq_verified?: boolean;
  rbq_license_number?: string;
  ccq_license_number?: string;
  
  // Performance metrics
  total_bookings?: number;
  total_reviews?: number;
  total_reviews_received?: number;
  average_rating?: number;
  response_time_hours?: number;
  community_rating_points?: number;
  shop_points?: number;
  quality_commendations?: number;
  reliability_commendations?: number;
  courtesy_commendations?: number;
  achievement_badges?: any[];
  network_connections_count?: number;
  network_points?: number;
  
  // Privacy settings
  privacy_level?: string;
  show_location?: boolean;
  show_contact_info?: boolean;
  is_verified?: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface RoleSwitchContextType {
  currentRole: 'customer' | 'provider';
  availableRoles: string[];
  switchRole: (role: 'customer' | 'provider') => Promise<void>;
  canSwitchToProvider: boolean;
  forceRefresh?: () => Promise<void>; // Add the missing forceRefresh function
}

// New Group System Types
export interface UserGroup {
  id: string;
  name: string;
  type: 'crew' | 'collective';
  leader_id: string;
  description?: string;
  active: boolean;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export interface GroupMembership {
  id: string;
  group_id: string;
  user_id: string;
  role: 'leader' | 'member';
  joined_at: string;
}

export interface GroupOpportunity {
  id: string;
  group_id: string;
  title: string;
  description: string;
  budget: number;
  status: 'open' | 'in_progress' | 'completed';
  created_by: string;
  created_at: string;
}

export interface GroupLicense {
  id: string;
  user_id: string;
  license_type: 'group_creator';
  active: boolean;
  expires_at: string;
  created_at: string;
}
