import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';

interface TattooVisualCalendarProps {
  bookings: any[];
}

const TattooVisualCalendar: React.FC<TattooVisualCalendarProps> = ({ bookings }) => {
  const today = new Date();
  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i);
    return date;
  });

  const mockAppointments = [
    { id: 1, day: 2, time: '10:00 AM', client: 'Sarah Chen', duration: '3h', type: 'New piece' },
    { id: 2, day: 2, time: '2:30 PM', client: 'Mike Rodriguez', duration: '2h', type: 'Touch-up' },
    { id: 3, day: 4, time: '11:00 AM', client: 'Emma Thompson', duration: '4h', type: 'Sleeve session' },
    { id: 4, day: 6, time: '1:00 PM', client: 'Alex Johnson', duration: '2h', type: 'Consultation' }
  ];

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          Visual Calendar - This Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {currentWeek.map((date, index) => {
            const dayAppointments = mockAppointments.filter(apt => apt.day === index);
            const isToday = date.toDateString() === today.toDateString();
            
            return (
              <div key={index} className={`fintech-inner-box p-3 min-h-32 ${isToday ? 'ring-2 ring-primary' : ''}`}>
                <div className="text-center mb-2">
                  <div className="text-xs text-muted-foreground">
                    {date.toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                  <div className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
                    {date.getDate()}
                  </div>
                </div>
                
                <div className="space-y-1">
                  {dayAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <User className="h-3 w-3" />
                        <span className="truncate">{appointment.client}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs opacity-90">{appointment.duration}</span>
                        <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                          {appointment.type.split(' ')[0]}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {dayAppointments.length === 0 && (
                    <div className="text-center text-muted-foreground text-xs mt-4">
                      No appointments
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
              <span className="text-muted-foreground">Scheduled session</span>
            </div>
          </div>
          <span className="text-muted-foreground">{mockAppointments.length} appointments this week</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TattooVisualCalendar;