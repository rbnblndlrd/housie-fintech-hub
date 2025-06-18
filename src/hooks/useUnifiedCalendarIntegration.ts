
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
    console.log('Converting appointments to events:', appointments);
    
    return appointments.map(appointment => {
      // Parse the date string properly - it comes as YYYY-MM-DD from database
      const appointmentDate = new Date(appointment.scheduled_date + 'T00:00:00.000Z');
      
      console.log('Processing appointment:', {
        id: appointment.id,
        title: appointment.title,
        originalDate: appointment.scheduled_date,
        parsedDate: appointmentDate,
        dateString: appointmentDate.toDateString(),
        time: appointment.scheduled_time
      });
      
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
  }, [appointments]);

  // Combine all events
  const allEvents = useMemo(() => {
    const combined = [
      ...bookingEvents,
      ...appointmentEvents
    ];
    
    console.log('Combined events:', {
      bookingEventsCount: bookingEvents.length,
      appointmentEventsCount: appointmentEvents.length,
      totalEvents: combined.length,
      events: combined.map(event => ({
        id: event.id,
        title: event.title,
        date: event.date,
        dateString: event.date.toDateString(),
        source: event.source
      }))
    });
    
    return combined;
  }, [bookingEvents, appointmentEvents]);

  const loading = bookingsLoading || appointmentsLoading;

  const handleCreateAppointment = async (newAppointment: Omit<CalendarEvent, 'id'>) => {
    console.log('Creating new appointment:', newAppointment);
    
    // Ensure we're using the correct date format (YYYY-MM-DD)
    const dateString = newAppointment.date.toISOString().split('T')[0];
    
    console.log('Date conversion:', {
      originalDate: newAppointment.date,
      isoString: newAppointment.date.toISOString(),
      dateString: dateString
    });
    
    const appointmentData = {
      title: newAppointment.title,
      scheduled_date: dateString,
      scheduled_time: newAppointment.time,
      client_name: newAppointment.client,
      location: newAppointment.location,
      status: newAppointment.status,
      amount: newAppointment.amount,
      appointment_type: 'personal' as const
    };
    
    console.log('Appointment data being sent to database:', appointmentData);
    
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
