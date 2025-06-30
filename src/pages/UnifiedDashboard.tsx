import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleSwitch } from "@/contexts/RoleSwitchContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp,
  Zap,
  Heart,
  MessageSquare,
  Bell
} from "lucide-react";
import Header from "@/components/Header";
import ServiceCard from "@/components/home/ServiceCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import VideoBackground from "@/components/common/VideoBackground";

const UnifiedDashboard = () => {
  const { user } = useAuth();
  const { currentRole, switchRole } = useRoleSwitch();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, [user, currentRole]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Mock data for now - in production, this would come from Supabase
      setDashboardData({
        stats: {
          totalBookings: 12,
          activeJobs: 3,
          monthlyRevenue: 2450,
          rating: 4.8
        },
        recentActivity: [
          { id: 1, type: 'booking', title: 'New plumbing request', time: '2 hours ago' },
          { id: 2, type: 'message', title: 'Message from client', time: '4 hours ago' },
          { id: 3, type: 'payment', title: 'Payment received', time: '1 day ago' }
        ]
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      id: 1,
      title: "Home Cleaning",
      description: "Professional cleaning services for your home",
      price: 80,
      rating: 4.8,
      image: "/lovable-uploads/cleaning-service.jpg",
      category: "cleaning"
    },
    {
      id: 2,
      title: "Plumbing Repair",
      description: "Expert plumbing services and repairs",
      price: 120,
      rating: 4.9,
      image: "/lovable-uploads/plumbing-service.jpg",
      category: "plumbing"
    },
    {
      id: 3,
      title: "Electrical Work",
      description: "Safe and reliable electrical services",
      price: 150,
      rating: 4.7,
      image: "/lovable-uploads/electrical-service.jpg",
      category: "electrical"
    }
  ];

  if (loading) {
    return (
      <>
        <VideoBackground />
        <div className="relative z-10 min-h-screen">
          <Header />
          <div className="pt-12 px-2 pb-4">
            <div className="max-w-none mx-2">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-white/20 rounded w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-white/20 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-12 px-2 pb-4">
          <div className="max-w-none mx-2">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white text-shadow-lg">
                  {currentRole === 'provider' ? 'Provider Dashboard' : 'Customer Dashboard'}
                </h1>
                <p className="text-white/90 text-shadow mt-1">
                  {currentRole === 'provider' 
                    ? 'Manage your services and track performance'
                    : 'Find and book services in your area'
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => switchRole(currentRole === 'provider' ? 'customer' : 'provider')}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                >
                  Switch to {currentRole === 'provider' ? 'Customer' : 'Provider'}
                </Button>
                <Badge className="bg-blue-500/80 text-white">
                  {currentRole === 'provider' ? 'Provider Mode' : 'Customer Mode'}
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-olive-green-transparent hover:shadow-lg transition-shadow border-2 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white text-shadow">
                        {currentRole === 'provider' ? 'Total Bookings' : 'Services Booked'}
                      </p>
                      <p className="text-2xl font-bold text-white text-shadow-lg">
                        {dashboardData?.stats?.totalBookings || '0'}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-white/80 drop-shadow-md" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-olive-green-transparent hover:shadow-lg transition-shadow border-2 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white text-shadow">
                        {currentRole === 'provider' ? 'Active Jobs' : 'Pending Requests'}
                      </p>
                      <p className="text-2xl font-bold text-white text-shadow-lg">
                        {dashboardData?.stats?.activeJobs || '0'}
                      </p>
                    </div>
                    <Zap className="h-8 w-8 text-white/80 drop-shadow-md" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-olive-green-transparent hover:shadow-lg transition-shadow border-2 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white text-shadow">
                        {currentRole === 'provider' ? 'Monthly Revenue' : 'Total Spent'}
                      </p>
                      <p className="text-2xl font-bold text-white text-shadow-lg">
                        ${dashboardData?.stats?.monthlyRevenue || '0'}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-white/80 drop-shadow-md" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-olive-green-transparent hover:shadow-lg transition-shadow border-2 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white text-shadow">Rating</p>
                      <p className="text-2xl font-bold text-white text-shadow-lg">
                        {dashboardData?.stats?.rating || '0'}
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-white/80 drop-shadow-md" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-sm">
                <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="services" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                  {currentRole === 'provider' ? 'My Services' : 'Browse Services'}
                </TabsTrigger>
                <TabsTrigger value="activity" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="bg-olive-green-transparent border-2 border-white/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white text-shadow">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dashboardData?.recentActivity?.map((activity: any) => (
                          <div key={activity.id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <div>
                                <p className="font-medium text-white text-shadow">{activity.title}</p>
                                <p className="text-sm text-white/80 text-shadow">{activity.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-olive-green-transparent border-2 border-white/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white text-shadow">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        <Link to="/bookings">
                          <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
                            <Calendar className="h-4 w-4 mr-2" />
                            Bookings
                          </Button>
                        </Link>
                        <Link to="/manager">
                          <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
                            <Users className="h-4 w-4 mr-2" />
                            Manager Hub
                          </Button>
                        </Link>
                        <Link to="/analytics-dashboard">
                          <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Analytics
                          </Button>
                        </Link>
                        <Link to="/admin">
                          <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
                            <Zap className="h-4 w-4 mr-2" />
                            Admin
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                {currentRole === 'customer' && (
                  <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                      <Input
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm"
                      />
                    </div>
                    <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card className="bg-olive-green-transparent border-2 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-shadow">Activity Feed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 text-center py-8 text-shadow">Activity feed coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnifiedDashboard;
