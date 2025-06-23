
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from "@/components/Header";
import GoogleCalendarIntegration from "@/components/GoogleCalendarIntegration";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ArrowLeft, Clock, MapPin, User } from "lucide-react";
import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addDays, format, subMonths, addMonths } from "date-fns";

const ProviderCalendar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Mock appointments for selected date
  const appointments = [
    {
      id: 1,
      title: "House Cleaning",
      time: "10:00 AM",
      customer: "John Smith",
      location: "123 Main St, Toronto",
      status: "confirmed",
      payment: "$120"
    },
    {
      id: 2,
      title: "Plumbing Repair",
      time: "2:00 PM", 
      customer: "Sarah Johnson",
      location: "456 Oak Ave, Toronto",
      status: "pending",
      payment: "$85"
    }
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'outline';
      case 'completed': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/provider-dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar Section */}
              <div className="lg:col-span-2">
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      {format(currentDate, 'MMMM yyyy')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <Button onClick={goToPreviousMonth} variant="ghost">Previous</Button>
                      <Button onClick={goToNextMonth} variant="ghost">Next</Button>
                    </div>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal mb-4",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <ShadCalendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    {selectedDate && (
                      <div className="mt-4">
                        <h3 className="font-semibold mb-3">
                          Appointments for {format(selectedDate, "PPP")}
                        </h3>
                        <div className="space-y-3">
                          {appointments.map((appointment) => (
                            <div key={appointment.id} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium">{appointment.title}</h4>
                                    <Badge variant={getStatusVariant(appointment.status)}>
                                      {appointment.status}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                    <User className="h-3 w-3" />
                                    {appointment.customer}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {appointment.time}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {appointment.location}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-green-600">{appointment.payment}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Google Calendar Integration */}
              <div className="space-y-6">
                <GoogleCalendarIntegration 
                  onSync={() => console.log('Syncing calendar...')}
                  onImport={() => console.log('Importing events...')}
                  onExport={() => console.log('Exporting events...')}
                />

                {/* Quick Actions */}
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full" 
                      onClick={() => navigate('/provider-bookings')}
                    >
                      Manage Bookings
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/provider-settings')}
                    >
                      Availability Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCalendar;
