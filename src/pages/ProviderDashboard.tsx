
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { CalendarDays, DollarSign, Star, Users, TrendingUp } from "lucide-react";
import CommunityRatingDisplay from "@/components/provider/CommunityRatingDisplay";
import ShopPointsWidget from "@/components/admin/ShopPointsWidget";
import { useShopPoints } from "@/hooks/useShopPoints";
import VideoBackground from "@/components/common/VideoBackground";

const ProviderDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { shopPointsData } = useShopPoints();
  
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    communityRatingPoints: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get provider profile
      const { data: profile } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profile) {
        // Get bookings stats
        const { data: bookings } = await supabase
          .from('bookings')
          .select('*')
          .eq('provider_id', profile.id);

        const totalBookings = bookings?.length || 0;
        const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
        const completedBookings = bookings?.filter(b => b.status === 'completed') || [];
        const monthlyRevenue = completedBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);

        setStats({
          totalBookings,
          pendingBookings,
          monthlyRevenue,
          averageRating: profile.average_rating || 0,
          communityRatingPoints: profile.community_rating_points || 0
        });

        // Get recent bookings
        const { data: recent } = await supabase
          .from('bookings')
          .select(`
            *,
            services:service_id (title),
            users:customer_id (full_name)
          `)
          .eq('provider_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentBookings(recent || []);
      }
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

  const awardTestPoints = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase.rpc('award_community_rating_points', {
        p_user_id: user.id,
        p_points: 10,
        p_reason: 'Test points from dashboard'
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Awarded 10 community rating points!",
      });
      
      loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white text-shadow-lg">Provider Dashboard</h1>
                <p className="text-white/90 text-shadow mt-2">Manage your services and track your performance</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">Provider</Badge>
                {shopPointsData && (
                  <Badge className="bg-purple-500/80 text-white border-purple-300/50">
                    {shopPointsData.shopPoints} Shop Points
                  </Badge>
                )}
              </div>
            </div>

            {/* Stats Cards with slate background */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-slate-800/60 hover:bg-slate-800/70 transition-all duration-200 border-slate-600/30 backdrop-blur-md shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white text-shadow">Total Bookings</p>
                      <p className="text-2xl font-bold text-white text-shadow-lg">{stats.totalBookings}</p>
                    </div>
                    <CalendarDays className="h-8 w-8 text-white/80 drop-shadow-md" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 hover:bg-slate-800/70 transition-all duration-200 border-slate-600/30 backdrop-blur-md shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white text-shadow">Pending</p>
                      <p className="text-2xl font-bold text-white text-shadow-lg">{stats.pendingBookings}</p>
                    </div>
                    <Users className="h-8 w-8 text-white/80 drop-shadow-md" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 hover:bg-slate-800/70 transition-all duration-200 border-slate-600/30 backdrop-blur-md shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white text-shadow">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-white text-shadow-lg">${stats.monthlyRevenue}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-white/80 drop-shadow-md" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 hover:bg-slate-800/70 transition-all duration-200 border-slate-600/30 backdrop-blur-md shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white text-shadow">Rating</p>
                      <p className="text-2xl font-bold text-white text-shadow-lg">{stats.averageRating.toFixed(1)}</p>
                    </div>
                    <Star className="h-8 w-8 text-white/80 drop-shadow-md" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-sm">
                <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Overview</TabsTrigger>
                <TabsTrigger value="bookings" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Bookings</TabsTrigger>
                <TabsTrigger value="community" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Community</TabsTrigger>
                <TabsTrigger value="testing" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Testing</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-white text-shadow">Recent Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {recentBookings.length > 0 ? (
                        <div className="space-y-3">
                          {recentBookings.map((booking: any) => (
                            <div key={booking.id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                              <div>
                                <p className="font-medium text-white text-shadow">{booking.services?.title || 'Service'}</p>
                                <p className="text-sm text-white/80 text-shadow">{booking.users?.full_name || 'Customer'}</p>
                              </div>
                              <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'} className="bg-white/20 text-white border-white/30">
                                {booking.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/80 text-center py-8 text-shadow">No recent bookings</p>
                      )}
                    </CardContent>
                  </Card>

                  {shopPointsData && (
                    <div className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl rounded-lg">
                      <ShopPointsWidget 
                        communityPoints={shopPointsData.communityPoints}
                        shopPoints={shopPointsData.shopPoints}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-4">
                <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-shadow">All Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 text-center py-8 text-shadow">Booking management coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="community" className="space-y-4">
                <div className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl rounded-lg p-6">
                  {user && <CommunityRatingDisplay userId={user.id} />}
                </div>
              </TabsContent>

              <TabsContent value="testing" className="space-y-4">
                <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white text-shadow">
                      <TrendingUp className="h-5 w-5" />
                      Testing Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-white/20">
                          <h4 className="font-medium text-white mb-2 text-shadow">Community Points</h4>
                          <p className="text-sm text-white/80 mb-3 text-shadow">Current: {stats.communityRatingPoints} points</p>
                          <Button onClick={awardTestPoints} className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
                            +10 Test Points
                          </Button>
                        </div>
                        
                        {shopPointsData && (
                          <div className="p-4 bg-purple-500/20 rounded-lg backdrop-blur-sm border border-white/20">
                            <h4 className="font-medium text-white mb-2 text-shadow">Shop Points</h4>
                            <p className="text-sm text-white/80 mb-1 text-shadow">Current: {shopPointsData.shopPoints} points</p>
                            <p className="text-xs text-white/70 mb-3 text-shadow">Tier: {shopPointsData.tier} ({shopPointsData.conversionRate}x)</p>
                            <div className="text-xs text-white/70 text-shadow">
                              Auto-calculated from community points
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm text-white/80 bg-white/10 p-3 rounded backdrop-blur-sm text-shadow">
                        <strong>Note:</strong> Shop points are automatically calculated from community points using a tiered system.
                        The more community points you earn, the better your conversion rate becomes!
                      </div>
                    </div>
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

export default ProviderDashboard;
