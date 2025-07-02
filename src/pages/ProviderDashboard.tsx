
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
                    <Badge className="absolute -top-3 -right-3 bg-amber-200 text-amber-800 text-xs min-w-[20px] h-5 flex items-center justify-center">
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

                  {/* Calendar Widget - Top Right Corner */}
                  <Card className="fintech-card lg:order-2">
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
                          {routeJobs.map((job) => (
                            <div 
                              key={`job-${job.id}`}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', job.id);
                                e.dataTransfer.effectAllowed = 'copy';
                              }}
                              className="flex items-center gap-2 p-2 fintech-card-secondary rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => selectJob(job.id)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedJobs.includes(parseInt(job.id))}
                                onChange={() => handleJobSelection(parseInt(job.id))}
                                className="rounded"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex-1 grid grid-cols-2 gap-1 text-xs">
                                <span className="font-medium">{job.scheduledTime}</span>
                                <span>{job.customerName}</span>
                                <span className="text-xs">{job.serviceType}</span>
                                <Badge variant={getStatusBadge(job.status)} className="w-fit text-xs">
                                  {job.status}
                                </Badge>
                              </div>
                              <span className="font-semibold text-sm">${job.amount}</span>
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
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Zap className="h-4 w-4" />
                            Smart Route Optimizer
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 px-3 pb-3">
                          <div 
                            className={`border-2 border-dashed rounded-lg p-3 text-center mb-2 transition-colors ${
                              dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
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
                            <Route className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                            <p className="text-xs text-gray-600">
                              {organizedJobs.length === 0 
                                ? 'Drag jobs here to optimize route' 
                                : `${organizedJobs.length} jobs in route`
                              }
                            </p>
                          </div>
                          
                          {organizedJobs.length > 0 && (
                            <div className="space-y-1 mb-2">
                              {organizedJobs.map((job, index) => (
                                <div key={`route-${job.id}`} className="flex items-center gap-2 p-2 bg-blue-50 rounded text-xs">
                                  <span className="w-4 h-4 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                                    {index + 1}
                                  </span>
                                  <span className="flex-1">{job.customerName}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-4 w-4 p-0 text-red-500"
                                    onClick={() => removeJobFromRoute(job.id)}
                                  >
                                    ×
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          
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
                            <Link to="/interactive-map">
                              <Button variant="ghost" className="w-full text-xs">
                                View Interactive Map →
                              </Button>
                            </Link>
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
