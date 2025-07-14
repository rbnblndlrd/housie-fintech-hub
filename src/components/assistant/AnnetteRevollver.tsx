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
}

const clips: Command[][] = [
  // Clip 1: Core Assistant Tools
  [
    { id: 'parse-ticket', label: 'Parse Ticket', icon: MapPin, action: 'parse_ticket' },
    { id: 'optimize-route', label: 'Optimize Route', icon: Route, action: 'optimize_route' },
    { id: 'check-prestige', label: 'Check My Prestige', icon: Trophy, action: 'check_prestige' },
    { id: 'todays-map', label: "Today's Map", icon: MapPin, action: 'show_map' },
    { id: 'view-bookings', label: 'View Bookings', icon: Calendar, action: 'view_bookings' },
    { id: 'rebooking', label: 'Rebooking Suggestions', icon: RefreshCw, action: 'rebooking_suggestions' },
  ],
  // Clip 2: Community / Social
  [
    { id: 'commendations', label: 'View Commendations', icon: Trophy, action: 'view_commendations' },
    { id: 'my-crew', label: 'My Crew', icon: Users, action: 'view_crew' },
    { id: 'community-rank', label: 'Community Rank', icon: Crown, action: 'community_rank' },
    { id: 'network-stats', label: 'Network Stats', icon: Network, action: 'network_stats' },
    { id: 'daily-boost', label: 'Claim Daily Boost', icon: Gift, action: 'daily_boost' },
    { id: 'prestige-goals', label: 'Prestige Goals', icon: TrendingUp, action: 'prestige_goals' },
  ],
  // Clip 3: Settings & Meta
  [
    { id: 'settings', label: 'Annette Settings', icon: Settings, action: 'annette_settings' },
    { id: 'credits', label: 'Credits Left', icon: CreditCard, action: 'check_credits' },
    { id: 'unlock-features', label: 'Unlock Features', icon: Unlock, action: 'unlock_features' },
    { id: 'language', label: 'Language Preference', icon: Globe, action: 'language_settings' },
    { id: 'help', label: 'Help', icon: HelpCircle, action: 'show_help' },
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
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
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
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md shadow-lg flex items-center justify-center border border-white/20 group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-200">
                <command.icon className="w-6 h-6 text-white" />
              </div>
              
              {/* Command Label */}
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-white font-medium whitespace-nowrap">
                  {command.label}
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