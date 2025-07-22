import React, { ReactNode, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Scroll, 
  History,
  Crown,
  Menu,
  X,
  Star
} from 'lucide-react';
import { AnnetteBubbleChat } from '@/components/assistant/AnnetteBubbleChat';
import PrestigeContent from '@/components/community/PrestigeContent';
import CanonicalChainBrowser from '@/components/prestige/CanonicalChainBrowser';
import RecentStampsWall from '@/components/stamps/RecentStampsWall';
import { useAuth } from '@/contexts/AuthContext';

const CommunityDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('prestige-titles');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isBubbleChatOpen, setIsBubbleChatOpen] = useState(false);

  const navItems = [
    { 
      id: 'prestige-titles', 
      label: 'Prestige Titles', 
      icon: Trophy, 
      emoji: '🏆'
    },
    { 
      id: 'sealed-chains', 
      label: 'Sealed Chains', 
      icon: Scroll, 
      emoji: '📜'
    },
    { 
      id: 'stamp-history', 
      label: 'Stamp History', 
      icon: History, 
      emoji: '📊'
    },
    { 
      id: 'hall-of-legends', 
      label: 'Hall of Legends', 
      icon: Crown, 
      emoji: '👑'
    }
  ];

  // Main content based on active tab
  const renderTabContent = () => {
    try {
      switch (activeTab) {
        case 'prestige-titles':
          return <PrestigeContent />;
        case 'sealed-chains':
          return <CanonicalChainBrowser />;
        case 'stamp-history':
          return (
            <div className="space-y-6">
              <RecentStampsWall limit={20} />
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Recent Sealed Chains</h3>
                <div className="overflow-x-auto">
                  <div className="flex gap-4 pb-4">
                    {/* Placeholder for recent sealed chains horizontal scroll */}
                    <Card className="min-w-80 bg-card/95 backdrop-blur-md border-border/20">
                      <CardContent className="p-4">
                        <div className="text-center text-muted-foreground">
                          Recent sealed chains will appear here
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'hall-of-legends':
          return (
            <div className="space-y-6">
              <Card className="bg-card/95 backdrop-blur-md border-border/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Public Hall of Legends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    Public leaderboard and community achievements coming soon
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        default:
          return <PrestigeContent />;
      }
    } catch (error) {
      console.error('Error rendering tab content:', error);
      return (
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              Something went wrong loading this content. Please try refreshing the page.
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  const rightPanelContent = (
    <div className="space-y-4">
      <Card className="bg-card/95 backdrop-blur-md border-border/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Prestige Level</span>
            <Badge variant="secondary">Level 8</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Sealed Chains</span>
            <span className="font-bold">3</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Stamps</span>
            <span className="font-bold">12</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Compact Tab Strip - Below HOUSIE Header */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/20">
        <div className="px-4 py-2">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onTabChange(item.id)}
                  className={`
                    flex-shrink-0 h-10 px-3 text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                    rounded-md font-medium
                  `}
                >
                  <span className="mr-2">{item.emoji}</span>
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar for legacy support */}
      {sidebarOpen && (
        <aside className="fixed top-0 left-0 h-full bg-background/95 backdrop-blur-md border-r border-border/20 text-foreground z-50 transition-transform duration-300 w-64 lg:hidden">
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-end mb-4">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 flex-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => {
                    onTabChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className="w-full justify-start h-10 px-3 text-left"
                >
                  <span className="mr-2">{item.emoji}</span>
                  <span className="text-sm">{item.label}</span>
                </Button>
              ))}
            </div>
            <div className="mt-4">
              <Button
                onClick={() => setIsBubbleChatOpen(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg text-sm"
              >
                💅 Chat with Annette
              </Button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content - Compact Layout */}
      <div className="pt-28">
        {/* Mobile Tab Menu Toggle */}
        <div className="lg:hidden fixed top-16 right-4 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="bg-background/80 backdrop-blur-sm"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Compact Community Content */}
        <div className="px-2 md:px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-4">
              {/* Main Echo Feed & Reputation Board - Full Height */}
              <div className="xl:col-span-3 space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {renderTabContent()}
              </div>

              {/* Right Panel - Community Hub */}
              <Card className="rounded-xl bg-card/95 backdrop-blur-md shadow-md border-border/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Community Hub
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {rightPanelContent}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Annette BubbleChat */}
      <AnnetteBubbleChat 
        isOpen={isBubbleChatOpen}
        onClose={() => setIsBubbleChatOpen(false)}
      />
    </div>
  );

  function onTabChange(tabId: string) {
    setActiveTab(tabId);
    // Optional: Annette voice line on tab switch
    console.log(`Switched to ${tabId} tab`);
  }
};

export default CommunityDashboard;