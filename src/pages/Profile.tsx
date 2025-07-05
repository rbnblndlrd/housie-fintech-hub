import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import UnifiedMobileProfile from '@/components/profile/UnifiedMobileProfile';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <UnifiedMobileProfile />;
};

export default Profile;