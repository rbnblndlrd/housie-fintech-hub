
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
import { ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { getUserDropdownItems, getProfileMenuItems, getAnalyticsMenuItems, NavigationItem } from '@/utils/navigationConfig';
import { getLoyaltyMenuItems } from '@/components/gamification/LoyaltyMenuItems';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { currentRole } = useRole();
  const navigate = useNavigate();

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
    console.log('🔧 Dropdown action clicked:', item.label, 'href:', item.href);
    
    if (item.action === 'logout') {
      handleLogout();
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
        <div className="flex items-center justify-start gap-2 p-2">
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
        </div>
        <DropdownMenuSeparator />
        
        {userDropdownItems.map((item, index) => {
          if (item.separator) {
            return <DropdownMenuSeparator key={index} />;
          }
          
          return (
            <DropdownMenuItem
              key={`${index}-${item.label}-${item.href}`}
              onClick={() => handleDropdownAction(item)}
              className="cursor-pointer"
            >
              <span className="mr-2">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
            </DropdownMenuItem>
          );
        })}

        {/* Profile Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <span className="mr-2">👤</span>
            <span>Profile</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {profileMenuItems.map((subItem, subIndex) => (
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
