
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { Navigate } from 'react-router-dom';
import CustomerDashboard from './CustomerDashboard';
import ProviderDashboard from './ProviderDashboard';

const UnifiedDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { currentRole, isLoading } = useRoleSwitch();

  console.log('🎯 UnifiedDashboard render:', { 
    hasUser: !!user,
    authLoading,
    currentRole, 
    isLoading 
  });

  // Redirect to auth if not authenticated
  if (!authLoading && !user) {
    console.log('🚪 No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Show loading while auth or role context is loading
  if (authLoading || isLoading) {
    console.log('⏳ Loading auth or role data...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Render the appropriate dashboard based on current role
  console.log('🎯 Rendering dashboard for role:', currentRole);
  
  if (currentRole === 'provider') {
    return <ProviderDashboard />;
  } else {
    return <CustomerDashboard />;
  }
};

export default UnifiedDashboard;
