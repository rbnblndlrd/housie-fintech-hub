
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

  // Redirect based on role
  console.log('🎯 Routing based on role:', currentRole);
  
  if (currentRole === 'customer') {
    return <Navigate to="/service-board" replace />;
  }
  
  if (currentRole === 'provider') {
    return (
      <>
        {/* Back Navigation - Above Dashboard tab */}
        <div className="fixed top-[94px] left-[22px] z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="bg-white border-slate-300 shadow-lg text-slate-800 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <ProviderDashboard />
        <ChatBubble />
      </>
    );
  }
  
  // Fallback
  return <Navigate to="/service-board" replace />;
};

export default UnifiedDashboard;
