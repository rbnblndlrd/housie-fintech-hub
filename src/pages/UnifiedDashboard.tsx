import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import Header from '@/components/Header';
import CalendarPreview from '@/components/calendar/CalendarPreview';
import KanbanTicketList from '@/components/dashboard/KanbanTicketList';
import HiddenLoyaltySection from '@/components/dashboard/HiddenLoyaltySection';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Globe, 
  MessageSquare, 
  User,
  Star,
  TrendingUp,
  Shield,
  MapPin,
  Clock,
  DollarSign,
  Target,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Phone,
  CheckCircle
} from 'lucide-react';

interface Job {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceAddress: string;
  serviceTime: string;
  personalNotes: string;
  customerNotes: string;
  specialInstructions: string;
  estimatedTravelTime: string;
}

const UnifiedDashboard = () => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();
  const navigate = useNavigate();
  
  // Quick Actions navigation state
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  
  // Job Analyzer states
  const [analyzerMode, setAnalyzerMode] = useState<'route' | 'details'>('route');
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);
  const [routeJobs, setRouteJobs] = useState<Job[]>([
    {
      id: '1',
      customerName: 'Marie Dubois',
      customerPhone: '+1 514-555-0123',
      serviceAddress: '123 Rue Saint-Catherine, Montreal',
      serviceTime: '9:00 AM - 11:00 AM',
      personalNotes: 'Customer prefers morning appointments',
      customerNotes: 'Please ring the doorbell twice',
      specialInstructions: 'Bring ladder for ceiling work',
      estimatedTravelTime: '15 min'
    },
    {
      id: '2',
      customerName: 'Jean Tremblay',
      customerPhone: '+1 514-555-0456',
      serviceAddress: '456 Avenue Mont-Royal, Montreal',
      serviceTime: '1:00 PM - 3:00 PM',
      personalNotes: 'Regular customer, very friendly',
      customerNotes: 'Key under the mat if not home',
      specialInstructions: 'Check electrical panel in basement',
      estimatedTravelTime: '20 min'
    }
  ]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const quickActions = [
    {
      id: 'bookings',
      title: currentRole === 'provider' ? 'Job Management' : 'My Bookings',
      description: currentRole === 'provider' ? 'Kanban board & job tracking' : 'View upcoming appointments',
      icon: Calendar,
      onClick: () => navigate('/bookings')
    },
    {
      id: 'map',
      title: 'Interactive Map',
      description: 'GPS overlay & navigation',
      icon: Globe,
      onClick: () => navigate('/interactive-map')
    },
    {
      id: 'network',
      title: 'Feedback & Social',
      description: 'Network links & reviews',
      icon: MessageSquare,
      onClick: () => navigate('/social')
    },
    {
      id: 'profile',
      title: 'Profile & Settings',
      description: 'Profile updates & settings',
      icon: User,
      onClick: () => navigate('/profile')
    }
  ];

  const stats = {
    rating: 4.8,
    links: 47,
    achievements: 'Quality Pro',
    totalJobs: currentRole === 'provider' ? 156 : 23,
    earnings: currentRole === 'provider' ? '$3,450' : null,
    responseTime: currentRole === 'provider' ? '2 hours' : null,
    completionRate: currentRole === 'provider' ? '98%' : null
  };

  // Sample upcoming bookings for customers
  const upcomingBookings = [
    {
      id: '1',
      serviceName: 'Home Cleaning',
      date: '2024-01-15',
      time: '10:00 AM',
      provider: 'CleanPro Services',
      status: 'confirmed'
    },
    {
      id: '2',
      serviceName: 'Plumbing Repair',
      date: '2024-01-18',
      time: '2:00 PM',
      provider: 'Montreal Plumbers',
      status: 'pending'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleJobDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const jobData = JSON.parse(e.dataTransfer.getData('application/json'));
      console.log('Job dropped for route planning:', jobData);
      // Add job to route logic here
    } catch (error) {
      console.error('Error handling job drop:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const switchToDetailsMode = () => {
    if (routeJobs.length > 0) {
      setAnalyzerMode('details');
      setSelectedJobIndex(0);
    }
  };

  const switchToRouteMode = () => {
    setAnalyzerMode('route');
  };

  const navigateJob = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedJobIndex > 0) {
      setSelectedJobIndex(selectedJobIndex - 1);
    } else if (direction === 'next' && selectedJobIndex < routeJobs.length - 1) {
      setSelectedJobIndex(selectedJobIndex + 1);
    }
  };

  const currentJob = routeJobs[selectedJobIndex];

  const handleQuickActionNav = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentActionIndex > 0) {
      setCurrentActionIndex(currentActionIndex - 1);
    } else if (direction === 'next' && currentActionIndex < quickActions.length - 1) {
      setCurrentActionIndex(currentActionIndex + 1);
    }
  };

  const goToQuickAction = (index: number) => {
    setCurrentActionIndex(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
                </h1>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {currentRole === 'provider' ? 'Service Provider' : 'Customer'}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    Montreal, QC
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-yellow-500 mb-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold">{stats.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 mb-1">{stats.links}</div>
                  <p className="text-xs text-gray-500">Links</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 mb-1">{stats.totalJobs}</div>
                  <p className="text-xs text-gray-500">{currentRole === 'provider' ? 'Jobs Done' : 'Bookings'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions - With Navigation */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickActionNav('prev')}
                  disabled={currentActionIndex === 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex gap-1">
                  {quickActions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToQuickAction(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentActionIndex ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickActionNav('next')}
                  disabled={currentActionIndex === quickActions.length - 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Current Quick Action Card */}
            <div className="flex justify-center">
              <Card 
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-2 border-gray-200 hover:border-gray-300 w-80"
                onClick={quickActions[currentActionIndex].onClick}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-xl bg-gray-100 group-hover:bg-gray-200 transition-colors">
                      {React.createElement(quickActions[currentActionIndex].icon, { 
                        className: "h-8 w-8 text-gray-700" 
                      })}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-xl">
                        {quickActions[currentActionIndex].title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {quickActions[currentActionIndex].description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* All Quick Actions Grid (smaller preview) */}
            <div className="grid grid-cols-4 gap-3 mt-6">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                const isActive = index === currentActionIndex;
                
                return (
                  <Card 
                    key={action.id}
                    className={`hover:shadow-md transition-all duration-200 cursor-pointer group border ${
                      isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setCurrentActionIndex(index);
                      action.onClick();
                    }}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`p-2 rounded-lg transition-colors ${
                          isActive ? 'bg-blue-200' : 'bg-gray-100 group-hover:bg-gray-200'
                        }`}>
                          <IconComponent className="h-4 w-4 text-gray-700" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{action.title}</h4>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Top Row Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Calendar Preview Card */}
            <Card className="fintech-card border-3 border-black bg-cream/95 shadow-lg">
              <CardContent className="p-0">
                <CalendarPreview />
              </CardContent>
            </Card>

            {/* Role-specific content */}
            {currentRole === 'provider' ? (
              // Provider: Job Analyzer Card
              <Card className="fintech-card border-3 border-black bg-cream/95 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-gray-600" />
                    {analyzerMode === 'route' ? 'Job Analyzer - Route Planning' : 'Job Details'}
                  </CardTitle>
                  {analyzerMode === 'route' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={switchToDetailsMode}
                      disabled={routeJobs.length === 0}
                      className="h-8 w-8 p-0"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={switchToRouteMode}
                      className="h-8 w-8 p-0"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {analyzerMode === 'route' ? (
                    <div className="space-y-4">
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors"
                        onDrop={handleJobDrop}
                        onDragOver={handleDragOver}
                      >
                        <p className="text-gray-600 font-medium">Drop jobs here to add to GPS route</p>
                      </div>
                      
                      {routeJobs.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Current Route:</h4>
                          {routeJobs.map((job, index) => (
                            <div key={job.id} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                              <span className="text-sm font-medium">{index + 1}. {job.customerName}</span>
                              <span className="text-xs text-gray-600">{job.estimatedTravelTime}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    currentJob && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigateJob('prev')}
                            disabled={selectedJobIndex === 0}
                            className="h-8 w-8 p-0"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-sm text-gray-600">
                            {selectedJobIndex + 1} of {routeJobs.length}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigateJob('next')}
                            disabled={selectedJobIndex === routeJobs.length - 1}
                            className="h-8 w-8 p-0"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Customer</h4>
                            <p className="text-sm text-gray-700">{currentJob.customerName}</p>
                            <a 
                              href={`tel:${currentJob.customerPhone}`}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <Phone className="h-3 w-3" />
                              {currentJob.customerPhone}
                            </a>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Service Details</h4>
                            <p className="text-sm text-gray-700">{currentJob.serviceAddress}</p>
                            <p className="text-sm text-gray-600">{currentJob.serviceTime}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                            <p className="text-xs text-gray-600 mb-1"><strong>Personal:</strong> {currentJob.personalNotes}</p>
                            <p className="text-xs text-gray-600 mb-1"><strong>Customer:</strong> {currentJob.customerNotes}</p>
                            <p className="text-xs text-gray-600"><strong>Special:</strong> {currentJob.specialInstructions}</p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            ) : (
              // Customer: Upcoming Bookings Card
              <Card className="fintech-card border-3 border-black bg-cream/95 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Upcoming Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{booking.serviceName}</h4>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {booking.date} at {booking.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3" />
                          {booking.provider}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate('/bookings')}
                  >
                    View All Bookings
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Bottom Section - Provider only gets Kanban Tickets */}
          {currentRole === 'provider' && (
            <div className="mb-8">
              <KanbanTicketList />
            </div>
          )}
        </div>
      </div>

      {/* Add Hidden Loyalty Section */}
      <HiddenLoyaltySection />
      
      {/* Add Chat Bubble */}
      <ChatBubble />
    </div>
  );
};

export default UnifiedDashboard;
