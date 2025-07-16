import React, { useState, useEffect, useRef } from 'react';
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleDoubleClick = () => {
    toggleRevolver();
  };

  const handleTouchStart = () => {
    longPressTimeoutRef.current = setTimeout(() => {
      toggleRevolver();
    }, 500); // 500ms long press
  };

  const handleTouchEnd = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        emitRevolverStateChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, emitRevolverStateChange]);

  return (
    <div className={cn(
      "revollver-trigger fixed z-[999] transition-all duration-300 ease-out",
      // Position in bottom-right corner as indicated in red square
      "bottom-8 right-8",
      className
    )}>
      {/* Radial Menu Items - Tactical Clip Layout */}
      {isOpen && (
        <div className="absolute bottom-0 right-0">
          {menuItems.map((item, index) => {
            // Fixed angle calculation - 6 items in 150° spread to ensure all are visible
            const angle = (index * 30) - 75; // 6 items, 30 degrees apart, from -75° to +75°
            const radius = 60; // Reduced radius to fit in corner
            
            let x = Math.cos(angle * Math.PI / 180) * radius;
            let y = Math.sin(angle * Math.PI / 180) * radius;
            
            return (
              <Button
                key={item.label}
                variant="ghost"
                size="sm"
                onClick={() => handleItemClick(item)}
                className={cn(
                  "absolute w-14 h-14 rounded-full border-2 border-slate-400/60",
                  "backdrop-blur-sm transition-all duration-300 shadow-lg drop-shadow-lg",
                  "hover:scale-110 hover:shadow-xl hover:drop-shadow-xl hover:border-primary/60",
                  "animate-scale-in",
                  item.color,
                  item.bg
                )}
                style={{
                  right: `${-x}px`,
                  bottom: `${-y}px`,
                  animationDelay: `${index * 100}ms`,
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
        ref={triggerRef}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onContextMenu={(e) => e.preventDefault()} // Disable right-click menu
        className={cn(
          "relative w-16 h-16 rounded-full shadow-xl drop-shadow-xl transition-all duration-300 ease-out",
          "border-2 border-slate-400 text-white bg-gradient-to-br from-slate-700 to-slate-900",
          "hover:scale-105 hover:shadow-2xl hover:drop-shadow-2xl hover:border-primary/60",
          "ring-2 ring-slate-500/20",
          "active:scale-95 active:duration-75", // Quick feedback on press
          // Pulse animation when closed
          !isOpen && "animate-pulse hover:animate-none",
          isOpen && "rotate-45 bg-gradient-to-br from-red-600 to-red-800 border-red-400 ring-red-500/30 shadow-red-500/20"
        )}
        variant="ghost"
      >
        {isOpen ? (
          <span className="material-symbols-outlined text-3xl text-white animate-fade-in">close</span>
        ) : (
          <span className="material-symbols-outlined text-3xl text-white animate-fade-in">apps</span>
        )}
      </Button>
    </div>
  );
};