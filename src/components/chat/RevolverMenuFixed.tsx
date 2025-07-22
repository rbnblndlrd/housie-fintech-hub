import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Navigation, CalendarCheck, Sparkles, BrainCircuit, Star, Home, RotateCcw, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { triggerAnnetteMessage } from '@/components/assistant/AnnetteIntegration';
import { GhostBubblePreview } from './GhostBubblePreview';
import { AssistantActionModal } from '@/components/assistant/AssistantActionModal';

interface RevolverMenuProps {
  className?: string;
}

export const RevolverMenu: React.FC<RevolverMenuProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ghostMessage, setGhostMessage] = useState<string | null>(null);
  const [showGhostBubble, setShowGhostBubble] = useState(false);
  const [modalAction, setModalAction] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const lastClickTime = useRef<Record<string, number>>({});
  
  const handleClick = (actionType: string) => {
    const now = Date.now();
    const lastAction = lastClickTime.current[actionType] || 0;
    
    if (now - lastAction < 2000) {
      console.log('🔄 Action cooldown active, ignoring click');
      return;
    }
    
    lastClickTime.current[actionType] = now;
    console.log('🎯 Revolver action triggered:', actionType);
    
    const responses = {
      gps: "GPS system activated. Current location locked.",
      bookings: "Calendar loaded. 3 active bookings found.",
      optimize: "Optimized route. 3 stops, ETA 5.5 hrs.",
      parse: "Ticket analyzed. Key details extracted.",
      prestige: "Current rank: Technomancer. 12 achievements unlocked.",
      home: "Returning to dashboard. All systems operational."
    };

    const ghostMessages = {
      gps: "GPS activated. Location locked.",
      bookings: "Calendar loaded. 3 active bookings.",
      optimize: "Optimized route. 3 stops, ETA 5.5 hrs.",
      parse: "Ticket analyzed successfully.",
      prestige: "Rank: Technomancer. 12 achievements.",
      home: "Returning to dashboard."
    };
    
    const response = responses[actionType as keyof typeof responses] || "Action completed successfully";
    const ghostMsg = ghostMessages[actionType as keyof typeof ghostMessages] || "Action completed";
    
    // Show ghost bubble preview
    setGhostMessage(ghostMsg);
    setShowGhostBubble(true);
    
    // Add action log entry to Assistant tab (if we had state management)
    console.log('📝 Assistant Action Log:', {
      action: actionType,
      timestamp: new Date(),
      response: response
    });
    
    // Show modal with detailed info
    setModalAction({
      title: actionType,
      description: response
    });
    setShowModal(true);
  };

  const menuItems = [
    { 
      icon: Navigation, 
      label: 'GPS', 
      actionType: 'gps',
      navigate: '/interactive-map',
      color: 'text-primary hover:text-primary/80',
      bg: 'bg-primary/20 hover:bg-primary/30'
    },
    { 
      icon: CalendarCheck, 
      label: 'Bookings', 
      actionType: 'bookings',
      navigate: '/dashboard',
      color: 'text-accent hover:text-accent/80',
      bg: 'bg-accent/20 hover:bg-accent/30'
    },
    { 
      icon: Sparkles, 
      label: 'Optimize', 
      actionType: 'optimize',
      navigate: '/analytics-dashboard',
      color: 'text-secondary hover:text-secondary/80',
      bg: 'bg-secondary/20 hover:bg-secondary/30'
    },
    { 
      icon: BrainCircuit, 
      label: 'Parse', 
      actionType: 'parse',
      color: 'text-muted-foreground hover:text-foreground',
      bg: 'bg-muted/20 hover:bg-muted/30'
    },
    { 
      icon: Star, 
      label: 'Prestige', 
      actionType: 'prestige',
      navigate: '/community-dashboard',
      color: 'text-accent hover:text-accent/80',
      bg: 'bg-accent/20 hover:bg-accent/30'
    },
    { 
      icon: Home, 
      label: 'Home', 
      actionType: 'home',
      navigate: '/',
      color: 'text-muted-foreground hover:text-foreground',
      bg: 'bg-muted/20 hover:bg-muted/30'
    }
  ];

  const handleItemClick = (item: typeof menuItems[0]) => {
    handleClick(item.actionType);
    
    if (item.navigate) {
      navigate(item.navigate);
    }
    
    setIsOpen(false);
  };

  return (
    <>
      <div className={cn(
        "fixed bottom-[100px] right-[160px] z-[1000]",
        className
      )}>
        <div className="relative flex items-center justify-center">
          
          {/* Orbital Menu Items */}
          {isOpen && (
            <div className="absolute inset-0 overflow-visible">
              {menuItems.map((item, index) => {
                const angle = (index * 60 - 90) * (Math.PI / 180); // 60 degrees apart, starting from top
                const radius = 100;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                
                return (
                  <div
                    key={item.label}
                    className="absolute group"
                    style={{
                      left: `calc(50% + ${x}px - 24px)`,
                      top: `calc(50% + ${y}px - 24px)`,
                      transform: isOpen ? 'scale(1)' : 'scale(0)',
                      opacity: isOpen ? 1 : 0,
                      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transitionDelay: `${index * 60}ms`
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "rounded-full border-2 border-border/60 w-12 h-12",
                        "backdrop-blur-[8px] transition-all duration-300",
                        "bg-background/90 shadow-lg",
                        "hover:scale-125 hover:shadow-2xl hover:shadow-primary/20",
                        "hover:border-primary/80 hover:bg-background/95",
                        item.color,
                        item.bg
                      )}
                      title={item.label}
                    >
                      <item.icon size={20} />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Central Toggle Button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "relative rounded-full transition-all duration-400 ease-out z-10 w-14 h-14",
              "border-2 text-primary-foreground shadow-2xl backdrop-blur-[8px]",
              "hover:scale-110 hover:shadow-primary/30 active:scale-95",
              !isOpen ? [
                "border-border bg-gradient-to-br from-muted to-muted-foreground/20",
                "hover:border-primary/60 hover:from-muted/80 hover:to-muted",
                "ring-2 ring-muted/30 animate-pulse hover:animate-none"
              ] : [
                "border-destructive bg-gradient-to-br from-destructive to-destructive/80",
                "hover:border-destructive/60 hover:from-destructive/80 hover:to-destructive",
                "ring-4 ring-destructive/40 rotate-45"
              ]
            )}
          >
            {isOpen ? (
              <X size={24} className="transition-all duration-300 -rotate-45" />
            ) : (
              <RotateCcw size={24} className="transition-all duration-300" />
            )}
          </Button>
        </div>

        {/* Debug Test Button - Hidden unless development mode */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <Button
              onClick={() => {
                setGhostMessage("Debug test message");
                setShowGhostBubble(true);
              }}
              variant="outline"
              size="sm"
              className="bg-background/90 backdrop-blur-sm text-xs"
            >
              Test Ghost Message
            </Button>
          </div>
        )}
      </div>

      {/* Ghost Bubble Preview */}
      <GhostBubblePreview
        message={ghostMessage}
        isVisible={showGhostBubble}
        onDismiss={() => {
          setShowGhostBubble(false);
          setGhostMessage(null);
        }}
      />

      {/* Assistant Action Modal */}
      <AssistantActionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        action={modalAction}
      />
    </>
  );
};