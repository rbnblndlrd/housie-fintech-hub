
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import DynamicNavigation from '@/components/DynamicNavigation';
import UserMenu from '@/components/header/UserMenu';
import HeaderActions from '@/components/header/HeaderActions';
import NotificationBell from '@/components/NotificationBell';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { getNavigationItems } from '@/utils/navigationConfig';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      navigate('/auth');
    } catch (error) {
      console.error('Sign-out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

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
      className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 50,
        pointerEvents: 'auto'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/a4e647f0-865a-42ef-a0cc-19226d5f0a35.png" 
              alt="HOUSIE" 
              className="h-10 w-auto"
              onError={(e) => {
                // Fallback to text if image fails to load
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const nextSibling = target.nextElementSibling as HTMLElement;
                if (nextSibling) {
                  nextSibling.style.display = 'block';
                }
              }}
            />
            <span className="text-xl font-bold text-white hidden">HOUSIE</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
              Services
            </Link>
            {user && (
              <>
                <Link to="/calendar" className="text-gray-300 hover:text-white transition-colors">
                  Calendar
                </Link>
                <Link to="/messages" className="text-gray-300 hover:text-white transition-colors">
                  Messages
                </Link>
                <Link to="/customer-dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="hidden sm:inline text-sm text-gray-300">
                  Welcome, {user.email?.split('@')[0]}
                </span>
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
