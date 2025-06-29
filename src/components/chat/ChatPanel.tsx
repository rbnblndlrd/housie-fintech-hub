
import React, { useState, useEffect } from 'react';
import MessagesTab from './MessagesTab';
import ClaudeConversation from './ClaudeConversation';
import AIVoiceInterface from './AIVoiceInterface';
import CreditsWidget from '@/components/credits/CreditsWidget';
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
  const [activeTab, setActiveTab] = useState(externalActiveTab || 'ai');
  const [claudeSessionId] = useState(() => crypto.randomUUID());

  console.log('💬 ChatPanel render:', { hasUser: !!user, currentRole, activeTab });

  // Determine user's subscription tier
  const userTier = user?.user_metadata?.subscription_tier || 'free'; // 'free', 'starter', 'pro', etc.
  const isAuthenticated = !!user;
  const hasVoiceAccess = isAuthenticated && userTier !== 'free'; // Starter+ users get voice
  const hasMessagesAccess = isAuthenticated; // Only authenticated users get messages
  const hasClaudeAccess = isAuthenticated && userTier !== 'free'; // Starter+ users get Claude

  // For now, we'll determine fleet mode based on provider role
  const isFleetMode = currentRole === 'provider';

  useEffect(() => {
    if (externalActiveTab) {
      // Validate the tab is available for this user
      if (externalActiveTab === 'voice' && !hasVoiceAccess) {
        setActiveTab('ai');
      } else if (externalActiveTab === 'messages' && !hasMessagesAccess) {
        setActiveTab('ai');
      } else {
        setActiveTab(externalActiveTab);
      }
    }
  }, [externalActiveTab, hasVoiceAccess, hasMessagesAccess]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Credits Widget - Only show for AI tabs and authenticated users */}
      {user && (activeTab === 'ai' || activeTab === 'voice') && (
        <div className="p-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-850">
          <CreditsWidget compact />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'messages' && hasMessagesAccess && <MessagesTab />}
        {activeTab === 'ai' && (
          <ClaudeConversation 
            sessionId={claudeSessionId}
            useWebLLM={!hasClaudeAccess}
          />
        )}
        {activeTab === 'voice' && hasVoiceAccess && <AIVoiceInterface isFleetMode={isFleetMode} />}
      </div>
    </div>
  );
};

export default ChatPanel;
