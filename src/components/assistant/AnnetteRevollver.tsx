import React, { useState, useEffect } from 'react';
import { 
  Compass, FileText, Star, Users, MapPin, Clock,
  Radio, Bookmark, Users2, Search, MessageSquare, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnnetteRevollverProps {
  isOpen: boolean;
  onClose: () => void;
  onCommandSelect: (command: string, context?: any) => void;
  className?: string;
}

interface ClipAction {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  voiceLine: string;
  action: string;
  context?: any;
}

// 🎡 CLIP DECK: 1st Cylinder — Core Actions
const cylinder1: ClipAction[] = [
  {
    id: 'optimize-route',
    icon: Compass,
    label: 'Optimize Route',
    voiceLine: "One click and your whole day falls in line.",
    action: 'optimize_route'
  },
  {
    id: 'parse-ticket',
    icon: FileText,
    label: 'Parse Ticket',
    voiceLine: "Mmm... juicy. Let's dissect this one.",
    action: 'parse_ticket'
  },
  {
    id: 'check-prestige',
    icon: Star,
    label: 'Check My Prestige',
    voiceLine: "Flex check: incoming.",
    action: 'check_prestige'
  },
  {
    id: 'recommend-provider',
    icon: Users,
    label: 'Who Should I Hire?',
    voiceLine: "Let me find someone who won't ghost you.",
    action: 'recommend_provider'
  },
  {
    id: 'show-route',
    icon: MapPin,
    label: 'Show My Route',
    voiceLine: "Zooming in on your destiny...",
    action: 'show_map'
  },
  {
    id: 'estimate-eta',
    icon: Clock,
    label: "What's My ETA?",
    voiceLine: "If I had wheels, you'd be there by now.",
    action: 'estimate_eta'
  }
];

// 🔄 CLIP DECK: 2nd Cylinder — Community & Broadcast  
const cylinder2: ClipAction[] = [
  {
    id: 'city-broadcast',
    icon: Radio,
    label: 'City Broadcast',
    voiceLine: "Here's what's echoing across town...",
    action: 'city_broadcast'
  },
  {
    id: 'view-stamps',
    icon: Bookmark,
    label: 'View My Stamps',
    voiceLine: "Look at all that recognition, darling.",
    action: 'view_stamps'
  },
  {
    id: 'loyalty-intel',
    icon: Users2,
    label: 'Loyalty Intel',
    voiceLine: "Faithful ones come back fast — here's proof.",
    action: 'loyalty_stats'
  },
  {
    id: 'review-footprint',
    icon: Search,
    label: 'Review My Footprint',
    voiceLine: "Let's retrace those glorious steps.",
    action: 'map_history'
  },
  {
    id: 'read-reviews',
    icon: MessageSquare,
    label: 'Read My Reviews',
    voiceLine: "What do the people say? Let's eavesdrop.",
    action: 'read_reviews'
  },
  {
    id: 'canon-log',
    icon: Shield,
    label: 'My Canon Log',
    voiceLine: "This is all confirmed — stamped and sacred.",
    action: 'canon_log'
  }
];

const cylinders = [cylinder1, cylinder2];

export const AnnetteRevollver: React.FC<AnnetteRevollverProps> = ({
  isOpen,
  onClose,
  onCommandSelect,
  className
}) => {
  const [currentCylinder, setCurrentCylinder] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredClip, setHoveredClip] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    spinCylinder();
  };

  const spinCylinder = () => {
    setCurrentCylinder((prev) => (prev + 1) % cylinders.length);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
    
    // Voice line on spin
    console.log("🎯 Annette: Spinning the clip... ready for your next move?");
  };

  const handleClipClick = (clip: ClipAction) => {
    console.log(`🎤 Annette: "${clip.voiceLine}"`);
    onCommandSelect(clip.action, clip.context);
    onClose();
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentClips = cylinders[currentCylinder];
  const radius = 140;
  const angleStep = (2 * Math.PI) / currentClips.length;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        className
      )}
      onClick={handleBackgroundClick}
      onContextMenu={handleRightClick}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in" />
      
      {/* Central Annette Hub */}
      <div className="relative">
        {/* Central Avatar */}
        <div className={cn(
          "w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-2xl",
          "flex items-center justify-center border-4 border-white/30 relative z-10",
          "transition-all duration-300",
          isAnimating && "animate-pulse scale-110"
        )}>
          <img 
            src="/lovable-uploads/7e58a112-189a-4048-9103-cd1a291fa6a5.png" 
            alt="Annette"
            className="w-14 h-14 rounded-full object-cover"
          />
        </div>
        
        {/* Cylinder indicator */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 text-white font-medium text-sm">
            Cylinder {currentCylinder + 1}/2
          </div>
        </div>

        {/* Clip Actions */}
        {currentClips.map((clip, index) => {
          const angle = index * angleStep - Math.PI / 2; // Start from top
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const isHovered = hoveredClip === clip.id;
          
          return (
            <div
              key={clip.id}
              className={cn(
                "absolute group cursor-pointer transition-all duration-300 ease-out",
                isAnimating && "animate-scale-in",
                isHovered && "scale-110 z-20"
              )}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${index * 80}ms`
              }}
              onMouseEnter={() => setHoveredClip(clip.id)}
              onMouseLeave={() => setHoveredClip(null)}
              onClick={() => handleClipClick(clip)}
            >
              {/* Clip Icon */}
              <div className={cn(
                "w-14 h-14 rounded-full backdrop-blur-md shadow-xl",
                "flex items-center justify-center border-2 transition-all duration-200",
                "bg-white/15 border-white/30 hover:bg-white/25 hover:border-white/50",
                "hover:shadow-2xl hover:shadow-orange-500/20",
                isHovered && "bg-white/30 border-white/60 shadow-2xl shadow-orange-500/30"
              )}>
                <clip.icon className={cn(
                  "w-7 h-7 transition-all duration-200",
                  "text-white",
                  isHovered && "text-orange-100 scale-110"
                )} />
                
                {/* Glow effect on hover */}
                {isHovered && (
                  <div className="absolute inset-0 rounded-full bg-orange-400/20 animate-pulse" />
                )}
              </div>
              
              {/* Clip Label with Voice Line Preview */}
              {isHovered && (
                <div className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 animate-fade-in pointer-events-none z-30">
                  <div className="bg-black/90 backdrop-blur-sm rounded-lg px-4 py-3 text-white text-center shadow-2xl border border-white/20 min-w-[200px]">
                    <div className="font-bold text-orange-300 text-sm mb-1">
                      {clip.label}
                    </div>
                    <div className="text-xs text-white/80 italic leading-relaxed">
                      "{clip.voiceLine}"
                    </div>
                  </div>
                  {/* Arrow pointer */}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-l border-t border-white/20" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-6 py-3 text-white/90 text-center text-sm">
          Right-click to spin the clip • Click outside to close
        </div>
      </div>
    </div>
  );
};

export default AnnetteRevollver;