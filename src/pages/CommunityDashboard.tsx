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

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-transparent text-white z-50 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64
      `}>
        <div className="p-6 h-full flex flex-col">
          {/* Mobile Close Button */}
          <div className="flex justify-end mb-8 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Community Navigation */}
          <div className="space-y-4 flex-1">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Community Dashboard
            </h3>
            <div className="space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => onTabChange(item.id)}
                    className={`
                      w-full justify-start h-14 px-5 text-left transition-all duration-200 ease-in-out relative
                      ${isActive 
                        ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30' 
                        : 'bg-white/5 text-gray-300 hover:bg-blue-500/30 hover:text-white'
                      }
                      rounded-lg font-medium
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.emoji}</span>
                      <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Annette BubbleChat - Fixed at bottom of sidebar */}
          <div className="mt-auto pt-4">
            <Button
              onClick={() => setIsBubbleChatOpen(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
            >
              💅 Chat with Annette
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 bg-card/95 backdrop-blur-md border-b border-border/20 z-30 p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-bold text-lg">Hall of Prestige</h1>
            <div className="w-8" />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-6 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 mb-6">
            {/* Main Card Block */}
            <Card className="xl:col-span-3 rounded-xl bg-white/10 backdrop-blur-md shadow-md border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    Hall of Prestige
                    <Badge variant="secondary" className="bg-muted/50">
                      Active
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderTabContent()}
              </CardContent>
            </Card>

            {/* Right Panel */}
            <Card className="rounded-xl bg-white/10 backdrop-blur-md shadow-md border-white/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Community Hub
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rightPanelContent}
              </CardContent>
            </Card>
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