
import React from 'react';
import MessagesTab from './MessagesTab';
import { Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatPanelProps {
  activeTab: 'messages' | 'ai';
}

const ChatPanel: React.FC<ChatPanelProps> = ({ activeTab }) => {
  if (activeTab === 'ai') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <Bot className="h-16 w-16 text-purple-400 mb-4" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Claude 4 AI Assistant
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Our powerful AI assistant is coming soon!
        </p>
        <Badge className="mt-3 bg-purple-100 text-purple-800">
          Under Development
        </Badge>
      </div>
    );
  }

  return <MessagesTab />;
};

export default ChatPanel;
