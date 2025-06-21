
import React from 'react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from 'lucide-react';
import CalendarModeToggle from './CalendarModeToggle';
import AddAppointmentDialog from "@/components/AddAppointmentDialog";
import { CalendarEvent } from '@/hooks/useBookingCalendarIntegration';

interface UnifiedCalendarProps {
  date: Date | undefined;
  onDateSelect: (newDate: Date | undefined) => void;
  isGoogleSyncMode: boolean;
  onModeToggle: (checked: boolean) => void;
  onAddAppointment: (newAppointment: Omit<CalendarEvent, 'id'>) => Promise<void>;
}

const UnifiedCalendar: React.FC<UnifiedCalendarProps> = ({
  date,
  onDateSelect,
  isGoogleSyncMode,
  onModeToggle,
  onAddAppointment
}) => {
  return (
    <Card className="fintech-card hover:shadow-xl transition-all duration-300">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          Calendrier Unifié
        </CardTitle>
        
        <CalendarModeToggle 
          isGoogleSyncMode={isGoogleSyncMode}
          onModeToggle={onModeToggle}
        />
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={onDateSelect}
          className="rounded-2xl border-0 shadow-inner bg-gradient-to-br from-gray-50 to-gray-100/50"
        />
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <AddAppointmentDialog 
            selectedDate={date}
            onAddAppointment={onAddAppointment}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedCalendar;
