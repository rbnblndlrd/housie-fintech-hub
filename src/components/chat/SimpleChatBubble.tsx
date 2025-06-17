
import React, { useState } from 'react';
import { MessageCircle, X, Send, Users, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const SimpleChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'ai'>('messages');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you find the perfect service today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [aiMessages, setAiMessages] = useState<Message[]>([
    {
      id: 'ai-1',
      text: 'Hi! I\'m your AI assistant. I can help you find services, get pricing estimates, and answer questions about bookings. What can I help you with?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [unreadCount] = useState(3);

  const currentMessages = activeTab === 'messages' ? messages : aiMessages;
  const setCurrentMessages = activeTab === 'messages' ? setMessages : setAiMessages;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setCurrentMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Different bot responses based on active tab
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: activeTab === 'messages' 
          ? "Thanks for your message! I'm here to help you with any questions about our services."
          : "I'd be happy to help you with that! Can you tell me more about what kind of service you're looking for? I can provide recommendations and pricing estimates.",
        sender: 'bot',
        timestamp: new Date()
      };
      setCurrentMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <Button
            onClick={() => setIsOpen(true)}
            className={cn(
              "relative rounded-full w-16 h-16 shadow-lg transition-all duration-300 hover:scale-110",
              "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
              "border-4 border-white dark:border-gray-800"
            )}
          >
            <MessageCircle className="h-7 w-7 text-white" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs font-bold animate-pulse"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        ) : (
          /* Chat Panel */
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-96 h-[600px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">HOUSIE Chat</h3>
                  <p className="text-white/80 text-sm">Connect • Communicate • Complete</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="bg-gray-50 dark:bg-gray-800 flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('messages')}
                className={cn(
                  "flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors",
                  activeTab === 'messages'
                    ? "bg-white dark:bg-gray-900 text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                )}
              >
                <Users className="h-4 w-4" />
                Messages
                {unreadCount > 0 && activeTab !== 'messages' && (
                  <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={cn(
                  "flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors",
                  activeTab === 'ai'
                    ? "bg-white dark:bg-gray-900 text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                )}
              >
                <Bot className="h-4 w-4" />
                AI Assistant
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                      message.sender === 'user'
                        ? "bg-blue-600 text-white rounded-br-md"
                        : activeTab === 'ai'
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 rounded-bl-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md"
                    )}
                  >
                    <p>{message.text}</p>
                    <p className={cn(
                      "text-xs mt-1 opacity-70",
                      message.sender === 'user' 
                        ? 'text-blue-100' 
                        : activeTab === 'ai'
                        ? 'text-purple-600 dark:text-purple-300'
                        : 'text-gray-500'
                    )}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={activeTab === 'ai' ? "Ask me anything about services..." : "Type your message..."}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!inputText.trim()}
                  className={cn(
                    activeTab === 'ai' 
                      ? "bg-purple-600 hover:bg-purple-700" 
                      : "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Left Border Notification Bubbles (Classic Facebook Style) */}
      {!isOpen && unreadCount > 0 && (
        <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
          <div className="flex flex-col gap-2 p-2">
            {[...Array(Math.min(unreadCount, 5))].map((_, index) => (
              <div
                key={index}
                className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"
                style={{ animationDelay: `${index * 0.2}s` }}
              />
            ))}
            {unreadCount > 5 && (
              <div className="w-3 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full animate-pulse shadow-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">+</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
