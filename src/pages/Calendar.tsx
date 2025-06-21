import React, { useState, useMemo, useEffect } from 'react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import CalendarTierBanner from "@/components/CalendarTierBanner";
import PremiumFeatureGate from "@/components/PremiumFeatureGate";
import GoogleCalendarIntegration from "@/components/GoogleCalendarIntegration";
import AddAppointmentDialog from "@/components/AddAppointmentDialog";
import EditAppointmentDialog from "@/components/EditAppointmentDialog";
import { Clock, MapPin, User, Calendar as CalendarIcon, Wifi, WifiOff, Briefcase } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedCalendarIntegration } from '@/hooks/useUnifiedCalendarIntegration';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';
import { CalendarEvent } from '@/hooks/useBookingCalendarIntegration';
import { useAuth } from '@/contexts/AuthContext';

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isGoogleSyncMode, setIsGoogleSyncMode] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<CalendarEvent | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [googleEvents, setGoogleEvents] = useState<any[]>([]);
  
  const { isFeatureAvailable } = useSubscription();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isConnected: googleConnected } = useGoogleCalendar();
  const { events, fetchEvents, loading: calendarLoading } = useCalendarEvents();
  const { 
    allEvents, 
    loading, 
    createAppointment, 
    updateEvent, 
    deleteEvent 
  } = useUnifiedCalendarIntegration();

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

  // Helper functions for status styling
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

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

  const handleModeToggle = (checked: boolean) => {
    if (checked && !isFeatureAvailable('google_calendar')) {
      toast({
        title: "Fonctionnalité Premium",
        description: "La synchronisation Google Calendar nécessite un abonnement Premium.",
        variant: "destructive",
      });
      return;
    }
    
    if (checked && !googleConnected) {
      toast({
        title: "Google Calendar non connecté",
        description: "Veuillez d'abord connecter votre Google Calendar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGoogleSyncMode(checked);
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
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Calendrier
            </h1>
            <p className="text-gray-600">Gérez votre planning et vos rendez-vous</p>
          </div>

          {/* Subscription Tier Banner */}
          <CalendarTierBanner />

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Unified Calendar */}
            <Card className="fintech-card hover:shadow-xl transition-all duration-300">
              <CardHeader className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                    Calendrier Unifié
                  </CardTitle>
                  
                  {/* Mode Status Indicator */}
                  <div className="flex items-center gap-2">
                    {isGoogleSyncMode ? (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        <Wifi className="h-3 w-3 mr-1" />
                        Synchronisé
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <WifiOff className="h-3 w-3 mr-1" />
                        Local
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="sync-mode" className="text-sm font-medium text-gray-700">
                      Mode Calendrier
                    </Label>
                    <div className="text-xs text-gray-500">
                      {isGoogleSyncMode ? 'Google Calendar Sync' : 'HOUSIE Local'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="sync-mode"
                      checked={isGoogleSyncMode}
                      onCheckedChange={handleModeToggle}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
                    />
                    {!isFeatureAvailable('google_calendar') && isGoogleSyncMode === false && (
                      <Badge variant="outline" className="text-xs">
                        Premium requis
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 pt-0">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  className="rounded-2xl border-0 shadow-inner bg-gradient-to-br from-gray-50 to-gray-100/50"
                />
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <AddAppointmentDialog 
                    selectedDate={date}
                    onAddAppointment={handleAddAppointment}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Events for Selected Date */}
            <Card className="fintech-card hover:shadow-xl transition-all duration-300">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center justify-between">
                  <span>
                    Rendez-vous du {date?.toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {selectedEvents.length} événement{selectedEvents.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {loading || calendarLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Chargement...</p>
                  </div>
                ) : selectedEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 inline-block mb-6">
                      <CalendarIcon className="h-16 w-16 text-white mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Aucun rendez-vous
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {isGoogleSyncMode 
                        ? 'Aucun événement synchronisé pour cette date.'
                        : 'Vous n\'avez pas de rendez-vous HOUSIE pour cette date.'
                      }
                    </p>
                    <AddAppointmentDialog 
                      selectedDate={date}
                      onAddAppointment={handleAddAppointment}
                    >
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-[0_4px_15px_-2px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_-2px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-200">
                        Ajouter un Rendez-vous
                      </Button>
                    </AddAppointmentDialog>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedEvents.map((event) => (
                      <div key={event.id} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl shadow-inner hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              {event.title}
                              {event.booking_id && (
                                <Badge variant="outline" className="text-xs">
                                  <Briefcase className="h-3 w-3 mr-1" />
                                  Réservation
                                </Badge>
                              )}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${getStatusColor(event.status)} text-white border-0 shadow-sm`}>
                                {getStatusText(event.status)}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${event.source === 'google' ? 'border-green-300 text-green-700' : 'border-blue-300 text-blue-700'}`}
                              >
                                {event.source === 'google' ? 'Google' : 'HOUSIE'}
                              </Badge>
                              {event.is_provider && (
                                <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                                  Prestataire
                                </Badge>
                              )}
                            </div>
                          </div>
                          {event.amount > 0 && (
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">${event.amount}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                              <Clock className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm text-gray-700">{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                              <User className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm text-gray-700">{event.client}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="p-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                              <MapPin className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm text-gray-700">{event.location}</span>
                          </div>
                        </div>
                        
                        {event.source !== 'google' && (
                          <div className="mt-4 flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleEditAppointment(event)}
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              Modifier
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDeleteAppointment(event.id)}
                              className="border-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all duration-200"
                            >
                              {event.booking_id ? 'Annuler' : 'Supprimer'}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
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
