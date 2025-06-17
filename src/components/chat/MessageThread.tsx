
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, Image, MoreVertical, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface MessageThreadProps {
  conversationId: string;
  onBack: () => void;
}

const MessageThread: React.FC<MessageThreadProps> = ({ conversationId, onBack }) => {
  const { user } = useAuth();
  const { messages, conversations, sendMessage, loading } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find(c => c.id === conversationId);
  const otherParticipant = conversation?.other_participant;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !otherParticipant || sending) return;

    setSending(true);
    try {
      await sendMessage(
        otherParticipant.id,
        newMessage,
        'text',
        conversation?.booking_id
      );
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  let lastDate = '';

  return (
    <div className="h-full flex flex-col">
      {/* Thread Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Avatar className="w-10 h-10">
            <AvatarImage 
              src={otherParticipant?.profile_image} 
              alt={otherParticipant?.full_name}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {otherParticipant?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {otherParticipant?.full_name || 'Unknown User'}
            </h3>
            <p className="text-xs text-green-600 dark:text-green-400">Online now</p>
          </div>
          
          <Button variant="ghost" size="sm" className="p-1">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/20 to-purple-50/20 dark:from-gray-800 dark:to-gray-900">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
              <Send className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Start your conversation with {otherParticipant?.full_name}
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender_id === user?.id;
            const messageDate = formatMessageDate(message.created_at);
            const showDateSeparator = messageDate !== lastDate;
            lastDate = messageDate;

            return (
              <div key={message.id}>
                {showDateSeparator && (
                  <div className="flex justify-center my-4">
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs px-3 py-1 rounded-full">
                      {messageDate}
                    </span>
                  </div>
                )}
                
                <div className={cn(
                  "flex items-end gap-2 max-w-[80%]",
                  isOwnMessage ? "ml-auto flex-row-reverse" : "mr-auto"
                )}>
                  {!isOwnMessage && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage 
                        src={message.sender?.profile_image} 
                        alt={message.sender?.full_name}
                      />
                      <AvatarFallback className="bg-gray-300 text-gray-700 text-xs">
                        {message.sender?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={cn(
                    "relative px-4 py-2 rounded-2xl max-w-full break-words",
                    isOwnMessage
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md"
                  )}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    <div className={cn(
                      "flex items-center gap-1 mt-1",
                      isOwnMessage ? "justify-end" : "justify-start"
                    )}>
                      <span className={cn(
                        "text-xs",
                        isOwnMessage 
                          ? "text-white/70" 
                          : "text-gray-500 dark:text-gray-400"
                      )}>
                        {formatMessageTime(message.created_at)}
                      </span>
                      
                      {isOwnMessage && (
                        <div className="text-white/70">
                          {message.is_read ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2">
            <Image className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              placeholder={`Message ${otherParticipant?.full_name}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sending}
              className="pr-12 rounded-full border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
              ) : (
                <Send className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
