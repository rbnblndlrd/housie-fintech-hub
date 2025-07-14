import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnnetteAvatarProps {
  onClick: (e?: React.MouseEvent) => void;
  className?: string;
  isActive?: boolean;
  hasNewMessage?: boolean;
}

export const AnnetteAvatar: React.FC<AnnetteAvatarProps> = ({
  onClick,
  className,
  isActive = false,
  hasNewMessage = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Idle animation every 8 seconds
    const interval = setInterval(() => {
      if (!isActive) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1500);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <Button
        onClick={onClick}
        onContextMenu={(e) => {
          e.preventDefault();
          onClick(e);
        }}
        className={cn(
          "relative rounded-full w-16 h-16 shadow-xl transition-all duration-300 group",
          "bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600",
          "border-2 border-white/20 backdrop-blur-sm hover:scale-105 hover:shadow-2xl",
          "hover:shadow-purple-500/20",
          isActive && "scale-110 shadow-2xl shadow-purple-500/30",
          isAnimating && "animate-pulse"
        )}
      >
        {/* Annette Avatar Image */}
        <img 
          src="/lovable-uploads/7e58a112-189a-4048-9103-cd1a291fa6a5.png" 
          alt="Annette AI Assistant"
          className="w-12 h-12 rounded-full object-cover transition-transform duration-200 group-hover:scale-110"
        />
        
        {/* Activity Indicator */}
        {isActive && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        )}
        
        {/* New Message Indicator */}
        {hasNewMessage && !isActive && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white animate-bounce" />
        )}
        
        {/* Sparkle Effect */}
        <Sparkles className={cn(
          "absolute -top-2 -right-2 h-5 w-5 text-yellow-400 transition-opacity duration-300",
          (isAnimating || hasNewMessage) ? "opacity-100" : "opacity-0"
        )} />
      </Button>
      
      {/* Tooltip */}
      <div className={cn(
        "absolute bottom-full right-0 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg",
        "transition-all duration-300 whitespace-nowrap pointer-events-none",
        "border border-white/10 backdrop-blur-sm shadow-lg",
        "group-hover:opacity-100 group-hover:translate-y-0",
        "opacity-0 translate-y-1"
      )}>
        <div className="flex flex-col items-center space-y-1">
          <div className="flex items-center space-x-1">
            <span>Click for chat</span>
            <Sparkles className="h-3 w-3 text-yellow-400" />
          </div>
          <span className="text-xs opacity-75">Right-click for Revollver™</span>
        </div>
      </div>
    </div>
  );
};