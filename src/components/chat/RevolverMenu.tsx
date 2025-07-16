import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useRevolverVisibility } from '@/hooks/useRevolverVisibility';

interface RevolverMenuProps {
  className?: string;
}

export const RevolverMenu: React.FC<RevolverMenuProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { emitRevolverStateChange } = useRevolverVisibility();

  const menuItems = [
    { 
      icon: 'map', 
      label: 'Interactive Map', 
      action: () => navigate('/interactive-map'),
      color: 'text-green-400 hover:text-green-300',
      bg: 'bg-green-500/20 hover:bg-green-500/30'
    },
    { 
      icon: 'calendar_today', 
      label: 'Schedule', 
      action: () => navigate('/dashboard'),
      color: 'text-blue-400 hover:text-blue-300',
      bg: 'bg-blue-500/20 hover:bg-blue-500/30'
    },
    { 
      icon: 'analytics', 
      label: 'Analytics', 
      action: () => navigate('/analytics-dashboard'),
      color: 'text-purple-400 hover:text-purple-300',
      bg: 'bg-purple-500/20 hover:bg-purple-500/30'
    },
    { 
      icon: 'groups', 
      label: 'Community', 
      action: () => navigate('/community-dashboard'),
      color: 'text-orange-400 hover:text-orange-300',
      bg: 'bg-orange-500/20 hover:bg-orange-500/30'
    },
    { 
      icon: 'psychology_alt', 
      label: 'Annette AI', 
      action: () => {/* Opens BubbleChat - could emit event */},
      color: 'text-cyan-400 hover:text-cyan-300',
      bg: 'bg-cyan-500/20 hover:bg-cyan-500/30'
    },
    { 
      icon: 'settings', 
      label: 'Settings', 
      action: () => navigate('/settings'),
      color: 'text-gray-400 hover:text-gray-300',
      bg: 'bg-gray-500/20 hover:bg-gray-500/30'
    }
  ];

  const handleItemClick = (item: typeof menuItems[0]) => {
    item.action();
    setIsOpen(false);
    emitRevolverStateChange(false);
  };

  const toggleRevolver = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    emitRevolverStateChange(newState);
  };

  return (
    <div className={cn("revollver-trigger fixed bottom-20 right-20 z-[999]", className)}>
      {/* Radial Menu Items - Tactical Clip Layout */}
      {isOpen && (
        <div className="absolute bottom-0 right-0">
          {menuItems.map((item, index) => {
            // Revolver cylinder positioning - clips expand upward and inward
            const angle = (index * 45) - 135; // 6 items, 45 degrees apart, starting upper-left
            const radius = Math.min(90, window.innerWidth < 768 ? 70 : 90); // Responsive radius
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;
            
            return (
              <Button
                key={item.label}
                variant="ghost"
                size="sm"
                onClick={() => handleItemClick(item)}
                className={cn(
                  "absolute w-14 h-14 rounded-full border-2 border-slate-400/60",
                  "backdrop-blur-sm transition-all duration-300 shadow-lg",
                  "hover:scale-110 hover:shadow-xl hover:border-primary/60",
                  "animate-revolver-clip",
                  item.color,
                  item.bg
                )}
                style={{
                  right: `${-x}px`,
                  bottom: `${-y}px`,
                  animationDelay: `${index * 80}ms`,
                  transformOrigin: 'bottom right'
                }}
                title={item.label}
              >
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </Button>
            );
          })}
        </div>
      )}

      {/* Central Trigger Button - Tactical Revolver */}
      <Button
        onClick={toggleRevolver}
        className={cn(
          "relative w-16 h-16 rounded-full shadow-xl transition-all duration-300",
          "border-2 border-slate-400 text-white bg-gradient-to-br from-slate-700 to-slate-900",
          "hover:scale-105 hover:shadow-2xl hover:border-primary/60",
          "ring-2 ring-slate-500/20",
          isOpen && "rotate-45 bg-gradient-to-br from-red-600 to-red-800 border-red-400 ring-red-500/30"
        )}
        variant="ghost"
      >
        {isOpen ? (
          <span className="material-symbols-outlined text-3xl text-white">close</span>
        ) : (
          <span className="material-symbols-outlined text-3xl text-white">apps</span>
        )}
      </Button>
    </div>
  );
};