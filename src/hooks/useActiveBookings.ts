
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

      if (!providerProfile) {
        console.log('No provider profile found for user');
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
          users!inner(full_name)
        `)
        .eq('provider_id', providerProfile.id)
        .in('status', ['confirmed', 'in_progress', 'pending'])
        .order('accepted_at', { ascending: false, nullsFirst: false });

      if (bookingsError) {
        console.error('Error fetching active bookings:', bookingsError);
        setError('Failed to load active bookings');
        setBookings([]);
        return;
      }

      // Format bookings for display
      const formattedBookings: ActiveBooking[] = (activeBookings || []).map(booking => ({
        id: booking.id,
        title: booking.custom_title || booking.service_title || 
               (booking.subcategory ? `${booking.subcategory} Service` : 'Service Request'),
        status: booking.status || 'pending',
        priority: booking.priority || 'medium',
        address: booking.service_address || 'Address TBD',
        scheduledTime: booking.scheduled_time || 'Time TBD',
        customer_name: booking.users?.full_name || 'Customer',
        total_amount: booking.total_amount,
        service_subcategory: booking.subcategory,
        acceptedAt: booking.accepted_at
      }));

      // Check for recently accepted jobs from localStorage
      const lastAcceptedJob = localStorage.getItem('lastAcceptedJob');
      if (lastAcceptedJob) {
        try {
          const jobData = JSON.parse(lastAcceptedJob);
          const existsInList = formattedBookings.some(booking => booking.id === jobData.id);
          if (!existsInList) {
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
          // Clear the localStorage after adding
          localStorage.removeItem('lastAcceptedJob');
        } catch (error) {
          console.error('Error parsing accepted job data:', error);
        }
      }

      setBookings(formattedBookings);
    } catch (err) {
      console.error('Error in fetchActiveBookings:', err);
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
        console.log('New job accepted, refreshing bookings');
        setTimeout(fetchActiveBookings, 500); // Small delay to ensure database is updated
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user?.id]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchActiveBookings
  };
};
