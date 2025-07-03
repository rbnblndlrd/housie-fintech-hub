import React, { useState } from 'react';
import { Briefcase, Map, Users, UserCog, Bell } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreamPill } from '@/components/ui/cream-pill';
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

  const handleJobHubClick = () => {
    onTabChange('job-hub');
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
        <div className="h-full w-full flex items-center justify-start p-4">
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="bg-transparent p-0 flex-col h-auto gap-4 border-none shadow-none">
              {/* Job Hub with integrated notification bell */}
              <div className="relative w-full">
                <TabsTrigger 
                  value="job-hub" 
                  onClick={handleJobHubClick}
                  className="w-full justify-start relative pr-12"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Job Hub
                </TabsTrigger>
                
                {/* Notification Bell positioned over Job Hub tab */}
                <button
                  onClick={handleBellClick}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 flex items-center justify-center hover:bg-white/10 rounded-sm z-10"
                >
                  <Bell className="h-4 w-4 text-orange-600" />
                  {unreadCount > 0 && (
                    <CreamPill 
                      variant="notification" 
                      size="default"
                      className="absolute -top-1 -right-1 min-w-[16px] h-[16px] text-xs flex items-center justify-center bg-red-500 text-white border-red-600"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </CreamPill>
                  )}
                </button>
              </div>
              
              <TabsTrigger value="map" className="w-full justify-start">
                <Map className="h-4 w-4 mr-2" />
                Map
              </TabsTrigger>
              
              <TabsTrigger value="crew" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Crew
              </TabsTrigger>
              
              <TabsTrigger value="profile" className="w-full justify-start">
                <UserCog className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Notification Dropdown */}
        {isNotificationOpen && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-96">
            <DashboardNotificationDropdown />
          </div>
        )}
      </div>
    </>
  );
};

export default VerticalTabsWithNotification;