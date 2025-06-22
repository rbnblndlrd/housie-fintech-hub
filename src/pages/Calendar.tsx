
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, MapPin, User } from 'lucide-react';
import Header from '@/components/Header';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'booking' | 'appointment' | 'reminder';
}

const Calendar = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock calendar events
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'House Cleaning - Marie Dubois',
        date: '2024-01-25',
        time: '10:00',
        location: 'Montréal, QC',
        type: 'booking'
      },
      {
        id: '2',
        title: 'Plumbing Repair - Jean Tremblay',
        date: '2024-01-24',
        time: '14:00',
        location: 'Laval, QC',
        type: 'booking'
      }
    ];
    
    setEvents(mockEvents);
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading calendar...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Calendrier
            </h1>
            <p className="text-gray-600">Gérez vos rendez-vous et réservations</p>
          </div>

          {/* Calendar Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar View */}
            <div className="lg:col-span-2">
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Janvier 2024
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
                      <div key={day} className="text-center font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }, (_, i) => {
                      const day = i - 6; // Start from previous month
                      const isCurrentMonth = day > 0 && day <= 31;
                      const hasEvent = day === 24 || day === 25;
                      
                      return (
                        <div
                          key={i}
                          className={`h-12 flex items-center justify-center rounded-lg border cursor-pointer hover:bg-blue-50 ${
                            isCurrentMonth 
                              ? hasEvent 
                                ? 'bg-blue-100 border-blue-300 text-blue-700 font-semibold' 
                                : 'bg-white border-gray-200 text-gray-900'
                              : 'bg-gray-50 border-gray-100 text-gray-400'
                          }`}
                        >
                          {isCurrentMonth ? day : day > 0 ? day - 31 : 31 + day}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events List */}
            <div>
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Événements à venir</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {new Date(event.date).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Ajouter un événement
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
