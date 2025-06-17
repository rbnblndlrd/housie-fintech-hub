
import React from 'react';
import MessagesTab from './MessagesTab';
import AIAssistantTab from './AIAssistantTab';

interface ChatPanelProps {
  activeTab: 'messages' | 'ai';
}

const ChatPanel: React.FC<ChatPanelProps> = ({ activeTab }) => {
  return (
    <div className="h-full">
      {activeTab === 'messages' ? <MessagesTab /> : <AIAssistantTab />}
    </div>
  );
};

export default ChatPanel;
