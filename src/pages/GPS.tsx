import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import GPSNavigationMap from '@/components/map/GPSNavigationMap';

const GPS = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="relative min-h-screen">
      {/* Full-Screen Basic Map */}
      <div className="absolute inset-0 w-full h-full">
        <GPSNavigationMap />
      </div>
    </div>
  );
};

export default GPS;