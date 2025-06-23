
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/useChat';
import ChatPanel from './ChatPanel';
import { usePopArt } from '@/contexts/PopArtContext';

export const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'ai'>('messages');
  const { totalUnreadCount } = useChat();
  const { triggerPopArt } = usePopArt();

  return (
    <>
      {/* Clean Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <Button
            onClick={() => setIsOpen(true)}
            className={cn(
              "relative rounded-full w-14 h-14 shadow-lg transition-all duration-200 hover:scale-105",
              "bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700",
              "hover:border-blue-500 dark:hover:border-blue-400"
            )}
            variant="ghost"
          >
            <MessageCircle className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            {totalUnreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
              >
                {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
              </Badge>
            )}
          </Button>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-96 h-[600px] flex flex-col overflow-hidden">
            {/* Clean Header */}
            <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Messages</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Clean Tab Navigation */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('messages')}
                  className={cn(
                    "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                    activeTab === 'messages'
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  Human Chat
                  {totalUnreadCount > 0 && (
                    <Badge variant="destructive" className="ml-2 h-4 px-1.5 text-xs">
                      {totalUnreadCount}
                    </Badge>
                  )}
                  {activeTab === 'messages' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={cn(
                    "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                    activeTab === 'ai'
                      ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  AI Assistant
                  {activeTab === 'ai' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden">
              <ChatPanel activeTab={activeTab} onPopArtTrigger={triggerPopArt} />
            </div>
          </div>
        )}
      </div>

      {/* Minimal Side Indicators */}
      {!isOpen && totalUnreadCount > 0 && (
        <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
          <div className="w-1 h-8 bg-red-500 rounded-r-full shadow-lg animate-pulse" />
        </div>
      )}
    </>
  );
};
