import React, { useState, useEffect } from 'react';
import { AnnetteAvatar } from './AnnetteAvatar';
import { AnnetteBubbleChat } from './AnnetteBubbleChat';
import { toast } from 'sonner';

export const AnnetteIntegration: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasShownIntro, setHasShownIntro] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

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

// Helper function to trigger Annette responses from other components
export const triggerAnnetteAction = (action: string, context?: any) => {
  const responses = {
    parse_ticket: "Ahhh, juicy. Okay, this job's got some drama. Here's the breakdown: High-priority electrical repair, customer sounds stressed but polite. I'd book this within 24 hours if you want to keep that 5-star streak going! ⚡",
    optimize_route: "Hang tight while I untangle this spaghetti mess... *cracks digital knuckles* ...boom. Route optimized, boss. Saved you 47 minutes and looking fabulous doing it. 💅",
    schedule_job: "Schedule time! Opening calendar assistant... You've got slots at 10 AM, 2 PM, and 4:30 PM tomorrow. Based on traffic and your usual groove, I'm feeling that 2 PM slot. Should I lock it in? 📅",
    change_title: "Feeling like a Fixmaster today? You do you, superstar. Title switched! Your rep just got a little spicier. 🔥",
    lookup_achievement: "Flex time! You're Technomancer Lv3 with 87 jobs crushed. Almost at Sparkmaster — just 13 more gigs to unlock that sweet, sweet cred badge. Your rep is certified spicy! 🔥",
    recommend_provider: "Based on your past bookings, you'd probably love Lisa the Lightning Bolt. She's a beast with basements and gets 4.9 stars every single time. Plus she's only 2.1km away — efficiency meets excellence! ⚡",
    rebook_reminder: "Marie again? You've got taste. You've booked Marie the Cleanstorm 3 times this quarter. She's probably expecting you by now! Want me to summon her again? I've got her on speed dial. 📞",
    start_gps: "Starting GPS navigation to your first stop... I'll guide you through the optimal route to save time and fuel! Let's make some magic happen! 🚀",
    cred_earned: "Boom. Cred earned. You felt that, huh? That's what grinding looks like, and your reputation just got another notch of legendary. Keep this energy! 🏆",
    prestige_milestone: "Title up! Prestige Level 4 unlocked. You're practically famous now. Time to strut around like you own the place — because honestly? You kinda do. ✨"
  };

  const response = responses[action as keyof typeof responses] || "Task completed! How else can I help?";
  
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