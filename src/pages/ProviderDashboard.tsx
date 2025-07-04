
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoBackground from '@/components/common/VideoBackground';
import FixedCalendar from '@/components/layout/FixedCalendar';
import DraggableWidget from '@/components/dashboard/DraggableWidget';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
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
  ArrowRight,
  Edit,
  Save,
  RotateCcw
} from 'lucide-react';
import JobHubSidebar from '@/components/dashboard/JobHubSidebar';
import SimpleNavigation from '@/components/dashboard/SimpleNavigation';

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('job-hub');
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  const [filterPeriod, setFilterPeriod] = useState('today');
  const [isJobHubOpen, setIsJobHubOpen] = useState(false);
  
  const {
    widgets,
    isEditMode,
    setIsEditMode,
    updateWidgetPosition,
    updateWidgetSize,
    toggleWidgetLock,
    lockAllWidgets,
    unlockAllWidgets,
    resetLayout,
    getWidgetConfig
  } = useDashboardLayout();
  
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
      
      {/* Draggable Dashboard Title */}
      <div className="fixed top-0 left-0 z-40">
        <DraggableWidget
          id="dashboard-title"
          defaultPosition={getWidgetConfig('dashboard-title').position}
          defaultSize={getWidgetConfig('dashboard-title').size}
          isLocked={getWidgetConfig('dashboard-title').isLocked}
          showCard={false}
          onPositionChange={updateWidgetPosition}
          onSizeChange={updateWidgetSize}
          onLockToggle={toggleWidgetLock}
        >
          <div className="h-full w-full flex items-center justify-center pointer-events-none">
            <div className="weathered-street-sign flex items-center justify-center">
              <h1 className="graffiti-text">
                Provider Dashboard
              </h1>
            </div>
          </div>
        </DraggableWidget>
      </div>

      {/* Draggable Welcome Text */}
      <div className="fixed top-0 left-0 z-40">
        <DraggableWidget
          id="welcome-text"
          defaultPosition={getWidgetConfig('welcome-text').position}
          defaultSize={getWidgetConfig('welcome-text').size}
          isLocked={getWidgetConfig('welcome-text').isLocked}
          showCard={false}
          onPositionChange={updateWidgetPosition}
          onSizeChange={updateWidgetSize}
          onLockToggle={toggleWidgetLock}
        >
          <div className="h-full w-full flex items-center justify-center text-center pointer-events-none">
            <p className="text-white/90 drop-shadow-md">
              Welcome back! Here&apos;s your performance overview
            </p>
          </div>
        </DraggableWidget>
      </div>
      
      <div className="relative z-10 min-h-screen">
        <div className="pb-2">
          <div className="max-w-full">

            {/* Dashboard Controls */}
            <div className="fixed top-4 right-4 z-30 flex gap-2">
              <Button
                onClick={() => setIsEditMode(!isEditMode)}
                variant={isEditMode ? "default" : "outline"}
                className="fintech-card"
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditMode ? 'Exit Edit' : 'Edit Layout'}
              </Button>
              
              {isEditMode && (
                <>
                  <Button
                    onClick={lockAllWidgets}
                    variant="outline"
                    className="fintech-card"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Lock All
                  </Button>
                  <Button
                    onClick={resetLayout}
                    variant="outline"
                    className="fintech-card"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </>
              )}
            </div>

            {/* Simple Navigation - Left Side */}
            <div className="fixed top-80 left-10 z-40 w-48">
              <SimpleNavigation 
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onJobHubClick={() => setIsJobHubOpen(true)}
              />
            </div>

            {/* Job Hub Sidebar */}
            <JobHubSidebar 
              isOpen={isJobHubOpen}
              onClose={() => setIsJobHubOpen(false)}
            />

            {/* Main Content Tabs - Positioned with spacing */}
            <div className="mt-[280px] mx-[188px]">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">

                <TabsContent value="job-hub" className="space-y-5">
                  {/* Draggable Widget Container */}
                  <div className="relative h-[1000px] w-full">
                    {/* Performance Widget */}
                    <DraggableWidget
                      id="performance"
                      defaultPosition={getWidgetConfig('performance').position}
                      defaultSize={getWidgetConfig('performance').size}
                      isLocked={getWidgetConfig('performance').isLocked}
                      onPositionChange={updateWidgetPosition}
                      onSizeChange={updateWidgetSize}
                      onLockToggle={toggleWidgetLock}
                    >
                      <CardContent className="p-5">
                        <div className="text-center">
                          <div className="h-12 w-12 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-orange-800">Performance</h3>
                          <p className="text-sm text-orange-600">Track metrics</p>
                        </div>
                      </CardContent>
                    </DraggableWidget>

                    {/* Earnings Widget */}
                    <DraggableWidget
                      id="earnings"
                      defaultPosition={getWidgetConfig('earnings').position}
                      defaultSize={getWidgetConfig('earnings').size}
                      isLocked={getWidgetConfig('earnings').isLocked}
                      onPositionChange={updateWidgetPosition}
                      onSizeChange={updateWidgetSize}
                      onLockToggle={toggleWidgetLock}
                    >
                      <CardContent className="p-5">
                        <div className="text-center">
                          <div className="h-12 w-12 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-orange-800">Earnings</h3>
                          <p className="text-sm text-orange-600">$2,450 today</p>
                        </div>
                      </CardContent>
                    </DraggableWidget>

                    {/* Rating Widget */}
                    <DraggableWidget
                      id="rating"
                      defaultPosition={getWidgetConfig('rating').position}
                      defaultSize={getWidgetConfig('rating').size}
                      isLocked={getWidgetConfig('rating').isLocked}
                      onPositionChange={updateWidgetPosition}
                      onSizeChange={updateWidgetSize}
                      onLockToggle={toggleWidgetLock}
                    >
                      <CardContent className="p-5">
                        <div className="text-center">
                          <div className="h-12 w-12 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <Star className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-orange-800">Rating</h3>
                          <p className="text-sm text-orange-600">4.9 stars</p>
                        </div>
                      </CardContent>
                    </DraggableWidget>

                    {/* Active Jobs Widget */}
                    <DraggableWidget
                      id="active-jobs"
                      defaultPosition={getWidgetConfig('active-jobs').position}
                      defaultSize={getWidgetConfig('active-jobs').size}
                      isLocked={getWidgetConfig('active-jobs').isLocked}
                      onPositionChange={updateWidgetPosition}
                      onSizeChange={updateWidgetSize}
                      onLockToggle={toggleWidgetLock}
                    >
                      <CardContent className="p-5">
                        <div className="text-center">
                          <div className="h-12 w-12 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-orange-800">Active Jobs</h3>
                          <p className="text-sm text-orange-600">3 pending</p>
                        </div>
                      </CardContent>
                    </DraggableWidget>

                    {/* Hidden Notifications Widget - now accessible via notification bell */}

                    {/* Smart Route Optimizer Widget - Fixed Layout */}
                    <div className="absolute" style={{ left: '620px', top: '320px', width: '500px', height: '400px' }}>
                      <Card className="h-full w-full bg-white border border-gray-200 shadow-lg">
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
                        <>
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
                        </>
                      )}
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="bookings" className="space-y-5">
                  {/* Fixed Calendar - moved from job-hub */}
                  <FixedCalendar />
                  
                  {/* Pending Bookings Section */}
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Incoming Pending Bookings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {pendingRequests.map((booking) => (
                          <div key={booking.id} className="fintech-inner-box flex items-center justify-between p-4">
                            <div className="flex-1">
                              <h3 className="font-medium">{booking.service}</h3>
                              <p className="text-sm opacity-70">{booking.client} • {booking.date} at {booking.time}</p>
                              <p className="text-sm opacity-60">{booking.location}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold">${booking.amount}</span>
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                  Accept
                                </Button>
                                <Button size="sm" variant="outline">
                                  Decline
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {pendingRequests.length === 0 && (
                          <div className="text-center py-8 opacity-70">
                            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No pending booking requests</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Booking Analytics Widget */}
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle>Booking Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">{completedJobs}</p>
                          <p className="text-sm opacity-70">Completed Today</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">${todaysEarnings}</p>
                          <p className="text-sm opacity-70">Today's Earnings</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{pendingRequests.length}</p>
                          <p className="text-sm opacity-70">Pending Requests</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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

                <TabsContent value="crew">
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle>Crew Center</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <p className="opacity-70">Crew coordination features will be displayed here</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="crew">
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle>Crew Center</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <p className="opacity-70">Crew coordination features will be displayed here</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderDashboard;
