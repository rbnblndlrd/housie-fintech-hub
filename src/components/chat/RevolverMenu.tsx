import React, { useState } from 'react';
import { Settings, Map, Calendar, BarChart3, Users, Bot, Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface RevolverMenuProps {
  className?: string;
}

export const RevolverMenu: React.FC<RevolverMenuProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { 
      icon: Map, 
      label: 'Interactive Map', 
      action: () => navigate('/interactive-map'),
      color: 'text-green-400 hover:text-green-300',
      bg: 'bg-green-500/20 hover:bg-green-500/30'
    },
    { 
      icon: Calendar, 
      label: 'Schedule', 
      action: () => navigate('/dashboard'),
      color: 'text-blue-400 hover:text-blue-300',
      bg: 'bg-blue-500/20 hover:bg-blue-500/30'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      action: () => navigate('/analytics-dashboard'),
      color: 'text-purple-400 hover:text-purple-300',
      bg: 'bg-purple-500/20 hover:bg-purple-500/30'
    },
    { 
      icon: Users, 
      label: 'Community', 
      action: () => navigate('/community-dashboard'),
      color: 'text-orange-400 hover:text-orange-300',
      bg: 'bg-orange-500/20 hover:bg-orange-500/30'
    },
    { 
      icon: Bot, 
      label: 'Annette AI', 
      action: () => {/* Opens BubbleChat - could emit event */},
      color: 'text-cyan-400 hover:text-cyan-300',
      bg: 'bg-cyan-500/20 hover:bg-cyan-500/30'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      action: () => navigate('/settings'),
      color: 'text-gray-400 hover:text-gray-300',
      bg: 'bg-gray-500/20 hover:bg-gray-500/30'
    }
  ];

  const handleItemClick = (item: typeof menuItems[0]) => {
    item.action();
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Radial Menu Items */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/10 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Items in Radial Layout */}
          <div className="relative">
            {menuItems.map((item, index) => {
              const angle = (index * 60) - 90; // 6 items, 60 degrees apart, starting at top
              const radius = 80;
              const x = Math.cos(angle * Math.PI / 180) * radius;
              const y = Math.sin(angle * Math.PI / 180) * radius;
              
              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "absolute w-12 h-12 rounded-full border-2 border-slate-500",
                    "backdrop-blur-md transition-all duration-300 animate-scale-in",
                    item.color,
                    item.bg
                  )}
                  style={{
                    left: `calc(50% + ${x}px - 24px)`,
                    top: `calc(50% + ${y}px - 24px)`,
                    animationDelay: `${index * 50}ms`
                  }}
                  title={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </Button>
              );
            })}
          </div>
        </>
      )}

      {/* Central Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative w-14 h-14 rounded-full shadow-lg transition-all duration-300",
          "border-2 border-slate-500 text-white bg-gradient-to-br from-slate-600 to-slate-800",
          "hover:scale-105 hover:shadow-xl",
          isOpen && "rotate-45 bg-gradient-to-br from-red-500 to-red-700 border-red-400"
        )}
        variant="ghost"
      >
        {isOpen ? (
          <Plus className="h-6 w-6 text-white" />
        ) : (
          <Zap className="h-6 w-6 text-white" />
        )}
      </Button>
    </div>
  );
};