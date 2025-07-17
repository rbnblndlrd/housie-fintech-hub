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
      "revolver-trigger fixed transition-all duration-300 ease-out overflow-visible",
      // Fixed to viewport positioning - bottom-right control zone  
      "bottom-[100px] right-[160px]",
      // Ensure high z-index for visibility above all content
      "z-[1000]",
      className
    )}>
      {/* Radial Menu Items - 150° arc starting at 195° */}
      {isOpen && (
        <div className="absolute bottom-0 right-0 overflow-visible">
          {menuItems.map((item, index) => {
            // Arc configuration as specified
            const arcAngle = 150;
            const radius = 100;
            const startAngle = 195;
            
            // Calculate position using the provided trigonometry
            const angle = (startAngle + (index * arcAngle) / (menuItems.length - 1)) * (Math.PI / 180);
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            // Ensure buttons stay within viewport bounds
            const viewportMargin = 60;
            const rightPos = Math.max(-x, -(window.innerWidth - 160 - viewportMargin));
            const bottomPos = Math.max(-y, -(window.innerHeight - 100 - viewportMargin));
            
            return (
              <div
                key={item.label}
                className="absolute"
                style={{
                  right: `${rightPos}px`,
                  bottom: `${bottomPos}px`,
                  transform: isOpen ? 'scale(1)' : 'scale(0)',
                  opacity: isOpen ? 1 : 0,
                  transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
                  transitionDelay: `${index * 80}ms`,
                  transformOrigin: 'center'
                }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "w-16 h-16 rounded-full border-2 border-slate-400/60 overflow-visible",
                    "backdrop-blur-[8px] transition-all duration-200",
                    "bg-white/80 shadow-lg drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]",
                    "hover:scale-110 hover:shadow-2xl hover:drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]",
                    "hover:border-primary/80 hover:bg-white/90",
                    "hover:rotate-3 hover:brightness-110",
                    item.color,
                    item.bg
                  )}
                  title={item.label}
                >
                  <span 
                    className="material-symbols-sharp"
                    style={{ 
                      fontSize: '32px',
                      lineHeight: 1
                    }}
                  >
                    {item.icon}
                  </span>
                </Button>
                
                {/* Label below button with responsive visibility */}
                <div 
                  className={cn(
                    "absolute top-full left-1/2 transform -translate-x-1/2 mt-2",
                    "text-xs text-white font-medium max-w-[80px] text-center",
                    "hidden sm:block", // Hide labels on mobile
                    "truncate" // Add ellipsis for long text
                  )}
                  style={{
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    opacity: isOpen ? 1 : 0,
                    transition: 'opacity 0.4s ease-in-out',
                    transitionDelay: `${index * 80 + 150}ms`
                  }}
                >
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Central Trigger Button - Material Symbols Sharp */}
      <Button
        ref={triggerRef}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onContextMenu={(e) => e.preventDefault()} // Disable right-click menu
        className={cn(
          "relative w-16 h-16 rounded-full transition-all duration-300 ease-out",
          "border-2 border-slate-400 text-white",
          // Enhanced styling with backdrop blur and shadow
          "bg-gradient-to-br from-slate-700 to-slate-900 backdrop-blur-[8px]",
          "drop-shadow-[0_3px_10px_rgba(0,0,0,0.35)]",
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
          <span className="material-symbols-sharp text-3xl text-white animate-fade-in">close</span>
        ) : (
          <span className="material-symbols-sharp text-3xl text-white animate-fade-in">apps</span>
        )}
      </Button>
    </div>
  );
};