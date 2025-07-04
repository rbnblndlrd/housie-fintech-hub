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
}

const SimpleNavigation: React.FC<SimpleNavigationProps> = ({ 
  activeTab, 
  onTabChange
}) => {
  const navItems = [
    { 
      id: 'job-hub', 
      label: 'Job Hub', 
      icon: ClipboardList, 
      emoji: '📋'
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
      id: 'messages', 
      label: 'Assistant', 
      icon: User, 
      emoji: '💬' 
    }
  ];

  const handleItemClick = (item: any) => {
    onTabChange(item.id);
  };

  return (
    <div className="flex flex-col space-y-4">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? "default" : "outline"}
            onClick={() => handleItemClick(item)}
            className={`
              w-full justify-start h-14 px-5 text-left transition-all duration-300 ease-in-out
              ${isActive 
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg border-primary' 
                : 'bg-background hover:bg-muted border-border text-foreground hover:text-primary hover:border-primary/50'
              }
              rounded-lg font-medium
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.emoji}</span>
              <span className="font-semibold text-sm tracking-wide">{item.label}</span>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default SimpleNavigation;