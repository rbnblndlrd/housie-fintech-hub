
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon } from 'lucide-react';
import CalendarEventCard from './CalendarEventCard';
import AddAppointmentDialog from "@/components/AddAppointmentDialog";
import { CalendarEvent } from '@/hooks/useBookingCalendarIntegration';

interface EventsListProps {
  date: Date | undefined;
  events: CalendarEvent[];
  loading: boolean;
  calendarLoading: boolean;
  isGoogleSyncMode: boolean;
  onAddAppointment: (newAppointment: Omit<CalendarEvent, 'id'>) => Promise<void>;
  onEditAppointment: (appointment: CalendarEvent) => void;
  onDeleteAppointment: (appointmentId: string) => Promise<void>;
}

const EventsList: React.FC<EventsListProps> = ({
  date,
  events,
  loading,
  calendarLoading,
  isGoogleSyncMode,
  onAddAppointment,
  onEditAppointment,
  onDeleteAppointment
}) => {
  if (loading || calendarLoading) {
    return (
      <Card className="fintech-card hover:shadow-xl transition-all duration-300">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  return (
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
            {events.length} événement{events.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {events.length === 0 ? (
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
              onAddAppointment={onAddAppointment}
            >
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-[0_4px_15px_-2px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_-2px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-200">
                Ajouter un Rendez-vous
              </Button>
            </AddAppointmentDialog>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <CalendarEventCard
                key={event.id}
                event={event}
                onEdit={onEditAppointment}
                onDelete={onDeleteAppointment}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsList;
