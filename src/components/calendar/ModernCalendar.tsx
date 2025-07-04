import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, ArrowLeft, Clock, MapPin, User } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { CalendarEvent } from '@/hooks/useUnifiedCalendarIntegration';
import { cn } from '@/lib/utils';

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
  const [showTodayView, setShowTodayView] = useState(false);

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

  const getTodaysEvents = () => {
    return events
      .filter(event => isSameDay(event.date, new Date()))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getPriorityColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en_route': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'client_note': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getJobTypeColor = (title: string) => {
    const jobType = title.toLowerCase();
    if (jobType.includes('cleaning')) return 'border-l-blue-500';
    if (jobType.includes('plumbing')) return 'border-l-green-500';
    if (jobType.includes('electrical')) return 'border-l-yellow-500';
    if (jobType.includes('painting')) return 'border-l-purple-500';
    if (jobType.includes('landscaping')) return 'border-l-emerald-500';
    return 'border-l-gray-500';
  };

  const formatStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      case 'en_route': return 'En Route';
      case 'client_note': return 'Client Note Added';
      default: return status;
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
          <div className="flex items-center gap-3">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              CALENDAR
            </CardTitle>
            {showTodayView && (
              <div className="text-lg font-semibold text-gray-700">
                Today - {format(new Date(), 'MMMM d, yyyy')}
              </div>
            )}
            {!showTodayView && (
              <div className="text-lg font-medium text-gray-600">
                {format(currentDate, 'MMMM yyyy')}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showTodayView ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTodayView(false)}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowTodayView(true)}
                  className="hidden sm:flex"
                >
                  Today's Schedule
                </Button>
              </>
            )}
            {onAddAppointment && (
              <Button size="sm" onClick={onAddAppointment}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn("transition-all duration-300", showTodayView ? "p-0" : "")}>
        {showTodayView ? (
          // Today's Schedule View
          <div className="h-[500px] overflow-y-auto">
            <div className="p-6 space-y-4">
              {getTodaysEvents().length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs scheduled for today</h3>
                    <p className="text-gray-600">Take some time to plan ahead or enjoy a well-deserved break!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {getTodaysEvents().map((event, index) => (
                    <div
                      key={index}
                      className={cn(
                        "bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border-l-4",
                        getJobTypeColor(event.title)
                      )}
                      onClick={() => onEditEvent?.(event.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-2xl font-bold text-gray-900">
                              {event.time}
                            </div>
                            <Badge className={cn("px-2 py-1 text-xs font-medium border", getPriorityColor(event.status))}>
                              {formatStatusText(event.status)}
                            </Badge>
                          </div>
                          
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{event.client}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>2 hours</span> {/* Default duration, you can make this dynamic */}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-600">
                            ${event.amount}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Monthly Calendar View
          <div>
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
                    className={cn(
                      "min-h-[80px] p-1 border border-gray-100 rounded-lg transition-all duration-200",
                      isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                      isCurrentDay ? 'ring-2 ring-blue-500 bg-blue-50' : '',
                      'hover:bg-blue-50 cursor-pointer'
                    )}
                    onClick={() => {
                      if (isCurrentDay) {
                        setShowTodayView(true);
                      }
                    }}
                  >
                    <div className={cn(
                      "text-sm font-medium mb-1",
                      isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                      isCurrentDay ? 'text-blue-600 font-bold' : ''
                    )}>
                      {format(date, 'd')}
                    </div>
                    
                    <div className="space-y-1">
                      {dayEvents.slice(0, compact ? 1 : 3).map((event, eventIndex) => (
                        <Badge
                          key={eventIndex}
                          className={cn(
                            "text-xs px-1 py-0 w-full justify-start cursor-pointer border",
                            getPriorityColor(event.status)
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditEvent?.(event.id);
                          }}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModernCalendar;
