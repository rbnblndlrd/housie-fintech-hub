import React, { ReactNode, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Users, 
  Trophy, 
  MessageCircle,
  Menu,
  X
} from 'lucide-react';
import { AnnetteIntegration } from '@/components/assistant/AnnetteIntegration';

interface CommunityLayoutProps {
  children: ReactNode;
  title?: string;
  rightPanelTitle?: string;
  rightPanelContent?: ReactNode;
  bottomWidgets?: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CommunityLayout: React.FC<CommunityLayoutProps> = ({
  children,
  title = "Hall of Prestige",
  rightPanelTitle = "Community Hub",
  rightPanelContent,
  bottomWidgets,
  activeTab,
  onTabChange
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { 
      id: 'discover', 
      label: 'Discover', 
      icon: Globe, 
      emoji: '🌍'
    },
    { 
      id: 'network', 
      label: 'Network', 
      icon: Users, 
      emoji: '👥'
    },
    { 
      id: 'recognition', 
      label: 'Prestige', 
      icon: Trophy, 
      emoji: '🏆'
    },
    { 
      id: 'social', 
      label: 'Social', 
      icon: MessageCircle, 
      emoji: '💬'
    }
  ];

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
        fixed top-0 left-0 h-full bg-white/5 backdrop-blur-sm text-white z-50 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64
      `}>
        <div className="p-6">
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
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Community
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
                      ${isActive ? 'active-tab' : ''}
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
            <h1 className="font-bold text-lg">{title}</h1>
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
                    {title}
                    <Badge variant="secondary" className="bg-muted/50">
                      Active
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {children}
              </CardContent>
            </Card>

            {/* Right Panel */}
            <Card className="rounded-xl bg-white/10 backdrop-blur-md shadow-md border-white/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {rightPanelTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rightPanelContent}
              </CardContent>
            </Card>
          </div>

          {/* Bottom Widgets */}
          {bottomWidgets && (
            <div className="mb-6">
              {bottomWidgets}
            </div>
          )}
        </div>
      </div>

      {/* Annette AI Assistant Integration */}
      <AnnetteIntegration />
    </div>
  );
};

export default CommunityLayout;