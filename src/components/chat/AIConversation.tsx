
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAIChat } from '@/hooks/useAIChat';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface AIConversationProps {
  sessionId: string;
  onBack: () => void;
}

const AIConversation: React.FC<AIConversationProps> = ({ sessionId, onBack }) => {
  const { user } = useAuth();
  const { messages, sendMessage, isTyping } = useAIChat();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(newMessage, sessionId);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending AI message:', error);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const suggestedPrompts = [
    "Find cleaning services near me",
    "How much does lawn care cost?",
    "Best time to schedule maintenance",
    "Home improvement recommendations"
  ];

  return (
    <div className="h-full flex flex-col">
      {/* AI Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-1 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              HOUSIE AI Assistant
              <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
            </h3>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {isTyping ? 'AI is thinking...' : 'Ready to help'}
            </p>
          </div>
          
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
            AI
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50/20 to-blue-50/20 dark:from-gray-800 dark:to-gray-900">
        {messages.length === 0 && (
          <>
            {/* Welcome Message */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 rounded-2xl rounded-bl-md p-4 max-w-[80%] border border-purple-200 dark:border-purple-700">
                <p className="text-sm text-gray-800 dark:text-gray-200 mb-3">
                  🏠 Hi! I'm your HOUSIE AI assistant. I'm here to help you with:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                  <li>Finding the perfect service providers</li>
                  <li>Getting accurate price estimates</li>
                  <li>Booking and scheduling assistance</li>
                  <li>Service recommendations and tips</li>
                </ul>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-3">
                  What can I help you with today? ✨
                </p>
              </div>
            </div>

            {/* Suggested Prompts */}
            <div className="flex flex-wrap gap-2 ml-11">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setNewMessage(prompt)}
                  className="px-3 py-1 text-xs bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-700 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </>
        )}

        {messages.map((message) => {
          const isUserMessage = message.message_type === 'user';

          return (
            <div key={message.id} className={cn(
              "flex items-start gap-3",
              isUserMessage ? "flex-row-reverse" : ""
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                isUserMessage 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600" 
                  : "bg-gradient-to-r from-purple-600 to-blue-600"
              )}>
                {isUserMessage ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              
              <div className={cn(
                "relative px-4 py-3 rounded-2xl max-w-[80%] break-words group",
                isUserMessage
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md"
                  : "bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 text-gray-800 dark:text-gray-200 border border-purple-200 dark:border-purple-700 rounded-bl-md"
              )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                
                <div className={cn(
                  "flex items-center justify-between mt-2",
                  isUserMessage ? "flex-row-reverse" : ""
                )}>
                  <span className={cn(
                    "text-xs",
                    isUserMessage 
                      ? "text-white/70" 
                      : "text-gray-500 dark:text-gray-400"
                  )}>
                    {formatMessageTime(message.created_at)}
                  </span>
                  
                  {!isUserMessage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(message.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 rounded-2xl rounded-bl-md p-4 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Ask me anything about home services..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sending || isTyping}
              className="pr-12 rounded-full border-purple-300 dark:border-purple-600 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-800"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending || isTyping}
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
              ) : (
                <Send className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          AI responses are generated and may not always be accurate. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default AIConversation;
