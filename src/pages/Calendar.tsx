
import React, { useState } from 'react';
import Header from '@/components/Header';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import ModernCalendar from '@/components/calendar/ModernCalendar';
import AddAppointmentDialog from '@/components/AddAppointmentDialog';
import EditAppointmentDialog from '@/components/EditAppointmentDialog';
import { useUnifiedCalendarIntegration } from '@/hooks/useUnifiedCalendarIntegration';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const { allEvents, createAppointment } = useUnifiedCalendarIntegration();

  const handleAddAppointment = async (newAppointment: Omit<CalendarEvent, 'id'>) => {
    await createAppointment(newAppointment);
  };

  const handleEditEvent = (eventId: string) => {
    const event = allEvents.find(event => event.id === eventId);
    if (event) {
      setEditingEvent(event as CalendarEvent);
    }
  };

  const handleUpdateAppointment = (updatedAppointment: CalendarEvent) => {
    // This will be handled by the unified calendar integration
    setEditingEvent(null);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    // This will be handled by the unified calendar integration
    setEditingEvent(null);
  };

  const handleCloseEdit = () => {
    setEditingEvent(null);
  };

  // Function that matches ModernCalendar's expected signature
  const handleCalendarAddClick = () => {
    // This will trigger when ModernCalendar wants to add an appointment
    console.log('Calendar add appointment clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <CalendarHeader />
          
          <div className="mb-6">
            <AddAppointmentDialog
              selectedDate={selectedDate}
              onAddAppointment={handleAddAppointment}
            >
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Appointment
              </Button>
            </AddAppointmentDialog>
          </div>
          
          <ModernCalendar
            onAddAppointment={handleCalendarAddClick}
            onEditEvent={handleEditEvent}
          />
        </div>
      </div>

      {/* Edit Appointment Dialog */}
      {editingEvent && (
        <EditAppointmentDialog
          appointment={editingEvent}
          open={!!editingEvent}
          onClose={handleCloseEdit}
          onUpdateAppointment={handleUpdateAppointment}
          onDeleteAppointment={handleDeleteAppointment}
        />
      )}
    </div>
  );
};

export default Calendar;
