
import React, { useState } from 'react';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Zap, 
  FileText, 
  Settings,
  Bell,
  Search,
  Filter,
  Star,
  TrendingUp,
  DollarSign,
  Phone,
  CreditCard,
  Navigation,
  Target
} from 'lucide-react';

const Dashboard = () => {
  const [draggedTicket, setDraggedTicket] = useState(null);

  const statsData = [
    { 
      title: 'Active Jobs', 
      value: '24', 
      change: '+12%', 
      icon: Zap, 
      color: 'from-blue-600 to-blue-800'
    },
    { 
      title: 'Monthly Revenue', 
      value: '$18,450', 
      change: '+8.5%', 
      icon: DollarSign, 
      color: 'from-green-600 to-green-800'
    },
    { 
      title: 'Team Members', 
      value: '12', 
      change: '+2', 
      icon: Users, 
      color: 'from-purple-600 to-purple-800'
    },
    { 
      title: 'Avg Rating', 
      value: '4.9', 
      change: '+0.1', 
      icon: Star, 
      color: 'from-yellow-600 to-yellow-800'
    }
  ];

  const quickActions = [
    { 
      icon: Plus, 
      title: 'New Job', 
      subtitle: 'Create ticket',
      color: 'from-blue-600 to-blue-800'
    },
    { 
      icon: Phone, 
      title: 'Emergency', 
      subtitle: 'Urgent call',
      color: 'from-red-600 to-red-800'
    },
    { 
      icon: Users, 
      title: 'Crew Status', 
      subtitle: 'Team overview',
      color: 'from-green-600 to-green-800'
    },
    { 
      icon: MapPin, 
      title: 'Route Plan', 
      subtitle: 'GPS optimize',
      color: 'from-purple-600 to-purple-800'
    },
    { 
      icon: Calendar, 
      title: 'Schedule', 
      subtitle: 'View calendar',
      color: 'from-yellow-600 to-yellow-800'
    },
    { 
      icon: CreditCard, 
      title: 'Payments', 
      subtitle: 'Process billing',
      color: 'from-indigo-600 to-indigo-800'
    }
  ];

  const todayJobs = [
    {
      id: 1,
      time: '09:00 AM',
      client: 'Sarah Johnson',
      service: 'Plumbing Repair',
      location: 'Downtown Montreal',
      status: 'confirmed',
      priority: 'high'
    },
    {
      id: 2,
      time: '11:30 AM',
      client: 'Mike Chen',
      service: 'HVAC Maintenance',
      location: 'Westmount',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 3,
      time: '02:00 PM',
      client: 'Lisa Martin',
      service: 'Electrical Check',
      location: 'NDG',
      status: 'confirmed',
      priority: 'low'
    }
  ];

  const jobQueue = [
    { id: 1, title: 'Emergency Plumbing', client: 'Marie Tremblay', priority: 'high', status: 'new' },
    { id: 2, title: 'HVAC Maintenance', client: 'Jean Dupont', priority: 'medium', status: 'assigned' },
    { id: 3, title: 'Electrical Repair', client: 'Sophie Martin', priority: 'low', status: 'in-progress' },
    { id: 4, title: 'Home Cleaning', client: 'Robert Wilson', priority: 'medium', status: 'new' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'new': return 'bg-blue-500';
      case 'assigned': return 'bg-purple-500';
      case 'in-progress': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen" style={{ background: '#F5F2E9' }}>
        <Header />
        <div className="pt-20 px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-black banking-title mb-2">
                  HOUSIE Command Center
                </h1>
                <p className="banking-text text-lg">
                  Manage your operations with intelligent automation
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button className="banking-button-secondary">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                  <Badge className="ml-2 bg-red-500 text-white">3</Badge>
                </Button>
                <Button className="banking-button-primary">
                  <Plus className="h-5 w-5 mr-2" />
                  New Job
                </Button>
              </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsData.map((stat, index) => (
                <Card key={index} className="banking-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm banking-text font-semibold mb-2">{stat.title}</p>
                        <p className="text-3xl font-black banking-title mb-2">{stat.value}</p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-bold text-sm">{stat.change}</span>
                        </div>
                      </div>
                      <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <stat.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions Grid */}
            <div className="mb-8">
              <Card className="banking-card">
                <CardHeader>
                  <CardTitle className="banking-title flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
                      <Settings className="h-4 w-4 text-white" />
                    </div>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        className={`
                          h-20 p-4 bg-gradient-to-br ${action.color} 
                          hover:scale-105 transition-all duration-200 
                          shadow-lg hover:shadow-xl border-4 border-white/20 rounded-xl
                        `}
                        variant="ghost"
                      >
                        <div className="flex flex-col items-center gap-2 text-white">
                          <action.icon className="h-6 w-6" />
                          <div className="text-center">
                            <div className="font-bold text-sm">{action.title}</div>
                            <div className="text-xs opacity-90">{action.subtitle}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Calendar Preview */}
              <Card className="banking-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="banking-title flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      Today's Schedule
                    </CardTitle>
                    <Badge className="banking-badge">
                      {todayJobs.length} Jobs
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {todayJobs.map((job) => (
                      <div key={job.id} className="flex items-center gap-4 p-3 bg-white/50 rounded-xl border-2 border-gray-200">
                        <div className="flex flex-col items-center gap-1 min-w-[60px]">
                          <Clock className="h-3 w-3 text-gray-600" />
                          <span className="text-xs font-bold banking-text">{job.time}</span>
                        </div>
                        
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(job.status)}`}></div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold banking-text text-sm">{job.client}</span>
                            <Badge className={`${getPriorityColor(job.priority)} text-xs`}>
                              {job.priority}
                            </Badge>
                          </div>
                          <p className="banking-text text-xs">{job.service}</p>
                          <div className="flex items-center gap-1 text-xs banking-text opacity-70">
                            <MapPin className="h-3 w-3" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full mt-4 banking-button-secondary">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Full Calendar
                  </Button>
                </CardContent>
              </Card>

              {/* GPS Preview */}
              <Card className="banking-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="banking-title flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center">
                        <Navigation className="h-4 w-4 text-white" />
                      </div>
                      Route Optimizer
                    </CardTitle>
                    <Badge className="banking-badge">
                      94% Optimized
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Route Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-xl border-2 border-blue-200">
                      <div className="text-lg font-black text-blue-800">6</div>
                      <div className="text-xs font-bold text-blue-600">Jobs</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-xl border-2 border-purple-200">
                      <div className="text-lg font-black text-purple-800">47km</div>
                      <div className="text-xs font-bold text-purple-600">Distance</div>
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-32 mb-4 border-3 border-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <p className="banking-text font-semibold text-sm">Interactive Map View</p>
                      <p className="banking-text text-xs opacity-70">Real-time GPS tracking</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button className="banking-button-secondary text-sm">
                      <Target className="h-3 w-3 mr-1" />
                      Re-optimize
                    </Button>
                    <Button className="banking-button-primary text-sm">
                      <Zap className="h-3 w-3 mr-1" />
                      Live Track
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job Queue */}
            <Card className="banking-card">
              <CardHeader>
                <CardTitle className="banking-title flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl flex items-center justify-center">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  Job Ticket Queue
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobQueue.map((job) => (
                    <div key={job.id} className="p-4 bg-white/50 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="banking-title text-sm">{job.title}</h4>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(job.status)}`}></div>
                      </div>
                      <p className="banking-text text-sm mb-2">{job.client}</p>
                      <Badge className={`${getPriorityColor(job.priority)} text-xs`}>
                        {job.priority} priority
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
