
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreamPill } from '@/components/ui/cream-pill';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationDropdown from './NotificationDropdown';

const NotificationBell = () => {
  const { user } = useAuth();
  const { notifications, loading, unreadCount, markAsRead } = useNotifications();

  console.log('🔔 NotificationBell render:', { 
    user: !!user, 
    loading, 
    unreadCount, 
    notificationsLength: notifications?.length 
  });

  if (!user) {
    console.log('🔔 No user, not rendering bell');
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-8 w-8 hover:bg-gray-700 focus:bg-gray-700"
        >
          <Bell className="h-4 w-4 text-white" />
          {unreadCount > 0 && (
            <CreamPill 
              variant="notification" 
              size="default"
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs flex items-center justify-center bg-red-500 text-white border-red-600"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </CreamPill>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0 bg-white border shadow-lg z-50">
        <NotificationDropdown
          notifications={notifications}
          loading={loading}
          onMarkAsRead={markAsRead}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
