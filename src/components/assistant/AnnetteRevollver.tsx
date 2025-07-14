import React, { useState, useEffect } from 'react';
import { 
  MapPin, Route, Trophy, Calendar, RefreshCw, Users, 
  Crown, Network, TrendingUp, Gift, Settings, CreditCard, 
  Unlock, Globe, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnnetteRevollverProps {
  isOpen: boolean;
  onClose: () => void;
  onCommandSelect: (command: string, context?: any) => void;
  className?: string;
}

interface Command {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  action: string;
  context?: any;
  isCanon?: boolean; // Canon-verified actions
}

const clips: Command[][] = [
  // Clip 1: Daily Ops
  [
    { id: 'parse-ticket', label: 'Parse Ticket', icon: MapPin, action: 'parse_ticket', isCanon: true },
    { id: 'optimize-route', label: 'Optimize Route', icon: Route, action: 'optimize_route', isCanon: true },
    { id: 'todays-map', label: "Today's Map", icon: MapPin, action: 'show_map', isCanon: true },
    { id: 'view-bookings', label: 'View Bookings', icon: Calendar, action: 'view_bookings', isCanon: true },
    { id: 'rebooking', label: 'Rebooking Suggestions', icon: RefreshCw, action: 'rebooking_suggestions', isCanon: false },
    { id: 'check-prestige', label: 'Check My Prestige', icon: Trophy, action: 'check_prestige', isCanon: true },
  ],
  // Clip 2: Social
  [
    { id: 'my-crew', label: 'My Crew', icon: Users, action: 'view_crew', isCanon: true },
    { id: 'commendations', label: 'View Commendations', icon: Trophy, action: 'view_commendations', isCanon: true },
    { id: 'network-stats', label: 'Network Stats', icon: Network, action: 'network_stats', isCanon: true },
    { id: 'community-rank', label: 'Community Rank', icon: Crown, action: 'community_rank', isCanon: false },
    { id: 'daily-boost', label: 'Claim Daily Boost', icon: Gift, action: 'daily_boost', isCanon: false },
    { id: 'prestige-goals', label: 'Prestige Goals', icon: TrendingUp, action: 'prestige_goals', isCanon: false },
  ],
  // Clip 3: Settings
  [
    { id: 'settings', label: 'Annette Settings', icon: Settings, action: 'annette_settings', isCanon: true },
    { id: 'credits', label: 'Credits Left', icon: CreditCard, action: 'check_credits', isCanon: true },
    { id: 'help', label: 'Help', icon: HelpCircle, action: 'show_help', isCanon: true },
    { id: 'unlock-features', label: 'Unlock Features', icon: Unlock, action: 'unlock_features', isCanon: false },
    { id: 'language', label: 'Language Preference', icon: Globe, action: 'language_settings', isCanon: false },
  ]
];

export const AnnetteRevollver: React.FC<AnnetteRevollverProps> = ({
  isOpen,
  onClose,
  onCommandSelect,
  className
}) => {
  const [currentClip, setCurrentClip] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    spinClip();
  };

  const spinClip = () => {
    setCurrentClip((prev) => (prev + 1) % clips.length);
    // Voice line on spin
    console.log("🎯 Annette: Spinning the clip... ready for your next move?");
  };

  const handleCommandClick = (command: Command) => {
    onCommandSelect(command.action, command.context);
    onClose();
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentCommands = clips[currentClip];
  const radius = 120;
  const angleStep = (2 * Math.PI) / currentCommands.length;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center",
        className
      )}
      onClick={handleBackgroundClick}
      onContextMenu={handleRightClick}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in" />
      
      {/* Central Annette Avatar */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg flex items-center justify-center border-4 border-white/20">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        
        {/* Clip indicator */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white font-medium">
            Clip {currentClip + 1}/3
          </div>
        </div>

        {/* Command Options */}
        {currentCommands.map((command, index) => {
          const angle = index * angleStep - Math.PI / 2; // Start from top
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <div
              key={command.id}
              className={cn(
                "absolute group cursor-pointer transition-all duration-300",
                isAnimating ? "animate-scale-in" : "",
                "hover:scale-110"
              )}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${index * 50}ms`
              }}
              onClick={() => handleCommandClick(command)}
            >
              {/* Command Icon */}
              <div className={cn(
                "w-12 h-12 rounded-full backdrop-blur-md shadow-lg flex items-center justify-center border transition-all duration-200",
                command.isCanon 
                  ? "bg-white/10 border-white/20 group-hover:bg-white/20 group-hover:border-white/40 group-hover:shadow-primary/20" 
                  : "bg-white/5 border-white/10 group-hover:bg-white/15 group-hover:border-white/30 animate-pulse"
              )}>
                <command.icon className={cn(
                  "w-6 h-6 transition-colors duration-200",
                  command.isCanon ? "text-white" : "text-white/70"
                )} />
                {/* Canon verification glow */}
                {command.isCanon && (
                  <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
                {/* Non-canon shimmer indicator */}
                {!command.isCanon && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 text-white/50">
                    💭
                  </div>
                )}
              </div>
              
              {/* Command Label with Canon indicator */}
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-black/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-white font-medium whitespace-nowrap">
                  {command.label}
                  <div className={cn(
                    "text-xs mt-1",
                    command.isCanon ? "text-green-400" : "text-yellow-400"
                  )}>
                    {command.isCanon ? "Based on your usage history" : "AI-generated suggestion — not Canon"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-white/80 text-center">
          Right-click to spin the clip • Click outside to close
        </div>
      </div>
    </div>
  );
};

export default AnnetteRevollver;