import React, { useState, useEffect } from 'react';
import { AnnetteAvatar } from './AnnetteAvatar';
import { AnnetteBubbleChat } from './AnnetteBubbleChat';
import { toast } from 'sonner';

export const AnnetteIntegration: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasShownIntro, setHasShownIntro] = useState(false);

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

  const handleAvatarClick = () => {
    setIsChatOpen(true);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      <AnnetteAvatar 
        onClick={handleAvatarClick}
        isActive={isChatOpen}
      />
      <AnnetteBubbleChat 
        isOpen={isChatOpen}
        onClose={handleChatClose}
      />
    </>
  );
};

// Helper function to trigger Annette responses from other components
export const triggerAnnetteAction = (action: string, context?: any) => {
  const responses = {
    parse_ticket: "I'll analyze this ticket for you! This appears to be a high-priority job that should be scheduled within 24 hours.",
    optimize_route: "Optimizing your route... I found 3 improvements that could save you 45 minutes and 12km!",
    schedule_job: "Opening calendar assistant... I recommend the 2:00 PM slot based on optimal travel time.",
    lookup_achievement: "You're at Technomancer ⚡ level! You're 13 jobs away from reaching 'Crownbreaker' status.",
    recommend_provider: "I found 2 great providers near you: Alex Thompson (electrical) and Marie Claire (cleaning).",
    rebook_reminder: "Perfect timing! Marie Dubois is due for her regular service. Should I send her a reminder?",
    start_gps: "Starting GPS navigation to your first stop... I'll guide you through the optimal route to save time and fuel!"
  };

  const response = responses[action as keyof typeof responses] || "Task completed! How else can I help?";
  
  toast("🤖 Annette says:", {
    description: response,
    duration: 4000
  });
};