
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import CustomerDashboard from '@/pages/CustomerDashboard';
import ProviderDashboard from '@/pages/ProviderDashboard';
import DashboardRoleToggle from '@/components/dashboard/DashboardRoleToggle';

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
                {currentRole === 'customer' ? 'Welcome back!' : 'Provider Dashboard'}
              </h1>
              <p className="text-gray-600">
                {currentRole === 'customer' 
                  ? 'Manage your bookings, calendar, and account' 
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

// Full Customer Dashboard Content (using the complete CustomerDashboard)
const CustomerDashboardContent = () => {
  return <CustomerDashboard />;
};

// Full Provider Dashboard Content (detailed view)
const ProviderDashboardContent = () => {
  return <ProviderDashboard />;
};

export default UnifiedDashboard;
