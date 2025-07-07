import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Users, 
  Trophy, 
  MessageCircle
} from 'lucide-react';

interface CommunityNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CommunityNavigation = ({ activeTab, onTabChange }: CommunityNavigationProps) => {
  const navItems = [
    { 
      id: 'discover', 
      label: 'Discover', 
      icon: Globe, 
      emoji: '🌍'
    },
    { 
      id: 'network', 
      label: 'Network', 
      icon: Users, 
      emoji: '👥'
    },
    { 
      id: 'recognition', 
      label: 'Recognition', 
      icon: Trophy, 
      emoji: '🏆'
    },
    { 
      id: 'social', 
      label: 'Social', 
      icon: MessageCircle, 
      emoji: '💬'
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

export default CommunityNavigation;