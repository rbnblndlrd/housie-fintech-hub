
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen">
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-white hover:bg-white/10 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">Manager</h1>
                <p className="text-white/90 drop-shadow-lg">Operations management and oversight</p>
              </div>
            </div>
          </div>

          {/* Simple Clean Interface */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Ticket Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Organize and track service tickets</p>
                <Button 
                  onClick={() => navigate('/kanban')}
                  className="w-full"
                >
                  Open Tickets
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Route Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Optimize job routes and scheduling</p>
                <Button 
                  onClick={() => navigate('/gps-job-analyzer')}
                  className="w-full"
                >
                  Route Optimizer
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Schedule and appointment management</p>
                <Button 
                  onClick={() => navigate('/calendar')}
                  className="w-full"
                >
                  View Calendar
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Team Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Monitor team performance and availability</p>
                <div className="text-sm text-gray-500">
                  Coming soon...
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Performance metrics and analytics</p>
                <div className="text-sm text-gray-500">
                  Coming soon...
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Configure system preferences</p>
                <Button 
                  onClick={() => navigate('/profile')}
                  className="w-full"
                  variant="outline"
                >
                  Profile Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
