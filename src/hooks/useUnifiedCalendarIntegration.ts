
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
    console.log('Converting appointments to events:', appointments.length);
    
    return appointments.map(appointment => {
      // Parse the date string properly - create local date without timezone conversion
      const dateParts = appointment.scheduled_date.split('-');
      const appointmentDate = new Date(
        parseInt(dateParts[0]), // year
        parseInt(dateParts[1]) - 1, // month (0-based)
        parseInt(dateParts[2]) // day
      );
      
      console.log('Processing appointment:', {
        id: appointment.id,
        title: appointment.title,
        originalDateString: appointment.scheduled_date,
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
    
    // Format date as YYYY-MM-DD for database storage
    const year = newAppointment.date.getFullYear();
    const month = String(newAppointment.date.getMonth() + 1).padStart(2, '0');
    const day = String(newAppointment.date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    console.log('Date conversion:', {
      originalDate: newAppointment.date,
      year,
      month,
      day,
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
