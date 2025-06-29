
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { CalendarEvent } from '@/hooks/useUnifiedCalendarIntegration';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';

interface UnifiedCalendarViewProps {
  events?: CalendarEvent[];
  loading?: boolean;
  onAddAppointment?: () => void;
  onEditEvent?: (eventId: string) => void;
}

const UnifiedCalendarView: React.FC<UnifiedCalendarViewProps> = ({ 
  events = [],
  loading = false,
  onAddAppointment, 
  onEditEvent 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [googleSyncEnabled, setGoogleSyncEnabled] = useState(false);
  const { isConnected, connectCalendar } = useGoogleCalendar();

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  // Filter events based on Google sync setting
  const filteredEvents = useMemo(() => {
    if (!googleSyncEnabled) {
      return events.filter(event => event.source === 'housie');
    }
    return events;
  }, [events, googleSyncEnabled]);

  // Detect conflicts (overlapping events)
  const detectConflicts = (dayEvents: CalendarEvent[]) => {
    const conflicts = [];
    for (let i = 0; i < dayEvents.length; i++) {
      for (let j = i + 1; j < dayEvents.length; j++) {
        const event1 = dayEvents[i];
        const event2 = dayEvents[j];
        
        // Simple time overlap check (could be enhanced)
        if (event1.time === event2.time) {
          conflicts.push(event1.id, event2.id);
        }
      }
    }
    return conflicts;
  };

  const getEventsForDay = (date: Date) => {
    return filteredEvents.filter(event => isSameDay(event.date, date));
  };

  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getEventColor = (event: CalendarEvent, conflicts: string[]) => {
    if (conflicts.includes(event.id)) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    
    switch (event.source) {
      case 'housie': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'google': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleGoogleSyncToggle = (enabled: boolean) => {
    if (enabled && !isConnected) {
      connectCalendar();
    }
    setGoogleSyncEnabled(enabled);
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
    <div className="space-y-6">
      {/* Event Legend */}
      <Card className="fintech-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">HOUSIE Jobs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Personal Events</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Schedule Conflicts</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                )}
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Google Connected' : 'Not Connected'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="google-sync"
                  checked={googleSyncEnabled}
                  onCheckedChange={handleGoogleSyncToggle}
                />
                <Label htmlFor="google-sync" className="text-sm">
                  Sync with Google Calendar
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unified Calendar */}
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
                <Button size="sm" onClick={onAddAppointment} className="bg-blue-600 hover:bg-blue-700">
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
              const conflicts = detectConflicts(dayEvents);
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
                    {dayEvents.slice(0, 3).map((event, eventIndex) => (
                      <Badge
                        key={eventIndex}
                        className={`
                          text-xs px-1 py-0 w-full justify-start cursor-pointer border
                          ${getEventColor(event, conflicts)}
                        `}
                        onClick={() => onEditEvent?.(event.id)}
                      >
                        <div className="truncate">
                          {event.time} {event.title}
                        </div>
                      </Badge>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Today's Events Summary */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Today's Schedule</h4>
            <div className="space-y-2">
              {getEventsForDay(new Date()).length === 0 ? (
                <p className="text-sm text-gray-500">No events scheduled for today</p>
              ) : (
                getEventsForDay(new Date()).map((event, index) => {
                  const conflicts = detectConflicts(getEventsForDay(new Date()));
                  return (
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
                      <div className="flex items-center space-x-2">
                        <Badge className={getEventColor(event, conflicts)}>
                          {event.source === 'housie' ? 'HOUSIE' : 'Google'}
                        </Badge>
                        <Badge className={`
                          ${event.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'}
                        `}>
                          {event.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedCalendarView;
