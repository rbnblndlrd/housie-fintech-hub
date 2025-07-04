import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  Map, 
  Users, 
  User,
  Calendar
} from 'lucide-react';

interface SimpleNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onJobHubClick: () => void;
}

const SimpleNavigation: React.FC<SimpleNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  onJobHubClick 
}) => {
  const navItems = [
    { 
      id: 'job-hub', 
      label: 'Job Hub', 
      icon: ClipboardList, 
      emoji: '📋',
      isSpecial: true // This triggers the sidebar instead of tab change
    },
    { 
      id: 'bookings', 
      label: 'Bookings', 
      icon: Calendar, 
      emoji: '📅' 
    },
    { 
      id: 'map', 
      label: 'Map', 
      icon: Map, 
      emoji: '🗺️' 
    },
    { 
      id: 'crew', 
      label: 'Crew', 
      icon: Users, 
      emoji: '👥' 
    }
  ];

  const handleItemClick = (item: any) => {
    if (item.isSpecial) {
      onJobHubClick();
    } else {
      onTabChange(item.id);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? "default" : "outline"}
            onClick={() => handleItemClick(item)}
            className={`
              w-full justify-start h-12 px-4 text-left transition-all duration-200
              ${isActive 
                ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg' 
                : 'bg-white hover:bg-orange-50 border-orange-200 text-gray-700 hover:text-orange-700'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.emoji}</span>
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{item.label}</span>
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default SimpleNavigation;