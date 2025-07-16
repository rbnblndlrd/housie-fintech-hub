import React, { useState, useEffect } from 'react';
import { AnnetteAvatar } from './AnnetteAvatar';
import { AnnetteBubbleChat } from './AnnetteBubbleChat';
import { AnnetteRevollver } from './AnnetteRevollver';
import { toast } from 'sonner';
import { useAnnetteDataQueries } from '@/hooks/useAnnetteDataQueries';
import { getCanonContext, generateContextAwareResponse, generateContextAwareResponseSync, type UserContext } from '@/utils/contextAwareEngine';

export const AnnetteIntegration: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRevollverOpen, setIsRevollverOpen] = useState(false);
  const [hasShownIntro, setHasShownIntro] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  
  // DEBUG MODE: Temporarily enabled to fix visibility issue
  const isDevelopment = true; // Force enable for debugging
  const [debugMode, setDebugMode] = useState(true);
  const [showRevollverDebug, setShowRevollverDebug] = useState(false);
  
  // Initialize data queries for real-time responses
  const { parseTicket, optimizeRoute, checkPrestige, recommendProvider, checkRebookingSuggestions } = useAnnetteDataQueries();

  useEffect(() => {
    // Load user context on mount
    const loadUserContext = async () => {
      try {
        const context = await getCanonContext();
        setUserContext(context);
      } catch (error) {
        console.error('Error loading user context:', error);
      }
    };
    
    loadUserContext();
    
    // Show onboarding intro on first load
    if (!hasShownIntro) {
      setTimeout(() => {
        toast("👋 Hi! I'm Annette, your HOUSIE AI assistant", {
          description: "I can help with ticket parsing, route optimization, and more. Click my avatar to chat!",
          duration: 5000
        });
        setHasShownIntro(true);
      }, 2000);
    }
  }, [hasShownIntro]);

  useEffect(() => {
    // Register for new message notifications
    const handleNewMessage = () => {
      if (!isChatOpen) {
        setHasNewMessage(true);
      }
    };

    // Listen for platform events that trigger Annette responses
    const originalEventBus = annetteEventBus;
    const enhancedEventBus = (action: string, context?: any) => {
      handleNewMessage();
      if (originalEventBus) {
        originalEventBus(action, context);
      }
    };

    annetteEventBus = enhancedEventBus;

    return () => {
      annetteEventBus = originalEventBus;
    };
  }, [isChatOpen]);

  const handleAvatarClick = (e?: React.MouseEvent) => {
    if (e?.type === 'contextmenu') {
      // Right-click opens Revollver
      e.preventDefault();
      setIsRevollverOpen(true);
      setIsChatOpen(false); // Close chat if open
    } else if (e?.shiftKey || e?.ctrlKey) {
      // Shift+click or Ctrl+click also opens Revollver (alternative)
      setIsRevollverOpen(!isRevollverOpen);
      setIsChatOpen(false);
    } else {
      // Regular click opens chat (but also toggles Revollver if chat is already open)
      if (isChatOpen) {
        setIsRevollverOpen(!isRevollverOpen);
      } else {
        setIsChatOpen(true);
        setIsRevollverOpen(false);
      }
      setHasNewMessage(false);
    }
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  const handleRevollverCommand = async (command: string, context?: any) => {
    // Close Revollver and auto-launch chat
    setIsRevollverOpen(false);
    setIsChatOpen(true);
    setHasNewMessage(false);
    
    // Trigger the action with enhanced context
    await triggerAnnetteAction(command, {
      ...context,
      fromRevollver: true,
      autoLaunched: true
    });
  };

  const handleRevollverClose = () => {
    setIsRevollverOpen(false);
    setShowRevollverDebug(false);
  };

  // Debug effect to log states
  useEffect(() => {
    if (debugMode) {
      console.log('🐛 ANNETTE DEBUG:', {
        isRevollverOpen,
        showRevollverDebug,
        isChatOpen,
        hasNewMessage
      });
    }
  }, [isRevollverOpen, showRevollverDebug, isChatOpen, hasNewMessage, debugMode]);

  return (
    <>
      {/* Debug Controls - Only in Development */}
      {isDevelopment && debugMode && (
        <div className="fixed top-4 right-4 z-[200] bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-xs space-y-2">
          <div className="font-bold text-orange-400">🔧 ANNETTE DEBUG</div>
          <div>Revollver Open: {isRevollverOpen ? '✅' : '❌'}</div>
          <div>Chat Open: {isChatOpen ? '✅' : '❌'}</div>
          <div>
            <button 
              onClick={() => setShowRevollverDebug(!showRevollverDebug)}
              className="bg-orange-500 hover:bg-orange-600 px-2 py-1 rounded text-xs"
            >
              {showRevollverDebug ? 'Hide' : 'Show'} Debug Revollver
            </button>
          </div>
          <div>
            <button 
              onClick={() => setIsRevollverOpen(!isRevollverOpen)}
              className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-xs"
            >
              Toggle Real Revollver
            </button>
          </div>
          <div>
            <button 
              onClick={() => setDebugMode(false)}
              className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-xs"
            >
              Disable Debug
            </button>
          </div>
        </div>
      )}

      {/* Debug Status Indicator - Only in Development */}
      {isDevelopment && debugMode && (
        <div className="fixed bottom-20 right-5 z-[60] bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          Revollver is mounted! {isRevollverOpen || showRevollverDebug ? '🎯' : '💤'}
        </div>
      )}

      <AnnetteAvatar 
        onClick={handleAvatarClick}
        isActive={isChatOpen || isRevollverOpen}
        hasNewMessage={hasNewMessage}
      />
      <AnnetteBubbleChat 
        isOpen={isChatOpen}
        onClose={handleChatClose}
      />
      
      {/* Main Revollver */}
      <AnnetteRevollver
        isOpen={isRevollverOpen}
        onClose={handleRevollverClose}
        onCommandSelect={handleRevollverCommand}
        userContext={userContext}
      />
      
      {/* Debug Force-Rendered Revollver - Only in Development */}
      {isDevelopment && debugMode && showRevollverDebug && (
        <AnnetteRevollver
          isOpen={true}
          onClose={handleRevollverClose}
          onCommandSelect={handleRevollverCommand}
          userContext={userContext}
          className="border-4 border-red-500/50"
        />
      )}
    </>
  );
};

// Event bus for Annette responses
let annetteEventBus: ((action: string, context?: any) => void) | null = null;

export const registerAnnetteEventBus = (handler: (action: string, context?: any) => void) => {
  annetteEventBus = handler;
};

// Enhanced helper function with real data integration and context awareness
export const triggerAnnetteAction = async (action: string, context?: any) => {
  let response: string;
  
  try {
    // Check if we have context-aware response available
    if (context?.voiceLine) {
      response = context.voiceLine;
    } else {
      // Fallback to static responses
      const responses = {
      // 🧠 1st Cylinder — Core Actions
      parse_ticket: "Mmm… juicy. Let's dissect this one. *analyzing ticket data* Priority detected, details loaded. This one's got potential! 📋",
      optimize_route: "Let's get strategic, sugar. Optimizing your steps! *route optimization activated* Efficiency just got a whole lot sexier! 🗺️",
      check_prestige: "Flex check: incoming. ✨ You're climbing like a boss! *scanning prestige metrics* Those achievements are looking absolutely gorgeous! ⭐",
      job_radar: "Ping ping. Verified opportunities detected. *scanning nearby jobs* Fresh positions in your radius! 📍",
      time_machine: "Here's your time trail. You've been busy, haven't you? *loading performance history* Your productivity graph is looking stellar! ⏰",
      canon_log: "That one's going in the vault, sugar. Stamped, sealed… Canonical. *accessing verified entries* Every record here is gospel truth! 🔐",
      view_storylines: "Looks like someone just linked another truth in their chain... *accessing storyline data* Your narrative is taking shape beautifully! 📜",
      storyline_progress: "Stamped and woven. This story's going places, sugar! *analyzing storyline progression* Every chapter verified! ✨",
      
      // 🤝 2nd Cylinder — Community & Connections
      top_connections: "These folks adore you. And honestly, same. *analyzing repeat client data* Your VIP list is looking absolutely gorgeous! 👥",
      city_broadcast: "Here's what's echoing across town... *accessing city broadcast feed* The pulse of the city, delivered fresh! 📡",
      view_stamps: "Look at all that recognition, darling. *loading achievement stamps* Your reputation is literally stamped with approval! 🔖",
      loyalty_stats: "Faithful ones come back fast — here's proof. *analyzing loyalty patterns* These numbers tell a beautiful story! 🫂",
      map_history: "Let's retrace those glorious steps. *loading footprint analysis* Every move mapped, every achievement tracked! 🔎",
      read_reviews: "What do the people say? Let's eavesdrop. *scanning review database* The verdict is in, and it's looking good! 💬",
      
      // Legacy actions (backwards compatibility)
      view_bookings: "Calendar wizard mode engaged! Time slots analyzed, preferences noted. Pop into chat and ask me about your best scheduling options! 📅",
      rebooking_suggestions: "Rebook radar is pinging! I see patterns in your booking history. Want me to suggest your next move? 📞",
      view_commendations: "Trophy case time! Your commendations are stacking up beautifully. Someone's been earning their respect! 🏆",
      view_crew: "Squad check! Your crew's looking solid. These are the people who've got your back in the game! 👥",
      community_rank: "Rank scanner activated! You're climbing the leaderboard like a boss. Check your standing! 👑",
      network_stats: "Network analysis complete! Your connections are growing strong. Quality over quantity, as always! 📊",
      daily_boost: "Daily boost claimed! Your grind just got a little extra juice. Keep that momentum rolling! ⚡",
      prestige_goals: "Goal tracker loaded! Your next milestone is within reach. Time to make it happen! 🎯",
      annette_settings: "Settings panel activated! Time to fine-tune this gorgeous AI experience. What needs adjusting? ⚙️",
      check_credits: "Credit check complete! Your balance is looking good for more AI adventures. Spend wisely! 💳",
      unlock_features: "Feature unlock scanner engaged! Ready to level up your HOUSIE experience? Let's see what's available! 🔓",
      language_settings: "Language preference center! Because I speak fluent sass in multiple languages! 🌍",
      show_help: "Help mode activated! I'm here to guide you through everything. What's got you puzzled? 💡"
    };

      response = responses[action as keyof typeof responses] || "Task completed! How else can I help?";
    }
  } catch (error) {
    console.error('Error in triggerAnnetteAction:', error);
    response = context?.voiceLine || "Something went sideways, but I'm still here for you! Try asking me directly in chat. 💪";
  }
  
  // Use event bus if available (for BubbleChat integration)
  if (annetteEventBus) {
    annetteEventBus(action, { 
      response, 
      context,
      voiceLine: context?.voiceLine || response,
      canonMetadata: context?.canonMetadata,
      contextTags: context?.contextTags,
      fromRevollver: context?.fromRevollver
    });
  } else {
    // Fallback to toast
    toast("🤖 Annette says:", {
      description: response,
      duration: 4000
    });
  }
};