
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ActiveBooking {
  id: string;
  title: string;
  status: string;
  priority: string;
  address: string;
  scheduledTime: string;
  customer_name?: string;
  total_amount?: number;
  service_subcategory?: string;
  acceptedAt?: string;
}

export const useActiveBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<ActiveBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveBookings = async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Get provider profile ID
      const { data: providerProfile } = await supabase
        .from('provider_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      console.log('🔍 Current user ID:', user.id);
      console.log('🔍 Provider profile found:', providerProfile);

      if (!providerProfile) {
        console.log('❌ No provider profile found for user');
        setBookings([]);
        setLoading(false);
        return;
      }

      // Fetch active bookings assigned to this provider
      const { data: activeBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          service_title,
          custom_title,
          status,
          priority,
          service_address,
          scheduled_date,
          scheduled_time,
          total_amount,
          subcategory,
          accepted_at,
          customer_id,
          provider_id
        `)
        .eq('provider_id', providerProfile.id)
        .in('status', ['confirmed', 'in_progress', 'pending'])
        .order('accepted_at', { ascending: false, nullsFirst: false });

      console.log('🔍 Fetching bookings for provider ID:', providerProfile.id);
      console.log('🔍 Raw bookings data:', activeBookings);
      console.log('🔍 Found bookings count:', activeBookings?.length || 0);

      if (bookingsError) {
        console.error('❌ Error fetching active bookings:', bookingsError);
        setError('Failed to load active bookings');
        setBookings([]);
        return;
      }

      // Format bookings for display
      const formattedBookings: ActiveBooking[] = (activeBookings || []).map(booking => {
        console.log('🔍 Processing booking:', booking.id, 'status:', booking.status);
        return {
          id: booking.id,
          title: booking.custom_title || booking.service_title || 
                 (booking.subcategory ? `${booking.subcategory} Service` : 'Service Request'),
          status: booking.status || 'pending',
          priority: booking.priority || 'medium',
          address: booking.service_address || 'Address TBD',
          scheduledTime: booking.scheduled_time || 'Time TBD',
          customer_name: 'Customer', // Will fetch separately if needed
          total_amount: booking.total_amount,
          service_subcategory: booking.subcategory,
          acceptedAt: booking.accepted_at
        };
      });

      // Check for recently accepted jobs from localStorage
      const lastAcceptedJob = localStorage.getItem('lastAcceptedJob');
      if (lastAcceptedJob) {
        try {
          const jobData = JSON.parse(lastAcceptedJob);
          console.log('🔍 Found lastAcceptedJob in localStorage:', jobData);
          
          const existsInList = formattedBookings.some(booking => booking.id === jobData.id);
          console.log('🔍 Job exists in database list:', existsInList);
          
          if (!existsInList) {
            console.log('🔍 Adding job from localStorage to list');
            formattedBookings.unshift({
              id: jobData.id,
              title: jobData.title,
              status: 'confirmed',
              priority: jobData.priority || 'high',
              address: jobData.address || 'Address TBD',
              scheduledTime: jobData.scheduledTime || 'ASAP',
              acceptedAt: jobData.acceptedAt
            });
          }
          // Clear the localStorage after processing
          localStorage.removeItem('lastAcceptedJob');
          console.log('🔍 Cleared lastAcceptedJob from localStorage');
        } catch (error) {
          console.error('❌ Error parsing accepted job data:', error);
        }
      }

      console.log('✅ Final formatted bookings:', formattedBookings);
      setBookings(formattedBookings);
    } catch (err) {
      console.error('❌ Error in fetchActiveBookings:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveBookings();

    // Set up periodic refresh to catch new jobs
    const interval = setInterval(fetchActiveBookings, 10000); // Check every 10 seconds

    // Listen for storage changes (when jobs are accepted on map)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lastAcceptedJob' && e.newValue) {
        console.log('📢 New job accepted via storage event, refreshing bookings');
        // Increased delay to ensure database consistency
        setTimeout(fetchActiveBookings, 1000);
      }
    };

    // Listen for custom events (when jobs are accepted on map)
    const handleJobAccepted = (event: CustomEvent) => {
      console.log('📢 Job accepted via custom event, refreshing bookings:', event.detail);
      // Force immediate refresh plus delayed refresh for safety
      fetchActiveBookings();
      setTimeout(fetchActiveBookings, 1000);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('jobAccepted', handleJobAccepted as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('jobAccepted', handleJobAccepted as EventListener);
    };
  }, [user?.id]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchActiveBookings
  };
};
