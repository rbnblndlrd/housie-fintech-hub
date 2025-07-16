
import React, { useState, useEffect } from 'react';
import { ArrowRight, Radio, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MessagesTab from './MessagesTab';
import AnnetteConversation from './AnnetteConversation';
import { EchoFeedPanel } from './EchoFeedPanel';
import { CrewThreadsPanel } from './CrewThreadsPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';

interface ChatPanelProps {
  activeTab?: 'messages' | 'ai' | 'voice';
  activeSubPanel?: 'main' | 'echo' | 'threads';
  onSubPanelToggle?: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ 
  activeTab: externalActiveTab,
  activeSubPanel = 'main',
  onSubPanelToggle
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

  // Render Echo Feed panel for AI tab
  if (externalActiveTab === 'ai' && activeSubPanel === 'echo') {
    return <EchoFeedPanel onBack={() => onSubPanelToggle?.()} />;
  }

  // Render Crew Threads panel for Messages tab
  if (externalActiveTab === 'messages' && activeSubPanel === 'threads') {
    return <CrewThreadsPanel onBack={() => onSubPanelToggle?.()} />;
  }

  // Render based on active tab (main panels)
  if (externalActiveTab === 'ai') {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-gray-900 relative">
        {/* Navigation Arrow */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSubPanelToggle}
            className="h-8 w-8 p-0 bg-purple-100 hover:bg-purple-200 text-purple-600 shadow-lg border border-purple-200"
            title="View Echo Feed (📡)"
          >
            <Radio className="h-4 w-4" />
          </Button>
        </div>
        <AnnetteConversation sessionId={`annette-${user.id}-${Date.now()}`} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 relative">
      {/* Navigation Arrow */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSubPanelToggle}
          className="h-8 w-8 p-0 bg-blue-100 hover:bg-blue-200 text-blue-600 shadow-lg border border-blue-200"
          title="View Crew Threads (👥)"
        >
          <Users className="h-4 w-4" />
        </Button>
      </div>
      {/* Messages Content */}
      <div className="flex-1 overflow-hidden">
        <MessagesTab />
      </div>
    </div>
  );
};

export default ChatPanel;
