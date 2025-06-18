
import React, { useState } from 'react';
import { Search, Users, Clock, Check, CheckCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

  // Filter out conversations that are only AI conversations or system messages
  const userConversations = conversations.filter(conv => {
    // Only show conversations that have real users (not AI assistants)
    return conv.other_participant && 
           conv.other_participant.id !== 'ai-assistant' &&
           !conv.other_participant.full_name?.includes('AI') &&
           !conv.other_participant.full_name?.includes('Assistant') &&
           // Make sure it's not just AI responses
           conv.last_message && 
           !conv.last_message.includes('Hello! How can I help you find the perfect service today?');
  });

  const filteredConversations = userConversations.filter(conv =>
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
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('fr-FR');
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
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher des conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 dark:bg-gray-800 border-0 focus:bg-white dark:focus:bg-gray-700"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Aucune conversation
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Commencez à discuter avec des prestataires lorsque vous faites une réservation!
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              💡 Astuce: Les conversations AI se trouvent dans l'onglet "Assistant IA"
            </p>
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
                    <Avatar className="w-12 h-12">
                      <AvatarImage 
                        src={conversation.other_participant?.profile_image} 
                        alt={conversation.other_participant?.full_name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {conversation.other_participant?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {conversation.other_participant?.full_name || 'Utilisateur Inconnu'}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatTime(conversation.last_message_at)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
                        {conversation.last_message || 'Aucun message'}
                      </p>
                      
                      <div className="flex items-center gap-2 ml-2">
                        {conversation.unread_count && conversation.unread_count > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="h-5 px-1.5 text-xs rounded-full"
                          >
                            {conversation.unread_count}
                          </Badge>
                        )}
                        <CheckCheck className="h-3 w-3 text-blue-500" />
                      </div>
                    </div>

                    {conversation.booking_id && (
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          Chat Réservation
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}</span>
          {totalUnreadCount > 0 && (
            <span className="text-blue-600 font-medium">
              {totalUnreadCount} message{totalUnreadCount !== 1 ? 's' : ''} non lu{totalUnreadCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesTab;
