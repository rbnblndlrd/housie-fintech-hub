
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
          <div className="space-y-3">
            {bookingsLoading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-3"></div>
                <p className="text-muted-foreground text-sm">Loading active jobs...</p>
              </div>
            ) : (
              <JobHub />
            )}
          </div>
        );
      case 'route-schedule':
        return (
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today's Route Control</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto">
              <TodaysRoutePanel />
            </CardContent>
          </Card>
        );
      case 'metrics':
        return (
          <div className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <PerformanceWidgets />
            </div>
            <StampTrackerWidget />
          </div>
        );
      case 'annette':
        return (
          <div className="min-h-[calc(100vh-10rem)] flex flex-col bg-gradient-to-br from-background to-muted/20 rounded-lg">
            {/* Compact Annette Header */}
            <div className="p-4 border-b border-border/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">💅</div>
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

            {/* Chat Interface Area - Full Height */}
            <div className="flex-1 p-4">
              <div className="text-center py-12">
                <Button
                  onClick={() => setLeftPanelOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-3"
                >
                  💅 Start Conversation
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Ready for route optimization, ticket parsing, and smart insights
                </p>
              </div>
              
              {/* Debug Controls - Development Only */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-3 bg-muted/30 rounded-lg max-w-md mx-auto">
                  <p className="text-xs font-medium mb-2">Debug Controls:</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRevollverMounted(!revollverMounted)}
                    className="text-xs"
                  >
                    {revollverMounted ? "Disable" : "Enable"} Revollver
                  </Button>
                </div>
              )}
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
                      onClick={() => setActiveTab(item.id)}
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

            {/* Compact Dashboard Content */}
            <div className="px-2 md:px-4 relative z-10">
              {/* Annette Chat Integration - Primary Widget */}
              {activeTab === 'annette' ? (
                <div className="min-h-[calc(100vh-8rem)] flex flex-col">
                  <div className="flex-1 max-w-4xl mx-auto w-full">
                    {renderTabContent()}
                  </div>
                </div>
              ) : (
                <div className="max-w-7xl mx-auto">
                  <div className="space-y-3">
                    {renderTabContent()}
                  </div>
                </div>
              )}
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
