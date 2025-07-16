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
      {/* Annette BubbleChat - positioned bottom-left, adjusted for sidebar on provider dashboard */}
      <div 
        className={`fixed z-50 ${isProviderDashboard ? 'bottom-6 left-80' : 'bottom-6 left-6'}`}
        style={{ 
          // Ensure it doesn't get hidden behind sidebar on provider dashboard
          ...(isProviderDashboard && { left: 'calc(18rem + 1.5rem)' }) // sidebar width + margin
        }}
      >
        <ChatBubble 
          defaultTab="ai"
          showMicIcon={false}
        />
      </div>
      
      {/* RevolverMenu - positioned bottom-right */}
      <RevolverMenu />
    </>
  );
};