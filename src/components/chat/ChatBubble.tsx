
import React, { useState } from 'react';
import { MessageCircle, X, Users, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/useChat';
import MessagesTab from './MessagesTab';
import ClaudeConversation from './ClaudeConversation';
import CreditsWidget from '@/components/credits/CreditsWidget';
import { usePopArt } from '@/contexts/PopArtContext';
import { useAuth } from '@/contexts/AuthContext';

export const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'ai'>('messages');
  const { totalUnreadCount } = useChat();
  const { triggerPopArt } = usePopArt();
  const { user } = useAuth();
  const [claudeSessionId] = useState(() => crypto.randomUUID());

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
            {totalUnreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs font-bold animate-pulse"
              >
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </Badge>
            )}
          </Button>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-96 max-w-[90vw] h-[600px] max-h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header with Credits Widget */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">HOUSIE Chat</h3>
                  <p className="text-white/80 text-sm">Connect • Communicate • Complete</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {user && (
                  <div className="scale-75 origin-right">
                    <CreditsWidget compact />
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-gray-50 dark:bg-gray-800 flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('messages')}
                className={cn(
                  "flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors text-sm",
                  activeTab === 'messages'
                    ? "bg-white dark:bg-gray-900 text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                )}
              >
                <Users className="h-4 w-4" />
                Messages
                {totalUnreadCount > 0 && (
                  <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                    {totalUnreadCount}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={cn(
                  "flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors text-sm",
                  activeTab === 'ai'
                    ? "bg-white dark:bg-gray-900 text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                )}
              >
                <Bot className="h-4 w-4" />
                AI Assistant
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  Claude 4
                </Badge>
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
              {activeTab === 'messages' ? (
                <MessagesTab />
              ) : (
                <ClaudeConversation 
                  sessionId={claudeSessionId}
                  onPopArtTrigger={triggerPopArt}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Left Border Notification Bubbles */}
      {!isOpen && totalUnreadCount > 0 && (
        <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
          <div className="flex flex-col gap-2 p-2">
            {[...Array(Math.min(totalUnreadCount, 5))].map((_, index) => (
              <div
                key={index}
                className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"
                style={{ animationDelay: `${index * 0.2}s` }}
              />
            ))}
            {totalUnreadCount > 5 && (
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
