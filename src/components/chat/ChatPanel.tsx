
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Bot, Settings } from 'lucide-react';
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

  // Update internal state when external activeTab changes
  useEffect(() => {
    if (externalActiveTab) {
      setActiveTab(externalActiveTab);
    }
  }, [externalActiveTab]);

  const handleBackToTabs = () => {
    setActiveTab('messages');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Credits Widget at the top */}
      {user && (
        <div className="p-4 border-b bg-white">
          <CreditsWidget compact />
        </div>
      )}

      {/* Chat Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="flex-1 m-4 mt-0">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Direct Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <MessagesTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="flex-1 m-4 mt-0">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                HOUSIE AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full p-0">
              <ClaudeConversation 
                sessionId={claudeSessionId}
                onBack={handleBackToTabs}
                onPopArtTrigger={onPopArtTrigger}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatPanel;
