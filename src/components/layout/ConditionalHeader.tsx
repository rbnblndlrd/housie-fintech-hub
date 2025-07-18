
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';

const ConditionalHeader = () => {
  const location = useLocation();
  
  // Only show header on auth page for now
  const pagesWithHeader = [
    '/auth'
  ];
  
  const shouldShowHeader = pagesWithHeader.includes(location.pathname);
  
  if (!shouldShowHeader) {
    return null;
  }
  
  return <Header />;
};

export default ConditionalHeader;
