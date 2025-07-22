
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Navigation, CalendarCheck, Sparkles, BrainCircuit, Star, Home, RotateCcw, X } from 'lucide-react';
import { triggerAnnetteMessage } from '@/components/assistant/AnnetteIntegration';

interface LeftAlignedRevollverProps {
  isVisible: boolean;
  activeTab: string;
}

export const LeftAlignedRevollver: React.FC<LeftAlignedRevollverProps> = ({
  isVisible,
  activeTab
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const lastClickTime = useRef<Record<string, number>>({});

  // Only show when mounted and on relevant tabs
  const shouldShow = isVisible && (activeTab === 'annette' || activeTab === 'job-hub');

  if (!shouldShow) return null;

  const handleClick = (actionType: string) => {
    const now = Date.now();
    const lastAction = lastClickTime.current[actionType] || 0;
    
    if (now - lastAction < 2000) {
      console.log('🔄 Action cooldown active, ignoring click');
      return;
    }
    
    lastClickTime.current[actionType] = now;
    console.log('🎯 Revollver action triggered:', actionType);
    
    const responses = {
      gps: "Alright sugar, let's hit the road! 🚗",
      bookings: "Booking calendar open. Don't forget that wedding on Sunday... again.",
      optimize: "Stand back. Route optimization sequence... engaged ✨",
      parse: "Parsing ticket... hope it's not another faucet with a vengeance.",
      prestige: "Prestige incoming. You might just be a big deal.",
      home: "Returning to HQ. Don't trip on the way back."
    };
    
    const message = responses[actionType as keyof typeof responses] || 
                   "Hmm, that's a new one. I'll figure it out, sugar! 💪";
    
    // Trigger Annette message
    if ((window as any).triggerAnnetteMessage) {
      console.log('🎯 Triggering Annette message:', message);
      (window as any).triggerAnnetteMessage({
        text: message,
        from: 'annette',
        source: 'revollver'
      });
    }
    
    // Play voice line with browser TTS
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      window.speechSynthesis.speak(utterance);
      console.log('🎤 Annette voice line played:', message);
    }
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
    <div className={cn(
      "fixed z-50 transition-all duration-300 ease-in-out",
      // Desktop positioning - left side, below compact tabs
      "lg:bottom-32 lg:left-6",
      // Mobile positioning - bottom right (avoid tab strip)
      "bottom-24 right-6 lg:bottom-32 lg:right-auto",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
    )}>
      <div className="relative flex items-center justify-center">
        
        {/* Orbital Menu Items */}
        {isOpen && (
          <div className="absolute inset-0 overflow-visible">
            {menuItems.map((item, index) => {
              const angle = (index * 60 - 90) * (Math.PI / 180);
              const radius = 80; // Smaller radius for left positioning
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);
              
              return (
                <div
                  key={item.label}
                  className="absolute group"
                  style={{
                    left: `calc(50% + ${x}px - 20px)`,
                    top: `calc(50% + ${y}px - 20px)`,
                    transform: isOpen ? 'scale(1)' : 'scale(0)',
                    opacity: isOpen ? 1 : 0,
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transitionDelay: `${index * 50}ms`
                  }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "rounded-full border-2 border-border/60 w-10 h-10",
                      "backdrop-blur-[8px] transition-all duration-300",
                      "bg-background/90 shadow-lg",
                      "hover:scale-110 hover:shadow-xl hover:shadow-primary/20",
                      "hover:border-primary/80 hover:bg-background/95",
                      item.color,
                      item.bg
                    )}
                    title={item.label}
                  >
                    <item.icon size={16} />
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
            "relative rounded-full transition-all duration-400 ease-out z-10 w-12 h-12",
            "border-2 text-primary-foreground shadow-xl backdrop-blur-[8px]",
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
            <X size={20} className="transition-all duration-300 -rotate-45" />
          ) : (
            <RotateCcw size={20} className="transition-all duration-300" />
          )}
        </Button>
      </div>

      {/* Debug Test Button - Only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
          <Button
            onClick={() => {
              if ((window as any).triggerAnnetteMessage) {
                (window as any).triggerAnnetteMessage({ 
                  text: 'Debug message from Left Revollver', 
                  from: 'annette', 
                  source: 'leftRevollverTest' 
                });
              }
            }}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm text-xs"
          >
            Test Annette
          </Button>
        </div>
      )}
    </div>
  );
};
