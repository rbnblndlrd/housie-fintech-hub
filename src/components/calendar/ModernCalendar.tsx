
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { CalendarEvent } from '@/hooks/useUnifiedCalendarIntegration';

interface ModernCalendarProps {
  events?: CalendarEvent[];
  loading?: boolean;
  onAddAppointment?: () => void;
  onEditEvent?: (eventId: string) => void;
  compact?: boolean;
}

const ModernCalendar: React.FC<ModernCalendarProps> = ({ 
  events = [],
  loading = false,
  onAddAppointment, 
  onEditEvent, 
  compact = false 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getPriorityColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="fintech-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fintech-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            {format(currentDate, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            {onAddAppointment && (
              <Button size="sm" onClick={onAddAppointment}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const dayEvents = getEventsForDay(date);
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isCurrentDay = isToday(date);

            return (
              <div
                key={index}
                className={`
                  min-h-[80px] p-1 border border-gray-100 rounded-lg
                  ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                  ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}
                  hover:bg-blue-50 transition-colors cursor-pointer
                `}
              >
                <div className={`
                  text-sm font-medium mb-1
                  ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  ${isCurrentDay ? 'text-blue-600' : ''}
                `}>
                  {format(date, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, compact ? 1 : 3).map((event, eventIndex) => (
                    <Badge
                      key={eventIndex}
                      className={`
                        text-xs px-1 py-0 w-full justify-start cursor-pointer
                        ${getPriorityColor(event.status)}
                      `}
                      onClick={() => onEditEvent?.(event.id)}
                    >
                      <div className="truncate">
                        {event.time} {event.title}
                      </div>
                    </Badge>
                  ))}
                  {dayEvents.length > (compact ? 1 : 3) && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - (compact ? 1 : 3)} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Today's Events Summary */}
        {!compact && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Today's Events</h4>
            <div className="space-y-2">
              {getEventsForDay(new Date()).length === 0 ? (
                <p className="text-sm text-gray-500">No events scheduled for today</p>
              ) : (
                getEventsForDay(new Date()).map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => onEditEvent?.(event.id)}
                  >
                    <div>
                      <div className="font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-600">
                        {event.time} • {event.client} • ${event.amount}
                      </div>
                    </div>
                    <Badge className={getPriorityColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModernCalendar;
