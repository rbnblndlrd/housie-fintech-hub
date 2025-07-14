import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Receipt, 
  Zap,
  DollarSign
} from 'lucide-react';

interface AnalyticsNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AnalyticsNavigation: React.FC<AnalyticsNavigationProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const navItems = [
    { 
      id: 'financial', 
      label: 'Financial Analytics', 
      icon: DollarSign, 
      emoji: '💰'
    },
    { 
      id: 'business', 
      label: 'Business Insights', 
      icon: BarChart3, 
      emoji: '📊'
    },
    { 
      id: 'performance', 
      label: 'Performance Metrics', 
      icon: Zap, 
      emoji: '⚡'
    },
    { 
      id: 'tax', 
      label: 'Tax Reports', 
      icon: Receipt, 
      emoji: '📄'
    }
  ];

  return (
    <div className="flex flex-col space-y-4">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? "default" : "outline"}
            onClick={() => onTabChange(item.id)}
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