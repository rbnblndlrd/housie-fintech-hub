
import { useMemo } from 'react';
import { useBookingCalendarIntegration, CalendarEvent } from '@/hooks/useBookingCalendarIntegration';
import { useCalendarAppointments } from '@/hooks/useCalendarAppointments';

export const useUnifiedCalendarIntegration = () => {
  const { calendarEvents: bookingEvents, loading: bookingsLoading, updateBookingStatus } = useBookingCalendarIntegration();
  const { 
    appointments, 
    loading: appointmentsLoading, 
    createAppointment, 
    updateAppointment, 
    deleteAppointment 
  } = useCalendarAppointments();

  // Convert database appointments to CalendarEvent format
  const appointmentEvents: CalendarEvent[] = useMemo(() => {
    return appointments.map(appointment => ({
      id: appointment.id,
      title: appointment.title,
      date: new Date(appointment.scheduled_date),
      time: appointment.scheduled_time,
      client: appointment.client_name,
      location: appointment.location || '',
      status: appointment.status as 'confirmed' | 'pending' | 'completed',
      amount: Number(appointment.amount) || 0,
      source: 'housie' as const,
      booking_id: undefined,
      is_provider: false
    }));
  }, [appointments]);

  // Combine all events
  const allEvents = useMemo(() => [
    ...bookingEvents,
    ...appointmentEvents
  ], [bookingEvents, appointmentEvents]);

  const loading = bookingsLoading || appointmentsLoading;

  const handleCreateAppointment = async (newAppointment: Omit<CalendarEvent, 'id'>) => {
    const appointmentData = {
      title: newAppointment.title,
      scheduled_date: newAppointment.date.toISOString().split('T')[0],
      scheduled_time: newAppointment.time,
      client_name: newAppointment.client,
      location: newAppointment.location,
      status: newAppointment.status,
      amount: newAppointment.amount,
      appointment_type: 'personal' as const
    };
    
    return await createAppointment(appointmentData);
  };

  const handleUpdateEvent = async (eventId: string, updates: Partial<CalendarEvent>) => {
    // Check if this is a booking or appointment
    const isBooking = bookingEvents.find(event => event.id === eventId);
    
    if (isBooking && updates.status) {
      // Handle booking status update
      const booking = bookingEvents.find(event => event.id === eventId);
      if (booking?.booking_id) {
        await updateBookingStatus(booking.booking_id, updates.status);
      }
    } else {
      // Handle appointment update
      const appointmentUpdates = {
        title: updates.title,
        scheduled_time: updates.time,
        client_name: updates.client,
        location: updates.location,
        status: updates.status,
        amount: updates.amount
      };
      
      await updateAppointment(eventId, appointmentUpdates);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    // Check if this is a booking or appointment
    const isBooking = bookingEvents.find(event => event.id === eventId);
    
    if (isBooking) {
      // Handle booking cancellation
      const booking = bookingEvents.find(event => event.id === eventId);
      if (booking?.booking_id) {
        await updateBookingStatus(booking.booking_id, 'cancelled');
      }
    } else {
      // Handle appointment deletion
      await deleteAppointment(eventId);
    }
  };

  return {
    allEvents,
    loading,
    createAppointment: handleCreateAppointment,
    updateEvent: handleUpdateEvent,
    deleteEvent: handleDeleteEvent,
    updateBookingStatus
  };
};
