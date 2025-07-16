import React from 'react';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { RevolverMenu } from '@/components/chat/RevolverMenu';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

export const SharedDashboardOverlay: React.FC = () => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();
  const location = useLocation();

  // Don't render if user isn't authenticated
  if (!user) {
    return null;
  }

  // Check if we're on provider dashboard (which has sidebar)
  const isProviderDashboard = location.pathname === '/dashboard';

  return (
    <>
      {/* Annette BubbleChat - only render on customer dashboard, not provider dashboard */}
      {!isProviderDashboard && (
        <div className="fixed z-50 bottom-6 left-6">
          <ChatBubble 
            defaultTab="ai"
            showMicIcon={false}
          />
        </div>
      )}
      
      {/* RevolverMenu - positioned bottom-right with higher z-index */}
      <div className="fixed bottom-6 right-6 z-50">
        <RevolverMenu />
      </div>
    </>
  );
};