import React, { useState, useEffect } from 'react';
import { 
  Compass, FileText, Star, Users, MapPin, Clock,
  Radio, Bookmark, Users2, Search, MessageSquare, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createCanonMetadata, getCanonEnhancedVoiceLine, logCanonEntry, type CanonMetadata } from '@/utils/canonHelper';
import { useBroadcastConsent } from '@/hooks/useBroadcastConsent';
import { useEchoBroadcast } from '@/hooks/useEchoBroadcast';
import BroadcastConsentModal from '@/components/broadcast/BroadcastConsentModal';
import { EchoBroadcastModal } from '@/components/canon/EchoBroadcastModal';

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
  canonMetadata?: CanonMetadata;
}

// 🧠 CLIP DECK: 1st Cylinder — Core Actions
const cylinder1: ClipAction[] = [
  {
    id: 'parse-ticket',
    icon: FileText,
    label: 'Parse Ticket',
    voiceLine: "Mmm… juicy. Let's dissect this one.",
    action: 'parse_ticket'
  },
  {
    id: 'optimize-route',
    icon: Compass,
    label: 'Optimize Route',
    voiceLine: "Let's get strategic, sugar. Optimizing your steps!",
    action: 'optimize_route'
  },
  {
    id: 'check-prestige',
    icon: Star,
    label: 'Check Prestige',
    voiceLine: "Flex check: incoming. ✨ You're climbing like a boss!",
    action: 'check_prestige'
  },
  {
    id: 'job-radar',
    icon: MapPin,
    label: 'Job Radar',
    voiceLine: "Ping ping. Canon says these are worth a peek.",
    action: 'job_radar'
  },
  {
    id: 'time-machine',
    icon: Clock,
    label: 'Time Machine',
    voiceLine: "Here's your time trail. You've been busy, haven't you?",
    action: 'time_machine'
  },
  {
    id: 'canon-log',
    icon: Shield,
    label: 'Canon Log',
    voiceLine: "Want the truth, the whole truth, and nothing but Canon?",
    action: 'canon_log'
  }
];

// 🤝 CLIP DECK: 2nd Cylinder — Community & Connections
const cylinder2: ClipAction[] = [
  {
    id: 'top-connections',
    icon: Users,
    label: 'Top Connections',
    voiceLine: "These folks adore you. And honestly, same.",
    action: 'top_connections'
  },
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
  
  // Broadcast consent functionality
  const {
    showConsentModal,
    pendingBroadcast,
    requestBroadcastConsent,
    handleConsent,
    closeConsentModal
  } = useBroadcastConsent();

  // Echo broadcast functionality
  const {
    showBroadcastModal,
    pendingBroadcast: pendingEcho,
    requestEchoBroadcast,
    handleBroadcastConfirm,
    closeBroadcastModal
  } = useEchoBroadcast();

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

  const handleClipClick = async (clip: ClipAction) => {
    // Create Canon metadata for this action
    const sourceData = { 
      fromDatabase: ['top_connections', 'check_prestige', 'loyalty_stats'].includes(clip.action),
      verified_data: true 
    };
    const canonMetadata = createCanonMetadata(clip.action, sourceData);
    
    // Enhance voice line with Canon context
    const enhancedVoiceLine = getCanonEnhancedVoiceLine(
      clip.voiceLine, 
      canonMetadata,
      // Mock specific data - in real implementation, this would come from actual queries
      { topClient: 'Maria G.', earnedCount: 3, loyalClients: 'Your top 5', radius: '5km' }
    );
    
    console.log(`🎤 Annette (${canonMetadata.trust}): "${enhancedVoiceLine}"`);
    
    // Log the Canon entry
    await logCanonEntry(canonMetadata, enhancedVoiceLine);
    
    // Request Echo broadcast for Canon achievements
    if (canonMetadata.trust === 'canon' && ['check_prestige', 'top_connections', 'loyalty_stats', 'view_stamps'].includes(clip.action)) {
      const sourceMap = {
        'check_prestige': 'prestige' as const,
        'top_connections': 'job' as const,
        'loyalty_stats': 'job' as const,
        'view_stamps': 'stamp' as const
      };
      
      requestEchoBroadcast(enhancedVoiceLine, canonMetadata, {
        source: sourceMap[clip.action as keyof typeof sourceMap] || 'custom',
        suggestedLocation: clip.action === 'check_prestige' ? 'profile' : 'city-board'
      });
    }
    
    // Auto-launch Annette bubble with enhanced context
    onCommandSelect(clip.action, { 
      voiceLine: enhancedVoiceLine,
      originalVoiceLine: clip.voiceLine,
      label: clip.label,
      clipId: clip.id,
      canonMetadata
    });
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
        {/* Central Avatar with dynamic glow */}
        <div className={cn(
          "w-20 h-20 rounded-full shadow-2xl",
          "flex items-center justify-center border-4 border-white/30 relative z-10",
          "transition-all duration-300",
          // Dynamic cylinder theming
          currentCylinder === 0 
            ? "bg-gradient-to-br from-orange-400 to-orange-600" 
            : "bg-gradient-to-br from-purple-400 to-blue-600",
          isAnimating && "animate-pulse scale-110"
        )}>
          <img 
            src="/lovable-uploads/7e58a112-189a-4048-9103-cd1a291fa6a5.png" 
            alt="Annette"
            className="w-14 h-14 rounded-full object-cover"
          />
          
          {/* Optional glow effect when active */}
          <div className={cn(
            "absolute inset-0 rounded-full opacity-30 animate-pulse",
            currentCylinder === 0 
              ? "bg-orange-400/40" 
              : "bg-purple-400/40"
          )} />
        </div>
        
        {/* Cylinder indicator with theme */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <div className={cn(
            "backdrop-blur-sm rounded-full px-4 py-2 text-white font-medium text-sm transition-all duration-300",
            currentCylinder === 0 
              ? "bg-orange-500/80" 
              : "bg-purple-500/80"
          )}>
            {currentCylinder === 0 ? "🧠 Core Actions" : "🤝 Community"} ({currentCylinder + 1}/2)
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
                // Dynamic hover glow based on cylinder
                currentCylinder === 0 
                  ? "hover:shadow-2xl hover:shadow-orange-500/20" 
                  : "hover:shadow-2xl hover:shadow-purple-500/20",
                isHovered && cn(
                  "bg-white/30 border-white/60 shadow-2xl",
                  currentCylinder === 0 
                    ? "shadow-orange-500/30" 
                    : "shadow-purple-500/30"
                )
              )}>
                <clip.icon className={cn(
                  "w-7 h-7 transition-all duration-200",
                  "text-white",
                  isHovered && "text-orange-100 scale-110"
                )} />
                
                {/* Dynamic glow effect on hover */}
                {isHovered && (
                  <div className={cn(
                    "absolute inset-0 rounded-full animate-pulse",
                    currentCylinder === 0 
                      ? "bg-orange-400/20" 
                      : "bg-purple-400/20"
                  )} />
                )}
              </div>
              
              {/* Clip Label with Voice Line Preview */}
              {isHovered && (
                <div className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 animate-fade-in pointer-events-none z-30">
                  <div className="bg-black/90 backdrop-blur-sm rounded-lg px-4 py-3 text-white text-center shadow-2xl border border-white/20 min-w-[200px]">
                    <div className={cn(
                      "font-bold text-sm mb-1",
                      currentCylinder === 0 ? "text-orange-300" : "text-purple-300"
                    )}>
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

      {/* Broadcast Consent Modal */}
      {pendingBroadcast && (
        <BroadcastConsentModal
          isOpen={showConsentModal}
          onClose={closeConsentModal}
          onConsent={handleConsent}
          eventType={pendingBroadcast.eventType}
          content={pendingBroadcast.content}
          canonLevel={pendingBroadcast.canonMetadata.trust}
        />
      )}

      {/* Echo Broadcast Modal */}
      {pendingEcho && (
        <EchoBroadcastModal
          isOpen={showBroadcastModal}
          onClose={closeBroadcastModal}
          onConfirm={handleBroadcastConfirm}
          message={pendingEcho.message}
          canonMetadata={pendingEcho.canonMetadata}
          suggestedLocation={pendingEcho.suggestedLocation}
        />
      )}
    </div>
  );
};

export default AnnetteRevollver;