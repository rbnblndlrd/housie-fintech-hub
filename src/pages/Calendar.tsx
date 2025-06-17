import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, AlertCircle } from "lucide-react";

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // June 2025
  const [selectedDate, setSelectedDate] = useState(16);

  const appointments = [
    {
      id: 1,
      client: "Marie L.",
      service: "Ménage résidentiel",
      time: "09:00",
      date: "15/12/2024"
    },
    {
      id: 2,
      client: "Jean D.",
      service: "Nettoyage bureaux",
      time: "14:00",
      date: "16/12/2024"
    },
    {
      id: 3,
      client: "Sophie M.",
      service: "Grand ménage",
      time: "10:30",
      date: "18/12/2024"
    }
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDate;
      const isToday = day === 16; // Highlight 16th as today for demo
      
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(day)}
          className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
            isSelected 
              ? 'bg-purple-600 text-white' 
              : isToday
              ? 'bg-purple-100 text-purple-700'
              : 'hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-orange-200">
      <Header />
      
      <div className="pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">Calendrier</h1>
              <p className="text-gray-600">Gérez vos disponibilités et rendez-vous</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-purple-600">
                Google Calendar: Connected
              </Badge>
              <Badge variant="outline" className="border-red-500 text-red-600">
                <AlertCircle className="h-3 w-3 mr-1" />
                Détection de conflit: Active
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">
                      Calendrier du mois
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth('prev')}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="font-medium min-w-[120px] text-center">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth('next')}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Days of week header */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {daysOfWeek.map(day => (
                      <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {renderCalendarDays()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Availability Status */}
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>Disponibilité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Badge className="bg-green-500 text-lg px-4 py-2">Disponible</Badge>
                  </div>
                  <div className="flex justify-between">
                    <Button className="bg-purple-600 hover:bg-purple-700 flex-1 mr-2">
                      Disponible
                    </Button>
                    <Button variant="outline" className="flex-1 ml-2">
                      Indisponible
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Appointments */}
              <Card className="bg-white shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Prochains rendez-vous</CardTitle>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointments.map(appointment => (
                    <div key={appointment.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{appointment.client}</span>
                        <span className="text-sm text-gray-500">{appointment.time}</span>
                      </div>
                      <div className="text-sm text-gray-600">{appointment.service}</div>
                      <div className="text-xs text-gray-500">{appointment.date}</div>
                    </div>
                  ))}
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
