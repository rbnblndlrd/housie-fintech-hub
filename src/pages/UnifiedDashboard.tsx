
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import Header from '@/components/Header';
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
  Award,
  Target,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Phone
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
      id: 'manager',
      title: 'Manager',
      description: 'Calendar & client coordination',
      icon: Calendar,
      onClick: () => navigate('/calendar')
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

  const handleJobDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Handle job drop logic here
    console.log('Job dropped for route planning');
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

          {/* Quick Actions - Single Row */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                
                return (
                  <Card 
                    key={action.id}
                    className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-2 border-gray-200 hover:border-gray-300"
                    onClick={action.onClick}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-xl bg-gray-100 group-hover:bg-gray-200 transition-colors">
                          <IconComponent className="h-6 w-6 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                          <p className="text-gray-600 text-xs leading-relaxed">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Performance Cards Grid with Fintech Styling */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Your Performance Card */}
            <Card className="fintech-card border-3 border-black bg-cream/95 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-gray-600" />
                  Your Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="h-8 w-8 text-yellow-500 fill-current" />
                      <span className="text-3xl font-bold text-gray-900">{stats.rating}</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      {stats.achievements}
                    </Badge>
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Network Links</span>
                      <span className="font-bold text-gray-900">{stats.links}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {currentRole === 'provider' ? 'Jobs Completed' : 'Services Booked'}
                      </span>
                      <span className="font-bold text-gray-900">{stats.totalJobs}</span>
                    </div>
                    {stats.earnings && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Monthly Earnings</span>
                        <span className="font-bold text-green-600">{stats.earnings}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Analyzer Card */}
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

            {/* Provider/Customer Specific Card */}
            {currentRole === 'provider' ? (
              <Card className="fintech-card border-3 border-black bg-cream/95 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-gray-600" />
                    Earnings Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">{stats.earnings}</div>
                      <div className="text-sm text-gray-600">This Month</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Completed Jobs</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pending Payments</span>
                        <span className="font-medium text-orange-600">$240</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Next Payout</span>
                        <span className="font-medium">Jan 15</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                        <div className="font-bold text-blue-900">{stats.responseTime}</div>
                        <div className="text-xs text-blue-700">Avg Response</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Target className="h-6 w-6 text-green-600 mx-auto mb-1" />
                        <div className="font-bold text-green-900">{stats.completionRate}</div>
                        <div className="text-xs text-green-700">Completion Rate</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="fintech-card border-3 border-black bg-cream/95 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-gray-600" />
                    Service Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-bold text-blue-900">5</div>
                        <div className="text-xs text-blue-700">Active Bookings</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="font-bold text-green-900">18</div>
                        <div className="text-xs text-green-700">Completed</div>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="font-bold text-purple-900">$1,250</div>
                      <div className="text-xs text-purple-700">Total Spent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
