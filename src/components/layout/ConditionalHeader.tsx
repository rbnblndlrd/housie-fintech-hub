import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';

const ConditionalHeader = () => {
  const location = useLocation();
  
  // Pages that KEEP the header
  const pagesWithHeader = [
    '/provider-profile/',  // This will match /provider-profile/:id
    '/social',
    '/competitive-advantage',
    '/help',
    '/help-center',
    '/profile',
    '/services'
  ];
  
  const shouldShowHeader = pagesWithHeader.some(path => {
    if (path.endsWith('/')) {
      // For dynamic routes like /provider-profile/:id
      return location.pathname.startsWith(path);
    }
    return location.pathname === path;
  });
  
  if (!shouldShowHeader) {
    return null;
  }
  
  return <Header />;
};

export default ConditionalHeader;
