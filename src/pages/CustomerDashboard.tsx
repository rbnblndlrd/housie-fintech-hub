import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  Search,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const recentBookings = [
    {
      id: '1',
      service: 'House Cleaning',
      provider: 'Clean Co.',
      date: '2024-01-15',
      status: 'Completed',
      rating: 5
    },
    {
      id: '2',
      service: 'Plumbing Repair',
      provider: 'Fix It Fast',
      date: '2024-01-12',
      status: 'Completed',
      rating: 4
    }
  ];

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-16 pl-[188px] pr-[188px] pb-8">
          <div className="max-w-full">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white text-shadow-lg mb-2">
                  Welcome Back!
                </h1>
                <p className="text-white/90 text-shadow">
                  Find and book services for your home
                </p>
              </div>
              <Link to="/calendar">
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  View Calendar
                </Button>
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="fintech-metric-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80 mb-1">Total Bookings</p>
                      <p className="text-3xl font-bold">12</p>
                    </div>
                    <Calendar className="h-8 w-8 opacity-70" />
                  </div>
                </CardContent>
              </Card>

              <Card className="fintech-metric-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80 mb-1">Pending</p>
                      <p className="text-3xl font-bold">2</p>
                    </div>
                    <Clock className="h-8 w-8 opacity-70" />
                  </div>
                </CardContent>
              </Card>

              <Card className="fintech-metric-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80 mb-1">Total Spent</p>
                      <p className="text-3xl font-bold">$1,240</p>
                    </div>
                    <DollarSign className="h-8 w-8 opacity-70" />
                  </div>
                </CardContent>
              </Card>

              <Card className="fintech-metric-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80 mb-1">Avg Rating</p>
                      <p className="text-3xl font-bold">4.8</p>
                    </div>
                    <Star className="h-8 w-8 opacity-70" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Bookings */}
              <div className="lg:col-span-2">
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div key={booking.id} className="fintech-inner-box flex items-center justify-between p-4">
                          <div className="flex-1">
                            <h3 className="font-medium">{booking.service}</h3>
                            <p className="text-sm opacity-70">{booking.provider} • {booking.date}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm">{booking.rating}</span>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link to="/calendar">
                      <Button className="fintech-inner-button w-full flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        View Calendar
                      </Button>
                    </Link>
                    <Link to="/services">
                      <Button className="fintech-inner-button w-full flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Find Services
                      </Button>
                    </Link>
                    <Link to="/bookings">
                      <Button className="fintech-inner-button w-full flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        View Bookings
                      </Button>
                    </Link>
                    <Button className="fintech-inner-button w-full flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Emergency Services
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDashboard;
