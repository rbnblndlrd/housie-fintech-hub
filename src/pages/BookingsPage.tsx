
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import Header from '@/components/Header';
import KanbanTicketList from '@/components/dashboard/KanbanTicketList';
import CalendarPreview from '@/components/calendar/CalendarPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';

const BookingsPage = () => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();

  if (!user) {
    return null;
  }

  const upcomingBookings = [
    {
      id: '1',
      serviceName: 'Home Cleaning',
      date: '2024-01-15',
      time: '10:00 AM',
      provider: 'CleanPro Services',
      location: '123 Rue Saint-Catherine, Montreal',
      status: 'confirmed'
    },
    {
      id: '2',
      serviceName: 'Plumbing Repair',
      date: '2024-01-18',
      time: '2:00 PM',
      provider: 'Montreal Plumbers',
      location: '456 Avenue Mont-Royal, Montreal',
      status: 'pending'
    },
    {
      id: '3',
      serviceName: 'Electrical Work',
      date: '2024-01-20',
      time: '9:00 AM',
      provider: 'Electric Solutions',
      location: '789 Boulevard Saint-Laurent, Montreal',
      status: 'confirmed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                {currentRole === 'provider' ? 'Job Management' : 'My Bookings'}
              </h1>
            </div>
            <p className="text-gray-600">
              {currentRole === 'provider' 
                ? 'Manage your service requests and track job progress' 
                : 'View your upcoming appointments and booking history'}
            </p>
          </div>

          {currentRole === 'provider' ? (
            // Provider View - Full Kanban Board
            <div className="space-y-8">
              <KanbanTicketList />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="fintech-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      New Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
                    <p className="text-sm text-gray-600">Pending acceptance</p>
                  </CardContent>
                </Card>
                
                <Card className="fintech-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      Today's Jobs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600 mb-1">2</div>
                    <p className="text-sm text-gray-600">Scheduled for today</p>
                  </CardContent>
                </Card>
                
                <Card className="fintech-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      In Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600 mb-1">1</div>
                    <p className="text-sm text-gray-600">Currently working</p>
                  </CardContent>
                </Card>
                
                <Card className="fintech-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600 mb-1">8</div>
                    <p className="text-sm text-gray-600">This week</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            // Customer View - Simple Bookings List with Calendar
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="fintech-card border-3 border-black bg-cream/95 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{booking.serviceName}</h3>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {booking.date} at {booking.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {booking.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          {booking.provider}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="fintech-card border-3 border-black bg-cream/95 shadow-lg">
                <CardContent className="p-0">
                  <CalendarPreview />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
