
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { useRouteOptimizer } from '@/hooks/useRouteOptimizer';
import JobExecutionMode from '@/components/route-optimizer/JobExecutionMode';
import { Link } from 'react-router-dom';
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
  
  const {
    executionMode,
    phases,
    routeJobs,
    organizedJobs,
    selectJob,
    exitExecutionMode,
    updatePhotoRequirement,
    completeJob,
    getSelectedJob,
    getProgressPercentage,
    getTotalRouteStats,
    addJobToRoute,
    removeJobFromRoute
  } = useRouteOptimizer();

  const [dragOver, setDragOver] = useState(false);

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
        <div className="pt-16 pl-[188px] pr-[188px] pb-2">
          <div className="max-w-full">
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
              <div className="flex items-center gap-4">
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
                
                {pendingRequests.length > 0 && (
                  <div className="relative">
                    <Bell className="h-6 w-6 text-amber-600" />
                    <Badge className="absolute -top-4 -right-4 bg-amber-200 text-amber-800 text-xs min-w-[20px] h-5 flex items-center justify-center">
                      {pendingRequests.length}
                    </Badge>
                  </div>
                )}
              </div>

              <TabsContent value="job-hub" className="space-y-3">
                {/* Top Section - Calendar and Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
                  {/* Stats Column - Stacked vertically */}
                  <div className="space-y-3 lg:order-1 h-full">
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
                    <Card className="fintech-card flex-1">
                      <CardHeader className="pb-2 px-3 pt-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Activity className="h-4 w-4" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 px-3 pb-3 flex-1">
                        <div className="space-y-1">
                          {recentActivity.slice(0, 3).map((activity, index) => (
                            <div key={index} className="flex items-start gap-2 p-1 rounded-lg fintech-card-secondary">
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

                  {/* Enhanced Calendar Widget */}
                  <Card className="fintech-card lg:order-2">
                    <CardHeader className="pb-2 px-3 pt-3">
                      <CardTitle className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          CALENDAR
                        </div>
                        <Badge variant="outline" className="text-xs">Jan 2024</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 px-3 pb-3">
                      <div className="space-y-3">
                        {/* Mini Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 text-xs">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                            <div key={day} className="p-1 text-center font-medium text-gray-500">{day}</div>
                          ))}
                          {Array.from({length: 35}, (_, i) => {
                            const date = i - 2; // Start from 30th of prev month
                            const isCurrentMonth = date > 0 && date <= 31;
                            const isToday = date === 15;
                            const hasEvent = [3, 8, 15, 22, 28].includes(date);
                            
                            return (
                              <div key={i} className={`
                                p-1 text-center rounded text-xs cursor-pointer relative
                                ${!isCurrentMonth ? 'text-gray-300' : ''}
                                ${isToday ? 'bg-blue-500 text-white font-bold' : 'hover:bg-gray-100'}
                                ${hasEvent && !isToday ? 'bg-orange-100 text-orange-800' : ''}
                              `}>
                                {isCurrentMonth ? date : date <= 0 ? 30 + date : date - 31}
                                {hasEvent && (
                                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Today's Schedule */}
                        <div className="space-y-1 text-xs">
                          <div className="font-medium text-gray-700">Today's Schedule:</div>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center p-1 bg-blue-50 rounded">
                              <span>10:00 AM - House Cleaning</span>
                              <Badge variant="outline" className="text-xs">Confirmed</Badge>
                            </div>
                            <div className="flex justify-between items-center p-1 bg-orange-50 rounded">
                              <span>2:00 PM - Plumbing</span>
                              <Badge variant="secondary" className="text-xs">Pending</Badge>
                            </div>
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

                {/* Main Grid Layout - Tighter gaps */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
                  {/* Enhanced AutoTask Widget */}
                  <div className="lg:col-span-5 space-y-2">
                    <Card className="fintech-card">
                      <CardHeader className="pb-2 px-3 pt-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-base font-bold">
                            <CheckCircle className="h-4 w-4" />
                            AUTOTASK-TYPE OF LIST FOR TICKET MANAGEMENT.
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">CORE FEATURE</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          MAKE IT TIMELESS, AGELESS, BIG, BEAUTIFUL, USER-FRIENDLY, EXTENSIVE, TABBED - USEFUL TABS!
                        </p>
                        
                        {/* Enhanced Filter Tabs */}
                        <div className="flex gap-1 mt-3">
                          {[
                            { key: 'pending', label: 'PENDING/INCOMING JOB REQUESTS', count: 4 },
                            { key: 'thisweek', label: 'THIS WEEK', count: 12 },
                            { key: 'completed', label: 'COMPLETED', count: 8 }
                          ].map((filter) => (
                            <Button
                              key={filter.key}
                              variant={filterPeriod === filter.key ? "default" : "outline"}
                              size="sm"
                              className="text-xs px-3 py-1 flex items-center gap-1"
                              onClick={() => setFilterPeriod(filter.key)}
                            >
                              {filter.label}
                              <Badge variant="secondary" className="ml-1 text-xs">
                                {filter.count}
                              </Badge>
                            </Button>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 px-3 pb-3">
                        {/* Recent Feedback Section */}
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-semibold text-sm">RECENT FEEDBACK (AT A GLANCE)</span>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between p-2 bg-white rounded border">
                              <span>"Excellent plumbing work!" - Sarah J.</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white rounded border">
                              <span>"Quick and professional service" - Mike D.</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Message Previewer */}
                        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Mail className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-sm">MESSAGE PREVIEWER (NOTIFICATIONS AND)</span>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-start gap-2 p-2 bg-white rounded">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                              <div>
                                <p className="font-medium">New booking request from Maria Garcia</p>
                                <p className="text-gray-500">House cleaning - Tomorrow 2:00 PM</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 p-2 bg-white rounded">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                              <div>
                                <p className="font-medium">Payment confirmed: $120.00</p>
                                <p className="text-gray-500">From John Smith - Electrical work</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 p-2 bg-white rounded">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                              <div>
                                <p className="font-medium">Schedule change request</p>
                                <p className="text-gray-500">Lisa Chen wants to reschedule</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Ticket List */}
                        <div className="space-y-1">
                          <div className="text-xs font-semibold mb-2 text-gray-700">ACTIVE TICKETS & JOBS</div>
                          {recentBookings.slice(0, 4).map((booking) => (
                            <div 
                              key={`booking-${booking.id}`}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', booking.id.toString());
                                e.dataTransfer.effectAllowed = 'copy';
                              }}
                              className="flex items-center gap-2 p-2 fintech-card-secondary rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border"
                              onClick={() => handleJobSelection(booking.id)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedJobs.includes(booking.id)}
                                onChange={() => handleJobSelection(booking.id)}
                                className="rounded"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex-1 text-xs">
                                <div className="grid grid-cols-2 gap-1">
                                  <span className="font-medium">{booking.time}</span>
                                  <span className="font-semibold">${booking.amount}</span>
                                  <span>{booking.service}</span>
                                  <Badge variant={getStatusBadge(booking.status)} className="w-fit text-xs">
                                    {booking.status}
                                  </Badge>
                                  <span className="text-gray-600">{booking.client}</span>
                                  <span className="text-gray-500 text-xs">{booking.location}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {selectedJobs.length > 0 && (
                          <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-xs text-amber-800 mb-1 font-semibold">
                              {selectedJobs.length} tickets selected for batch operations
                            </p>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="text-xs">Bulk Update Status</Button>
                              <Button size="sm" variant="outline" className="text-xs">Export Report</Button>
                              <Button size="sm" variant="outline" className="text-xs">Send Messages</Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Center Column - Smart Route Optimizer (60% width) */}
                  <div className="lg:col-span-7 space-y-2">
                    {/* Smart Route Optimizer / Job Execution Mode */}
                    {executionMode && getSelectedJob() ? (
                      <JobExecutionMode
                        job={getSelectedJob()!}
                        phases={phases}
                        progressPercentage={getProgressPercentage()}
                        onBack={exitExecutionMode}
                        onCompleteJob={completeJob}
                        onUpdatePhotoRequirement={updatePhotoRequirement}
                      />
                    ) : (
                      <Card className="fintech-card">
                        <CardHeader className="pb-2 px-3 pt-3">
                          <CardTitle className="flex items-center justify-between text-base font-bold">
                            <div className="flex items-center gap-2">
                              <Route className="h-4 w-4" />
                              SMART ROUTE OPTIMIZER
                            </div>
                            <Badge className="bg-orange-500 text-white text-xs">ACTIVE</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 px-3 pb-3">
                          {/* Route Planning Area */}
                          <div 
                            className={`border-2 border-dashed rounded-lg p-4 text-center mb-3 transition-colors min-h-[120px] flex flex-col items-center justify-center ${
                              dragOver ? 'border-blue-400 bg-blue-50' : 'border-orange-300 bg-orange-50/30'
                            }`}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setDragOver(false);
                              const jobId = e.dataTransfer.getData('text/plain');
                              addJobToRoute(jobId);
                            }}
                          >
                            <Route className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              {organizedJobs.length === 0 
                                ? 'Drag jobs here to optimize route' 
                                : `${organizedJobs.length} jobs in optimization queue`
                              }
                            </p>
                            <p className="text-xs text-gray-500">
                              AI-powered route planning with real-time traffic analysis
                            </p>
                          </div>
                          
                          {/* Route Display */}
                          {organizedJobs.length > 0 && (
                            <div className="mb-3 p-3 bg-white rounded-lg border border-orange-200">
                              <div className="text-sm font-semibold mb-2 text-orange-800">Optimized Route Sequence:</div>
                              <div className="space-y-2">
                                {organizedJobs.map((job, index) => (
                                  <div key={`route-${job.id}`} className="flex items-center gap-3 p-2 bg-orange-50 rounded border border-orange-100">
                                    <span className="w-6 h-6 bg-orange-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                                      {index + 1}
                                    </span>
                                    <div className="flex-1 text-sm">
                                      <div className="font-medium">{job.customerName}</div>
                                      <div className="text-xs text-gray-600">{job.serviceType} • {job.scheduledTime}</div>
                                    </div>
                                    <div className="text-xs text-gray-500">${job.amount}</div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 text-red-500 hover:bg-red-100"
                                      onClick={() => removeJobFromRoute(job.id)}
                                    >
                                      ×
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Analytics Panel */}
                          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                            <div className="p-2 bg-green-50 rounded border border-green-200">
                              <div className="flex items-center justify-between">
                                <span className="text-green-700">Traffic Analysis:</span>
                                <span className="font-semibold text-green-600">Light traffic</span>
                              </div>
                            </div>
                            <div className="p-2 bg-blue-50 rounded border border-blue-200">
                              <div className="flex items-center justify-between">
                                <span className="text-blue-700">Client Availability:</span>
                                <span className="font-semibold text-blue-600">4 time slots</span>
                              </div>
                            </div>
                            <div className="p-2 bg-purple-50 rounded border border-purple-200">
                              <div className="flex items-center justify-between">
                                <span className="text-purple-700">Est. Travel Time:</span>
                                <span className="font-semibold text-purple-600">2h 15m</span>
                              </div>
                            </div>
                            <div className="p-2 bg-amber-50 rounded border border-amber-200">
                              <div className="flex items-center justify-between">
                                <span className="text-amber-700">Route Efficiency:</span>
                                <span className="font-semibold text-amber-600">92%</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="space-y-2">
                            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold py-2">
                              <Route className="h-4 w-4 mr-2" />
                              Optimize Route
                            </Button>
                            <div className="grid grid-cols-2 gap-2">
                              <Button variant="outline" className="text-sm border-orange-300 hover:bg-orange-50">
                                <Navigation className="h-3 w-3 mr-1" />
                                Start GPS Navigation
                              </Button>
                              <Link to="/interactive-map" className="w-full">
                                <Button variant="outline" className="w-full text-sm border-orange-300 hover:bg-orange-50">
                                  <Map className="h-3 w-3 mr-1" />
                                  View Interactive Map
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
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
