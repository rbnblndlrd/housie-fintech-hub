
import React, { useState } from 'react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { Clock, MapPin, User, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  client: string;
  location: string;
  status: 'confirmed' | 'pending' | 'completed';
  amount: number;
}

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);

  // Mock events data
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Nettoyage résidentiel',
      date: new Date(),
      time: '09:00',
      client: 'Marie Dubois',
      location: '123 Rue Saint-Denis, Montréal',
      status: 'confirmed',
      amount: 120
    },
    {
      id: '2',
      title: 'Jardinage',
      date: new Date(),
      time: '14:00',
      client: 'Pierre Martin',
      location: '456 Avenue du Parc, Montréal',
      status: 'pending',
      amount: 180
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'confirmed': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'completed': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En Attente';
      case 'confirmed': return 'Confirmée';
      case 'completed': return 'Terminée';
      default: return status;
    }
  };

  React.useEffect(() => {
    // Filter events for selected date
    const eventsForDate = mockEvents.filter(
      event => event.date.toDateString() === date?.toDateString()
    );
    setSelectedEvents(eventsForDate);
  }, [date]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Calendrier
            </h1>
            <p className="text-gray-600">Gérez votre planning et vos rendez-vous</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100/50 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  Sélectionner une Date
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-2xl border-0 shadow-inner bg-gradient-to-br from-gray-50 to-gray-100/50"
                />
              </CardContent>
            </Card>

            {/* Events for Selected Date */}
            <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100/50 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Rendez-vous du {date?.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {selectedEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 inline-block mb-6">
                      <CalendarIcon className="h-16 w-16 text-white mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Aucun rendez-vous
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Vous n'avez pas de rendez-vous prévu pour cette date.
                    </p>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-[0_4px_15px_-2px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_-2px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-200">
                      Ajouter un Rendez-vous
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedEvents.map((event) => (
                      <div key={event.id} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl shadow-inner hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{event.title}</h4>
                            <Badge className={`${getStatusColor(event.status)} text-white border-0 shadow-sm mt-1`}>
                              {getStatusText(event.status)}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">${event.amount}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                              <Clock className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm text-gray-700">{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                              <User className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm text-gray-700">{event.client}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="p-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                              <MapPin className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm text-gray-700">{event.location}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            Modifier
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all duration-200"
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
