
import React, { useState, useEffect } from 'react';
import MessagesTab from './MessagesTab';
import ClaudeConversation from './ClaudeConversation';
import CreditsWidget from '@/components/credits/CreditsWidget';
import { useAuth } from '@/contexts/AuthContext';

interface ChatPanelProps {
  activeTab?: 'messages' | 'ai';
  onPopArtTrigger?: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ 
  activeTab: externalActiveTab, 
  onPopArtTrigger 
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(externalActiveTab || 'messages');
  const [claudeSessionId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    if (externalActiveTab) {
      setActiveTab(externalActiveTab);
    }
  }, [externalActiveTab]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Credits Widget - Only show for AI tab */}
      {user && activeTab === 'ai' && (
        <div className="p-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-850">
          <CreditsWidget compact />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'messages' ? (
          <MessagesTab />
        ) : (
          <ClaudeConversation 
            sessionId={claudeSessionId}
            onPopArtTrigger={onPopArtTrigger}
          />
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
