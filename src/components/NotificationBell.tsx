
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

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <CreamPill 
              variant="notification" 
              size="default"
              className="absolute -top-1 -right-1"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </CreamPill>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
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
