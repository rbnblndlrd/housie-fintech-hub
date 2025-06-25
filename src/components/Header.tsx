
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import DynamicNavigation from '@/components/DynamicNavigation';
import UserMenu from '@/components/header/UserMenu';
import HeaderActions from '@/components/header/HeaderActions';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getNavigationItems } from '@/utils/navigationConfig';

const Header = () => {
  const { user } = useAuth();
  const { currentRole } = useRole();
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

  // Test navigation function
  React.useEffect(() => {
    console.log('🏠 Header navigation test:', {
      navigateType: typeof navigate,
      canNavigate: typeof navigate === 'function'
    });
  }, [navigate]);

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
    <header className="bg-gray-900 text-white shadow-lg relative z-50 pointer-events-auto">
      <div className="max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8 pointer-events-auto">
            <div className="flex items-center space-x-2 cursor-pointer pointer-events-auto" onClick={handleLogoClick}>
              <img 
                src="/lovable-uploads/bf9b9088-19df-408a-89eb-3638be9d8ccf.png" 
                alt="HOUSIE" 
                className="h-8 w-auto" 
              />
            </div>
            <div className="pointer-events-auto">
              <DynamicNavigation items={navigationItems} />
            </div>
          </div>

          {/* Right side - Actions and User Menu */}
          <div className="flex items-center space-x-4 pointer-events-auto">
            <HeaderActions />
            {user ? (
              <UserMenu />
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white pointer-events-auto"
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
