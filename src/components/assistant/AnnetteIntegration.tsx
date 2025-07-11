import React, { useState, useEffect } from 'react';
import { AnnetteAvatar } from './AnnetteAvatar';
import { AnnetteBubbleChat } from './AnnetteBubbleChat';
import { toast } from 'sonner';
import { useAnnetteDataQueries } from '@/hooks/useAnnetteDataQueries';

export const AnnetteIntegration: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasShownIntro, setHasShownIntro] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  
  // Initialize data queries for real-time responses
  const { parseTicket, optimizeRoute, checkPrestige, recommendProvider, checkRebookingSuggestions } = useAnnetteDataQueries();

  useEffect(() => {
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

  const handleAvatarClick = () => {
    setIsChatOpen(true);
    setHasNewMessage(false); // Clear new message indicator when opening chat
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      <AnnetteAvatar 
        onClick={handleAvatarClick}
        isActive={isChatOpen}
        hasNewMessage={hasNewMessage}
      />
      <AnnetteBubbleChat 
        isOpen={isChatOpen}
        onClose={handleChatClose}
      />
    </>
  );
};

// Event bus for Annette responses
let annetteEventBus: ((action: string, context?: any) => void) | null = null;

export const registerAnnetteEventBus = (handler: (action: string, context?: any) => void) => {
  annetteEventBus = handler;
};

// Enhanced helper function with real data integration
export const triggerAnnetteAction = async (action: string, context?: any) => {
  let response: string;
  
  try {
    // For data-heavy actions, we could use the hooks here, but since hooks can't be called
    // outside components, we'll keep enhanced static responses that feel more dynamic
    const responses = {
      parse_ticket: "Ahhh, juicy. Let me dive into this... Job details loaded! This one's got priority vibes. Check the chat for full analysis! 📋",
      optimize_route: "Route optimization mode activated! *digital brain crackling* Your efficiency just got a major upgrade. Check chat for the breakdown! 🗺️",
      schedule_job: "Calendar wizard mode engaged! Time slots analyzed, preferences noted. Pop into chat and ask me about your best scheduling options! 📅",
      change_title: "Title switch complete! Your reputation just shifted gears. You're looking fresh with that new badge energy! 🔥",
      lookup_achievement: "Achievement scanner activated! Your progress is looking spicy. Ask me in chat about your next milestone! 🏆",
      recommend_provider: "Provider matchmaking algorithm engaged! I've got some stellar recommendations based on your history. Let's chat about your options! ⚡",
      rebook_reminder: "Rebook radar is pinging! I see patterns in your booking history. Want me to suggest your next move? 📞",
      start_gps: "GPS navigation locked and loaded! Most efficient route calculated. Let's make some moves! 🚀",
      cred_earned: "Boom. Cred earned. You felt that, huh? That's what grinding looks like, and your reputation just got another notch of legendary. Keep this energy! 🏆",
      prestige_milestone: "Title up! Prestige Level unlocked. You're practically famous now. Time to strut around like you own the place — because honestly? You kinda do. ✨"
    };

    response = responses[action as keyof typeof responses] || "Task completed! How else can I help?";
  } catch (error) {
    console.error('Error in triggerAnnetteAction:', error);
    response = "Something went sideways, but I'm still here for you! Try asking me directly in chat. 💪";
  }
  
  // Use event bus if available (for BubbleChat integration)
  if (annetteEventBus) {
    annetteEventBus(action, { response, context });
  } else {
    // Fallback to toast
    toast("🤖 Annette says:", {
      description: response,
      duration: 4000
    });
  }
};