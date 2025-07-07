import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Users, 
  BarChart3, 
  Calendar
} from 'lucide-react';

const DashboardNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Job Hub', 
      icon: Briefcase, 
      emoji: '📋',
      path: '/dashboard'
    },
    { 
      id: 'bookings', 
      label: 'Bookings', 
      icon: Calendar, 
      emoji: '📅',
      path: '/bookings' 
    },
    { 
      id: 'community', 
      label: 'Community', 
      icon: Users, 
      emoji: '👥',
      path: '/community-dashboard' 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      emoji: '📊',
      path: '/analytics-dashboard' 
    }
  ];

  const handleItemClick = (item: any) => {
    navigate(item.path);
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/community-dashboard') return 'community';
    if (path === '/analytics-dashboard') return 'analytics';
    if (path === '/bookings') return 'bookings';
    return 'dashboard'; // default for /dashboard and any other paths
  };

  const activeTab = getActiveTab();

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

export default DashboardNavigation;