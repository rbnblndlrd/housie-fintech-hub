import React, { useState, useEffect } from 'react';
import { 
  Compass, FileText, Star, Users, MapPin, Clock,
  Radio, Bookmark, Users2, Search, MessageSquare, Shield,
  Settings, Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createCanonMetadata, getCanonEnhancedVoiceLine, logCanonEntry, type CanonMetadata } from '@/utils/canonHelper';
import { generateContextAwareResponse, enhanceClipWithContext, type UserContext } from '@/utils/contextAwareEngine';
import { getClipDefinition, enhancedClipDefinitions } from '@/types/clipDefinitions';
import { useBroadcastConsent } from '@/hooks/useBroadcastConsent';
import { useEchoBroadcast } from '@/hooks/useEchoBroadcast';
import { useClipPreferences } from '@/hooks/useClipPreferences';
import BroadcastConsentModal from '@/components/broadcast/BroadcastConsentModal';
import { EchoBroadcastModal } from '@/components/canon/EchoBroadcastModal';
import { ClipManagerModal } from '@/components/revollver/ClipManagerModal';

interface AnnetteRevollverProps {
  isOpen: boolean;
  onClose: () => void;
  onCommandSelect: (command: string, context?: any) => void;
  userContext?: UserContext | null;
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

const allClips = [...cylinder1, ...cylinder2];

export const AnnetteRevollver: React.FC<AnnetteRevollverProps> = ({
  isOpen,
  onClose,
  onCommandSelect,
  userContext,
  className
}) => {
  const [currentCylinder, setCurrentCylinder] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredClip, setHoveredClip] = useState<string | null>(null);
  const [showClipManager, setShowClipManager] = useState(false);
  const [showFavoriteAction, setShowFavoriteAction] = useState<string | null>(null);
  
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

  // Clip preferences functionality
  const {
    favorites,
    isLoading: preferencesLoading,
    toggleFavorite,
    updateOrder,
    isFavorited
  } = useClipPreferences();

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

  const getCylinders = () => {
    // Create custom cylinder from favorites
    const customCylinder = favorites
      .map(fav => allClips.find(clip => clip.id === fav.clip_id))
      .filter(Boolean) as ClipAction[];
    
    return [cylinder1, cylinder2, customCylinder];
  };

  const spinCylinder = () => {
    const cylinders = getCylinders();
    setCurrentCylinder((prev) => (prev + 1) % cylinders.length);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
    
    // Voice line on spin
    const cylinderNames = ["Core Actions", "Community", "Custom"];
    console.log(`🎯 Annette: Spinning to ${cylinderNames[currentCylinder]}... ready for your next move?`);
  };

  const handleClipClick = async (clip: ClipAction) => {
    let contextAwareResponse;
    
    // Use enhanced context-aware response if user context is available
    if (userContext) {
      contextAwareResponse = await generateContextAwareResponse(
        clip.action, 
        clip.voiceLine, 
        userContext, 
        clip.id // Pass clip ID for enhanced definition lookup
      );
    } else {
      // Fallback to traditional Canon system
      const sourceData = { 
        fromDatabase: ['top_connections', 'check_prestige', 'loyalty_stats'].includes(clip.action),
        verified_data: true 
      };
      const canonMetadata = createCanonMetadata(clip.action, sourceData);
      
      const enhancedVoiceLine = getCanonEnhancedVoiceLine(
        clip.voiceLine, 
        canonMetadata,
        { topClient: 'Maria G.', earnedCount: 3, loyalClients: 'Your top 5', radius: '5km' }
      );
      
      contextAwareResponse = {
        voiceLine: enhancedVoiceLine,
        canonMetadata,
        contextTags: [],
        flavorType: canonMetadata.trust
      };
    }
    
    console.log(`🎤 Annette (${contextAwareResponse.flavorType.toUpperCase()}): "${contextAwareResponse.voiceLine}"`);
    console.log(`📝 Context Tags: ${contextAwareResponse.contextTags.join(', ')}`);
    console.log(`🎯 Clip Definition: ${getClipDefinition(clip.id) ? 'Enhanced' : 'Legacy'}`);
    
    // Log the Canon entry
    await logCanonEntry(contextAwareResponse.canonMetadata, contextAwareResponse.voiceLine);
    
    // Request Echo broadcast for Canon achievements
    if (contextAwareResponse.canonMetadata.trust === 'canon' && ['check_prestige', 'top_connections', 'loyalty_stats', 'view_stamps'].includes(clip.action)) {
      const sourceMap = {
        'check_prestige': 'prestige' as const,
        'top_connections': 'job' as const,
        'loyalty_stats': 'job' as const,
        'view_stamps': 'stamp' as const
      };
      
      requestEchoBroadcast(contextAwareResponse.voiceLine, contextAwareResponse.canonMetadata, {
        source: sourceMap[clip.action as keyof typeof sourceMap] || 'custom',
        suggestedLocation: clip.action === 'check_prestige' ? 'profile' : 'city-board'
      });
    }
    
    // Auto-launch Annette bubble with enhanced context
    onCommandSelect(clip.action, { 
      voiceLine: contextAwareResponse.voiceLine,
      originalVoiceLine: clip.voiceLine,
      label: clip.label,
      clipId: clip.id,
      canonMetadata: contextAwareResponse.canonMetadata,
      contextTags: contextAwareResponse.contextTags,
      userContext,
      fromRevollver: true // Flag for enhanced integration
    });
    onClose();
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClipRightClick = (e: React.MouseEvent, clipId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShowFavoriteAction(clipId);
    setTimeout(() => setShowFavoriteAction(null), 2000);
  };

  const handleCenterClick = () => {
    if (currentCylinder === 2) {
      setShowClipManager(true);
    }
  };

  if (!isOpen) return null;

  const cylinders = getCylinders();
  const currentClips = cylinders[currentCylinder] || [];
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
        <div 
          className={cn(
            "w-20 h-20 rounded-full shadow-2xl cursor-pointer",
            "flex items-center justify-center border-4 border-white/30 relative z-10",
            "transition-all duration-300",
            // Dynamic cylinder theming
            currentCylinder === 0 
              ? "bg-gradient-to-br from-orange-400 to-orange-600" 
              : currentCylinder === 1
              ? "bg-gradient-to-br from-purple-400 to-blue-600"
              : "bg-gradient-to-br from-yellow-400 to-purple-600",
            isAnimating && "animate-pulse scale-110",
            currentCylinder === 2 && "hover:scale-105"
          )}
          onClick={handleCenterClick}
        >
          <img 
            src="/lovable-uploads/7e58a112-189a-4048-9103-cd1a291fa6a5.png" 
            alt="Annette"
            className="w-14 h-14 rounded-full object-cover"
          />
          
          {/* Settings icon for custom cylinder */}
          {currentCylinder === 2 && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Settings className="w-3 h-3 text-purple-600" />
            </div>
          )}
          
          {/* Optional glow effect when active */}
          <div className={cn(
            "absolute inset-0 rounded-full opacity-30 animate-pulse",
            currentCylinder === 0 
              ? "bg-orange-400/40" 
              : currentCylinder === 1
              ? "bg-purple-400/40"
              : "bg-yellow-400/40"
          )} />
        </div>
        
        {/* Cylinder indicator with theme */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <div className={cn(
            "backdrop-blur-sm rounded-full px-4 py-2 text-white font-medium text-sm transition-all duration-300",
            currentCylinder === 0 
              ? "bg-orange-500/80" 
              : currentCylinder === 1
              ? "bg-purple-500/80"
              : "bg-yellow-500/80"
          )}>
            {currentCylinder === 0 
              ? "🧠 Core Actions" 
              : currentCylinder === 1 
              ? "🤝 Community" 
              : `⭐️ Custom (${currentClips.length}/7)`
            } ({currentCylinder + 1}/3)
          </div>
        </div>

        {/* Empty state for custom cylinder */}
        {currentCylinder === 2 && currentClips.length === 0 && (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg px-6 py-4 text-white">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <p className="text-sm font-medium mb-1">Customize your Revollver™</p>
              <p className="text-xs text-white/80">Right-click any clip to favorite it</p>
            </div>
          </div>
        )}

        {/* Clip Actions */}
        {currentClips.map((clip, index) => {
          const angle = index * angleStep - Math.PI / 2; // Start from top
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const isHovered = hoveredClip === clip.id;
          const isFav = isFavorited(clip.id);
          const showFavAction = showFavoriteAction === clip.id;
          
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
              onContextMenu={(e) => handleClipRightClick(e, clip.id)}
            >
              {/* Clip Icon */}
              <div className={cn(
                "w-14 h-14 rounded-full backdrop-blur-md shadow-xl relative",
                "flex items-center justify-center border-2 transition-all duration-200",
                "bg-white/15 border-white/30 hover:bg-white/25 hover:border-white/50",
                // Dynamic hover glow based on cylinder
                currentCylinder === 0 
                  ? "hover:shadow-2xl hover:shadow-orange-500/20" 
                  : currentCylinder === 1
                  ? "hover:shadow-2xl hover:shadow-purple-500/20"
                  : "hover:shadow-2xl hover:shadow-yellow-500/20",
                isHovered && cn(
                  "bg-white/30 border-white/60 shadow-2xl",
                  currentCylinder === 0 
                    ? "shadow-orange-500/30" 
                    : currentCylinder === 1
                    ? "shadow-purple-500/30"
                    : "shadow-yellow-500/30"
                ),
                // Favorite glow
                isFav && "ring-2 ring-yellow-400/50 bg-yellow-100/20"
              )}>
                <clip.icon className={cn(
                  "w-7 h-7 transition-all duration-200",
                  "text-white",
                  isHovered && "text-orange-100 scale-110",
                  isFav && "text-yellow-200"
                )} />
                
                {/* Favorite star indicator */}
                {isFav && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-2 h-2 text-yellow-900 fill-current" />
                  </div>
                )}
                
                {/* Dynamic glow effect on hover */}
                {isHovered && (
                  <div className={cn(
                    "absolute inset-0 rounded-full animate-pulse",
                    currentCylinder === 0 
                      ? "bg-orange-400/20" 
                      : currentCylinder === 1
                      ? "bg-purple-400/20"
                      : "bg-yellow-400/20"
                  )} />
                )}
              </div>
              
              {/* Favorite action popup */}
              {showFavAction && (
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 animate-fade-in z-30">
                  <div 
                    className="bg-black/90 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs cursor-pointer hover:bg-black/95 transition-colors border border-yellow-400/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(clip.id);
                      setShowFavoriteAction(null);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {isFav ? (
                        <>
                          <Heart className="w-3 h-3 text-red-400" />
                          <span>Unfavorite</span>
                        </>
                      ) : (
                        <>
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span>Favorite</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
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
          Right-click to spin • Right-click clips to ⭐️ • {currentCylinder === 2 ? "Click center to manage" : "Click outside to close"}
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

      {/* Clip Manager Modal */}
      <ClipManagerModal
        isOpen={showClipManager}
        onClose={() => setShowClipManager(false)}
        favorites={favorites}
        allClips={allClips}
        onToggleFavorite={toggleFavorite}
        onUpdateOrder={updateOrder}
        isFavorited={isFavorited}
      />
    </div>
  );
};

export default AnnetteRevollver;