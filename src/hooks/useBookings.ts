import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Booking {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  provider: string;
  location: string;
  status: string;
  customer_name?: string;
  total_amount?: number;
}

export const useBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching bookings for user:', user.id);

      // Get bookings where user is either customer or provider
      const { data: userBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          scheduled_date,
          scheduled_time,
          service_address,
          status,
          total_amount,
          customer_id,
          provider_id,
          services!inner(title, category),
          users!bookings_customer_id_fkey(full_name),
          provider_profiles!inner(
            business_name,
            users!provider_profiles_user_id_fkey(full_name)
          )
        `)
        .or(`customer_id.eq.${user.id},provider_id.eq.${user.id}`)
        .order('scheduled_date', { ascending: false })
        .limit(20);

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        setError('Failed to load bookings');
        return;
      }

      console.log('Raw bookings data:', userBookings);

      if (userBookings && userBookings.length > 0) {
        const formattedBookings: Booking[] = userBookings.map(booking => {
          const serviceName = booking.services?.title || booking.services?.category || 'Service';
          const providerName = booking.provider_profiles?.business_name || 
                              booking.provider_profiles?.users?.full_name || 
                              'Provider';
          const customerName = booking.users?.full_name || 'Customer';
          
          return {
            id: booking.id,
            serviceName,
            date: booking.scheduled_date,
            time: booking.scheduled_time,
            provider: booking.customer_id === user.id ? providerName : customerName,
            location: booking.service_address || 'Location TBD',
            status: booking.status || 'pending',
            customer_name: customerName,
            total_amount: booking.total_amount
          };
        });

        setBookings(formattedBookings);
      } else {
        console.log('No bookings found');
        setBookings([]);
      }
      setError(null);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setError('Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Set up real-time subscription for bookings
    const channel = supabase
      .channel('bookings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Booking change detected:', payload);
          fetchBookings(); // Refetch on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings
  };
};