
export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
}

export interface UserStats {
  communityRatingPoints: number;
  totalReviews: number;
  networkConnections: number;
  qualityCommendations: number;
  reliabilityCommendations: number;
  courtesyCommendations: number;
  shopPoints: number;
}

export interface AdminFunctionResult {
  success: boolean;
  error?: string;
  message?: string;
  review_id?: string;
  commendation_id?: string;
  debug_info?: {
    step?: string;
    provider_user_id?: string;
    provider_profile_id?: string;
    service_id?: string;
    customer_id?: string;
    booking_id?: string;
    review_id?: string;
    customer_created?: string;
    customer_found?: string;
    commendations_added?: string;
    sql_state?: string;
  };
}
