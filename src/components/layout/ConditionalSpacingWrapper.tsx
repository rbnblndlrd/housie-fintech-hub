import React from 'react';
import { useLocation } from 'react-router-dom';

interface ConditionalSpacingWrapperProps {
  children: React.ReactNode;
}

const ConditionalSpacingWrapper: React.FC<ConditionalSpacingWrapperProps> = ({ children }) => {
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
  
  const hasHeader = pagesWithHeader.some(path => {
    if (path.endsWith('/')) {
      // For dynamic routes like /provider-profile/:id
      return location.pathname.startsWith(path);
    }
    return location.pathname === path;
  });
  
  return (
    <div className={hasHeader ? 'has-header' : ''}>
      {children}
    </div>
  );
};

export default ConditionalSpacingWrapper;
