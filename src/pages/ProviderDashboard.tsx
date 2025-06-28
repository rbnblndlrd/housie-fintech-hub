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
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your services and track your performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Provider</Badge>
            {shopPointsData && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                {shopPointsData.shopPoints} Shop Points
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="fintech-card hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="fintech-card hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="fintech-card hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="fintech-card hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentBookings.length > 0 ? (
                    <div className="space-y-4">
                      {recentBookings.map((booking: any) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{booking.services?.title || 'Service'}</p>
                            <p className="text-sm text-gray-600">{booking.users?.full_name || 'Customer'}</p>
                          </div>
                          <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No recent bookings</p>
                  )}
                </CardContent>
              </Card>

              {shopPointsData && (
                <ShopPointsWidget 
                  communityPoints={shopPointsData.communityPoints}
                  shopPoints={shopPointsData.shopPoints}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">Booking management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            {user && <CommunityRatingDisplay userId={user.id} />}
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Testing Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Community Points</h4>
                      <p className="text-sm text-blue-700 mb-3">Current: {stats.communityRatingPoints} points</p>
                      <Button onClick={awardTestPoints} className="w-full">
                        +10 Test Points
                      </Button>
                    </div>
                    
                    {shopPointsData && (
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">Shop Points</h4>
                        <p className="text-sm text-purple-700 mb-1">Current: {shopPointsData.shopPoints} points</p>
                        <p className="text-xs text-purple-600 mb-3">Tier: {shopPointsData.tier} ({shopPointsData.conversionRate}x)</p>
                        <div className="text-xs text-purple-600">
                          Auto-calculated from community points
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
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
  );
};

export default ProviderDashboard;
