import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

interface CleaningMiniCalendarProps {
  bookings: any[];
}

const CleaningMiniCalendar: React.FC<CleaningMiniCalendarProps> = ({ bookings }) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Generate calendar days for current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const dayNumber = index - firstDayOfMonth + 1;
    const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
    const isToday = isCurrentMonth && dayNumber === today.getDate();
    
    // Mock booking data for demonstration
    const hasBooking = isCurrentMonth && [3, 7, 12, 18, 22, 28].includes(dayNumber);
    
    return {
      day: isCurrentMonth ? dayNumber : '',
      isCurrentMonth,
      isToday,
      hasBooking
    };
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <Card className="fintech-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-purple-500" />
          {monthNames[currentMonth]} {currentYear}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center text-xs relative
                ${day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                ${day.isToday ? 'bg-primary text-primary-foreground rounded-full font-bold' : ''}
                ${day.hasBooking && !day.isToday ? 'bg-blue-100 dark:bg-blue-900 rounded' : ''}
                ${day.isCurrentMonth ? 'hover:bg-muted rounded cursor-pointer' : ''}
              `}
            >
              {day.day}
              {day.hasBooking && (
                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-muted-foreground">Scheduled job</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-blue-500" />
            <span className="text-muted-foreground">6 jobs this month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CleaningMiniCalendar;