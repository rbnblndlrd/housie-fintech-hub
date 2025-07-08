
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomerDashboard from './CustomerDashboard';
import ProviderDashboard from './ProviderDashboard';
import { ChatBubble } from '@/components/chat/ChatBubble';

const UnifiedDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { currentRole, isLoading } = useRoleSwitch();
  const navigate = useNavigate();

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
  
  return (
    <>
      {/* Back Navigation - Positioned in red box area */}
      <div className="fixed top-4 left-32 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
          className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-lg text-slate-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
      
      {currentRole === 'provider' ? <ProviderDashboard /> : <CustomerDashboard />}
      <ChatBubble />
    </>
  );
};

export default UnifiedDashboard;
