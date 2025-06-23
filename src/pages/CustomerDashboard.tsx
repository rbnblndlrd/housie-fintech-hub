
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Star, Clock } from 'lucide-react';

const CustomerDashboard = () => {
  const upcomingBookings = [
    {
      id: 1,
      service: 'House Cleaning',
      provider: 'Clean Pro Services',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'confirmed',
      location: 'Downtown Montreal'
    },
    {
      id: 2,
      service: 'Lawn Mowing',
      provider: 'Green Thumb Landscaping',
      date: '2024-01-18',
      time: '2:00 PM',
      status: 'pending',
      location: 'Plateau-Mont-Royal'
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Consistent Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">
              Customer Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your bookings and discover new services
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="fintech-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Services scheduled</p>
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorite Providers</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Trusted providers</p>
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$245</div>
                <p className="text-xs text-muted-foreground">Total spent</p>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Bookings */}
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{booking.service}</h3>
                      <p className="text-sm text-gray-600">{booking.provider}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {booking.date} at {booking.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {booking.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                        className={booking.status === 'confirmed' ? 'bg-green-500' : ''}
                      >
                        {booking.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CustomerDashboard;
