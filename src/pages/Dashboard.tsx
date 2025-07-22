
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
import { RevolverMenu } from '@/components/chat/RevolverMenu';
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
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            {/* Main Job Hub Content */}
            <div className="xl:col-span-3 space-y-4">
              {bookingsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-3"></div>
                  <p className="text-muted-foreground text-sm">Loading active jobs...</p>
                </div>
              ) : (
                <JobHub />
              )}
            </div>
            {/* Right Panel - Job Hub Tools */}
            <Card className="bg-card/95 backdrop-blur-md border-border/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Briefcase className="h-4 w-4 mr-2" />
                  View All Jobs
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Route className="h-4 w-4 mr-2" />
                  Plan Route
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case 'route-schedule':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            {/* Main Route Content */}
            <div className="xl:col-span-3">
              <Card className="bg-card/95 backdrop-blur-md border-border/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Today's Route Control</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3 max-h-[calc(100vh-10rem)] overflow-y-auto">
                  <TodaysRoutePanel />
                </CardContent>
              </Card>
            </div>
            {/* Right Panel - Route Tools */}
            <Card className="bg-card/95 backdrop-blur-md border-border/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Route Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Route className="h-4 w-4 mr-2" />
                  GPS Navigation
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Optimize Route
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case 'metrics':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            {/* Main Metrics Content */}
            <div className="xl:col-span-3 space-y-4">
              {/* Performance Widgets - Consistent with Analytics Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <PerformanceWidgets />
              </div>
              {/* Stamp MVP - Fully Restored */}
              <StampTrackerWidget showBroadcastControls={false} />
            </div>
            {/* Right Panel - Metrics Tools */}
            <Card className="bg-card/95 backdrop-blur-md border-border/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Performance Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ask Annette
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case 'annette':
        return (
          <div className="min-h-[calc(100vh-8rem)] flex flex-col bg-gradient-to-br from-background to-muted/20 rounded-lg border border-border/20">
            {/* Unified Annette Header */}
            <div className="p-4 border-b border-border/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💅</div>
                  <div>
                    <h3 className="text-lg font-semibold">Annette AI Assistant</h3>
                    <p className="text-sm text-muted-foreground">Your intelligent service companion</p>
                  </div>
                </div>
                <Badge variant={revollverMounted ? "default" : "secondary"} className="text-xs">
                  {revollverMounted ? "Active" : "Standby"}
                </Badge>
              </div>
            </div>

            {/* Annette Chat Interface */}
            <div className="flex-1 p-6">
              <div className="text-center py-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold">Revolver™ is mounted!</span>
                  <Badge variant="default" className="bg-green-600 text-xs">Active</Badge>
                </div>
                <div className="space-y-4 max-w-md mx-auto">
                  <Button
                    onClick={() => setLeftPanelOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-3 w-full"
                  >
                    💅 Start Conversation
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Ready for route optimization, ticket parsing, and smart insights
                  </p>
                  <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
                    🎯 <strong>Revolver Ready:</strong> Right-click the radial menu (bottom-right) for quick actions
                  </div>
                </div>
              </div>
            </div>
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

      {/* Unified Tab Strip - Directly Below HOUSIE Header */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/20">
        <div className="px-3 py-1.5">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    flex-shrink-0 h-9 px-3 text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                    rounded-md font-medium
                  `}
                >
                  <span className="mr-1.5">{item.emoji}</span>
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
                        setActiveTab(item.id);
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

      {/* Unified Main Content Area */}
      <div className="pt-26">
        {/* Mobile Tab Menu Toggle */}
        <div className="lg:hidden fixed top-16 right-3 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="bg-background/80 backdrop-blur-sm h-8 w-8 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Unified Dashboard Content - Analytics-Style Layout */}
        <div className="px-3 md:px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'annette' ? (
              <div className="min-h-[calc(100vh-7rem)] flex flex-col">
                <div className="flex-1 max-w-5xl mx-auto w-full">
                  {renderTabContent()}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {renderTabContent()}
              </div>
            )}
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

          {/* Working Radial Revolver - Positioned bottom-right */}
          <div className="fixed bottom-6 right-6 z-50">
            <RevolverMenu />
          </div>

          {/* Global Job Acceptance Overlay */}
          <GlobalJobAcceptanceOverlay />
        </div>
      </BookingsProvider>
    </JobAcceptanceProvider>
  );
};

export default Dashboard;
