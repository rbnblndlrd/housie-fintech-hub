
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardRoleToggle from '@/components/dashboard/DashboardRoleToggle';
import { 
  Calendar, 
  Kanban, 
  Map, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  TrendingUp,
  Target,
  Activity,
  DollarSign,
  Star,
  User,
  Settings
} from 'lucide-react';

const UnifiedDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { currentRole, availableRoles, isLoading: roleLoading } = useRoleSwitch();
  const navigate = useNavigate();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen">
        <div className="pt-20 w-full px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Sample data for dashboard previews
  const todaySchedule = [
    { id: 1, client: 'Marie Dubois', service: 'Plumbing Repair', time: '10:30 AM', priority: 'high' },
    { id: 2, client: 'Jean Martin', service: 'HVAC Maintenance', time: '2:00 PM', priority: 'medium' },
    { id: 3, client: 'Sophie Tremblay', service: 'Electrical Check', time: '4:30 PM', priority: 'low' },
    { id: 4, client: 'Pierre Gagnon', service: 'Kitchen Repair', time: '6:00 PM', priority: 'medium' },
    { id: 5, client: 'Claire Dubois', service: 'Bathroom Fix', time: '8:30 PM', priority: 'high' }
  ];

  const activeTickets = [
    { id: 1, title: 'Emergency Plumbing - Downtown', status: 'in-progress', assignee: 'Marc D.', priority: 'high', location: 'Montreal' },
    { id: 2, title: 'HVAC Service - Westmount', status: 'pending', assignee: 'Sophie T.', priority: 'medium', location: 'Westmount' },
    { id: 3, title: 'Electrical Repair - Plateau', status: 'scheduled', assignee: 'Pierre G.', priority: 'medium', location: 'Plateau' },
    { id: 4, title: 'Kitchen Renovation - Verdun', status: 'in-progress', assignee: 'Luc B.', priority: 'low', location: 'Verdun' },
    { id: 5, title: 'Bathroom Plumbing - NDG', status: 'pending', assignee: 'Marc D.', priority: 'high', location: 'NDG' },
    { id: 6, title: 'Heating System - Outremont', status: 'review', assignee: 'Sophie T.', priority: 'medium', location: 'Outremont' }
  ];

  const performanceMetrics = {
    todayJobs: 12,
    completedJobs: 8,
    pendingJobs: 4,
    todayRevenue: 2450,
    avgResponseTime: '23 min',
    customerRating: 4.8,
    activeTeamMembers: 6
  };

  return (
    <div className="min-h-screen">
      <div className="pt-20 w-full px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header with Role Toggle */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                {currentRole === 'customer' ? 'Welcome back!' : 'Provider Dashboard'}
              </h1>
              <p className="text-white/90 drop-shadow-lg">
                {currentRole === 'customer' 
                  ? 'Manage your bookings, calendar, and account' 
                  : 'Command center - manage operations and track performance'
                }
              </p>
            </div>
            
            {availableRoles.length > 1 && <DashboardRoleToggle />}
          </div>

          {/* Quick Actions for Provider */}
          {currentRole === 'provider' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Button
                onClick={() => navigate('/manager')}
                className="h-20 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex flex-col items-center justify-center gap-2"
              >
                <Activity className="h-6 w-6" />
                <span className="text-sm font-medium">Manager</span>
              </Button>
              
              <Button
                onClick={() => navigate('/kanban')}
                className="h-20 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex flex-col items-center justify-center gap-2"
              >
                <Kanban className="h-6 w-6" />
                <span className="text-sm font-medium">Tickets</span>
              </Button>
              
              <Button
                onClick={() => navigate('/gps-job-analyzer')}
                className="h-20 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white flex flex-col items-center justify-center gap-2"
              >
                <Map className="h-6 w-6" />
                <span className="text-sm font-medium">GPS Routes</span>
              </Button>
              
              <Button
                onClick={() => navigate('/profile')}
                className="h-20 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex flex-col items-center justify-center gap-2"
              >
                <Settings className="h-6 w-6" />
                <span className="text-sm font-medium">Profile</span>
              </Button>
            </div>
          )}

          {/* Main Dashboard Layout - Asymmetric Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Big Ticket List - Spans most of the width */}
            <div className="col-span-12 lg:col-span-8">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Kanban className="h-5 w-5 text-blue-500" />
                    {currentRole === 'provider' ? 'Active Tickets & Jobs' : 'My Bookings'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {activeTickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{ticket.title}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-4 mt-1">
                            <span>Assigned to: {ticket.assignee}</span>
                            <span>📍 {ticket.location}</span>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <Badge 
                            className={
                              ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                              ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }
                          >
                            {ticket.priority}
                          </Badge>
                          <Badge 
                            className={
                              ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              ticket.status === 'review' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }
                          >
                            {ticket.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => navigate('/kanban')}
                    className="w-full mt-4" 
                    variant="outline"
                  >
                    Open Full Ticket System
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics - Left of GPS */}
            <div className="col-span-12 lg:col-span-4">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{performanceMetrics.todayJobs}</div>
                        <div className="text-xs text-gray-600">Today's Jobs</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{performanceMetrics.completedJobs}</div>
                        <div className="text-xs text-gray-600">Completed</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">${performanceMetrics.todayRevenue}</div>
                        <div className="text-xs text-gray-600">Revenue</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-lg font-bold text-yellow-600">{performanceMetrics.avgResponseTime}</div>
                        <div className="text-xs text-gray-600">Avg Response</div>
                      </div>
                    </div>
                    <div className="text-center pt-2 border-t">
                      <div className="flex items-center justify-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold text-lg">{performanceMetrics.customerRating}</span>
                        <span className="text-sm text-gray-600">Rating</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Wide Calendar Preview - Spans 2/3 of width */}
            <div className="col-span-12 lg:col-span-8">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-500" />
                    {currentRole === 'provider' ? "Today's Schedule" : "Upcoming Bookings"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                    {todaySchedule.map((appointment) => (
                      <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg border">
                        <div className="font-medium text-sm text-gray-900">{appointment.time}</div>
                        <div className="text-xs text-gray-600 mt-1">{appointment.client}</div>
                        <div className="text-xs text-gray-500 mt-1">{appointment.service}</div>
                        <Badge 
                          className={`mt-2 text-xs ${
                            appointment.priority === 'high' ? 'bg-red-100 text-red-800' :
                            appointment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          {appointment.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => navigate('/calendar')}
                    className="w-full mt-4" 
                    variant="outline"
                  >
                    View Full Calendar
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Small GPS Job Analyzer - Right side */}
            <div className="col-span-12 lg:col-span-4">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-green-500" />
                    Route Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <Target className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Optimize routes for maximum efficiency</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-medium">3</div>
                        <div className="text-gray-600">Pending</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-medium">25km</div>
                        <div className="text-gray-600">Today</div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate('/gps-job-analyzer')}
                      className="w-full" 
                      variant="outline"
                    >
                      Open GPS Routes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
