import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useRevolverVisibility } from '@/hooks/useRevolverVisibility';
import { Navigation, CalendarCheck, Sparkles, BrainCircuit, Star, Home, RotateCcw, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { triggerAnnetteAction, triggerAnnetteMessage } from '@/components/assistant/AnnetteIntegration';

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
  
  // Unified action map with voice lines and messages
  const actionMap = {
    gps: "Alright sugar, let's hit the road 🚗",
    bookings: "Booking calendar open. Don't forget that wedding on Sunday… again.",
    optimize: "Stand back. Route optimization sequence… engaged ✨",
    parse: "Parsing ticket… hope it's not another faucet with a vengeance.",
    prestige: "Prestige incoming. You might just be a big deal.",
    home: "Returning to HQ. Don't trip on the way back."
  };

  // Toast messages for each action
  const toastMap = {
    gps: "Annette started your GPS route",
    bookings: "Opened your bookings",
    optimize: "Optimizing your route now",
    parse: "Ticket sent to Annette for summary",
    prestige: "Opening your Prestige tracker",
    home: "Returned to Dashboard"
  };
  
  const COOLDOWN_MS = 2000;

  // Configuration constants for orbital layout
  const ORBIT_RADIUS = 100;
  const CENTER_BUTTON_SIZE = 56;
  const ORBITAL_BUTTON_SIZE = 48;

  // Provider role radial menu items in clockwise order with unified actions
  const menuItems = [
    { 
      icon: Navigation, 
      label: 'GPS', 
      actionType: 'gps' as keyof typeof actionMap,
      navigate: '/interactive-map',
      color: 'text-primary hover:text-primary/80',
      bg: 'bg-primary/20 hover:bg-primary/30'
    },
    { 
      icon: CalendarCheck, 
      label: 'Bookings', 
      actionType: 'bookings' as keyof typeof actionMap,
      navigate: '/dashboard',
      color: 'text-accent hover:text-accent/80',
      bg: 'bg-accent/20 hover:bg-accent/30'
    },
    { 
      icon: Sparkles, 
      label: 'Optimize', 
      actionType: 'optimize' as keyof typeof actionMap,
      navigate: '/analytics-dashboard',
      color: 'text-secondary hover:text-secondary/80',
      bg: 'bg-secondary/20 hover:bg-secondary/30'
    },
    { 
      icon: BrainCircuit, 
      label: 'Parse', 
      actionType: 'parse' as keyof typeof actionMap,
      action: () => console.log('🧠 Parse ticket functionality to be implemented'),
      color: 'text-muted-foreground hover:text-foreground',
      bg: 'bg-muted/20 hover:bg-muted/30'
    },
    { 
      icon: Star, 
      label: 'Prestige', 
      actionType: 'prestige' as keyof typeof actionMap,
      navigate: '/community-dashboard',
      color: 'text-accent hover:text-accent/80',
      bg: 'bg-accent/20 hover:bg-accent/30'
    },
    { 
      icon: Home, 
      label: 'Home', 
      actionType: 'home' as keyof typeof actionMap,
      navigate: '/',
      color: 'text-muted-foreground hover:text-foreground',
      bg: 'bg-muted/20 hover:bg-muted/30'
    }
  ];

  // Unified click handler for all Revolver actions
  const handleClick = (actionType: keyof typeof actionMap) => {
    const now = Date.now();
    const lastActionTime = lastActionTimeRef.current[actionType] || 0;
    
    // Check cooldown
    if (now - lastActionTime < COOLDOWN_MS) {
      console.log(`🔇 Action ${actionType} still in cooldown`);
      return;
    }
    
    // Update last action time
    lastActionTimeRef.current[actionType] = now;
    
    const text = actionMap[actionType];
    
    // Trigger both voice and message panel through Annette system
    triggerAnnetteAction(`revolver_${actionType}`, {
      text,
      from: 'annette',
      source: 'revolver',
      voiceLine: text,
      response: text, // Same message appears in chat
      fromRevolver: true,
      actionType,
      autoOpenChat: true // Signal to auto-open chat if closed
    });
    
    // Trigger speech synthesis
    if (window.speechSynthesis && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
    
    // Show toast notification
    toast({
      title: "🤖 Annette says:",
      description: toastMap[actionType],
      duration: 3000,
    });
    
    console.log(`🎯 Revolver action triggered: ${actionType}`);
  };

  const handleItemClick = (item: typeof menuItems[0]) => {
    // Trigger unified handler
    handleClick(item.actionType);
    
    // Handle navigation if specified
    if (item.navigate) {
      navigate(item.navigate);
    }
    
    // Handle custom action if specified
    if (item.action) {
      item.action();
    }
    
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

      {/* Debug Test Button - Temporary for testing */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
        <Button
          onClick={() => triggerAnnetteMessage({ 
            text: 'Debug message from Revolver test', 
            from: 'annette', 
            source: 'manualTest' 
          })}
          variant="outline"
          size="sm"
          className="bg-background/90 backdrop-blur-sm text-xs"
        >
          Test Annette Message
        </Button>
      </div>
    </div>
  );
};