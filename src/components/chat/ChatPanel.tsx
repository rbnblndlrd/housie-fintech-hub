
import React, { useState, useEffect } from 'react';
import MessagesTab from './MessagesTab';
import ClaudeConversation from './ClaudeConversation';
import AIVoiceInterface from './AIVoiceInterface';
import CreditsWidget from '@/components/credits/CreditsWidget';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';

interface ChatPanelProps {
  activeTab?: 'messages' | 'ai' | 'voice';
  onPopArtTrigger?: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ 
  activeTab: externalActiveTab, 
  onPopArtTrigger 
}) => {
  const { user } = useAuth();
  const { currentRole } = useRole();
  const [activeTab, setActiveTab] = useState(externalActiveTab || 'messages');
  const [claudeSessionId] = useState(() => crypto.randomUUID());

  // For now, we'll determine fleet mode based on provider role
  // This can be extended later with additional logic if needed
  const isFleetMode = currentRole === 'provider'; // Assuming providers can access fleet features

  useEffect(() => {
    if (externalActiveTab) {
      setActiveTab(externalActiveTab);
    }
  }, [externalActiveTab]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Credits Widget - Only show for AI tabs */}
      {user && (activeTab === 'ai' || activeTab === 'voice') && (
        <div className="p-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-850">
          <CreditsWidget compact />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'messages' && <MessagesTab />}
        {activeTab === 'ai' && (
          <ClaudeConversation 
            sessionId={claudeSessionId}
            onPopArtTrigger={onPopArtTrigger}
          />
        )}
        {activeTab === 'voice' && <AIVoiceInterface isFleetMode={isFleetMode} />}
      </div>
    </div>
  );
};

export default ChatPanel;
