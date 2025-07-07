import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Receipt, 
  Zap,
  DollarSign
} from 'lucide-react';

const AnalyticsNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      id: 'business-insights', 
      label: 'Business Insights', 
      icon: BarChart3, 
      emoji: '📊',
      path: '/business-insights'
    },
    { 
      id: 'tax-reports', 
      label: 'Tax Reports', 
      icon: Receipt, 
      emoji: '📄',
      path: '/tax-reports' 
    },
    { 
      id: 'performance', 
      label: 'Performance', 
      icon: Zap, 
      emoji: '⚡',
      path: '/performance' 
    },
    { 
      id: 'financial-analytics', 
      label: 'Financial Analytics', 
      icon: DollarSign, 
      emoji: '💰',
      path: '/financial-analytics' 
    }
  ];

  const handleItemClick = (item: any) => {
    navigate(item.path);
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/business-insights') return 'business-insights';
    if (path === '/tax-reports') return 'tax-reports';
    if (path === '/performance') return 'performance';
    if (path === '/financial-analytics') return 'financial-analytics';
    return 'business-insights'; // default
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

export default AnalyticsNavigation;