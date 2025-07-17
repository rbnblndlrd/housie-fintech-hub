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

  // Configuration constants for orbital layout
  const ORBIT_RADIUS = 80;
  const CENTER_BUTTON_SIZE = 56;
  const ORBITAL_BUTTON_SIZE = 48;

  const menuItems = [
    { 
      icon: 'map', 
      label: 'Map', 
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
      label: 'Annette', 
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
      {/* Orbital Menu Container - Centered layout */}
      <div className="relative flex items-center justify-center">
        
        {/* Orbital Menu Items - Perfect circle around center */}
        {isOpen && (
          <div className="absolute inset-0 overflow-visible">
            {menuItems.map((item, index) => {
              // Calculate orbital positions in a perfect circle
              const angleStep = (2 * Math.PI) / menuItems.length;
              const angle = index * angleStep - Math.PI / 2; // Start from top
              const x = ORBIT_RADIUS * Math.cos(angle);
              const y = ORBIT_RADIUS * Math.sin(angle);
              
              return (
                <div
                  key={item.label}
                  className="absolute group"
                  style={{
                    left: `calc(50% + ${x}px - ${ORBITAL_BUTTON_SIZE / 2}px)`,
                    top: `calc(50% + ${y}px - ${ORBITAL_BUTTON_SIZE / 2}px)`,
                    transform: isOpen ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-180deg)',
                    opacity: isOpen ? 1 : 0,
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transitionDelay: `${index * 60}ms`,
                    transformOrigin: 'center'
                  }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "rounded-full border-2 border-slate-400/60 overflow-visible group relative",
                      "backdrop-blur-[8px] transition-all duration-300",
                      "bg-white/90 shadow-lg drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]",
                      "hover:scale-125 hover:shadow-2xl hover:drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)]",
                      "hover:border-primary/80 hover:bg-white/95",
                      "hover:rotate-12 hover:brightness-110",
                      item.color,
                      item.bg
                    )}
                    style={{
                      width: `${ORBITAL_BUTTON_SIZE}px`,
                      height: `${ORBITAL_BUTTON_SIZE}px`
                    }}
                    title={item.label}
                  >
                    <span 
                      className="material-symbols-sharp transition-transform duration-200 group-hover:scale-110"
                      style={{ 
                        fontSize: '24px',
                        lineHeight: 1
                      }}
                    >
                      {item.icon}
                    </span>
                  </Button>
                  
                  {/* Hover label tooltip */}
                  <div 
                    className={cn(
                      "absolute -bottom-8 left-1/2 transform -translate-x-1/2",
                      "px-2 py-1 bg-black/80 text-white text-xs font-medium rounded",
                      "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                      "pointer-events-none whitespace-nowrap z-20",
                      "hidden sm:block" // Hide on mobile
                    )}
                    style={{
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Central Close/Open Button - Always visible and centered */}
        <Button
          ref={triggerRef}
          onClick={toggleRevolver}
          onDoubleClick={handleDoubleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onContextMenu={(e) => e.preventDefault()}
          className={cn(
            "relative rounded-full transition-all duration-400 ease-out z-10",
            "border-2 text-white shadow-2xl",
            // Enhanced styling with backdrop blur and shadow
            "backdrop-blur-[8px]",
            "hover:scale-110 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]",
            "active:scale-95 active:duration-100",
            // Conditional styling based on state
            !isOpen ? [
              "border-slate-400/80 bg-gradient-to-br from-slate-700 to-slate-900",
              "hover:border-primary/60 hover:from-slate-600 hover:to-slate-800",
              "ring-2 ring-slate-500/30",
              "animate-pulse hover:animate-none"
            ] : [
              "border-red-400/80 bg-gradient-to-br from-red-600 to-red-800",
              "hover:border-red-300 hover:from-red-500 hover:to-red-700",
              "ring-4 ring-red-500/40",
              "rotate-45"
            ]
          )}
          style={{
            width: `${CENTER_BUTTON_SIZE}px`,
            height: `${CENTER_BUTTON_SIZE}px`
          }}
        >
          <span 
            className={cn(
              "material-symbols-sharp transition-all duration-300",
              isOpen && "-rotate-45" // Counter-rotate the icon when button rotates
            )}
            style={{ 
              fontSize: '28px',
              lineHeight: 1
            }}
          >
            {isOpen ? 'close' : 'apps'}
          </span>
        </Button>
      </div>
    </div>
  );
};