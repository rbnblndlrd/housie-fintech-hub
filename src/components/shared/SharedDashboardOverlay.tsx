import React from 'react';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { RevolverMenu } from '@/components/chat/RevolverMenu';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { useAuth } from '@/contexts/AuthContext';

export const SharedDashboardOverlay: React.FC = () => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();

  // Don't render if user isn't authenticated
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Annette BubbleChat - positioned bottom-left */}
      <ChatBubble 
        defaultTab="ai"
        showMicIcon={false}
      />
      
      {/* RevolverMenu - positioned bottom-right */}
      <RevolverMenu />
    </>
  );
};