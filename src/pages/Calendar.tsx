
import React, { useState } from 'react';
import Header from '@/components/Header';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import UnifiedCalendarView from '@/components/calendar/UnifiedCalendarView';
import AddAppointmentDialog from '@/components/AddAppointmentDialog';
import EditAppointmentDialog from '@/components/EditAppointmentDialog';
import { useUnifiedCalendarIntegration, CalendarEvent } from '@/hooks/useUnifiedCalendarIntegration';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { allEvents, loading, error, createAppointment, refreshData } = useUnifiedCalendarIntegration();

  const handleAddAppointment = async (newAppointment: Omit<CalendarEvent, 'id'>) => {
    try {
      await createAppointment(newAppointment);
      setShowAddDialog(false);
    } catch (error) {
      console.error('Failed to add appointment:', error);
    }
  };

  const handleEditEvent = (eventId: string) => {
    const event = allEvents.find(event => event.id === eventId);
    if (event) {
      setEditingEvent(event as CalendarEvent);
    }
  };

  const handleUpdateAppointment = (updatedAppointment: CalendarEvent) => {
    // Refresh data after update
    refreshData();
    setEditingEvent(null);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    // Refresh data after delete
    refreshData();
    setEditingEvent(null);
  };

  const handleCloseEdit = () => {
    setEditingEvent(null);
  };

  const handleAddClick = () => {
    setShowAddDialog(true);
  };

  const handleRetry = () => {
    refreshData();
  };

  // Show error state with retry option
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
        
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <CalendarHeader />
            
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Failed to load calendar data: {error}</span>
                <Button onClick={handleRetry} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <CalendarHeader />
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Loading calendar...</span>
            </div>
          ) : (
            <UnifiedCalendarView
              events={allEvents}
              loading={loading}
              onAddAppointment={handleAddClick}
              onEditEvent={handleEditEvent}
            />
          )}
        </div>
      </div>

      {/* Add Appointment Dialog */}
      {showAddDialog && (
        <AddAppointmentDialog
          selectedDate={selectedDate}
          onAddAppointment={handleAddAppointment}
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
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
