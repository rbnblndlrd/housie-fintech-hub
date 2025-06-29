
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
  
  // Role capabilities - these are the new columns we added
  can_provide_services?: boolean;
  can_book_services?: boolean;
  active_role?: 'customer' | 'provider' | 'commercial';
  profile_type?: 'individual' | 'business' | 'commercial';
  
  // Provider-specific fields - these are the new columns we added
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
  
  // Performance metrics - these are the new columns we added
  total_bookings?: number;
  total_reviews?: number;
  total_reviews_received?: number; // This maps to total_reviews in the DB
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
  currentRole: 'customer' | 'provider' | 'commercial';
  availableRoles: string[];
  switchRole: (role: 'customer' | 'provider' | 'commercial') => Promise<void>;
  canSwitchToProvider: boolean;
  canSwitchToCommercial: boolean;
}
