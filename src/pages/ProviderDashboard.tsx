
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { 
  Calendar, 
  DollarSign, 
  Star, 
  Users, 
  Clock, 
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data
  const recentBookings = [
    {
      id: 1,
      service: "House Cleaning",
      client: "Sarah Johnson",
      date: "2024-01-15",
      time: "10:00 AM",
      location: "Downtown Montreal",
      status: "confirmed",
      amount: 120
    },
    {
      id: 2,
      service: "Plumbing Repair",
      client: "John Smith",
      date: "2024-01-18",
      time: "02:00 PM",
      location: "Westmount",
      status: "pending",
      amount: 85
    },
    {
      id: 3,
      service: "Electrical Installation",
      client: "Emily Clark",
      date: "2024-01-22",
      time: "11:30 AM",
      location: "Plateau",
      status: "confirmed",
      amount: 150
    },
    {
      id: 4,
      service: "Landscaping",
      client: "Michael Davis",
      date: "2024-01-25",
      time: "09:00 AM",
      location: "Outremont",
      status: "completed",
      amount: 200
    },
    {
      id: 5,
      service: "Pet Grooming",
      client: "Linda Wilson",
      date: "2024-01-29",
      time: "03:45 PM",
      location: "Hampstead",
      status: "confirmed",
      amount: 60
    }
  ];

  const earnings = [
    { month: 'Jan', amount: 2340 },
    { month: 'Feb', amount: 2180 },
    { month: 'Mar', amount: 2650 },
    { month: 'Apr', amount: 2890 },
    { month: 'May', amount: 2420 },
    { month: 'Jun', amount: 2780 },
  ];

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
                Provider Dashboard
              </h1>
              <p className="text-white/90 drop-shadow-md">
                Welcome back! Here's your performance overview
              </p>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="fintech-card p-1">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="earnings">Earnings</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Bookings */}
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Recent Bookings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentBookings.slice(0, 3).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-4 fintech-card-secondary rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium">{booking.service}</h4>
                              <p className="text-sm opacity-70">{booking.client}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {booking.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {booking.time}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge 
                                variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                                className="mb-2"
                              >
                                {booking.status}
                              </Badge>
                              <p className="font-semibold">${booking.amount}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        <Eye className="h-4 w-4 mr-2" />
                        View All Bookings
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button className="w-full justify-start" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Update Availability
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Payout Settings
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Star className="h-4 w-4 mr-2" />
                        Service Gallery
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="bookings">
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle>All Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 fintech-card-secondary rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{booking.service}</h4>
                            <p className="text-sm opacity-70">{booking.client}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {booking.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {booking.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {booking.location}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                              className="mb-2"
                            >
                              {booking.status}
                            </Badge>
                            <p className="font-semibold">${booking.amount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="earnings">
                <Card className="fintech-chart-container">
                  <CardHeader>
                    <CardTitle>Earnings Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <p className="opacity-70">Earnings chart will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="opacity-70">Reviews and ratings will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderDashboard;
