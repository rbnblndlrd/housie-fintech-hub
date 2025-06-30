
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { Navigate, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardRoleToggle from '@/components/dashboard/DashboardRoleToggle';
import { 
  Calendar, 
  Kanban, 
  Map, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  TrendingUp,
  Target,
  Activity
} from 'lucide-react';

const UnifiedDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { currentRole, availableRoles, isLoading: roleLoading } = useRoleSwitch();
  const navigate = useNavigate();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
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
    { id: 3, client: 'Sophie Tremblay', service: 'Electrical Check', time: '4:30 PM', priority: 'low' }
  ];

  const activeTickets = [
    { id: 1, title: 'Emergency Plumbing - Downtown', status: 'in-progress', assignee: 'Marc D.', priority: 'high' },
    { id: 2, title: 'HVAC Service - Westmount', status: 'pending', assignee: 'Sophie T.', priority: 'medium' },
    { id: 3, title: 'Electrical Repair - Plateau', status: 'scheduled', assignee: 'Pierre G.', priority: 'medium' }
  ];

  const quickStats = {
    todayJobs: 12,
    completedJobs: 8,
    pendingJobs: 4,
    todayRevenue: 2450
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 w-full px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header with Role Toggle */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {currentRole === 'customer' ? 'Welcome back!' : 'Provider Dashboard'}
              </h1>
              <p className="text-gray-600">
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
                <span className="text-sm font-medium">Kanban Board</span>
              </Button>
              
              <Button
                onClick={() => navigate('/gps-job-analyzer')}
                className="h-20 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white flex flex-col items-center justify-center gap-2"
              >
                <Map className="h-6 w-6" />
                <span className="text-sm font-medium">GPS Analyzer</span>
              </Button>
              
              <Button
                onClick={() => navigate('/analytics')}
                className="h-20 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex flex-col items-center justify-center gap-2"
              >
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm font-medium">Analytics</span>
              </Button>
            </div>
          )}

          {/* Quick Stats for Provider */}
          {currentRole === 'provider' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{quickStats.todayJobs}</div>
                  <div className="text-sm text-gray-600">Today's Jobs</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{quickStats.completedJobs}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{quickStats.pendingJobs}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">${quickStats.todayRevenue}</div>
                  <div className="text-sm text-gray-600">Revenue</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Dashboard Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  {currentRole === 'provider' ? "Today's Schedule" : "Upcoming Bookings"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaySchedule.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{appointment.client}</div>
                        <div className="text-sm text-gray-600">{appointment.service}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{appointment.time}</div>
                        <Badge 
                          className={
                            appointment.priority === 'high' ? 'bg-red-100 text-red-800' :
                            appointment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }
                        >
                          {appointment.priority}
                        </Badge>
                      </div>
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

            {/* Kanban Preview for Provider */}
            {currentRole === 'provider' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Kanban className="h-5 w-5 text-blue-500" />
                    Active Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeTickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{ticket.title}</div>
                          <div className="text-sm text-gray-600">Assigned to: {ticket.assignee}</div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            className={
                              ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
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
                    Open Kanban Board
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Customer Services Card */}
            {currentRole === 'customer' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-500" />
                    Find Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">Browse and book home services from trusted professionals.</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">🔧 Plumbing</Button>
                      <Button variant="outline" size="sm">⚡ Electrical</Button>
                      <Button variant="outline" size="sm">🌡️ HVAC</Button>
                      <Button variant="outline" size="sm">🏠 General</Button>
                    </div>
                    <Button 
                      onClick={() => navigate('/services')}
                      className="w-full"
                    >
                      Browse All Services
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analytics Preview for Provider */}
            {currentRole === 'provider' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Week</span>
                      <span className="font-medium">47 jobs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg Response</span>
                      <span className="font-medium">23 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Rating</span>
                      <span className="font-medium">4.8 ⭐</span>
                    </div>
                    <Button 
                      onClick={() => navigate('/analytics')}
                      className="w-full" 
                      variant="outline"
                    >
                      View Full Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* GPS/Route Preview for Provider */}
            {currentRole === 'provider' && (
              <Card>
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
                      Open GPS Analyzer
                    </Button>
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
