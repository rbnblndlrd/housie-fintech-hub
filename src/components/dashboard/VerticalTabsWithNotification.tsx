import React, { useState } from 'react';
import { Briefcase, Map, Users, UserCog, Bell } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardNotificationDropdown from './DashboardNotificationDropdown';

interface VerticalTabsWithNotificationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
}

const VerticalTabsWithNotification: React.FC<VerticalTabsWithNotificationProps> = ({
  activeTab,
  onTabChange,
  className = ""
}) => {
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
      
      <div className={`relative ${className}`}>
        <div className="h-full w-full flex items-center justify-start">
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="bg-transparent border-none shadow-none p-0 flex-col h-auto gap-3">
              {/* Job Hub tab with notification bell */}
              <TabsTrigger 
                value="job-hub" 
                className="relative w-full justify-start bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:border-orange-600 transition-all duration-200 rounded-lg h-12"
              >
                <Briefcase className="h-4 w-4 mr-3 drop-shadow-sm" />
                <span className="drop-shadow-sm">Job Hub</span>
                <button
                  onClick={handleBellClick}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 flex items-center justify-center hover:bg-white/20 rounded-full z-10 transition-colors duration-200"
                >
                  <Bell className="h-4 w-4 text-orange-400 drop-shadow-sm hover:text-orange-300" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              </TabsTrigger>
              
              {/* Notification Popup - positioned relative to the entire tab container */}
              {isNotificationOpen && (
                <div className="absolute bottom-full left-full ml-4 mb-2 z-40 w-80">
                  <DashboardNotificationDropdown />
                </div>
              )}
              
              <TabsTrigger 
                value="map" 
                className="w-full justify-start bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:border-orange-600 transition-all duration-200 rounded-lg h-12"
              >
                <Map className="h-4 w-4 mr-3 drop-shadow-sm" />
                <span className="drop-shadow-sm">Map</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="crew" 
                className="w-full justify-start bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:border-orange-600 transition-all duration-200 rounded-lg h-12"
              >
                <Users className="h-4 w-4 mr-3 drop-shadow-sm" />
                <span className="drop-shadow-sm">Crew</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="profile" 
                className="w-full justify-start bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:border-orange-600 transition-all duration-200 rounded-lg h-12"
              >
                <UserCog className="h-4 w-4 mr-3 drop-shadow-sm" />
                <span className="drop-shadow-sm">Profile</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default VerticalTabsWithNotification;