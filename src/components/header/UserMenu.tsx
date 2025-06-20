
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { getUserDropdownItems, NavigationItem } from '@/utils/navigationConfig';
import { useNotifications } from '@/hooks/useNotifications';
import { CreamPill } from '@/components/ui/cream-pill';
import NotificationDropdown from '@/components/NotificationDropdown';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { currentRole } = useRole();
  const navigate = useNavigate();
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const { notifications, loading, unreadCount, markAsRead } = useNotifications();

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
    } else if (item.action === 'notifications') {
      setNotificationDropdownOpen(true);
    } else if (item.href) {
      navigate(item.href);
    }
  };

  // Memoize dropdown items with currentRole as dependency to force re-calculation
  const userDropdownItems = useMemo(() => {
    console.log('🔧 Recalculating dropdown items for role:', currentRole);
    const items = getUserDropdownItems(user, currentRole);
    console.log('🔧 Dashboard item href:', items.find(item => item.label === 'Dashboard')?.href);
    return items;
  }, [user, currentRole]);

  const enhancedDropdownItems: NavigationItem[] = user ? [
    { 
      label: "Notifications", 
      href: "", 
      icon: <Bell className="h-4 w-4" />, 
      action: "notifications",
      badge: unreadCount > 0 ? unreadCount : undefined,
      separator: false
    },
    { separator: true, label: "", href: "", icon: "" },
    ...userDropdownItems
  ] : userDropdownItems;

  if (!user) return null;

  return (
    <>
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
          
          {enhancedDropdownItems.map((item, index) => {
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
                {item.badge && (
                  <CreamPill variant="notification" size="default" className="ml-2">
                    {item.badge > 99 ? '99+' : item.badge}
                  </CreamPill>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notification Dropdown Modal */}
      {notificationDropdownOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setNotificationDropdownOpen(false)}>
          <div className="fixed top-16 right-4 w-96 bg-white rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
            <NotificationDropdown
              notifications={notifications}
              loading={loading}
              onMarkAsRead={markAsRead}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UserMenu;
