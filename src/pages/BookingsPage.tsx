
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import KanbanTicketList from '@/components/dashboard/KanbanTicketList';
import CalendarPreview from '@/components/calendar/CalendarPreview';
import { ChatBubble } from '@/components/chat/ChatBubble';
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
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="h-7 w-7 text-blue-400" />
                <h1 className="text-3xl font-bold text-white text-shadow-lg">
                  {currentRole === 'provider' ? 'Job Management' : 'My Bookings'}
                </h1>
              </div>
              <p className="text-white/90 text-shadow">
                {currentRole === 'provider' 
                  ? 'Manage your service requests and track job progress' 
                  : 'View your upcoming appointments and booking history'}
              </p>
            </div>

            {currentRole === 'provider' ? (
              // Provider View - Full Kanban Board
              <div className="space-y-6">
                <KanbanTicketList />
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2 text-white text-shadow">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        New Requests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-400 mb-1">3</div>
                      <p className="text-sm text-white/70">Pending acceptance</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2 text-white text-shadow">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        Today's Jobs
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-yellow-400 mb-1">2</div>
                      <p className="text-sm text-white/70">Scheduled for today</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2 text-white text-shadow">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        In Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-purple-400 mb-1">1</div>
                      <p className="text-sm text-white/70">Currently working</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2 text-white text-shadow">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        Completed
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-400 mb-1">8</div>
                      <p className="text-sm text-white/70">This week</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              // Customer View - Simple Bookings List with Calendar
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-white text-shadow">
                      <Calendar className="h-5 w-5" />
                      Upcoming Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="border border-white/20 rounded-lg p-3 hover:bg-white/5 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-white">{booking.serviceName}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-white/70">
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

                <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                  <CardContent className="p-0">
                    <CalendarPreview />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Add Chat Bubble */}
        <ChatBubble />
      </div>
    </>
  );
};

export default BookingsPage;
