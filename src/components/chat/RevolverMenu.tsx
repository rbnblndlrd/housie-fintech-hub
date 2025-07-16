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
      // Responsive positioning with safe margins
      "bottom-6 right-6 sm:bottom-8 sm:right-8 md:bottom-10 md:right-10",
      // Safe area support for iOS
      "pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)]",
      className
    )}>
      {/* Radial Menu Items - Tactical Clip Layout */}
      {isOpen && (
        <div className="absolute bottom-0 right-0">
          {menuItems.map((item, index) => {
            // Revolver cylinder positioning - clips expand upward and inward
            const angle = (index * 45) - 135; // 6 items, 45 degrees apart, starting upper-left
            const baseRadius = 90;
            const mobileRadius = 70;
            const radius = window.innerWidth < 768 ? mobileRadius : baseRadius;
            
            let x = Math.cos(angle * Math.PI / 180) * radius;
            let y = Math.sin(angle * Math.PI / 180) * radius;
            
            // Dynamic bounds checking with safe margins
            const safeMargin = 24;
            const buttonSize = 56; // 14 * 4 = 56px (w-14 h-14)
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Current button position relative to viewport
            const currentX = viewportWidth - (safeMargin * 2) - Math.abs(x);
            const currentY = viewportHeight - (safeMargin * 2) - Math.abs(y);
            
            // Adjust if too close to edges
            if (currentX < buttonSize) {
              x = -(viewportWidth - buttonSize - safeMargin * 3);
            }
            if (currentY < buttonSize) {
              y = -(viewportHeight - buttonSize - safeMargin * 3);
            }
            
            // Ensure minimum distance from edges
            const minX = -(viewportWidth - buttonSize - safeMargin);
            const minY = -(viewportHeight - buttonSize - safeMargin);
            const maxX = -safeMargin;
            const maxY = -safeMargin;
            
            const safeX = Math.max(minX, Math.min(maxX, -x));
            const safeY = Math.max(minY, Math.min(maxY, -y));
            
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
                  right: `${safeX}px`,
                  bottom: `${safeY}px`,
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