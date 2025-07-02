
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
import { useSubscriptionData } from '@/hooks/useSubscriptionData';
import QuickSettingsPanel from './QuickSettingsPanel';
import { getAnalyticsMenuItems, NavigationItem } from '@/utils/navigationConfig';
import { 
  ChevronDown, 
  User, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Minus,
  Crown,
  Star,
  Zap,
  Shield,
  UserCheck
} from 'lucide-react';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { currentRole } = useRoleSwitch();
  const navigate = useNavigate();
  const { subscriptionData, openSubscriptionPortal } = useSubscriptionData();
  const [currentStatus, setCurrentStatus] = useState('Available');

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
    if (item.action === 'logout') {
      handleLogout();
    } else if (item.href) {
      navigate(item.href);
    }
  };

  const handleStatusChange = (status: string) => {
    setCurrentStatus(status);
    // Here you would typically save the status to your backend
    console.log('Status changed to:', status);
  };

  const analyticsMenuItems = useMemo(() => {
    return getAnalyticsMenuItems();
  }, []);

  const getSubscriptionIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'premium':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'pro':
        return <Star className="h-4 w-4 text-purple-600" />;
      case 'starter':
        return <Zap className="h-4 w-4 text-blue-600" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Available':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'Busy':
        return <Minus className="h-3 w-3 text-red-500" />;
      case 'Away':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'Do Not Disturb':
        return <AlertTriangle className="h-3 w-3 text-gray-500" />;
      default:
        return <CheckCircle className="h-3 w-3 text-green-500" />;
    }
  };

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
              {getStatusIcon(currentStatus)}
              <UserCheck className="h-3 w-3 text-blue-400" />
              <span className="text-xs text-gray-300">{currentStatus} • Verified</span>
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

        {/* Subscription Section */}
        <DropdownMenuLabel>Subscription & Status</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={openSubscriptionPortal}
          className="cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            {getSubscriptionIcon(subscriptionData.subscription_tier)}
            <span className="capitalize">{subscriptionData.subscription_tier} Plan</span>
          </div>
          <span className="text-xs text-blue-600">Manage →</span>
        </DropdownMenuItem>

        {/* Status Management */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <div className="flex items-center gap-2">
              {getStatusIcon(currentStatus)}
              <UserCheck className="h-4 w-4 text-blue-600" />
              <span>{currentStatus} • Verified</span>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onClick={() => handleStatusChange('Available')}
              className="cursor-pointer"
            >
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>Available</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange('Busy')}
              className="cursor-pointer"
            >
              <Minus className="h-4 w-4 text-red-500 mr-2" />
              <span>Busy</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange('Away')}
              className="cursor-pointer"
            >
              <Clock className="h-4 w-4 text-yellow-500 mr-2" />
              <span>Away</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange('Do Not Disturb')}
              className="cursor-pointer"
            >
              <AlertTriangle className="h-4 w-4 text-gray-500 mr-2" />
              <span>Do Not Disturb</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        
        {/* Main Navigation Items */}
        <DropdownMenuItem
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer"
        >
          <span className="mr-3">📊</span>
          <span className="flex-1">Dashboard</span>
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

        <DropdownMenuSeparator />

        {/* Quick Settings */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <span className="mr-3">⚙️</span>
            <span>Quick Settings</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-80">
            <QuickSettingsPanel />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Full Profile */}
        <DropdownMenuItem
          onClick={() => navigate("/profile")}
          className="cursor-pointer"
        >
          <span className="mr-3">👤</span>
          <span className="flex-1">Full Profile</span>
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
