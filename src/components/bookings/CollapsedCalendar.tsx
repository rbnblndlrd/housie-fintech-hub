import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import CalendarPreview from '@/components/calendar/CalendarPreview';

interface CollapsedCalendarProps {
  bookings?: any[];
}

const CollapsedCalendar: React.FC<CollapsedCalendarProps> = ({ bookings = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const today = new Date();
  const todayBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate.toDateString() === today.toDateString();
  });

  const upcomingCount = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate > today;
  }).length;

  if (!isExpanded) {
    return (
      <Card className="fintech-card border-gray-200">
        <CardContent className="p-4">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                Calendar • {todayBookings.length} today, {upcomingCount} upcoming
              </span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fintech-card border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-gray-600" />
            Calendar View
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="p-1"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <CalendarPreview />
      </CardContent>
    </Card>
  );
};

export default CollapsedCalendar;