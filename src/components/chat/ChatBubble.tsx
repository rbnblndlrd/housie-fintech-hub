
import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Mic, Bell, Radio, Users, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import ChatPanel from './ChatPanel';
import { EchoFeedPanel } from './EchoFeedPanel';
import { CrewThreadsPanel } from './CrewThreadsPanel';
import DashboardNotificationDropdown from '@/components/dashboard/DashboardNotificationDropdown';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { useBubbleChatVisibility } from '@/hooks/useBubbleChatVisibility';

interface ChatBubbleProps {
  defaultTab?: 'messages' | 'ai' | 'voice';
  showMicIcon?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  defaultTab,
  showMicIcon 
}) => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();
  const { emitBubbleChatStateChange } = useBubbleChatVisibility();
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
  const [activeSubPanel, setActiveSubPanel] = useState<'main' | 'echo' | 'threads'>('main');
  const [previousTab, setPreviousTab] = useState<'messages' | 'ai' | 'voice'>('ai');
  const { totalUnreadCount } = useChat();

  // Role-based voice lines - updated with user-specified quotes
  const echoVoiceLines = [
    "Echoes never lie, sugar. Let's see what the network remembers…",
    "The Canon's stirring. Let's see who made history today.",
    "This isn't gossip — this is verified prestige, baby.",
    "Let me tune into the local signal… scanning nodes…",
    "What's loud, proud, and carved in the blockchain? These.",
    "Echo stream loaded. Time to trace the ripples."
  ];

  const crewVoiceLines = [
    "Crew chatter coming in hot. Don't leave 'em hanging.",
    "Nothing like a good cluster of chaos to brighten the day.",
    "You've got team threads, sugar. Let's stitch some history.",
    "Every gig has a rhythm — and this is where the beat starts.",
    "Crew status: online. Collectives? Buzzing.",
    "If teamwork had a group chat… this would be it."
  ];

  // Role-aware greeting lines
  const getGreetingForRole = () => {
    if (currentRole === 'provider') {
      return [
        "Ready to optimize your route, sugar? I've got logistics and sass.",
        "Provider mode activated. Let's parse some jobs and stack that paper.",
        "Time to coordinate your crew and maximize efficiency. You got this!"
      ];
    } else {
      return [
        "Ask me anything. I've got data, sass, and an extremely organized brain.",
        "Need help? I've got button-clickin' fingers and achievement-tracking eyes.",
        "Customer mode online. Ready to track your prestige and manage bookings."
      ];
    }
  };

  // Session memory for sub-panels
  useEffect(() => {
    const savedSubPanel = sessionStorage.getItem('chatBubble-lastSubPanel');
    if (savedSubPanel && (savedSubPanel === 'echo' || savedSubPanel === 'threads')) {
      setActiveSubPanel(savedSubPanel);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('chatBubble-lastSubPanel', activeSubPanel);
  }, [activeSubPanel]);

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
    emitBubbleChatStateChange(true);
    
    // Restore last viewed tab and sub-panel
    const savedTab = localStorage.getItem('chatBubble-lastTab');
    const savedSubPanel = sessionStorage.getItem('chatBubble-lastSubPanel');
    
    if (savedTab && (savedTab === 'messages' || savedTab === 'ai' || savedTab === 'voice')) {
      if (savedTab === 'voice' && !hasVoiceAccess) return;
      if (savedTab === 'messages' && !hasMessagesAccess) return;
      setActiveTab(savedTab);
    }
    
    if (savedSubPanel && (savedSubPanel === 'echo' || savedSubPanel === 'threads')) {
      setActiveSubPanel(savedSubPanel);
    }

    // Show role-aware greeting when opening
    const greetingLines = getGreetingForRole();
    const randomGreeting = greetingLines[Math.floor(Math.random() * greetingLines.length)];
    toast("🧠 Annette", {
      description: randomGreeting
    });

    // Auto-focus chat input after 1 second
    setTimeout(() => {
      const chatInput = document.querySelector('input[placeholder*="Ask"], textarea[placeholder*="Ask"]') as HTMLElement;
      if (chatInput) {
        chatInput.focus();
      }
    }, 1000);
  };

  const handleTabChange = (tab: 'messages' | 'ai' | 'voice') => {
    // Validate access before switching
    if (tab === 'voice' && !hasVoiceAccess) return;
    if (tab === 'messages' && !hasMessagesAccess) return;
    
    setPreviousTab(activeTab);
    setActiveTab(tab);
    // Reset to main panel when switching tabs
    setActiveSubPanel('main');
  };

  const handleSubPanelToggle = () => {
    if (activeTab === 'ai') {
      const newPanel = activeSubPanel === 'main' ? 'echo' : 'main';
      setActiveSubPanel(newPanel);
      
      // Random Annette voice line for Echo Feed
      if (newPanel === 'echo') {
        const randomLine = echoVoiceLines[Math.floor(Math.random() * echoVoiceLines.length)];
        toast("🧠 Annette", {
          description: randomLine
        });
      }
    } else if (activeTab === 'messages') {
      const newPanel = activeSubPanel === 'main' ? 'threads' : 'main';
      setActiveSubPanel(newPanel);
      
      // Random Annette voice line for Crew Threads
      if (newPanel === 'threads') {
        const randomLine = crewVoiceLines[Math.floor(Math.random() * crewVoiceLines.length)];
        toast("🧠 Annette", {
          description: randomLine
        });
      }
    }
  };

  const handleGoBack = () => {
    if (activeSubPanel !== 'main') {
      setActiveSubPanel('main');
    } else {
      // Go back to previous tab
      setActiveTab(previousTab);
    }
  };

  // Get current icon for the floating button based on active panel
  const getCurrentIcon = () => {
    if (activeTab === 'ai' && activeSubPanel === 'echo') return <Radio className="h-5 w-5 text-white" />;
    if (activeTab === 'messages' && activeSubPanel === 'threads') return <Users className="h-5 w-5 text-white" />;
    return null; // Use default Annette avatar
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
      {/* BubbleChat - positioning handled by parent container */}
      {!isOpen ? (
        <div>
          <Button
            onClick={handleOpen}
            className={cn(
              "relative rounded-full w-16 h-16 shadow-lg transition-all duration-200 hover:scale-105",
              "border-2 border-purple-400 text-white bg-gradient-to-br from-purple-500 to-blue-600"
            )}
            variant="ghost"
          >
            {/* Dynamic Icon based on current view */}
            {activeSubPanel === 'echo' ? (
              <Radio className="h-6 w-6 text-white" />
            ) : activeSubPanel === 'threads' ? (
              <Users className="h-6 w-6 text-white" />
            ) : activeTab === 'messages' ? (
              <MessageCircle className="h-6 w-6 text-white" />
            ) : (
              <img 
                src="/lovable-uploads/7e58a112-189a-4048-9103-cd1a291fa6a5.png" 
                alt="Annette AI Assistant"
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            
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
        <div>
          <div className={cn(
            "bg-slate-800 border-2 border-slate-600 rounded-lg shadow-xl flex flex-col overflow-hidden",
            "max-w-[90vw] w-80 md:w-96 h-[60vh] max-h-[600px]",
            "transition-all duration-300",
            // Add subtle glow when active
            "ring-2 ring-purple-400/20 shadow-purple-400/10"
          )}
               style={{ minHeight: '400px', maxWidth: '340px' }}>
            {/* Header with Navigation Arrow */}
            <div className="bg-slate-700 border-b-2 border-slate-600 p-4 flex items-center justify-between">
              {/* Left Navigation Arrow */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSubPanelToggle}
                  className={cn(
                    "h-8 w-8 p-0 rounded-full transition-all duration-200",
                    activeSubPanel === 'main' 
                      ? "hover:bg-slate-600 text-gray-300 hover:text-white"
                      : "hover:bg-slate-600 text-purple-400 hover:text-purple-300"
                  )}
                  title={
                    activeSubPanel === 'main' 
                      ? (activeTab === 'ai' ? 'View Echo Feed' : 'View Crew Threads')
                      : 'Back to Chat'
                  }
                >
                  {activeSubPanel === 'main' ? (
                    <ArrowLeft className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
                
                <h3 className="font-semibold text-white">
                  {activeSubPanel === 'echo' ? '📡 Echo Feed' : 
                   activeSubPanel === 'threads' ? '👥 Crew Threads' :
                   activeTab === 'messages' ? '💬 Messages' :
                   useMicIcon ? '🎤 Voice Assistant' : '🧠 Annette'}
                </h3>
              </div>
              
              {/* Right Controls */}
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
                  onClick={() => {
                    setIsOpen(false);
                    emitBubbleChatStateChange(false);
                  }}
                  className="h-8 w-8 p-0 hover:bg-slate-600 text-gray-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tab Navigation - only show when in main panel */}
            {activeSubPanel === 'main' && (
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

                  {/* Messages Tab */}
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
            )}

            {/* Content Area - handles different panels inline */}
            <div className="flex-1 overflow-hidden">
              {activeSubPanel === 'echo' ? (
                <EchoFeedPanel onBack={() => setActiveSubPanel('main')} />
              ) : activeSubPanel === 'threads' ? (
                <CrewThreadsPanel onBack={() => setActiveSubPanel('main')} />
              ) : (
                <ChatPanel 
                  activeTab={activeTab} 
                  activeSubPanel={activeSubPanel}
                  onSubPanelToggle={handleSubPanelToggle}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification Popup */}
      {isNotificationOpen && (
        <>
          <div 
            className="fixed inset-0 z-30" 
            onClick={closeNotification}
          />
          <div className="fixed z-40 w-80 bottom-72 left-8">
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
        <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
          <div className="w-1 h-8 bg-red-500 rounded-r-full shadow-lg animate-pulse" />
        </div>
      )}
    </>
  );
};
