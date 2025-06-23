
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useClaudeChat } from '@/hooks/useClaudeChat';
import { Badge } from '@/components/ui/badge';

interface ClaudeConversationProps {
  sessionId: string;
  onBack?: () => void;
  onPopArtTrigger?: () => void;
}

const ClaudeConversation: React.FC<ClaudeConversationProps> = ({ 
  sessionId, 
  onBack, 
  onPopArtTrigger 
}) => {
  const { messages, sendMessage, isTyping } = useClaudeChat();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const messageToSend = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      await sendMessage(messageToSend, sessionId, onPopArtTrigger);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* AI Status Bar */}
      <div className="p-3 border-b border-gray-100 dark:border-gray-800 bg-purple-50 dark:bg-purple-950/20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">HOUSIE AI</span>
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
            Claude 4
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">AI Assistant Ready</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ask me anything about home services!</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.message_type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.message_type === 'assistant' && (
                <Avatar className="w-7 h-7 mt-1">
                  <AvatarFallback className="bg-purple-600 text-white text-xs">
                    <Bot className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 ${
                  message.message_type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatTime(message.created_at)}
                </p>
              </div>

              {message.message_type === 'user' && (
                <Avatar className="w-7 h-7 mt-1">
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-7 h-7 mt-1">
                <AvatarFallback className="bg-purple-600 text-white text-xs">
                  <Bot className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-850">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask HOUSIE AI anything..."
            disabled={isSending || isTyping}
            className="flex-1 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400"
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || isSending || isTyping}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          💡 Try: "cleaning costs", "tax questions", or "show me colors"
        </div>
      </div>
    </div>
  );
};

export default ClaudeConversation;
