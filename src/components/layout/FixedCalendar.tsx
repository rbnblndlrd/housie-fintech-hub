import React, { useState } from 'react';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const FixedCalendar = () => {
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
    }
  ];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="w-[320px] h-[280px] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
        {/* Header - 30px height */}
        <div className="h-[30px] px-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-gray-600" />
            <span className="text-xs font-bold text-gray-800">CALENDAR</span>
          </div>
          <div className="flex items-center gap-2">
            {showSchedule ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowSchedule(false)}
                className="h-5 w-5 p-0 hover:bg-gray-100"
              >
                <ArrowLeft className="h-2.5 w-2.5" />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowSchedule(true)}
                className="h-5 w-5 p-0 hover:bg-gray-100"
              >
                <ArrowRight className="h-2.5 w-2.5" />
              </Button>
            )}
            <span className="text-[10px] border border-gray-300 px-1.5 py-0.5 rounded bg-gray-50">
              {showSchedule ? 'Today' : 'Jan 2024'}
            </span>
          </div>
        </div>
        
        {/* Content - 250px height */}
        <div className="h-[250px] p-3">
          {showSchedule ? (
            // Schedule View
            <div className="h-full overflow-y-auto">
              <div className="text-xs font-semibold text-gray-700 mb-3">
                Today's Schedule
              </div>
              
              {todaysJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <Calendar className="w-8 h-8 text-gray-400 mb-2" />
                  <div className="text-xs text-gray-600">No jobs today</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {todaysJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-gray-50 border border-gray-200 rounded p-2"
                    >
                      <div className="text-xs font-bold text-gray-900 mb-1">
                        {job.time}
                      </div>
                      <div className="text-[10px] text-gray-600">
                        <div className="font-medium">{job.service}</div>
                        <div>{job.customer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Calendar View
            <div className="h-full flex flex-col">
              {/* Day Headers - 25px height */}
              <div className="h-[25px] grid grid-cols-7 gap-1 mb-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                  <div key={day} className="flex items-center justify-center text-[10px] font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Date Grid - Remaining space (~210px) */}
              <div className="flex-1 grid grid-cols-7 gap-1">
                {Array.from({length: 35}, (_, i) => {
                  const date = i - 1;
                  const displayDate = date <= 0 ? 30 + date : date > 31 ? date - 31 : date;
                  const isCurrentMonth = date > 0 && date <= 31;
                  const isToday = date === 15;
                  const hasJob = [3, 8, 15, 22, 28].includes(date);
                  
                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "flex items-center justify-center text-sm font-medium cursor-pointer rounded transition-colors relative",
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
                        <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FixedCalendar;