
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
        <div className="fixed z-50" style={{ bottom: '100px', right: '16px' }}>
          <Button
            onClick={handleOpen}
            className={cn(
              "relative rounded-full w-20 h-20 shadow-lg transition-all duration-200 hover:scale-105",
              "border-2 border-slate-600 text-white bg-slate-800"
            )}
            variant="ghost"
          >
            {/* Annette Avatar Image */}
            <img 
              src="/lovable-uploads/7e58a112-189a-4048-9103-cd1a291fa6a5.png" 
              alt="Annette AI Assistant"
              className="w-16 h-16 rounded-full object-cover"
            />
            
            {/* Mic Icon Overlay for Voice Mode */}
            {useMicIcon && (
              <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                <Mic className="h-5 w-5 text-white" />
              </div>
            )}
            
            {/* Unread Message Badge */}
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
        <div className="fixed z-50" style={{ bottom: '100px', right: '16px' }}>
          <div className="bg-slate-800 border-2 border-slate-600 rounded-lg shadow-xl max-w-[90vw] w-80 md:w-96 h-[60vh] max-h-[600px] flex flex-col overflow-hidden">
            {/* Clean Header */}
            <div className="bg-slate-700 border-b-2 border-slate-600 p-4 flex items-center justify-between">
              <h3 className="font-semibold text-white">
                {useMicIcon ? 'Voice Assistant' : 'Assistant'}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNotificationClick}
                  className="h-8 w-8 p-0 hover:bg-slate-600 text-gray-200"
                >
                  <Bell className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-slate-600 text-gray-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Clean Tab Navigation */}
            <div className="bg-slate-800 border-b-2 border-slate-600">
              <div className="flex">
                {/* AI Assistant Tab (Annette) */}
                <button
                  onClick={() => handleTabChange('ai')}
                  className={cn(
                    "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                    activeTab === 'ai'
                      ? "text-purple-400 bg-slate-700"
                      : "text-gray-300 hover:text-white hover:bg-slate-700"
                  )}
                >
                  Ask Annette
                  {activeTab === 'ai' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400" />
                  )}
                </button>

                {/* Messages Tab (second position) */}
                {hasMessagesAccess && (
                  <button
                    onClick={() => handleTabChange('messages')}
                    className={cn(
                      "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                      activeTab === 'messages'
                        ? "text-blue-400 bg-slate-700"
                        : "text-gray-300 hover:text-white hover:bg-slate-700"
                    )}
                  >
                    Messages
                    {totalUnreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2 h-4 px-1.5 text-xs">
                        {totalUnreadCount}
                      </Badge>
                    )}
                    {activeTab === 'messages' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
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
          <div className="fixed z-40 w-80" style={{ bottom: '720px', right: '16px' }}>
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-xl border border-slate-600 p-4 animate-scale-in backdrop-blur-sm">
              <div className="bg-slate-600 rounded-lg p-3 border border-slate-500">
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
