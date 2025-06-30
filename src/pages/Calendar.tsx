import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Home, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

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
    },
    {
      id: 4,
      title: 'Kitchen Repair',
      client: 'Pierre Gagnon',
      date: new Date(2024, 0, 16, 16, 30),
      duration: 45,
      priority: 'low',
      location: 'Verdun'
    },
    {
      id: 5,
      title: 'Bathroom Fix',
      client: 'Claire Dubois',
      date: new Date(2024, 0, 17, 11, 0),
      duration: 75,
      priority: 'high',
      location: 'NDG'
    }
  ];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

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
    <div className="min-h-screen">
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Navigation */}
          <div className="flex items-center justify-between mb-6">
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
                <p className="text-white/90 drop-shadow-lg">Manage your appointments and schedule</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-white bg-black/20 backdrop-blur-sm rounded-md px-4 py-2 font-medium min-w-[150px] text-center">
                  {format(currentDate, 'MMMM yyyy')}
                </div>
                <Button variant="outline" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard Home
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-blue-500" />
                Schedule Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center font-medium text-gray-500 border-b">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-[120px] p-2 border rounded-lg ${
                        isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                      } ${isSameDay(day, new Date()) ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <div className={`text-sm font-medium mb-2 ${
                        isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {format(day, 'd')}
                      </div>
                      
                      <div className="space-y-1">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded truncate ${getPriorityColor(event.priority)}`}
                            title={`${event.title} - ${event.client} at ${format(event.date, 'HH:mm')}`}
                          >
                            <div className="font-medium">{format(event.date, 'HH:mm')}</div>
                            <div className="truncate">{event.title}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="mt-6 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events
                  .filter(event => isSameDay(event.date, new Date()))
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
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
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost">
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
  );
};

export default Calendar;
