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
    <div className="fixed inset-0 w-full h-full bg-background z-50 p-2">
      <div className="border-2 border-border rounded-lg overflow-hidden h-full">
        <GPSNavigationMap />
      </div>
    </div>
  );
};

export default GPS;