
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useClaudeChat } from '@/hooks/useClaudeChat';
import { Badge } from '@/components/ui/badge';

interface ClaudeConversationProps {
  sessionId: string;
  onBack: () => void;
  onPopArtTrigger?: () => void;
}

const ClaudeConversation = ({ 
  sessionId, 
  onBack, 
  onPopArtTrigger 
}: ClaudeConversationProps) => {
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
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">HOUSIE AI</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Powered by Claude 4</p>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.message_type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.message_type === 'assistant' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.message_type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatTime(message.created_at)}
                </p>
              </div>

              {message.message_type === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Claude is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask HOUSIE AI anything about home services..."
            disabled={isSending || isTyping}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || isSending || isTyping}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          💡 Try: "tax?", "pets?", "cleaning costs", "test claude", or "show me colors"
        </div>
      </div>
    </div>
  );
};

export default ClaudeConversation;
