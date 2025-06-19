
import { supabase } from '@/integrations/supabase/client';
import { BookingFilters, ServiceFilters, UserFilters } from '@/types/filters';
import { isDateInRange } from '@/utils/dateFilters';
import { matchesSearch, matchesPriceRange, matchesStatus } from '@/utils/filterUtils';

export const fetchFilteredBookings = async (filters: BookingFilters) => {
  let query = supabase
    .from('bookings')
    .select(`
      *,
      provider:provider_profiles(business_name, user:users(full_name)),
      service:services(title, category),
      customer:users(full_name)
    `)
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters.paymentStatus !== 'all') {
    query = query.eq('payment_status', filters.paymentStatus);
  }

  if (filters.dateRange.from) {
    query = query.gte('created_at', filters.dateRange.from.toISOString());
  }

  if (filters.dateRange.to) {
    query = query.lte('created_at', filters.dateRange.to.toISOString());
  }

  if (filters.providerId) {
    query = query.eq('provider_id', filters.providerId);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Apply client-side filters for complex searches
  let filteredData = data || [];

  if (filters.searchTerm) {
    filteredData = filteredData.filter(booking =>
      matchesSearch(booking.service?.title || '', filters.searchTerm) ||
      matchesSearch(booking.provider?.business_name || '', filters.searchTerm) ||
      matchesSearch(booking.service_address || '', filters.searchTerm)
    );
  }

  if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) {
    filteredData = filteredData.filter(booking =>
      matchesPriceRange(booking.total_amount || 0, filters.priceRange)
    );
  }

  return filteredData;
};

export const fetchFilteredServices = async (filters: ServiceFilters) => {
  let query = supabase
    .from('services')
    .select(`
      *,
      provider:provider_profiles(
        id,
        business_name,
        hourly_rate,
        average_rating,
        total_bookings,
        verified,
        verification_level,
        background_check_verified,
        ccq_verified,
        rbq_verified,
        user:users(full_name, city, province)
      )
    `)
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }

  if (filters.subcategory !== 'all') {
    query = query.eq('subcategory', filters.subcategory);
  }

  if (filters.verified !== null) {
    query = query.eq('provider.verified', filters.verified);
  }

  if (filters.backgroundCheckRequired !== null) {
    query = query.eq('background_check_required', filters.backgroundCheckRequired);
  }

  if (filters.ccqRbqRequired !== null) {
    query = query.eq('ccq_rbq_required', filters.ccqRbqRequired);
  }

  if (filters.riskCategory !== 'all') {
    query = query.eq('risk_category', filters.riskCategory);
  }

  const { data, error } = await query;

  if (error) throw error;

  let filteredData = data || [];

  if (filters.searchTerm) {
    filteredData = filteredData.filter(service =>
      matchesSearch(service.title, filters.searchTerm) ||
      matchesSearch(service.description || '', filters.searchTerm) ||
      matchesSearch(service.provider?.business_name || '', filters.searchTerm)
    );
  }

  if (filters.location !== 'all') {
    filteredData = filteredData.filter(service =>
      service.provider?.user?.city?.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  return filteredData;
};

export const fetchFilteredUsers = async (filters: UserFilters) => {
  let query = supabase
    .from('users')
    .select(`
      *,
      provider_profiles (
        verified,
        total_bookings,
        average_rating,
        verification_level,
        background_check_verified,
        ccq_verified,
        rbq_verified
      )
    `)
    .order('created_at', { ascending: false });

  if (filters.userType === 'providers') {
    query = query.eq('can_provide', true);
  } else if (filters.userType === 'customers') {
    query = query.eq('can_provide', false);
  }

  if (filters.city) {
    query = query.ilike('city', `%${filters.city}%`);
  }

  if (filters.province) {
    query = query.ilike('province', `%${filters.province}%`);
  }

  if (filters.verificationLevel !== 'all') {
    query = query.eq('provider_profiles.verification_level', filters.verificationLevel);
  }

  const { data, error } = await query;

  if (error) throw error;

  let filteredData = data || [];

  if (filters.searchTerm) {
    filteredData = filteredData.filter(user =>
      matchesSearch(user.full_name, filters.searchTerm) ||
      matchesSearch(user.email, filters.searchTerm)
    );
  }

  return filteredData;
};

export const fetchServiceSubcategories = async (category?: string) => {
  let query = supabase
    .from('service_subcategories')
    .select('*')
    .order('category', { ascending: true })
    .order('subcategory', { ascending: true });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};
