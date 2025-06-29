
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import DynamicNavigation from '@/components/DynamicNavigation';
import UserMenu from '@/components/header/UserMenu';
import HeaderActions from '@/components/header/HeaderActions';
import NotificationBell from '@/components/NotificationBell';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getNavigationItems } from '@/utils/navigationConfig';

const Header = () => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();
  const navigate = useNavigate();

  // Get navigation items based on user and current role
  const navigationItems = getNavigationItems(user, currentRole);

  console.log('🏠 Header render:', { 
    hasUser: !!user, 
    currentRole, 
    navigationItemsCount: navigationItems.length,
    navigationItems: navigationItems.map(item => ({ label: item.label, href: item.href })),
    hasNavigateFunction: typeof navigate === 'function'
  });

  const handleLogoClick = () => {
    console.log('🏠 Logo clicked, navigating to home');
    try {
      navigate('/');
      console.log('✅ Logo navigation successful');
    } catch (error) {
      console.error('❌ Logo navigation failed:', error);
      window.location.href = '/';
    }
  };

  return (
    <header 
      className="bg-gray-900 text-white shadow-lg fixed top-0 left-0 right-0 z-50" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 50,
        pointerEvents: 'auto'
      }}
    >
      <div className="max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8" style={{ pointerEvents: 'auto' }}>
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={handleLogoClick}
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            >
              <img 
                src="/lovable-uploads/bf9b9088-19df-408a-89eb-3638be9d8ccf.png" 
                alt="HOUSIE" 
                className="h-8 w-auto" 
              />
            </div>
            <div style={{ pointerEvents: 'auto' }}>
              <DynamicNavigation items={navigationItems} />
            </div>
          </div>

          {/* Right side - Actions, Notifications, and User Menu */}
          <div className="flex items-center space-x-4" style={{ pointerEvents: 'auto' }}>
            <HeaderActions />
            {user ? (
              <>
                <NotificationBell />
                <UserMenu />
              </>
            ) : (
              <Button 
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
