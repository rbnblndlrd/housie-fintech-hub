import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useRevolverVisibility } from '@/hooks/useRevolverVisibility';
import { Navigation, CalendarCheck, Sparkles, BrainCircuit, Star, Home, RotateCcw, X } from 'lucide-react';

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
  const ORBIT_RADIUS = 100;
  const CENTER_BUTTON_SIZE = 56;
  const ORBITAL_BUTTON_SIZE = 48;

  const menuItems = [
    { 
      icon: Navigation, 
      label: 'GPS', 
      action: () => navigate('/interactive-map'),
      color: 'text-emerald-400 hover:text-emerald-300',
      bg: 'bg-emerald-500/20 hover:bg-emerald-500/30'
    },
    { 
      icon: CalendarCheck, 
      label: 'Bookings', 
      action: () => navigate('/dashboard'),
      color: 'text-amber-400 hover:text-amber-300',
      bg: 'bg-amber-500/20 hover:bg-amber-500/30'
    },
    { 
      icon: Sparkles, 
      label: 'Optimize', 
      action: () => navigate('/analytics-dashboard'),
      color: 'text-violet-400 hover:text-violet-300',
      bg: 'bg-violet-500/20 hover:bg-violet-500/30'
    },
    { 
      icon: BrainCircuit, 
      label: 'Parse', 
      action: () => {/* Parse ticket functionality */},
      color: 'text-cyan-400 hover:text-cyan-300',
      bg: 'bg-cyan-500/20 hover:bg-cyan-500/30'
    },
    { 
      icon: Star, 
      label: 'Prestige', 
      action: () => navigate('/community-dashboard'),
      color: 'text-yellow-400 hover:text-yellow-300',
      bg: 'bg-yellow-500/20 hover:bg-yellow-500/30'
    },
    { 
      icon: Home, 
      label: 'Home', 
      action: () => navigate('/'),
      color: 'text-slate-400 hover:text-slate-300',
      bg: 'bg-slate-500/20 hover:bg-slate-500/30'
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
                       "hover:rotate-12 hover:brightness-110 hover:glow",
                       item.color,
                       item.bg
                     )}
                     style={{
                       width: `${ORBITAL_BUTTON_SIZE}px`,
                       height: `${ORBITAL_BUTTON_SIZE}px`
                     }}
                     title={item.label}
                   >
                     <item.icon 
                       size={20} 
                       className="transition-transform duration-200 group-hover:scale-110"
                     />
                   </Button>
                  
                  {/* Hover label tooltip */}
                  <div 
                    className={cn(
                      "absolute -bottom-10 left-1/2 transform -translate-x-1/2",
                      "px-2 py-1 bg-black/90 text-white text-[11px] font-medium rounded",
                      "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                      "pointer-events-none whitespace-nowrap z-20",
                      "hidden sm:block max-w-[80px] text-center" // Hide on mobile, limit width
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
           {isOpen ? (
             <X 
               size={24} 
               className="transition-all duration-300 -rotate-45"
             />
           ) : (
             <RotateCcw 
               size={24} 
               className="transition-all duration-300"
             />
           )}
         </Button>
      </div>
    </div>
  );
};