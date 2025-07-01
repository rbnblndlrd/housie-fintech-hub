import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import GoogleCalendarIntegration from '@/components/GoogleCalendarIntegration';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Home, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

const Calendar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Sample events data
  const events = [
    {
      id: 1,
      title: 'Plumbing Repair',
      client: 'Marie Dubois',
      date: new Date(2024, 0, 15, 10, 30),
      duration: 120,
      priority: 'high',
      location: 'Downtown Montreal'
    },
    {
      id: 2,
      title: 'HVAC Maintenance',
      client: 'Jean Martin',
      date: new Date(2024, 0, 15, 14, 0),
      duration: 90,
      priority: 'medium',
      location: 'Westmount'
    },
    {
      id: 3,
      title: 'Electrical Check',
      client: 'Sophie Tremblay',
      date: new Date(2024, 0, 16, 9, 0),
      duration: 60,
      priority: 'medium',
      location: 'Plateau'
    }
  ];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        
        {/* Reduced margin container - only affects body content, not header */}
        <div className="pt-16 px-2 pb-4">
          <div className="max-w-full mx-auto">
            
            {/* Header with Navigation */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg">Calendar</h1>
                  <p className="text-white/90 drop-shadow-md">Manage your appointments and schedule</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={prevMonth}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-white bg-black/20 backdrop-blur-sm rounded-md px-4 py-2 font-medium min-w-[150px] text-center">
                    {format(currentDate, 'MMMM yyyy')}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={nextMonth}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </div>
            </div>

            {/* Google Calendar Integration */}
            <div className="mb-4 px-2">
              <GoogleCalendarIntegration />
            </div>

            {/* Big Calendar Grid - Using fintech styling */}
            <Card className="fintech-chart-container mb-4 mx-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  Schedule Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="fintech-inner-box p-3 text-center font-medium">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day) => {
                    const dayEvents = getEventsForDay(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isToday = isSameDay(day, new Date());
                    
                    return (
                      <div
                        key={day.toISOString()}
                        className={`fintech-inner-box min-h-[140px] p-3 transition-colors ${
                          isCurrentMonth 
                            ? 'hover:bg-white' 
                            : 'opacity-50'
                        } ${isToday ? 'ring-2 ring-blue-400' : ''}`}
                      >
                        <div className={`text-sm font-medium mb-2 ${
                          isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                        } ${isToday ? 'text-blue-600 font-bold' : ''}`}>
                          {format(day, 'd')}
                        </div>
                        
                        <div className="space-y-1">
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-2 rounded cursor-pointer hover:opacity-80 ${getPriorityColor(event.priority)}`}
                              title={`${event.title} - ${event.client} at ${format(event.date, 'HH:mm')}`}
                            >
                              <div className="font-medium">{format(event.date, 'HH:mm')}</div>
                              <div className="truncate">{event.title}</div>
                              <div className="truncate opacity-80">{event.client}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Today's Schedule - Using fintech styling */}
            <Card className="fintech-card mx-2">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events
                    .filter(event => isSameDay(event.date, new Date()))
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((event) => (
                      <div key={event.id} className="fintech-inner-box flex items-center justify-between p-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-medium text-lg">{format(event.date, 'HH:mm')}</span>
                            <span className="font-medium">{event.title}</span>
                            <Badge className={`${getPriorityColor(event.priority)} text-xs`}>
                              {event.priority}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span>Client: {event.client}</span>
                            <span className="mx-2">•</span>
                            <span>Location: {event.location}</span>
                            <span className="mx-2">•</span>
                            <span>Duration: {event.duration}min</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="fintech-inner-button">
                            Edit
                          </Button>
                          <Button size="sm" className="fintech-button-primary">
                            Complete
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
                
                {events.filter(event => isSameDay(event.date, new Date())).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No appointments scheduled for today
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
