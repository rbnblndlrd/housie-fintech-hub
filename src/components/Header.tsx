import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { getNavigationItems } from '@/utils/navigationConfig';
import DynamicNavigation from './DynamicNavigation';
import UserMenu from './header/UserMenu';
import RoleToggle from './header/RoleToggle';
import HeaderActions from './header/HeaderActions';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const navigationItems = getNavigationItems(user);

  return (
    <TooltipProvider>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo - Fixed width container */}
            <div className="flex justify-start">
              <button
                onClick={handleLogoClick}
                className="flex items-center space-x-2"
              >
                <img 
                  src="/lovable-uploads/8e4dab5f-fc1a-4bae-9e52-c88e60c0a67d.png" 
                  alt="HOUSIE" 
                  className="h-8 w-auto"
                />
              </button>
            </div>
            
            {/* Center: Navigation - Fixed positioning */}
            <nav className="hidden md:flex space-x-8">
              <DynamicNavigation items={navigationItems} />
            </nav>
            
            {/* Right: User Menu - Fixed width container */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {user && (
                <div className="flex items-center space-x-4">
                  <HeaderActions />
                  <RoleToggle />
                  <UserMenu />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default Header;
