import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useRevolverVisibility } from '@/hooks/useRevolverVisibility';
import { Navigation, CalendarCheck, Sparkles, BrainCircuit, Star, Home, RotateCcw, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { triggerAnnetteAction } from '@/components/assistant/AnnetteIntegration';

interface RevolverMenuProps {
  className?: string;
}

export const RevolverMenu: React.FC<RevolverMenuProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { emitRevolverStateChange } = useRevolverVisibility();
  const { toast } = useToast();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActionTimeRef = useRef<Record<string, number>>({});
  
  // Voice lines and toast messages for each action
  const actionConfig = {
    navigation: {
      voice: "Alright sugar, let's hit the road 🚗",
      toast: "Annette started your GPS route"
    },
    calendar_check: {
      voice: "Booking calendar open. Don't forget that wedding on Sunday… again.",
      toast: "Opened your bookings"
    },
    sparkle: {
      voice: "Stand back. Route optimization sequence… engaged ✨",
      toast: "Optimizing your route now"
    },
    brain_circuit: {
      voice: "Parsing ticket… hope it's not another faucet with a vengeance.",
      toast: "Ticket sent to Annette for summary"
    },
    star: {
      voice: "Prestige incoming. You might just be a big deal.",
      toast: "Opening your Prestige tracker"
    },
    home: {
      voice: "Returning to HQ. Don't trip on the way back.",
      toast: "Returned to Dashboard"
    }
  };
  
  const COOLDOWN_MS = 2000;

  // Configuration constants for orbital layout
  const ORBIT_RADIUS = 100;
  const CENTER_BUTTON_SIZE = 56;
  const ORBITAL_BUTTON_SIZE = 48;

  // Provider role radial menu items in clockwise order with voice actions
  const menuItems = [
    { 
      icon: Navigation, 
      label: 'GPS', 
      actionKey: 'navigation' as keyof typeof actionConfig,
      action: () => {
        handleVoiceAndToast('navigation');
        navigate('/interactive-map');
      },
      color: 'text-primary hover:text-primary/80',
      bg: 'bg-primary/20 hover:bg-primary/30'
    },
    { 
      icon: CalendarCheck, 
      label: 'Bookings', 
      actionKey: 'calendar_check' as keyof typeof actionConfig,
      action: () => {
        handleVoiceAndToast('calendar_check');
        navigate('/dashboard');
      },
      color: 'text-accent hover:text-accent/80',
      bg: 'bg-accent/20 hover:bg-accent/30'
    },
    { 
      icon: Sparkles, 
      label: 'Optimize', 
      actionKey: 'sparkle' as keyof typeof actionConfig,
      action: () => {
        handleVoiceAndToast('sparkle');
        navigate('/analytics-dashboard');
      },
      color: 'text-secondary hover:text-secondary/80',
      bg: 'bg-secondary/20 hover:bg-secondary/30'
    },
    { 
      icon: BrainCircuit, 
      label: 'Parse', 
      actionKey: 'brain_circuit' as keyof typeof actionConfig,
      action: () => {
        handleVoiceAndToast('brain_circuit');
        // TODO: Implement AI ticket parsing functionality
        console.log('🧠 Parse ticket functionality to be implemented');
      },
      color: 'text-muted-foreground hover:text-foreground',
      bg: 'bg-muted/20 hover:bg-muted/30'
    },
    { 
      icon: Star, 
      label: 'Prestige', 
      actionKey: 'star' as keyof typeof actionConfig,
      action: () => {
        handleVoiceAndToast('star');
        navigate('/community-dashboard');
      },
      color: 'text-accent hover:text-accent/80',
      bg: 'bg-accent/20 hover:bg-accent/30'
    },
    { 
      icon: Home, 
      label: 'Home', 
      actionKey: 'home' as keyof typeof actionConfig,
      action: () => {
        handleVoiceAndToast('home');
        navigate('/');
      },
      color: 'text-muted-foreground hover:text-foreground',
      bg: 'bg-muted/20 hover:bg-muted/30'
    }
  ];

  // Handle voice lines, message panel, and toast notifications with cooldown
  const handleVoiceAndToast = (actionKey: keyof typeof actionConfig) => {
    const now = Date.now();
    const lastActionTime = lastActionTimeRef.current[actionKey] || 0;
    
    // Check cooldown
    if (now - lastActionTime < COOLDOWN_MS) {
      console.log(`🔇 Action ${actionKey} still in cooldown`);
      return;
    }
    
    // Update last action time
    lastActionTimeRef.current[actionKey] = now;
    
    const config = actionConfig[actionKey];
    
    // Trigger both voice and message panel through Annette system
    triggerAnnetteAction(`revolver_${actionKey}`, {
      voiceLine: config.voice,
      response: config.voice, // Same message appears in chat
      fromRevolver: true,
      actionKey,
      autoOpenChat: true // Signal to auto-open chat if closed
    });
    
    // Show toast notification
    toast({
      title: "🤖 Annette",
      description: config.toast,
      duration: 3000,
    });
  };

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
                       "rounded-full border-2 border-border/60 overflow-visible group relative",
                       "backdrop-blur-[8px] transition-all duration-300",
                       "bg-background/90 shadow-lg",
                       "hover:scale-125 hover:shadow-2xl hover:shadow-primary/20",
                       "hover:border-primary/80 hover:bg-background/95",
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
                     <item.icon 
                       size={20} 
                       className="transition-transform duration-200 group-hover:scale-110"
                     />
                   </Button>
                  
                  {/* Hover label tooltip */}
                   <div 
                     className={cn(
                       "absolute -bottom-12 left-1/2 transform -translate-x-1/2",
                       "px-2 py-1 bg-popover text-popover-foreground text-[11px] font-medium rounded",
                       "border border-border/50 shadow-md",
                       "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                       "pointer-events-none whitespace-nowrap z-20",
                       "hidden sm:block max-w-[80px] text-center"
                     )}
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
             "border-2 text-primary-foreground shadow-2xl",
             "backdrop-blur-[8px]",
             "hover:scale-110 hover:shadow-primary/30",
             "active:scale-95 active:duration-100",
             !isOpen ? [
               "border-border bg-gradient-to-br from-muted to-muted-foreground/20",
               "hover:border-primary/60 hover:from-muted/80 hover:to-muted",
               "ring-2 ring-muted/30",
               "animate-pulse hover:animate-none"
             ] : [
               "border-destructive bg-gradient-to-br from-destructive to-destructive/80",
               "hover:border-destructive/60 hover:from-destructive/80 hover:to-destructive",
               "ring-4 ring-destructive/40",
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