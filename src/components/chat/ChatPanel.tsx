
import React, { useState, useEffect } from 'react';
import MessagesTab from './MessagesTab';
import AnnetteConversation from './AnnetteConversation';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';

interface ChatPanelProps {
  activeTab?: 'messages' | 'ai' | 'voice';
}

const ChatPanel: React.FC<ChatPanelProps> = ({ 
  activeTab: externalActiveTab
}) => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();

  console.log('💬 ChatPanel render:', { hasUser: !!user, currentRole });

  // Handle different tabs based on authentication
  if (!user) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Sign in to access {externalActiveTab === 'ai' ? 'Annette' : 'messages'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {externalActiveTab === 'ai' 
              ? 'Connect with Annette, your HOUSIE AI assistant'
              : 'Connect with providers and customers through our messaging system'
            }
          </p>
        </div>
      </div>
    );
  }

  // Render based on active tab
  if (externalActiveTab === 'ai') {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-gray-900">
        <AnnetteConversation sessionId={`annette-${user.id}-${Date.now()}`} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Messages Content */}
      <div className="flex-1 overflow-hidden">
        <MessagesTab />
      </div>
    </div>
  );
};

export default ChatPanel;
