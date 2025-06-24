
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronRight, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { getUserDropdownItems, getProfileMenuItems, getAnalyticsMenuItems, NavigationItem } from '@/utils/navigationConfig';
import { getLoyaltyMenuItems } from '@/components/gamification/LoyaltyMenuItems';
import NotificationIndicator from '@/components/NotificationIndicator';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { currentRole, setCurrentRole } = useRole();
  const navigate = useNavigate();

  console.log('👤 UserMenu render:', { user: !!user, currentRole });

  const handleLogout = async () => {
    try {
      await logout();
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDropdownAction = (item: NavigationItem) => {
    console.log('🔧 Dropdown action clicked:', item.label, 'href:', item.href, 'action:', item.action);
    
    if (item.action === 'logout') {
      handleLogout();
    } else if (item.action === 'toggle-customer') {
      console.log('🔧 Switching to customer role');
      setCurrentRole('customer');
      // Navigate to customer dashboard if currently on provider dashboard
      if (window.location.pathname === '/provider-dashboard') {
        navigate('/customer-dashboard');
      }
    } else if (item.action === 'toggle-provider') {
      console.log('🔧 Switching to provider role');
      setCurrentRole('provider');
      // Navigate to provider dashboard if currently on customer dashboard
      if (window.location.pathname === '/customer-dashboard') {
        navigate('/provider-dashboard');
      }
    } else if (item.href) {
      navigate(item.href);
    }
  };

  // Memoize menu items
  const userDropdownItems = useMemo(() => {
    return getUserDropdownItems(user, currentRole);
  }, [user, currentRole]);

  const profileMenuItems = useMemo(() => {
    return getProfileMenuItems(currentRole);
  }, [currentRole]);

  const analyticsMenuItems = useMemo(() => {
    return getAnalyticsMenuItems();
  }, []);

  const loyaltyMenuItems = useMemo(() => {
    return getLoyaltyMenuItems(currentRole);
  }, [currentRole]);

  if (!user) return null;

  // Dynamic dashboard link based on current role
  const dashboardHref = currentRole === 'provider' ? '/provider-dashboard' : '/customer-dashboard';
  // Dynamic settings link based on current role
  const settingsHref = currentRole === 'provider' ? '/provider-settings' : '/customer-settings';

  return (
    <DropdownMenu key={`dropdown-${currentRole}-${Date.now()}`}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gray-800">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.profile_image || undefined} alt={user.user_metadata?.full_name || user.email} />
            <AvatarFallback className="bg-gray-700 text-white">
              {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-between gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.user_metadata?.full_name && (
              <p className="font-medium">{user.user_metadata.full_name}</p>
            )}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <NotificationIndicator />
          </div>
        </div>
        <DropdownMenuSeparator />
        
        {/* Map */}
        <DropdownMenuItem
          onClick={() => navigate("/interactive-map")}
          className="cursor-pointer"
        >
          <span className="mr-2">🗺️</span>
          <span className="flex-1">Map</span>
        </DropdownMenuItem>

        {/* Dashboard */}
        <DropdownMenuItem
          onClick={() => navigate(dashboardHref)}
          className="cursor-pointer"
        >
          <span className="mr-2">📊</span>
          <span className="flex-1">Dashboard</span>
        </DropdownMenuItem>

        {/* Profile Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <span className="mr-2">👤</span>
            <span>Profile</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {profileMenuItems.map((subItem, subIndex) => {
              // Handle separators
              if (subItem.separator) {
                return <DropdownMenuSeparator key={`separator-${subIndex}`} />;
              }
              
              // Skip settings as it's now moved to main menu
              if (subItem.label === 'Settings') {
                return null;
              }
              
              // Handle role toggle items with active state
              if (subItem.action && (subItem.action === 'toggle-customer' || subItem.action === 'toggle-provider')) {    
                return (
                  <DropdownMenuItem
                    key={`${subIndex}-${subItem.label}`}
                    onClick={() => handleDropdownAction(subItem)}
                    className={`cursor-pointer ${subItem.active ? 'bg-blue-50 text-blue-700' : ''}`}
                  >
                    <span className="mr-2">{subItem.icon}</span>
                    <span className="flex-1">{subItem.label}</span>
                    {subItem.active && <Check className="h-4 w-4 ml-2" />}
                  </DropdownMenuItem>
                );
              }
              
              // Handle regular menu items
              return (
                <DropdownMenuItem
                  key={`${subIndex}-${subItem.label}`}
                  onClick={() => handleDropdownAction(subItem)}
                  className="cursor-pointer"
                >
                  <span className="mr-2">{subItem.icon}</span>
                  <span>{subItem.label}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Analytics Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <span className="mr-2">📊</span>
            <span>Analytics</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {analyticsMenuItems.map((subItem, subIndex) => (
              <DropdownMenuItem
                key={`${subIndex}-${subItem.label}`}
                onClick={() => handleDropdownAction(subItem)}
                className="cursor-pointer"
              >
                <span className="mr-2">{subItem.icon}</span>
                <span>{subItem.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Loyalty & Rewards Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <span className="mr-2">🎯</span>
            <span>Loyalty & Rewards</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {loyaltyMenuItems.map((subItem, subIndex) => (
              <DropdownMenuItem
                key={`${subIndex}-${subItem.label}`}
                onClick={() => handleDropdownAction(subItem)}
                className="cursor-pointer"
              >
                <span className="mr-2">{subItem.icon}</span>
                <span>{subItem.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Settings */}
        <DropdownMenuItem
          onClick={() => navigate(settingsHref)}
          className="cursor-pointer"
        >
          <span className="mr-2">⚙️</span>
          <span className="flex-1">Settings</span>
        </DropdownMenuItem>

        {/* Sign Out */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <span className="mr-2">🚪</span>
          <span className="flex-1">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
