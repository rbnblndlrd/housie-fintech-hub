
import { useState, useEffect, useCallback } from 'react';
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

export const useBookingCalendarIntegration = () => {
  const { user } = useAuth();
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookingsAsCalendarEvents = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // First get provider profile if user can provide services
      const { data: providerProfile } = await supabase
        .from('provider_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let bookingsQuery = supabase
        .from('bookings')
        .select(`
          *,
          customer:customer_id (full_name, phone),
          provider:provider_id (
            business_name,
            user:user_id (full_name)
          ),
          service:service_id (title)
        `);

      // Get bookings where user is either customer or provider
      const customerBookings = await bookingsQuery
        .eq('customer_id', user.id);

      let providerBookings = { data: [], error: null };
      if (providerProfile) {
        providerBookings = await bookingsQuery
          .eq('provider_id', providerProfile.id);
      }

      const allBookingsData = [
        ...(customerBookings.data || []),
        ...(providerBookings.data || [])
      ];

      // Convert bookings to calendar events
      const events: CalendarEvent[] = allBookingsData.map(booking => ({
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
        is_provider: booking.provider_id === providerProfile?.id
      }));

      setCalendarEvents(events);

    } catch (error) {
      console.error('Error fetching bookings for calendar:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Update local calendar events
      setCalendarEvents(prev => 
        prev.map(event => 
          event.booking_id === bookingId 
            ? { ...event, status: newStatus as 'confirmed' | 'pending' | 'completed' }
            : event
        )
      );

    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  // Simple data fetching - no real-time subscription to avoid conflicts
  useEffect(() => {
    if (user?.id) {
      fetchBookingsAsCalendarEvents();
    }
  }, [user?.id, fetchBookingsAsCalendarEvents]);

  return {
    calendarEvents,
    loading,
    refreshEvents: fetchBookingsAsCalendarEvents,
    updateBookingStatus
  };
};
