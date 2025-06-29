
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import CustomerDashboard from '@/pages/CustomerDashboard';
import ProviderDashboard from '@/pages/ProviderDashboard';
import DashboardRoleToggle from '@/components/dashboard/DashboardRoleToggle';
import { Card, CardContent } from '@/components/ui/card';

const UnifiedDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { currentRole, availableRoles } = useRoleSwitch();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header with Role Toggle */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {currentRole === 'customer' ? 'My Overview' : 'Provider Dashboard'}
              </h1>
              <p className="text-gray-600">
                {currentRole === 'customer' 
                  ? 'Your bookings and account overview' 
                  : 'Manage your services and track performance'
                }
              </p>
            </div>
            
            {/* Role Toggle - only show if user has multiple roles */}
            {availableRoles.length > 1 && <DashboardRoleToggle />}
          </div>

          {/* Role-Specific Dashboard Content */}
          <div className="dashboard-content">
            {currentRole === 'customer' ? (
              <CustomerDashboardContent />
            ) : (
              <ProviderDashboardContent />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified Customer Dashboard Content (overview style)
const CustomerDashboardContent = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Upcoming Bookings</h3>
            <p className="text-3xl font-bold text-blue-600">3</p>
            <p className="text-sm text-gray-600">Next: Tomorrow at 2:00 PM</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Total Spent</h3>
            <p className="text-3xl font-bold text-green-600">$450</p>
            <p className="text-sm text-gray-600">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Services Used</h3>
            <p className="text-3xl font-bold text-purple-600">12</p>
            <p className="text-sm text-gray-600">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">House Cleaning</p>
                <p className="text-sm text-gray-600">Completed yesterday</p>
              </div>
              <span className="text-green-600 font-medium">$85</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Plumbing Repair</p>
                <p className="text-sm text-gray-600">Scheduled for tomorrow</p>
              </div>
              <span className="text-blue-600 font-medium">$120</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Full Provider Dashboard Content (detailed view)
const ProviderDashboardContent = () => {
  return <ProviderDashboard />;
};

export default UnifiedDashboard;
