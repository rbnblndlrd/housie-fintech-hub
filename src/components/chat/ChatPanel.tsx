
import React, { useState } from 'react';
import MessagesTab from './MessagesTab';
import ClaudeConversation from './ClaudeConversation';
import { Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatPanelProps {
  activeTab: 'messages' | 'ai';
  onPopArtTrigger?: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ activeTab, onPopArtTrigger }) => {
  const [showAIConversation, setShowAIConversation] = useState(false);
  
  if (activeTab === 'ai') {
    if (showAIConversation) {
      return (
        <ClaudeConversation
          sessionId={`session-${Date.now()}`}
          onBack={() => setShowAIConversation(false)}
          onPopArtTrigger={onPopArtTrigger}
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <Bot className="h-16 w-16 text-purple-400 mb-4" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Claude 4 AI Assistant
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Intelligent assistance powered by Anthropic's Claude 4
        </p>
        <Badge className="mb-4 bg-green-100 text-green-800">
          Ready to Chat
        </Badge>
        <button
          onClick={() => setShowAIConversation(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
        >
          Start Conversation
        </button>
      </div>
    );
  }

  return <MessagesTab />;
};

export default ChatPanel;
