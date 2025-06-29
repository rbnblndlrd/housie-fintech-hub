
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
  const [appointments, setAppointments] = useState<CalendarEvent[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { allEvents } = useUnifiedCalendarIntegration();

  const handleAddAppointment = (newAppointment: Omit<CalendarEvent, 'id'>) => {
    const appointment: CalendarEvent = {
      ...newAppointment,
      id: `appointment-${Date.now()}`
    };
    setAppointments(prev => [...prev, appointment]);
    setShowAddDialog(false);
  };

  const handleEditEvent = (eventId: string) => {
    const event = allEvents.find(event => event.id === eventId);
    if (event) {
      setEditingEvent(event as CalendarEvent);
    }
  };

  const handleUpdateAppointment = (updatedAppointment: CalendarEvent) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === updatedAppointment.id ? updatedAppointment : apt)
    );
    setEditingEvent(null);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    setEditingEvent(null);
  };

  const handleCloseEdit = () => {
    setEditingEvent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <CalendarHeader />
          
          <div className="mb-6">
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Appointment
            </Button>
          </div>
          
          <ModernCalendar
            onAddAppointment={() => setShowAddDialog(true)}
            onEditEvent={handleEditEvent}
          />
        </div>
      </div>

      {/* Add Appointment Dialog */}
      {showAddDialog && (
        <AddAppointmentDialog
          selectedDate={selectedDate}
          onClose={() => setShowAddDialog(false)}
          onAddAppointment={handleAddAppointment}
        />
      )}

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
