import React, { useState } from 'react';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SimpleCalendar = () => {
  const [showSchedule, setShowSchedule] = useState(false);
  
  // Sample today's jobs
  const todaysJobs = [
    {
      id: 1,
      time: "10:00 AM",
      service: "House Cleaning",
      customer: "Sarah Johnson"
    },
    {
      id: 2,
      time: "2:00 PM", 
      service: "Plumbing Repair",
      customer: "Mike Chen"
    },
    {
      id: 3,
      time: "4:30 PM",
      service: "Lawn Care", 
      customer: "Emma Davis"
    }
  ];

  return (
    <div className="fixed top-4 right-4 w-96 h-[480px] z-50">
      <Card className="h-full w-full bg-white/95 border border-gray-200 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-3 px-4 pt-4">
          <CardTitle className="flex items-center justify-between text-sm font-bold text-gray-800">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              CALENDAR
            </div>
            <div className="flex items-center gap-2">
              {showSchedule ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSchedule(false)}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-3 w-3" />
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSchedule(true)}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}
              <span className="text-xs border border-gray-300 px-2 py-1 rounded bg-gray-50">
                {showSchedule ? 'Today' : 'Jan 2024'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0 px-4 pb-4 h-full flex flex-col">
          {showSchedule ? (
            // Schedule View
            <div className="flex-1 space-y-3">
              <div className="text-sm font-semibold text-gray-700 mb-4">
                Today's Schedule - January 15, 2024
              </div>
              
              {todaysJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">No jobs today</h4>
                    <p className="text-xs text-gray-600">Enjoy your free time!</p>
                  </div>
                </div>
              ) : (
                todaysJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-sm font-bold text-gray-900">
                            {job.time}
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="font-medium text-gray-800">{job.service}</div>
                          <div>{job.customer}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Calendar View
            <div className="flex flex-col h-full">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-3">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                  <div key={day} className="py-2 text-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 flex-1">
                {Array.from({length: 35}, (_, i) => {
                  const date = i - 1; // Start from 0 for easier calculation
                  const displayDate = date <= 0 ? 30 + date : date > 31 ? date - 31 : date;
                  const isCurrentMonth = date > 0 && date <= 31;
                  const isToday = date === 15;
                  const hasJob = [3, 8, 15, 22, 28].includes(date);
                  
                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "flex items-center justify-center text-sm font-medium cursor-pointer rounded transition-colors relative min-h-[45px]",
                        !isCurrentMonth && 'text-gray-300',
                        isToday ? 'bg-gray-900 text-white font-bold' : 'hover:bg-gray-100 text-gray-700',
                        hasJob && !isToday && 'bg-gray-100 text-gray-800'
                      )}
                      onClick={() => {
                        if (isToday) {
                          setShowSchedule(true);
                        }
                      }}
                    >
                      {displayDate}
                      {hasJob && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleCalendar;