import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import UnifiedMobileProfile from '@/components/profile/UnifiedMobileProfile';
import ProfileErrorBoundary from '@/components/profile/ProfileErrorBoundary';
import BackNavigation from '@/components/navigation/BackNavigation';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();

  console.log('📱 Profile page render:', { 
    hasUser: !!user, 
    authLoading,
    userId: user?.id,
    email: user?.email 
  });

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if no user
  if (!user) {
    console.log('🔐 Profile: No user found, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  return (
    <ProfileErrorBoundary>
      <BackNavigation />
      <UnifiedMobileProfile />
    </ProfileErrorBoundary>
  );
};

export default Profile;