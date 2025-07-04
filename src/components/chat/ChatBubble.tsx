
import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Mic, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import ChatPanel from './ChatPanel';
import DashboardNotificationDropdown from '@/components/dashboard/DashboardNotificationDropdown';
import { useLocation } from 'react-router-dom';

interface ChatBubbleProps {
  defaultTab?: 'messages' | 'ai' | 'voice';
  showMicIcon?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  defaultTab,
  showMicIcon 
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const isInteractiveMap = location.pathname === '/interactive-map';
  
  // Determine user's subscription tier and access levels
  const userTier = user?.user_metadata?.subscription_tier || 'free';
  const isAuthenticated = !!user;
  const hasVoiceAccess = isAuthenticated && userTier !== 'free';
  const hasMessagesAccess = isAuthenticated;
  
  // Use props or detect page to set defaults, but ensure user has access
  let initialTab = defaultTab || (isInteractiveMap ? 'voice' : 'ai');
  if (initialTab === 'voice' && !hasVoiceAccess) initialTab = 'ai';
  if (initialTab === 'messages' && !hasMessagesAccess) initialTab = 'ai';
  
  const useMicIcon = showMicIcon !== undefined ? showMicIcon : isInteractiveMap;
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'ai' | 'voice'>(initialTab);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { totalUnreadCount } = useChat();

  // Persistent tab memory
  useEffect(() => {
    const savedTab = localStorage.getItem('chatBubble-lastTab');
    if (savedTab && (savedTab === 'messages' || savedTab === 'ai' || savedTab === 'voice')) {
      // Validate access before restoring
      if (savedTab === 'voice' && !hasVoiceAccess) return;
      if (savedTab === 'messages' && !hasMessagesAccess) return;
      setActiveTab(savedTab);
    }
  }, [hasVoiceAccess, hasMessagesAccess]);

  // Save tab selection
  useEffect(() => {
    localStorage.setItem('chatBubble-lastTab', activeTab);
  }, [activeTab]);

  const handleOpen = () => {
    setIsOpen(true);
    // Reset to initial tab when opening
    setActiveTab(initialTab);
  };

  const handleTabChange = (tab: 'messages' | 'ai' | 'voice') => {
    // Validate access before switching
    if (tab === 'voice' && !hasVoiceAccess) return;
    if (tab === 'messages' && !hasMessagesAccess) return;
    setActiveTab(tab);
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const closeNotification = () => {
    setIsNotificationOpen(false);
  };

  // Determine tab order based on subscription
  const isPremiumUser = userTier === 'premium' || userTier === 'professional';
  const tabOrder = isPremiumUser ? ['ai', 'messages', 'voice'] : ['ai', 'messages', 'voice'];

  return (
    <>
      {!isOpen ? (
        <div className="fixed z-50" style={{ bottom: '120px', right: '120px' }}>
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
            {totalUnreadCount > 0 && !useMicIcon && hasMessagesAccess && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
              >
                {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
              </Badge>
            )}
          </Button>
        </div>
      ) : (
        <div className="fixed z-50" style={{ bottom: '120px', right: '120px' }}>
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg shadow-xl w-96 h-[600px] flex flex-col overflow-hidden">
            {/* Clean Header */}
            <div className="bg-yellow-200 border-b-2 border-yellow-300 p-4 flex items-center justify-between">
              <h3 className="font-semibold text-yellow-900">
                {useMicIcon ? 'Voice Assistant' : 'Assistant'}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNotificationClick}
                  className="h-8 w-8 p-0 hover:bg-yellow-300 text-yellow-800"
                >
                  <Bell className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-yellow-300 text-yellow-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Clean Tab Navigation */}
            <div className="bg-yellow-50 border-b-2 border-yellow-300">
              <div className="flex">
                {/* AI Assistant Tab (first position, Claude for Premium/Pro, WebLLM for Free/Starter) */}
                <button
                  onClick={() => handleTabChange('ai')}
                  className={cn(
                    "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                    activeTab === 'ai'
                      ? "text-purple-600 bg-yellow-100"
                      : "text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100"
                  )}
                >
                  {isPremiumUser ? 'Claude' : 'AI Assistant'}
                  {activeTab === 'ai' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                  )}
                </button>

                {/* Messages Tab (second position) */}
                {hasMessagesAccess && (
                  <button
                    onClick={() => handleTabChange('messages')}
                    className={cn(
                      "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                      activeTab === 'messages'
                        ? "text-blue-600 bg-yellow-100"
                        : "text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100"
                    )}
                  >
                    Messages
                    {totalUnreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2 h-4 px-1.5 text-xs">
                        {totalUnreadCount}
                      </Badge>
                    )}
                    {activeTab === 'messages' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden">
              <ChatPanel activeTab={activeTab} />
            </div>
          </div>
        </div>
      )}

      {/* Notification Popup - Bottom Right Corner */}
      {isNotificationOpen && (
        <>
          <div 
            className="fixed inset-0 z-30" 
            onClick={closeNotification}
          />
          <div className="fixed z-40 w-80" style={{ bottom: '740px', right: '120px' }}>
            <div className="bg-gradient-to-br from-white to-yellow-50 rounded-xl shadow-xl border border-yellow-200 p-4 animate-scale-in backdrop-blur-sm">
              <div className="bg-yellow-100 rounded-lg p-3 border border-yellow-300">
                <DashboardNotificationDropdown />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Minimal Side Indicators */}
      {!isOpen && totalUnreadCount > 0 && !useMicIcon && hasMessagesAccess && (
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40">
          <div className="w-1 h-8 bg-red-500 rounded-l-full shadow-lg animate-pulse" />
        </div>
      )}
    </>
  );
};
