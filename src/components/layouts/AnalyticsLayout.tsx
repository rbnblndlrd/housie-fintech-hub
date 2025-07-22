import React, { ReactNode, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Receipt, 
  Zap,
  DollarSign,
  Menu,
  X
} from 'lucide-react';
import { AnnetteIntegration } from '@/components/assistant/AnnetteIntegration';

interface AnalyticsLayoutProps {
  children: ReactNode;
  title?: string;
  rightPanelTitle?: string;
  rightPanelContent?: ReactNode;
  bottomWidgets?: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AnalyticsLayout: React.FC<AnalyticsLayoutProps> = ({
  children,
  title = "Analytics Dashboard",
  rightPanelTitle = "Analytics Tools",
  rightPanelContent,
  bottomWidgets,
  activeTab,
  onTabChange
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { 
      id: 'financial', 
      label: 'Financial Analytics', 
      icon: DollarSign, 
      emoji: '💰'
    },
    { 
      id: 'business', 
      label: 'Business Insights', 
      icon: BarChart3, 
      emoji: '📊'
    },
    { 
      id: 'performance', 
      label: 'Performance Metrics', 
      icon: Zap, 
      emoji: '⚡'
    },
    { 
      id: 'tax', 
      label: 'Tax Reports', 
      icon: Receipt, 
      emoji: '📄'
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
            <div className="space-y-2">
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

        {/* Compact Analytics Content */}
        <div className="px-2 md:px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-4">
              {/* Main Analytics Panel */}
              <div className="xl:col-span-3 space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {children}
              </div>

              {/* Right Panel - Analytics Tools */}
              {rightPanelContent && (
                <Card className="rounded-xl bg-card/95 backdrop-blur-md shadow-md border-border/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {rightPanelTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {rightPanelContent}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Bottom Widgets */}
            {bottomWidgets && (
              <div className="mb-4">
                {bottomWidgets}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Annette AI Assistant Integration */}
      <AnnetteIntegration />
    </div>
  );
};

export default AnalyticsLayout;