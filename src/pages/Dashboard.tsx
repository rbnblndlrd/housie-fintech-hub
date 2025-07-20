
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Route, 
  BarChart3, 
  MessageCircle,
  Menu,
  X
} from 'lucide-react';
import JobHub from '@/components/dashboard/JobHub';
import TodaysRoutePanel from '@/components/dashboard/TodaysRoutePanel';
import PerformanceWidgets from '@/components/dashboard/PerformanceWidgets';
import { StampTrackerWidget } from '@/components/stamps/StampTrackerWidget';
import { AnnetteIntegration } from '@/components/assistant/AnnetteIntegration';
import { TodaysRouteAnchor } from '@/components/dashboard/TacticalHUD/TodaysRouteAnchor';
import { LeftDockPanel } from '@/components/dashboard/LeftDockPanel';
import { LeftAlignedRevollver } from '@/components/dashboard/LeftAlignedRevollver';
import { useActiveBookings } from '@/hooks/useActiveBookings';
import { JobAcceptanceProvider } from '@/contexts/JobAcceptanceContext';
import { GlobalJobAcceptanceOverlay } from '@/components/overlays/GlobalJobAcceptanceOverlay';
import { BookingsProvider } from '@/contexts/BookingsContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('job-hub');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [revollverMounted, setRevollverMounted] = useState(true); // Auto-mount for demo
  
  const { bookings: activeBookings, loading: bookingsLoading } = useActiveBookings();

  // Convert bookings to jobs format - filter out mock jobs in production
  const jobs = activeBookings
    .filter(booking => {
      // Only show mock jobs in development mode
      if (booking.title?.includes('Mock') || booking.customer_name?.includes('Mock')) {
        return process.env.NODE_ENV === 'development';
      }
      return true;
    })
    .map(booking => ({
      id: booking.id,
      title: booking.title,
      service_subcategory: booking.service_subcategory || 'general',
      customer: booking.customer_name || 'Customer',
      priority: booking.priority
    }));

  const navItems = [
    { 
      id: 'job-hub', 
      label: 'Job Hub', 
      icon: Briefcase, 
      emoji: '🛠️'
    },
    { 
      id: 'route-schedule', 
      label: 'Route & Schedule', 
      icon: Route, 
      emoji: '🗺️'
    },
    { 
      id: 'metrics', 
      label: 'Metrics', 
      icon: BarChart3, 
      emoji: '📊'
    },
    { 
      id: 'annette', 
      label: 'Annette', 
      icon: MessageCircle, 
      emoji: '💅'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'job-hub':
        return (
          <div className="space-y-6">
            {bookingsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading active jobs...</p>
              </div>
            ) : (
              <JobHub />
            )}
          </div>
        );
      case 'route-schedule':
        return (
          <div className="space-y-3 md:space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="text-base md:text-lg">Today's Route Control</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3 max-h-[70vh] overflow-y-auto">
                <TodaysRoutePanel />
              </CardContent>
            </Card>
          </div>
        );
      case 'metrics':
        return (
          <div className="space-y-3 md:space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <PerformanceWidgets />
            </div>
            <div className="mt-3 md:mt-6">
              <StampTrackerWidget />
            </div>
          </div>
        );
      case 'annette':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Annette AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">💅</div>
                  <h3 className="text-lg font-semibold mb-2">Annette is Ready</h3>
                  <p className="text-muted-foreground mb-6">
                    Your AI assistant is ready to help with route optimization, ticket parsing, and more.
                  </p>
                  <Button
                    onClick={() => setLeftPanelOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Open Chat Panel
                  </Button>
                </div>
                
                {/* Revollver Status */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Revollver™ Status</span>
                    </div>
                    <Badge variant={revollverMounted ? "default" : "secondary"}>
                      {revollverMounted ? "Active" : "Standby"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {revollverMounted 
                      ? "Radial assistant menu is active and ready for voice commands."
                      : "Revollver is in standby mode."
                    }
                  </p>
                  
                  {/* Debug Controls - Development Only */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-medium mb-2">Debug Controls:</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRevollverMounted(!revollverMounted)}
                        >
                          {revollverMounted ? "Disable" : "Enable"} Revollver
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <JobHub />;
    }
  };

  return (
    <JobAcceptanceProvider>
      <BookingsProvider>
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

              {/* Dashboard Navigation */}
              <div className="space-y-4 flex-1">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                  Dashboard
                </h3>
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => setActiveTab(item.id)}
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
                <h1 className="font-bold text-lg">Dashboard</h1>
                <div className="w-8" />
              </div>
            </header>

            {/* Dashboard Content */}
            <div className="p-2 md:p-4 lg:p-6 relative z-10">
              <div className="grid grid-cols-1 gap-3 md:gap-6">
                {/* Main Card Block - Compact mobile layout */}
                <Card className="rounded-xl bg-white/10 backdrop-blur-md shadow-md border-white/20">
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-lg md:text-2xl font-bold text-foreground flex items-center justify-between">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        Provider Dashboard
                        <Badge variant="secondary" className="bg-muted/50 text-xs md:text-sm">
                          Active
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {renderTabContent()}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Tactical HUD Anchor Card */}
          <TodaysRouteAnchor />
          
          {/* Full Annette Integration with voice lines */}
          <AnnetteIntegration />

          {/* Left Dock Panel for Annette Chat */}
          <LeftDockPanel 
            isOpen={leftPanelOpen}
            onToggle={() => setLeftPanelOpen(!leftPanelOpen)}
            activeTab={activeTab}
          />

          {/* Left-Aligned Revollver */}
          <LeftAlignedRevollver
            isVisible={revollverMounted}
            activeTab={activeTab}
          />

          {/* Global Job Acceptance Overlay */}
          <GlobalJobAcceptanceOverlay />
        </div>
      </BookingsProvider>
    </JobAcceptanceProvider>
  );
};

export default Dashboard;
