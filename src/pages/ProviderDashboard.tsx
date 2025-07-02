
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
  Eye,
  Briefcase,
  Map,
  UserCog,
  Bell,
  Filter,
  ChevronDown,
  Navigation,
  Route,
  BarChart3,
  Activity,
  Zap,
  ArrowRight
} from 'lucide-react';

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('job-hub');
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  const [filterPeriod, setFilterPeriod] = useState('today');

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

  const pendingRequests = recentBookings.filter(booking => booking.status === 'pending');
  const todaysEarnings = 350;
  const completedJobs = 4;
  const activeRouteProgress = "3 of 5 stops completed";

  const recentActivity = [
    { type: 'booking', message: 'New booking request from Maria Garcia', time: '5 min ago' },
    { type: 'payment', message: 'Payment received: $120.00', time: '15 min ago' },
    { type: 'review', message: 'New 5-star review from John Smith', time: '1 hour ago' },
    { type: 'booking', message: 'Booking confirmed with Lisa Chen', time: '2 hours ago' }
  ];

  const handleJobSelection = (jobId: number) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': 'secondary',
      'confirmed': 'default',
      'completed': 'outline'
    } as const;
    return variants[status as keyof typeof variants] || 'secondary';
  };

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-16 px-4 pb-2">
          <div className="max-w-full mx-auto">
            <div className="mb-3">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
                Provider Dashboard
              </h1>
              <p className="text-white/90 drop-shadow-md">
                Welcome back! Here's your performance overview
              </p>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3">
              <TabsList className="fintech-card p-1">
                <TabsTrigger value="job-hub">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Job Hub
                </TabsTrigger>
                <TabsTrigger value="map">
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </TabsTrigger>
                <TabsTrigger value="community">
                  <Users className="h-4 w-4 mr-2" />
                  Community
                </TabsTrigger>
                <TabsTrigger value="profile">
                  <UserCog className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="job-hub" className="space-y-3">
                {/* Top Section - Notification Banner */}
                {pendingRequests.length > 0 && (
                  <Card className="fintech-card border-amber-200 bg-amber-50/80">
                    <CardContent className="p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-amber-600" />
                          <span className="font-medium text-amber-800">
                            Pending Booking Requests ({pendingRequests.length})
                          </span>
                        </div>
                        <Badge variant="secondary" className="bg-amber-200 text-amber-800">
                          {pendingRequests.length}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Main Grid Layout - Tighter gaps */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
                  {/* Left Column - AutoTask List (40% width) */}
                  <div className="lg:col-span-5 space-y-2">
                    <Card className="fintech-card">
                      <CardHeader className="pb-2 px-3 pt-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <CheckCircle className="h-4 w-4" />
                            AutoTask List
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="text-xs">
                              <Filter className="h-3 w-3 mr-1" />
                              Columns
                              <ChevronDown className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Filter Buttons */}
                        <div className="flex gap-1 mt-2">
                          {['Today', 'This Week', 'Pending', 'Completed'].map((filter) => (
                            <Button
                              key={filter}
                              variant={filterPeriod === filter.toLowerCase().replace(' ', '') ? "default" : "outline"}
                              size="sm"
                              className="text-xs px-2 py-1"
                              onClick={() => setFilterPeriod(filter.toLowerCase().replace(' ', ''))}
                            >
                              {filter}
                            </Button>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 px-3 pb-3">
                        <div className="space-y-1">
                          {recentBookings.map((booking) => (
                            <div key={booking.id} className="flex items-center gap-2 p-2 fintech-card-secondary rounded-lg">
                              <input
                                type="checkbox"
                                checked={selectedJobs.includes(booking.id)}
                                onChange={() => handleJobSelection(booking.id)}
                                className="rounded"
                              />
                              <div className="flex-1 grid grid-cols-2 gap-1 text-xs">
                                <span className="font-medium">{booking.date}</span>
                                <span>{booking.client}</span>
                                <span className="text-xs">{booking.service}</span>
                                <Badge variant={getStatusBadge(booking.status)} className="w-fit text-xs">
                                  {booking.status}
                                </Badge>
                              </div>
                              <span className="font-semibold text-sm">${booking.amount}</span>
                            </div>
                          ))}
                        </div>
                        
                        {selectedJobs.length > 0 && (
                          <div className="mt-2 p-2 bg-amber-50 rounded-lg">
                            <p className="text-xs text-amber-800 mb-1">
                              {selectedJobs.length} jobs selected
                            </p>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="text-xs">Bulk Update</Button>
                              <Button size="sm" variant="outline" className="text-xs">Export</Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Center Column - AI Route Planner & Calendar (35% width) */}
                  <div className="lg:col-span-4 space-y-2">
                    {/* AI Route Planner */}
                    <Card className="fintech-card">
                      <CardHeader className="pb-2 px-3 pt-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Zap className="h-4 w-4" />
                          Smart Route Optimizer
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 px-3 pb-3">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center mb-2">
                          <Route className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                          <p className="text-xs text-gray-600">Drop jobs here to optimize route</p>
                        </div>
                        
                        <div className="space-y-1 mb-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span>Traffic Analysis:</span>
                            <span className="text-green-600">Light traffic</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Client Availability:</span>
                            <span className="text-blue-600">4 time slots</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Button className="w-full fintech-button-primary text-sm">
                            <Route className="h-3 w-3 mr-1" />
                            Optimize Route
                          </Button>
                          <Button variant="outline" className="w-full text-sm">
                            <Navigation className="h-3 w-3 mr-1" />
                            Start GPS Navigation
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                          <Button variant="ghost" className="w-full text-xs">
                            View Interactive Map →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Calendar Widget */}
                    <Card className="fintech-card">
                      <CardHeader className="pb-2 px-3 pt-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Calendar className="h-4 w-4" />
                          Calendar
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 px-3 pb-3">
                        <div className="space-y-2">
                          <div className="text-center">
                            <div className="text-sm font-semibold">January 2024</div>
                            <div className="grid grid-cols-7 gap-1 mt-1 text-xs">
                              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                <div key={day} className="p-1 font-medium text-gray-500">{day}</div>
                              ))}
                              {Array.from({length: 31}, (_, i) => (
                                <div key={i} className={`p-1 text-center rounded text-xs ${i + 1 === 15 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>
                                  {i + 1}
                                </div>
                              ))}
                            </div>
                          </div>
                          <Button variant="outline" className="w-full text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            Sync with Google
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Quick Stats & Activity Feed (25% width) */}
                  <div className="lg:col-span-3 space-y-2">
                    {/* Quick Stats */}
                    <Card className="fintech-card">
                      <CardHeader className="pb-2 px-3 pt-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <BarChart3 className="h-4 w-4" />
                          Quick Stats
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 px-3 pb-3 space-y-2">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span>Today's Earnings</span>
                            <span className="font-semibold text-green-600">${todaysEarnings}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Jobs Completed</span>
                            <span className="font-semibold">{completedJobs}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Route Progress</span>
                            <span className="font-semibold text-blue-600">{activeRouteProgress}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity Feed */}
                    <Card className="fintech-card">
                      <CardHeader className="pb-2 px-3 pt-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Activity className="h-4 w-4" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 px-3 pb-3">
                        <div className="space-y-1">
                          {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-2 p-2 rounded-lg fintech-card-secondary">
                              <div className={`p-1 rounded-full ${
                                activity.type === 'booking' ? 'bg-blue-100' :
                                activity.type === 'payment' ? 'bg-green-100' :
                                'bg-yellow-100'
                              }`}>
                                {activity.type === 'booking' && <Calendar className="h-2 w-2 text-blue-600" />}
                                {activity.type === 'payment' && <DollarSign className="h-2 w-2 text-green-600" />}
                                {activity.type === 'review' && <Star className="h-2 w-2 text-yellow-600" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-medium">{activity.message}</p>
                                <p className="text-xs text-gray-500">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="map">
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle>Map View</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="opacity-70">Interactive map will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="community">
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle>Community</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="opacity-70">Community features will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile">
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="opacity-70">Profile settings and information will be displayed here</p>
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
