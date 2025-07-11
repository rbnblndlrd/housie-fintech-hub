import React, { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Map, 
  MessageSquare, 
  TrendingUp, 
  DollarSign, 
  Star, 
  Briefcase,
  Menu,
  X,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnnetteIntegration } from '@/components/assistant/AnnetteIntegration';
import autumnBg from '@/assets/autumn-dashboard-bg.jpg';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  rightPanelTitle?: string;
  rightPanelContent?: ReactNode;
  bottomWidgets?: ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title = "Dashboard Module",
  rightPanelTitle = "Today's Route",
  rightPanelContent,
  bottomWidgets
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [widgetsVisible, setWidgetsVisible] = useState(true);
  const [widgetsLocked, setWidgetsLocked] = useState(false);

  const navItems: NavItem[] = [
    { id: 'job-hub', label: 'Job Hub', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/bookings' },
    { id: 'map', label: 'Map View', icon: Map, path: '/map' },
    { id: 'community', label: 'Community', icon: MessageSquare, path: '/community-dashboard' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/analytics-dashboard' },
  ];

  const defaultStats: StatCard[] = [
    {
      title: "Performance",
      value: "94%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Earnings",
      value: "$2,450",
      change: "+12.5%",
      icon: DollarSign,
      color: "from-yellow-500 to-orange-600"
    },
    {
      title: "Rating",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "Active Jobs",
      value: "3",
      change: "+1",
      icon: Briefcase,
      color: "from-blue-500 to-cyan-600"
    }
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };


  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ 
        backgroundImage: `url(${autumnBg})`,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-card/95 backdrop-blur-md border-r border-border/20 z-50 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 lg:w-72
      `}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-foreground">HOUSIE</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={isActiveRoute(item.path) ? "default" : "ghost"}
                className={`w-full justify-start text-left ${
                  isActiveRoute(item.path) 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
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
            <div className="w-8" /> {/* Spacer */}
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-6 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
            {/* Main Card Block */}
            <Card className="xl:col-span-3 bg-card/95 backdrop-blur-md border-border/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-between">
                  {title}
                  <Badge variant="secondary" className="bg-muted/50">
                    Active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {children}
              </CardContent>
            </Card>

            {/* Right Panel */}
            <Card className="bg-card/95 backdrop-blur-md border-border/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {rightPanelTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rightPanelContent || (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
                      <div className="text-muted-foreground">
                        <Map className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Drag items here</p>
                        <p className="text-xs opacity-60">Future integration</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bottom Widget Row */}
          {widgetsVisible && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Performance Stats</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setWidgetsLocked(!widgetsLocked)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {widgetsLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setWidgetsVisible(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <EyeOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {bottomWidgets || defaultStats.map((stat, index) => (
                  <Card key={index} className="bg-card/95 backdrop-blur-md border-border/20 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          <p className="text-sm text-green-600">{stat.change}</p>
                        </div>
                        <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Show Widgets Button (when hidden) */}
          {!widgetsVisible && (
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => setWidgetsVisible(true)}
                className="bg-card/95 backdrop-blur-md border-border/20"
              >
                <Eye className="h-4 w-4 mr-2" />
                Show Performance Stats
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Annette AI Assistant Integration */}
      <AnnetteIntegration />
    </div>
  );
};

export default DashboardLayout;