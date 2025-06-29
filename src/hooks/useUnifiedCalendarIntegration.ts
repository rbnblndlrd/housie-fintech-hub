
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  client: string;
  location: string;
  status: 'confirmed' | 'pending' | 'completed';
  amount: number;
  source: 'housie' | 'google';
  booking_id?: string;
  is_provider?: boolean;
}

export const useUnifiedCalendarIntegration = () => {
  const { user } = useAuth();
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  // Stable callback to fetch all calendar data
  const fetchAllCalendarData = useCallback(async () => {
    if (!user) {
      setAllEvents([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching unified calendar data for user:', user.id);

      // Fetch appointments
      const { data: appointments, error: appointmentsError } = await supabase
        .from('calendar_appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_date', { ascending: true });

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
        throw appointmentsError;
      }

      // Fetch bookings (customer bookings)
      const { data: customerBookings, error: customerBookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customer_id (full_name, phone),
          provider:provider_id (
            business_name,
            user:user_id (full_name)
          ),
          service:service_id (title)
        `)
        .eq('customer_id', user.id);

      if (customerBookingsError) {
        console.error('Error fetching customer bookings:', customerBookingsError);
      }

      // Fetch provider bookings if user has a provider profile
      let providerBookingsData = [];
      try {
        const { data: providerProfile } = await supabase
          .from('provider_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (providerProfile) {
          const { data: providerBookings, error: providerBookingsError } = await supabase
            .from('bookings')
            .select(`
              *,
              customer:customer_id (full_name, phone),
              provider:provider_id (
                business_name,
                user:user_id (full_name)
              ),
              service:service_id (title)
            `)
            .eq('provider_id', providerProfile.id);

          if (!providerBookingsError && providerBookings) {
            providerBookingsData = providerBookings;
          }
        }
      } catch (providerError) {
        console.log('No provider profile found or error fetching provider bookings:', providerError);
      }

      // Convert appointments to calendar events
      const appointmentEvents: CalendarEvent[] = (appointments || []).map(appointment => {
        const dateParts = appointment.scheduled_date.split('-');
        const appointmentDate = new Date(
          parseInt(dateParts[0]),
          parseInt(dateParts[1]) - 1,
          parseInt(dateParts[2])
        );
        
        return {
          id: appointment.id,
          title: appointment.title,
          date: appointmentDate,
          time: appointment.scheduled_time,
          client: appointment.client_name,
          location: appointment.location || '',
          status: appointment.status as 'confirmed' | 'pending' | 'completed',
          amount: Number(appointment.amount) || 0,
          source: 'housie' as const,
          booking_id: undefined,
          is_provider: false
        };
      });

      // Convert bookings to calendar events
      const allBookingsData = [
        ...(customerBookings || []),
        ...providerBookingsData
      ];

      const bookingEvents: CalendarEvent[] = allBookingsData.map(booking => ({
        id: `booking-${booking.id}`,
        title: booking.service?.title || 'Service',
        date: new Date(booking.scheduled_date),
        time: booking.scheduled_time,
        client: booking.customer_id === user.id 
          ? booking.provider?.business_name || booking.provider?.user?.full_name || 'Provider'
          : booking.customer?.full_name || 'Customer',
        location: booking.service_address || 'Address not specified',
        status: booking.status as 'confirmed' | 'pending' | 'completed',
        amount: Number(booking.total_amount) || 0,
        source: 'housie' as const,
        booking_id: booking.id,
        is_provider: booking.provider_id !== user.id
      }));

      // Combine all events
      const combinedEvents = [...appointmentEvents, ...bookingEvents];
      
      console.log('Successfully fetched calendar data:', {
        appointmentEvents: appointmentEvents.length,
        bookingEvents: bookingEvents.length,
        totalEvents: combinedEvents.length
      });

      setAllEvents(combinedEvents);

    } catch (error) {
      console.error('Error in fetchAllCalendarData:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch calendar data');
      setAllEvents([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Create appointment function
  const createAppointment = useCallback(async (newAppointment: Omit<CalendarEvent, 'id'>) => {
    if (!user) return null;

    try {
      console.log('Creating new appointment:', newAppointment);
      
      const year = newAppointment.date.getFullYear();
      const month = String(newAppointment.date.getMonth() + 1).padStart(2, '0');
      const day = String(newAppointment.date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      const appointmentData = {
        title: newAppointment.title,
        scheduled_date: dateString,
        scheduled_time: newAppointment.time,
        client_name: newAppointment.client,
        location: newAppointment.location,
        status: newAppointment.status,
        amount: newAppointment.amount,
        appointment_type: 'personal' as const,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('calendar_appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (error) throw error;

      console.log('Appointment created successfully:', data);
      
      // Refresh data after successful creation
      await fetchAllCalendarData();
      
      return data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      setError(error instanceof Error ? error.message : 'Failed to create appointment');
      return null;
    }
  }, [user?.id, fetchAllCalendarData]);

  // Cleanup function for subscriptions
  const cleanupSubscription = useCallback(() => {
    if (subscriptionRef.current) {
      console.log('Cleaning up existing calendar subscription');
      supabase.removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
      isSubscribedRef.current = false;
    }
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.id) {
      setAllEvents([]);
      cleanupSubscription();
      return;
    }

    // Cleanup any existing subscription first
    cleanupSubscription();

    // Initial data fetch
    fetchAllCalendarData();

    // Set up new subscription with stable channel name
    const channelName = `unified-calendar-${user.id}`;
    console.log('Setting up unified calendar subscription:', channelName);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendar_appointments',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Calendar appointment change detected:', payload);
          fetchAllCalendarData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Booking change detected:', payload);
          fetchAllCalendarData();
        }
      )
      .subscribe((status) => {
        console.log('Unified calendar subscription status:', status);
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
        }
      });

    subscriptionRef.current = channel;

    // Cleanup on unmount or user change
    return cleanupSubscription;
  }, [user?.id]); // Only depend on user.id, not fetchAllCalendarData

  return {
    allEvents,
    loading,
    error,
    createAppointment,
    refreshData: fetchAllCalendarData
  };
};
