import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FloatingCalendar = () => {
  return (
    <Card className="fixed top-5 right-5 z-[999] w-[400px] h-[320px] bg-gradient-to-br from-amber-50 to-orange-100 border-0 shadow-xl">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            CALENDAR
          </div>
          <Badge variant="outline" className="text-xs">Jan 2024</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
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
                <div key={i} className={`
                  p-1 text-center rounded text-xs cursor-pointer relative
                  ${!isCurrentMonth ? 'text-gray-300' : ''}
                  ${isToday ? 'bg-blue-500 text-white font-bold' : 'hover:bg-gray-100'}
                  ${hasEvent && !isToday ? 'bg-orange-100 text-orange-800' : ''}
                `}>
                  {isCurrentMonth ? date : date <= 0 ? 30 + date : date - 31}
                  {hasEvent && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Today's Schedule */}
          <div className="space-y-1 text-xs">
            <div className="font-medium text-gray-700">Today's Schedule:</div>
            <div className="space-y-1">
              <div className="flex justify-between items-center p-1 bg-blue-50 rounded">
                <span>10:00 AM - House Cleaning</span>
                <Badge variant="outline" className="text-xs">Confirmed</Badge>
              </div>
              <div className="flex justify-between items-center p-1 bg-orange-50 rounded">
                <span>2:00 PM - Plumbing</span>
                <Badge variant="secondary" className="text-xs">Pending</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FloatingCalendar;