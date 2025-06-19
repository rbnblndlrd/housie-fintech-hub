
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
  location: string;
  priceRange: PriceRange;
  verified: boolean | null;
}

export interface UserFilters extends BaseFilters {
  userType: 'all' | 'providers' | 'customers';
  verified: boolean | null;
  city: string;
  province: string;
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
