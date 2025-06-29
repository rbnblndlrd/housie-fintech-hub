
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  client: string;
  location: string;
  status: 'confirmed' | 'pending' | 'completed';
  amount: number;
  source: 'housie' | 'google';
}

export const useUnifiedCalendarIntegration = () => {
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { isConnected: googleConnected } = useGoogleCalendar();
  const { toast } = useToast();

  const fetchHousieEvents = useCallback(async () => {
    if (!user) return [];

    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          provider:provider_id (
            business_name,
            user:user_id (full_name)
          ),
          service:service_id (title),
          customer:customer_id (full_name)
        `)
        .or(`customer_id.eq.${user.id},provider_id.eq.${user.id}`)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;

      return (bookings || []).map(booking => ({
        id: `housie-${booking.id}`,
        title: booking.service?.title || 'Service Booking',
        date: new Date(booking.scheduled_date),
        time: booking.scheduled_time,
        client: booking.customer?.full_name || booking.provider?.business_name || 'Client',
        location: booking.service_address || 'Location TBD',
        status: booking.status as 'confirmed' | 'pending' | 'completed',
        amount: booking.total_amount || 0,
        source: 'housie' as const,
      }));
    } catch (error) {
      console.error('Error fetching HOUSIE events:', error);
      return [];
    }
  }, [user]);

  const fetchGoogleEvents = useCallback(async () => {
    if (!user || !googleConnected) return [];

    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 2);

      const { data, error } = await supabase.functions.invoke('google-calendar-events', {
        body: {
          action: 'getEvents',
          providerId: user.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          timeZone: 'America/Montreal'
        }
      });

      if (error) throw error;

      return (data.events || []).map((event: any) => ({
        id: `google-${event.id}`,
        title: event.summary || 'Google Calendar Event',
        date: new Date(event.start),
        time: new Date(event.start).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        client: 'Google Calendar',
        location: event.location || 'See Google Calendar',
        status: 'confirmed' as const,
        amount: 0,
        source: 'google' as const,
      }));
    } catch (error) {
      console.error('Error fetching Google events:', error);
      return [];
    }
  }, [user, googleConnected]);

  const refreshData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const [housieEvents, googleEvents] = await Promise.all([
        fetchHousieEvents(),
        fetchGoogleEvents()
      ]);

      const combinedEvents = [...housieEvents, ...googleEvents]
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      setAllEvents(combinedEvents);
    } catch (error) {
      console.error('Error refreshing calendar data:', error);
      setError(error.message || 'Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  }, [user, fetchHousieEvents, fetchGoogleEvents]);

  const createAppointment = useCallback(async (newAppointment: Omit<CalendarEvent, 'id'>) => {
    try {
      // For now, only create HOUSIE appointments
      // Google Calendar integration would need additional implementation
      
      const { error } = await supabase
        .from('bookings')
        .insert({
          customer_id: user?.id,
          provider_id: user?.id, // This should be the actual provider ID
          service_id: 'temp-service-id', // This should be an actual service ID
          scheduled_date: newAppointment.date.toISOString().split('T')[0],
          scheduled_time: newAppointment.time,
          service_address: newAppointment.location,
          total_amount: newAppointment.amount,
          status: newAppointment.status,
        });

      if (error) throw error;

      toast({
        title: "Appointment Created",
        description: "Your appointment has been successfully created.",
      });

      await refreshData();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to create appointment. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [user, toast, refreshData]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    allEvents,
    loading,
    error,
    createAppointment,
    refreshData,
  };
};
