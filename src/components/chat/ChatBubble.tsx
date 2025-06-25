
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
              "bg-yellow-300 hover:bg-yellow-400 border-2 border-yellow-600"
            )}
            variant="ghost"
          >
            <MessageCircle className="h-6 w-6 text-yellow-800" />
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
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg shadow-xl w-96 h-[600px] flex flex-col overflow-hidden">
            {/* Clean Header */}
            <div className="bg-yellow-200 border-b-2 border-yellow-300 p-4 flex items-center justify-between">
              <h3 className="font-semibold text-yellow-900">Messages</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-yellow-300 text-yellow-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Clean Tab Navigation */}
            <div className="bg-yellow-50 border-b-2 border-yellow-300">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('messages')}
                  className={cn(
                    "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                    activeTab === 'messages'
                      ? "text-blue-600 bg-yellow-100"
                      : "text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100"
                  )}
                >
                  Human Chat
                  {totalUnreadCount > 0 && (
                    <Badge variant="destructive" className="ml-2 h-4 px-1.5 text-xs">
                      {totalUnreadCount}
                    </Badge>
                  )}
                  {activeTab === 'messages' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={cn(
                    "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                    activeTab === 'ai'
                      ? "text-purple-600 bg-yellow-100"
                      : "text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100"
                  )}
                >
                  AI Assistant
                  {activeTab === 'ai' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
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
