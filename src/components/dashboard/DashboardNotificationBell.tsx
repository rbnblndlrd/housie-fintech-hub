import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreamPill } from '@/components/ui/cream-pill';
import DashboardNotificationDropdown from './DashboardNotificationDropdown';

const DashboardNotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock unread count - in real app this would come from a hook
  const unreadCount = 2;

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative h-8 w-8 hover:bg-white/20 focus:bg-white/20 text-white"
        onClick={() => setIsOpen(!isOpen)}
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
      
      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 w-96">
            <DashboardNotificationDropdown />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardNotificationBell;