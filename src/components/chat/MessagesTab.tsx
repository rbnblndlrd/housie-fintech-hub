
import React, { useState } from 'react';
import { Search, Users, Clock, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import MessageThread from './MessageThread';
import { cn } from '@/lib/utils';

const MessagesTab = () => {
  const { user } = useAuth();
  const { conversations, activeConversation, loadMessages, totalUnreadCount } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [showThread, setShowThread] = useState(false);

  // Enhanced AI response patterns to filter out
  const aiResponsePatterns = [
    "I'd be happy to help you with that!",
    "Can you provide more details about what specific service you're looking for?",
    "Based on your request, I can recommend several excellent service providers",
    "That's a great question! For home services, I typically recommend",
    "I can help you estimate costs for that service",
    "For that type of service, I recommend checking the provider's insurance",
    "Let me help you find the perfect service provider!",
    "I can assist with booking that service",
    "That service typically takes",
    "Hello! How can I help you find the perfect service today?",
    "HOUSIE AI",
    "AI Assistant",
    "assistant",
    "I'm an AI",
    "webllm",
    "fallback mode",
    "local ai",
    "test webllm",
    "tax?", "pets?", "cleaning costs"
  ];

  const isAIRelated = (text: string) => {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return aiResponsePatterns.some(pattern => 
      lowerText.includes(pattern.toLowerCase())
    );
  };

  const humanConversations = conversations.filter(conv => {
    if (conv.other_participant) {
      const participantName = conv.other_participant.full_name || '';
      const participantId = conv.other_participant.id || '';
      const lowerName = participantName.toLowerCase();
      
      if (lowerName.includes('ai') || 
          lowerName.includes('assistant') || 
          lowerName.includes('bot') ||
          lowerName.includes('housie ai') ||
          participantId === 'ai-assistant' ||
          participantId.includes('ai') ||
          participantId.includes('bot')) {
        return false;
      }
    }

    if (conv.last_message && isAIRelated(conv.last_message)) {
      return false;
    }

    if (conv.last_message) {
      const lowerMessage = conv.last_message.toLowerCase();
      
      if (lowerMessage.includes('webllm is working') ||
          lowerMessage.includes('local ai') ||
          lowerMessage.includes('fallback mode') ||
          lowerMessage.includes('✅') ||
          lowerMessage.includes('🤖') ||
          lowerMessage.includes('🎨') ||
          lowerMessage.match(/tax\?|pets\?|cleaning costs/)) {
        return false;
      }
    }

    return conv.other_participant && 
           conv.other_participant.id !== 'ai-assistant' &&
           conv.last_message &&
           conv.last_message.trim() !== '' &&
           conv.last_message !== 'Start a conversation' &&
           !conv.last_message.toLowerCase().includes('ai') &&
           !conv.last_message.toLowerCase().includes('assistant');
  });

  const filteredConversations = humanConversations.filter(conv =>
    conv.other_participant?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationClick = (conversationId: string) => {
    loadMessages(conversationId);
    setShowThread(true);
  };

  const handleBackToList = () => {
    setShowThread(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (showThread && activeConversation) {
    return (
      <MessageThread
        conversationId={activeConversation}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              No conversations yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Start chatting with service providers when you make a booking!
            </p>
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 text-center max-w-sm">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                💡 Separate Chat Systems
              </p>
              <p className="text-xs text-blue-500 dark:text-blue-300">
                Human Chat: Real conversations with service providers
              </p>
              <p className="text-xs text-purple-500 dark:text-purple-300">
                AI Assistant: Get instant help and advice
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationClick(conversation.id)}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage 
                        src={conversation.other_participant?.profile_image} 
                        alt={conversation.other_participant?.full_name}
                      />
                      <AvatarFallback className="bg-blue-600 text-white font-medium">
                        {conversation.other_participant?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {conversation.other_participant?.full_name || 'User'}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.last_message_at)}
                        </span>
                        {conversation.unread_count && conversation.unread_count > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="h-4 px-1.5 text-xs rounded-full"
                          >
                            {conversation.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {conversation.last_message || 'No messages yet'}
                    </p>

                    {conversation.booking_id && (
                      <Badge variant="outline" className="text-xs mt-2 bg-green-50 text-green-700 border-green-200">
                        📅 Booking Chat
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Footer */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-850">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>👥 {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}</span>
          {totalUnreadCount > 0 && (
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {totalUnreadCount} unread
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesTab;
