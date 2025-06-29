
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { getUserDropdownItems, getAnalyticsMenuItems, NavigationItem } from '@/utils/navigationConfig';
import { getLoyaltyMenuItems } from '@/components/gamification/LoyaltyMenuItems';
import { ChevronDown, User } from 'lucide-react';

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

  const statusOptions = [
    { value: 'Available', label: 'Available', color: 'bg-green-500' },
    { value: 'Busy', label: 'Busy', color: 'bg-red-500' },
    { value: 'Away', label: 'Away', color: 'bg-yellow-500' },
    { value: 'Do Not Disturb', label: 'Do Not Disturb', color: 'bg-gray-500' }
  ];

  const currentStatus = statusOptions.find(s => s.value === providerStatus);

  if (!user) return null;

  const userInitials = user.user_metadata?.full_name 
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U';

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-auto p-2 rounded-lg hover:bg-gray-800 flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-white">{userName}</span>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${currentStatus?.color}`}></div>
              <span className="text-xs text-gray-300">{providerStatus}</span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-white border shadow-lg z-50" align="end" forceMount>
        {/* User Info Section */}
        <div className="p-3 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-blue-600 text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{userName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <Badge className="mt-1 bg-blue-100 text-blue-800 border-blue-200">
                {currentRole === 'provider' ? 'Service Provider' : 'Customer'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Status Selection (for providers) */}
        {currentRole === 'provider' && (
          <>
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            {statusOptions.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                className="cursor-pointer"
              >
                <div className={`w-3 h-3 rounded-full ${status.color} mr-3`}></div>
                <span className="flex-1">{status.label}</span>
                {providerStatus === status.value && <span className="text-blue-600">✓</span>}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}
        
        {/* Main Navigation Items */}
        <DropdownMenuItem
          onClick={() => navigate("/interactive-map")}
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
