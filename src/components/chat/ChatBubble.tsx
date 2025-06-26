
import React, { useState } from 'react';
import { MessageCircle, X, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/useChat';
import ChatPanel from './ChatPanel';
import { usePopArt } from '@/contexts/PopArtContext';
import { useLocation } from 'react-router-dom';

interface ChatBubbleProps {
  defaultTab?: 'messages' | 'ai' | 'voice';
  showMicIcon?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  defaultTab,
  showMicIcon 
}) => {
  const location = useLocation();
  const isInteractiveMap = location.pathname === '/interactive-map';
  
  // Use props or detect page to set defaults
  const initialTab = defaultTab || (isInteractiveMap ? 'voice' : 'messages');
  const useMicIcon = showMicIcon !== undefined ? showMicIcon : isInteractiveMap;
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'ai' | 'voice'>(initialTab);
  const { totalUnreadCount } = useChat();
  const { triggerPopArt } = usePopArt();

  const handleOpen = () => {
    setIsOpen(true);
    // Reset to initial tab when opening
    setActiveTab(initialTab);
  };

  return (
    <>
      {/* Clean Floating Chat Button - Changed to bright yellow */}
      <div className="fixed bottom-6 left-6 z-50">
        {!isOpen ? (
          <Button
            onClick={handleOpen}
            className={cn(
              "relative rounded-full w-14 h-14 shadow-lg transition-all duration-200 hover:scale-105",
              "border-2 border-orange-600 text-black"
            )}
            style={{ backgroundColor: '#f5d478' }}
            variant="ghost"
          >
            {useMicIcon ? (
              <Mic className="h-6 w-6 text-black" />
            ) : (
              <MessageCircle className="h-6 w-6 text-black" />
            )}
            {totalUnreadCount > 0 && !useMicIcon && (
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
              <h3 className="font-semibold text-yellow-900">
                {useMicIcon ? 'Voice Assistant' : 'Assistant'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-yellow-300 text-yellow-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Clean Tab Navigation - Reordered for interactive map */}
            <div className="bg-yellow-50 border-b-2 border-yellow-300">
              <div className="flex">
                {isInteractiveMap ? (
                  // Voice tab first for interactive map
                  <>
                    <button
                      onClick={() => setActiveTab('voice')}
                      className={cn(
                        "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                        activeTab === 'voice'
                          ? "text-green-600 bg-yellow-100"
                          : "text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100"
                      )}
                    >
                      🗣️ Voice
                      {activeTab === 'voice' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
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
                      AI Text
                      {activeTab === 'ai' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className={cn(
                        "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                        activeTab === 'messages'
                          ? "text-blue-600 bg-yellow-100"
                          : "text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100"
                      )}
                    >
                      Chat
                      {totalUnreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2 h-4 px-1.5 text-xs">
                          {totalUnreadCount}
                        </Badge>
                      )}
                      {activeTab === 'messages' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                      )}
                    </button>
                  </>
                ) : (
                  // Default order for other pages
                  <>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className={cn(
                        "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                        activeTab === 'messages'
                          ? "text-blue-600 bg-yellow-100"
                          : "text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100"
                      )}
                    >
                      Chat
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
                      AI Text
                      {activeTab === 'ai' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('voice')}
                      className={cn(
                        "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                        activeTab === 'voice'
                          ? "text-green-600 bg-yellow-100"
                          : "text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100"
                      )}
                    >
                      🗣️ Voice
                      {activeTab === 'voice' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden">
              <ChatPanel activeTab={activeTab} onPopArtTrigger={triggerPopArt} />
            </div>
          </div>
        )}
      </div>

      {/* Minimal Side Indicators - Also moved to left side */}
      {!isOpen && totalUnreadCount > 0 && !useMicIcon && (
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40">
          <div className="w-1 h-8 bg-red-500 rounded-l-full shadow-lg animate-pulse" />
        </div>
      )}
    </>
  );
};
