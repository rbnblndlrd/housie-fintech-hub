
import React, { useState } from 'react';
import Header from '@/components/Header';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import ModernCalendar from '@/components/calendar/ModernCalendar';
import AddAppointmentDialog from '@/components/AddAppointmentDialog';
import EditAppointmentDialog from '@/components/EditAppointmentDialog';
import { useUnifiedCalendarIntegration } from '@/hooks/useUnifiedCalendarIntegration';

const Calendar = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const { allEvents } = useUnifiedCalendarIntegration();

  const handleAddAppointment = () => {
    setShowAddDialog(true);
  };

  const handleEditEvent = (eventId: string) => {
    setEditingEventId(eventId);
  };

  const editingEvent = editingEventId 
    ? allEvents.find(event => event.id === editingEventId)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <CalendarHeader />
          
          <ModernCalendar
            onAddAppointment={handleAddAppointment}
            onEditEvent={handleEditEvent}
          />
        </div>
      </div>

      {/* Add Appointment Dialog */}
      <AddAppointmentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      {/* Edit Appointment Dialog */}
      {editingEvent && (
        <EditAppointmentDialog
          open={!!editingEventId}
          onOpenChange={(open) => !open && setEditingEventId(null)}
          appointment={editingEvent}
        />
      )}
    </div>
  );
};

export default Calendar;
