
export interface Service {
  id: string;
  title: string;
  description: string;
  base_price: number;
  pricing_type: string;
  category: string;
  subcategory: string;
  active: boolean;
  background_check_required: boolean;
  ccq_rbq_required: boolean;
  risk_category: string;
  provider: {
    id: string;
    business_name: string;
    hourly_rate: number;
    service_radius_km: number;
    average_rating: number;
    total_bookings: number;
    verified: boolean;
    verification_level: 'basic' | 'background_check' | 'professional_license';
    background_check_verified: boolean;
    ccq_verified: boolean;
    rbq_verified: boolean;
    user: {
      full_name: string;
      city: string;
      province: string;
    };
  };
}

export interface Provider {
  id: number;
  name: string;
  lat: number;
  lng: number;
  service: string;
  rating: number;
  availability: string;
  serviceRadius?: number; // in kilometers
  verified?: boolean;
  hourlyRate?: number;
  distance?: string;
}
