
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { getUserDropdownItems, getAnalyticsMenuItems, NavigationItem } from '@/utils/navigationConfig';
import { getLoyaltyMenuItems } from '@/components/gamification/LoyaltyMenuItems';
import NotificationIndicator from '@/components/NotificationIndicator';
import UserMenuSubmenu from './UserMenuSubmenu';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { currentRole } = useRoleSwitch();
  const navigate = useNavigate();
  const [providerStatus, setProviderStatus] = useState('Available');

  const handleLogout = async () => {
    try {
      await logout();
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setProviderStatus(newStatus);
    console.log('Provider status changed to:', newStatus);
  };

  const handleDropdownAction = (item: NavigationItem) => {
    if (item.action === 'logout') {
      handleLogout();
    } else if (item.href) {
      navigate(item.href);
    }
  };

  const analyticsMenuItems = useMemo(() => {
    return getAnalyticsMenuItems();
  }, []);

  const loyaltyMenuItems = useMemo(() => {
    return getLoyaltyMenuItems(currentRole);
  }, [currentRole]);

  if (!user) return null;

  return (
    <DropdownMenu key={`dropdown-${currentRole}-${Date.now()}`}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-auto p-2 rounded-lg hover:bg-gray-800">
          <NotificationIndicator />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        {/* User Info with Submenu */}
        <div className="p-2">
          <UserMenuSubmenu
            providerStatus={providerStatus}
            onStatusChange={handleStatusChange}
          />
        </div>

        <DropdownMenuSeparator />
        
        {/* Main Navigation Items */}
        <DropdownMenuItem
          onClick={() => navigate("/emergency")}
          className="cursor-pointer"
        >
          <span className="mr-3">🗺️</span>
          <span className="flex-1">Interactive Map</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer"
        >
          <span className="mr-3">📊</span>
          <span className="flex-1">Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate("/notifications")}
          className="cursor-pointer"
        >
          <span className="mr-3">🤖</span>
          <span className="flex-1">AI Assistant</span>
        </DropdownMenuItem>

        {/* Analytics Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <span className="mr-3">📊</span>
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
            <span className="mr-3">🎯</span>
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
          onClick={() => navigate("/profile")}
          className="cursor-pointer"
        >
          <span className="mr-3">⚙️</span>
          <span className="flex-1">Settings</span>
        </DropdownMenuItem>

        {/* Sign Out */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <span className="mr-3">🚪</span>
          <span className="flex-1">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
