import React, { useState, useMemo, useEffect } from 'react';
import Header from "@/components/Header";
import CalendarTierBanner from "@/components/CalendarTierBanner";
import PremiumFeatureGate from "@/components/PremiumFeatureGate";
import GoogleCalendarIntegration from "@/components/GoogleCalendarIntegration";
import EditAppointmentDialog from "@/components/EditAppointmentDialog";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import UnifiedCalendar from "@/components/calendar/UnifiedCalendar";
import EventsList from "@/components/calendar/EventsList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedCalendarIntegration } from '@/hooks/useUnifiedCalendarIntegration';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';
import { CalendarEvent } from '@/hooks/useBookingCalendarIntegration';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isGoogleSyncMode, setIsGoogleSyncMode] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<CalendarEvent | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [googleEvents, setGoogleEvents] = useState<any[]>([]);
  
  const { isFeatureAvailable } = useSubscription();
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentRole } = useRole();
  const navigate = useNavigate();
  const { isConnected: googleConnected } = useGoogleCalendar();
  const { events, fetchEvents, loading: calendarLoading } = useCalendarEvents();
  const { 
    allEvents, 
    loading, 
    createAppointment, 
    updateEvent, 
    deleteEvent 
  } = useUnifiedCalendarIntegration();

  // Determine back navigation based on user role
  const getBackNavigation = () => {
    if (currentRole === 'provider') {
      return {
        href: '/provider-bookings',
        label: 'Back to Booking Management'
      };
    } else {
      return {
        href: '/customer-bookings',
        label: 'Back to My Bookings'
      };
    }
  };

  // Fetch Google Calendar events when connected and in sync mode
  useEffect(() => {
    if (googleConnected && isGoogleSyncMode && user && date) {
      const fetchGoogleEvents = async () => {
        const startDate = new Date(date);
        startDate.setDate(startDate.getDate() - 7); // Get events from a week before
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 7); // Get events until a week after
        
        const googleEventsData = await fetchEvents(
          user.id, 
          startDate.toISOString(), 
          endDate.toISOString()
        );
        
        if (googleEventsData) {
          setGoogleEvents(googleEventsData);
        }
      };
      
      fetchGoogleEvents();
    }
  }, [googleConnected, isGoogleSyncMode, user, date, fetchEvents]);

  // Calculate selected events based on current date and sync mode
  const selectedEvents = useMemo(() => {
    if (!date) {
      console.log('No date selected');
      return [];
    }
    
    const selectedYear = date.getFullYear();
    const selectedMonth = date.getMonth();
    const selectedDay = date.getDate();
    
    let combinedEvents = [...allEvents];
    
    // Add Google Calendar events if in sync mode
    if (isGoogleSyncMode && googleEvents.length > 0) {
      const googleCalendarEvents = googleEvents.map(event => ({
        id: `google-${event.id}`,
        title: event.summary || 'Busy',
        date: new Date(event.start),
        time: new Date(event.start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        client: 'Google Calendar',
        location: event.location || 'Non spécifié',
        status: 'confirmed' as const,
        amount: 0,
        source: 'google' as const,
        booking_id: undefined,
        is_provider: false
      }));
      
      combinedEvents = [...combinedEvents, ...googleCalendarEvents];
    }
    
    const eventsForDate = combinedEvents.filter(event => {
      const eventYear = event.date.getFullYear();
      const eventMonth = event.date.getMonth();
      const eventDay = event.date.getDate();
      
      return eventYear === selectedYear && 
             eventMonth === selectedMonth && 
             eventDay === selectedDay;
    });
    
    if (isGoogleSyncMode) {
      return eventsForDate; // Show all events when Google sync is on
    } else {
      return eventsForDate.filter(event => event.source === 'housie'); // Only HOUSIE events
    }
  }, [date, allEvents, isGoogleSyncMode, googleEvents]);

  const handleDateSelect = (newDate: Date | undefined) => {
    console.log('Date selected:', {
      newDate,
      totalEvents: allEvents.length,
      eventsForNewDate: newDate ? allEvents.filter(event => {
        return event.date.getFullYear() === newDate.getFullYear() &&
               event.date.getMonth() === newDate.getMonth() &&
               event.date.getDate() === newDate.getDate();
      }).length : 0
    });
    setDate(newDate);
  };

  const handleAddAppointment = async (newAppointment: Omit<CalendarEvent, 'id'>) => {
    console.log('Calendar: Creating appointment:', newAppointment);
    const result = await createAppointment(newAppointment);
    if (result) {
      console.log('Calendar: Appointment created successfully:', result);
    }
  };

  const handleUpdateAppointment = async (updatedAppointment: CalendarEvent) => {
    await updateEvent(updatedAppointment.id, updatedAppointment);
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    await deleteEvent(appointmentId);
  };

  const handleEditAppointment = (appointment: CalendarEvent) => {
    setEditingAppointment(appointment);
    setEditDialogOpen(true);
  };

  const handleGoogleSync = () => {
    toast({
      title: "Synchronisation démarrée",
      description: "Synchronisation avec Google Calendar en cours...",
    });
    console.log('Google Calendar sync triggered');
  };

  const handleImportEvents = () => {
    toast({
      title: "Importation démarrée",
      description: "Importation des événements Google Calendar...",
    });
    console.log('Import events triggered');
  };

  const handleExportEvents = () => {
    toast({
      title: "Exportation démarrée",
      description: "Exportation vers Google Calendar...",
    });
    console.log('Export events triggered');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button
              onClick={() => navigate(getBackNavigation().href)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {getBackNavigation().label}
            </Button>
          </div>

          <CalendarHeader />
          <CalendarTierBanner />

          <div className="grid lg:grid-cols-2 gap-8">
            <UnifiedCalendar
              date={date}
              onDateSelect={handleDateSelect}
              isGoogleSyncMode={isGoogleSyncMode}
              onModeToggle={setIsGoogleSyncMode}
              onAddAppointment={handleAddAppointment}
            />

            <EventsList
              date={date}
              events={selectedEvents}
              loading={loading}
              calendarLoading={calendarLoading}
              isGoogleSyncMode={isGoogleSyncMode}
              onAddAppointment={handleAddAppointment}
              onEditAppointment={handleEditAppointment}
              onDeleteAppointment={handleDeleteAppointment}
            />
          </div>

          {/* Google Calendar Integration Panel (Only shown when Premium) */}
          {isFeatureAvailable('google_calendar') && (
            <div className="mt-8">
              <GoogleCalendarIntegration
                onSync={handleGoogleSync}
                onImport={handleImportEvents}
                onExport={handleExportEvents}
              />
            </div>
          )}

          {/* Premium Upsell for Non-Subscribers */}
          {!isFeatureAvailable('google_calendar') && (
            <div className="mt-8">
              <PremiumFeatureGate
                feature="google_calendar"
                title="Synchronisation Google Calendar"
                description="Activez la synchronisation bidirectionnelle avec Google Calendar pour accéder à tous vos événements en un seul endroit."
                previewMode={false}
              >
                <div />
              </PremiumFeatureGate>
            </div>
          )}

          {/* Edit Appointment Dialog */}
          <EditAppointmentDialog
            appointment={editingAppointment}
            open={editDialogOpen}
            onClose={() => {
              setEditDialogOpen(false);
              setEditingAppointment(null);
            }}
            onUpdateAppointment={handleUpdateAppointment}
            onDeleteAppointment={handleDeleteAppointment}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
