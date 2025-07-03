import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { CreamPill } from '@/components/ui/cream-pill';
import DashboardNotificationDropdown from './DashboardNotificationDropdown';

const FloatingNotificationBell: React.FC = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const unreadCount = 2; // Mock unread count

  const handleBellClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleBackgroundClick = () => {
    if (isNotificationOpen) {
      setIsNotificationOpen(false);
    }
  };

  return (
    <>
      {/* Background overlay to close notification */}
      {isNotificationOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={handleBackgroundClick}
        />
      )}
      
      <div className="relative h-full w-full flex items-center justify-center">
        {/* Notification Bell */}
        <button
          onClick={handleBellClick}
          className="h-8 w-8 flex items-center justify-center hover:bg-white/20 rounded-full z-10 transition-colors duration-200 bg-white/10 backdrop-blur-sm border border-white/20"
        >
          <Bell className="h-5 w-5 text-orange-400 drop-shadow-sm hover:text-orange-300" />
          {unreadCount > 0 && (
            <CreamPill 
              variant="notification" 
              size="default"
              className="absolute -top-1 -right-1 min-w-[16px] h-[16px] text-xs flex items-center justify-center bg-red-500 text-white border-red-600 shadow-lg"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </CreamPill>
          )}
        </button>
        
        {/* Notification Roll-up Menu */}
        {isNotificationOpen && (
          <div className="absolute bottom-full mb-4 z-40 w-80" style={{ left: '130px' }}>
            <DashboardNotificationDropdown />
          </div>
        )}
      </div>
    </>
  );
};

export default FloatingNotificationBell;