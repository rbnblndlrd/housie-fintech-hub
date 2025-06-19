
export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface BaseFilters {
  searchTerm: string;
  dateRange: DateRange;
  status: string;
}

export interface BookingFilters extends BaseFilters {
  providerId?: string;
  serviceCategory?: string;
  priceRange: PriceRange;
  paymentStatus: string;
}

export interface ServiceFilters extends BaseFilters {
  category: string;
  subcategory: string;
  location: string;
  priceRange: PriceRange;
  verified: boolean | null;
  backgroundCheckRequired: boolean | null;
  ccqRbqRequired: boolean | null;
  riskCategory: string;
}

export interface UserFilters extends BaseFilters {
  userType: 'all' | 'providers' | 'customers';
  verified: boolean | null;
  city: string;
  province: string;
  verificationLevel: string;
}

export interface CalendarFilters extends BaseFilters {
  appointmentType: string;
  clientName: string;
}

export type FilterPreset = {
  id: string;
  name: string;
  filters: Partial<BaseFilters>;
};

export interface FilterState<T extends BaseFilters> {
  filters: T;
  isLoading: boolean;
  error: string | null;
  resultCount: number;
}

export interface ServiceSubcategory {
  id: string;
  category: string;
  subcategory: string;
  background_check_required: boolean;
  ccq_rbq_required: boolean;
  risk_category: string;
  description: string;
  created_at: string;
}
