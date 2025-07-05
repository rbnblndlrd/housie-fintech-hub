import React from 'react';
import { useLocation } from 'react-router-dom';
import VideoBackground from '@/components/common/VideoBackground';

const ConditionalVideoBackground = () => {
  const location = useLocation();
  
  // Pages that should have the video background
  const pagesWithVideoBackground = [
    '/dashboard',
    '/bookings',
    '/profile',
    '/notifications',
    '/performance',
    '/business-insights'
  ];
  
  const shouldShowVideoBackground = pagesWithVideoBackground.some(path => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  });
  
  if (!shouldShowVideoBackground) {
    return null;
  }
  
  return <VideoBackground />;
};

export default ConditionalVideoBackground;