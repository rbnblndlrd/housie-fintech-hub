import React, { useState } from 'react';
import { Calendar, ArrowLeft, Clock, MapPin, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DraggableWidget from '@/components/dashboard/DraggableWidget';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const FloatingCalendar = () => {
  const { updateWidgetPosition, updateWidgetSize, toggleWidgetLock, getWidgetConfig } = useDashboardLayout();
  const [showTodayView, setShowTodayView] = useState(false);
  
  // Sample today's events data
  const todaysEvents = [
    {
      id: 1,
      time: "10:00 AM",
      title: "House Cleaning",
      client: "Sarah Johnson", 
      location: "123 Main St, Toronto",
      status: "confirmed",
      amount: 120,
      duration: "2 hours"
    },
    {
      id: 2,
      time: "2:00 PM", 
      title: "Plumbing Repair",
      client: "Mike Chen",
      location: "456 Oak Ave, Toronto", 
      status: "pending",
      amount: 85,
      duration: "1.5 hours"
    },
    {
      id: 3,
      time: "4:30 PM",
      title: "Electrical Work", 
      client: "Emma Davis",
      location: "789 Pine Rd, Toronto",
      status: "en_route", 
      amount: 150,
      duration: "2.5 hours"
    }
  ];

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

  return (
    <div className="fixed top-0 left-0 z-50">
      <DraggableWidget
        id="floating-calendar"
        defaultPosition={getWidgetConfig('floating-calendar')?.position || { x: window.innerWidth - 430, y: 100 }}
        defaultSize={getWidgetConfig('floating-calendar')?.size || { width: 400, height: showTodayView ? 500 : 320 }}
        isLocked={getWidgetConfig('floating-calendar')?.isLocked || false}
        onPositionChange={updateWidgetPosition}
        onSizeChange={updateWidgetSize}
        onLockToggle={toggleWidgetLock}
      >
        <Card className="h-full w-full bg-gradient-to-br from-amber-50 to-orange-100 border-0 shadow-xl">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                CALENDAR
              </div>
              <div className="flex items-center gap-2">
                {showTodayView && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTodayView(false)}
                    className="h-6 w-6 p-0 hover:bg-amber-200"
                  >
                    <ArrowLeft className="h-3 w-3" />
                  </Button>
                )}
                <Badge variant="outline" className="text-xs">
                  {showTodayView ? format(new Date(), 'MMM d, yyyy') : 'Jan 2024'}
                </Badge>
              </div>
            </CardTitle>
            {showTodayView && (
              <div className="text-sm font-semibold text-gray-700">
                Today - {format(new Date(), 'MMMM d, yyyy')}
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-4 overflow-hidden">
            {showTodayView ? (
              // Today's Schedule View
              <div className="h-full overflow-y-auto space-y-3">
                {todaysEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-center space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">No jobs scheduled for today</h4>
                      <p className="text-xs text-gray-600">Take some time to plan ahead!</p>
                    </div>
                  </div>
                ) : (
                  todaysEvents.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border-l-4",
                        getJobTypeColor(event.title)
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-lg font-bold text-gray-900">
                              {event.time}
                            </div>
                            <Badge className={cn("px-2 py-0.5 text-xs font-medium border", getPriorityColor(event.status))}>
                              {formatStatusText(event.status)}
                            </Badge>
                          </div>
                          
                          <h5 className="text-sm font-semibold text-gray-900 mb-2 truncate">{event.title}</h5>
                          
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{event.client}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span>{event.duration}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right ml-2">
                          <div className="text-sm font-semibold text-green-600">
                            ${event.amount}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              // Monthly Calendar View
              <div className="space-y-3">
                {/* Mini Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                    <div key={day} className="p-1 text-center font-medium text-gray-500">{day}</div>
                  ))}
                  {Array.from({length: 35}, (_, i) => {
                    const date = i - 2;
                    const isCurrentMonth = date > 0 && date <= 31;
                    const isToday = date === 15;
                    const hasEvent = [3, 8, 15, 22, 28].includes(date);
                    
                    return (
                      <div 
                        key={i} 
                        className={cn(
                          "p-1 text-center rounded text-xs cursor-pointer relative transition-colors",
                          !isCurrentMonth && 'text-gray-300',
                          isToday ? 'bg-blue-500 text-white font-bold' : 'hover:bg-amber-200',
                          hasEvent && !isToday && 'bg-orange-100 text-orange-800'
                        )}
                        onClick={() => {
                          if (isToday) {
                            setShowTodayView(true);
                          }
                        }}
                      >
                        {isCurrentMonth ? date : date <= 0 ? 30 + date : date - 31}
                        {hasEvent && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Today's Schedule Summary */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Today's Schedule:</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowTodayView(true)}
                      className="h-5 px-2 py-0 text-xs hover:bg-amber-200"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {todaysEvents.slice(0, 2).map((event) => (
                      <div key={event.id} className="flex justify-between items-center p-1 bg-white/50 rounded">
                        <span className="truncate">{event.time} - {event.title}</span>
                        <Badge className={cn("text-xs", getPriorityColor(event.status))}>
                          {formatStatusText(event.status)}
                        </Badge>
                      </div>
                    ))}
                    {todaysEvents.length > 2 && (
                      <div className="text-center text-gray-500">
                        +{todaysEvents.length - 2} more jobs
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DraggableWidget>
    </div>
  );
};

export default FloatingCalendar;