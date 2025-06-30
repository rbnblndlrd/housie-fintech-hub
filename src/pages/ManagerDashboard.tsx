
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  Map, 
  Kanban, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Target,
  Activity,
  Settings
} from 'lucide-react';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    navigate('/auth');
    return null;
  }

  const quickStats = {
    todayJobs: 12,
    completedJobs: 8,
    pendingJobs: 4,
    todayRevenue: 2450,
    thisWeekJobs: 47,
    avgResponseTime: 23
  };

  const upcomingAppointments = [
    { id: 1, client: 'Marie Dubois', service: 'Plumbing Repair', time: '10:30 AM', priority: 'high' },
    { id: 2, client: 'Jean Martin', service: 'HVAC Maintenance', time: '2:00 PM', priority: 'medium' },
    { id: 3, client: 'Sophie Tremblay', service: 'Electrical Check', time: '4:30 PM', priority: 'low' }
  ];

  const activeTickets = [
    { id: 1, title: 'Emergency Plumbing - Downtown', status: 'in-progress', assignee: 'Marc D.', priority: 'high' },
    { id: 2, title: 'HVAC Service - Westmount', status: 'pending', assignee: 'Sophie T.', priority: 'medium' },
    { id: 3, title: 'Electrical Repair - Plateau', status: 'scheduled', assignee: 'Pierre G.', priority: 'medium' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manager Dashboard</h1>
            <p className="text-gray-600">Operations command center and analytics</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
              onClick={() => navigate('/calendar')}
              className="h-20 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex flex-col items-center justify-center gap-2"
            >
              <Calendar className="h-6 w-6" />
              <span className="text-sm font-medium">Calendar</span>
            </Button>
            
            <Button
              onClick={() => navigate('/analytics')}
              className="h-20 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex flex-col items-center justify-center gap-2"
            >
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm font-medium">Analytics</span>
            </Button>
          </div>

          {/* Manager Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-teal-600">{quickStats.thisWeekJobs}</div>
                    <div className="text-sm text-gray-600">This Week</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{quickStats.avgResponseTime}m</div>
                    <div className="text-sm text-gray-600">Avg Response</div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-orange-500" />
                      Today's Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingAppointments.map((appointment) => (
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

                {/* Kanban Preview */}
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
              </div>
            </TabsContent>

            <TabsContent value="operations" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-500" />
                      Operations Command
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      onClick={() => navigate('/gps-job-analyzer')}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Map className="h-4 w-4 mr-2" />
                      GPS Job Analyzer
                    </Button>
                    <Button 
                      onClick={() => navigate('/kanban')}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Kanban className="h-4 w-4 mr-2" />
                      Ticket Management
                    </Button>
                    <Button 
                      onClick={() => navigate('/schedule')}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule Optimizer
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-500" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      className="w-full justify-start bg-red-500 hover:bg-red-600 text-white"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Emergency Dispatch
                    </Button>
                    <Button 
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Batch Assign Jobs
                    </Button>
                    <Button 
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                    <p className="text-gray-600 mb-4">Comprehensive performance metrics and insights</p>
                    <Button onClick={() => navigate('/analytics')}>
                      View Full Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="planning" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    Strategic Planning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Strategic Planning Tools</h3>
                    <p className="text-gray-600 mb-4">Long-term planning and resource optimization</p>
                    <Button onClick={() => navigate('/strategic-planning')}>
                      Access Planning Tools
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
