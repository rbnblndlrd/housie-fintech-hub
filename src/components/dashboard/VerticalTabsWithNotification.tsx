import React from 'react';
import { Briefcase, Map, Users, UserCog } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  return (
    <div className={`relative ${className}`}>
      {/* Remove padding and add modern styling */}
      <div className="h-full w-full flex items-center justify-start">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="bg-transparent border-none shadow-none p-0 flex-col h-auto gap-3">
            {/* Job Hub tab - now clean without notification bell */}
            <TabsTrigger 
              value="job-hub" 
              className="w-full justify-start bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:border-orange-600 transition-all duration-200 rounded-lg h-12"
            >
              <Briefcase className="h-4 w-4 mr-3 drop-shadow-sm" />
              <span className="drop-shadow-sm">Job Hub</span>
            </TabsTrigger>
              
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
  );
};

export default VerticalTabsWithNotification;