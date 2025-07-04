import React, { useState } from 'react';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      title: "Cleaning Services",
      client: "Sarah Johnson", 
      location: "123 Main St, Toronto",
      status: "Confirmed",
      amount: 120,
      duration: "2 hours"
    },
    {
      id: 2,
      time: "2:00 PM", 
      title: "Appliance & Tech Repair",
      client: "Mike Chen",
      location: "456 Oak Ave, Toronto", 
      status: "Pending",
      amount: 85,
      duration: "1.5 hours"
    },
    {
      id: 3,
      time: "4:30 PM",
      title: "Personal Wellness", 
      client: "Emma Davis",
      location: "789 Pine Rd, Toronto",
      status: "En Route", 
      amount: 150,
      duration: "2.5 hours"
    }
  ];

  const getServiceIcon = (title: string) => {
    const serviceType = title.toLowerCase();
    if (serviceType.includes('personal wellness')) return '💆';
    if (serviceType.includes('cleaning')) return '🧹';
    if (serviceType.includes('exterior') || serviceType.includes('grounds')) return '🌿';
    if (serviceType.includes('pet')) return '🐕';
    if (serviceType.includes('appliance') || serviceType.includes('tech') || serviceType.includes('repair')) return '🔧';
    if (serviceType.includes('event')) return '🎪';
    if (serviceType.includes('moving') || serviceType.includes('delivery')) return '🚚';
    return '🔧'; // default
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
        <Card className="h-full w-full bg-white border border-gray-200 shadow-lg">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                CALENDAR
              </div>
              <div className="flex items-center gap-2">
                {showTodayView ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTodayView(false)}
                    className="h-6 w-6 p-0 hover:bg-gray-100"
                  >
                    <ArrowLeft className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTodayView(true)}
                    className="h-6 w-6 p-0 hover:bg-gray-100"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
                <span className="text-xs border border-gray-300 px-2 py-1 rounded">
                  {showTodayView ? format(new Date(), 'MMM d, yyyy') : 'Jan 2024'}
                </span>
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
              // Today's Schedule View - REPLACES the calendar entirely
              <div className="h-[280px] overflow-y-auto space-y-3">
                {todaysEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-gray-600" />
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
                      className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-lg font-bold text-gray-900">
                              {event.time}
                            </div>
                            <div className="text-lg">
                              {getServiceIcon(event.title)}
                            </div>
                            <span className="text-xs text-gray-500 font-medium">
                              {event.status}
                            </span>
                          </div>
                          
                          <div className="space-y-1 text-xs text-gray-600">
                            <div>{event.client}</div>
                            <div className="truncate">{event.location}</div>
                            <div>{event.duration}</div>
                          </div>
                        </div>
                        
                        <div className="text-right ml-2">
                          <div className="text-sm font-semibold text-gray-900">
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
              <div>
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
                          isToday ? 'bg-gray-900 text-white font-bold' : 'hover:bg-gray-100',
                          hasEvent && !isToday && 'bg-gray-100 text-gray-800'
                        )}
                        onClick={() => {
                          if (isToday) {
                            setShowTodayView(true);
                          }
                        }}
                      >
                        {isCurrentMonth ? date : date <= 0 ? 30 + date : date - 31}
                        {hasEvent && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-600 rounded-full"></div>
                        )}
                      </div>
                    );
                  })}
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