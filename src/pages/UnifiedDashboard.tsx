
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { 
  CalendarDays, 
  DollarSign, 
  Star, 
  Users, 
  TrendingUp, 
  MapPin, 
  Clock,
  UserCheck,
  Heart,
  Award,
  UsersIcon,
  Plus
} from 'lucide-react';
import CommunityRatingDisplay from '@/components/provider/CommunityRatingDisplay';
import ShopPointsWidget from '@/components/admin/ShopPointsWidget';
import { useShopPoints } from '@/hooks/useShopPoints';

const UnifiedDashboard = () => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();
  const { toast } = useToast();
  const { shopPointsData } = useShopPoints();
  
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    communityRatingPoints: 0,
    favoriteProviders: 0,
    completedBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
      loadUserGroups();
    }
  }, [user, currentRole]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (currentRole === 'provider') {
        await loadProviderData();
      } else {
        await loadCustomerData();
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

  const loadUserGroups = async () => {
    // TODO: Load user's groups when groups table is created
    // This is a placeholder for now
    setUserGroups([]);
  };

  const loadProviderData = async () => {
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
        communityRatingPoints: profile.community_rating_points || 0,
        favoriteProviders: 0,
        completedBookings: completedBookings.length
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
  };

  const loadCustomerData = async () => {
    // Get customer bookings
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('customer_id', user?.id);

    const totalBookings = bookings?.length || 0;
    const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
    const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;

    setStats({
      totalBookings,
      pendingBookings,
      monthlyRevenue: 0,
      averageRating: 0,
      communityRatingPoints: 0,
      favoriteProviders: 0,
      completedBookings
    });

    // Get recent bookings
    const { data: recent } = await supabase
      .from('bookings')
      .select(`
        *,
        services:service_id (title),
        provider_profiles:provider_id (business_name)
      `)
      .eq('customer_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(5);

    setRecentBookings(recent || []);
  };

  const renderCustomerView = () => (
    <div className="space-y-6">
      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedBookings}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
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
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Groups</p>
                <p className="text-2xl font-bold text-gray-900">{userGroups.length}</p>
              </div>
              <UsersIcon className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Content Tabs */}
      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
          <TabsTrigger value="groups">My Groups</TabsTrigger>
          <TabsTrigger value="collectives">Customer Collectives</TabsTrigger>
          <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
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
                        <p className="text-sm text-gray-600">{booking.provider_profiles?.business_name || 'Provider'}</p>
                      </div>
                      <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent bookings</p>
                  <Button className="mt-4" onClick={() => window.location.href = '/services'}>
                    Browse Services
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups">
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                My Groups
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                Groups system coming soon! Join customer collectives to get bulk discounts.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collectives">
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle>Customer Collectives</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                Join collectives to get bulk discounts on services!
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-actions">
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <CalendarDays className="h-6 w-6" />
                  Book Service
                </Button>
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <MapPin className="h-6 w-6" />
                  Find Nearby
                </Button>
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <Star className="h-6 w-6" />
                  Leave Review
                </Button>
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <Users className="h-6 w-6" />
                  Join Collective
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderProviderView = () => (
    <div className="space-y-6">
      {/* Provider Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-sm font-medium text-gray-600">Groups</p>
                <p className="text-2xl font-bold text-gray-900">{userGroups.length}</p>
              </div>
              <UsersIcon className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Provider Content Tabs */}
      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jobs">Job Management</TabsTrigger>
          <TabsTrigger value="crews">Provider Crews</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle>Recent Jobs</CardTitle>
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
                <p className="text-gray-500 text-center py-8">No recent jobs</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crews">
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Provider Crews
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Crew
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                Create crews to tackle big opportunities together! $10/month license to create crews.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>This Month</span>
                    <span className="font-bold">${stats.monthlyRevenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed Jobs</span>
                    <span>{stats.completedBookings}</span>
                  </div>
                </div>
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

        <TabsContent value="community">
          {user && <CommunityRatingDisplay userId={user.id} />}
        </TabsContent>
      </Tabs>
    </div>
  );

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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              {currentRole === 'customer' && 'Manage your bookings and join customer collectives'}
              {currentRole === 'provider' && 'Manage your services and provider crews'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {currentRole}
            </Badge>
            {shopPointsData && currentRole === 'provider' && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                {shopPointsData.shopPoints} Shop Points
              </Badge>
            )}
          </div>
        </div>

        {/* Dynamic content based on active role */}
        {currentRole === 'customer' && renderCustomerView()}
        {currentRole === 'provider' && renderProviderView()}
      </div>
    </div>
  );
};

export default UnifiedDashboard;
