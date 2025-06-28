
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Star, Award, Users, ShoppingBag, TrendingUp } from 'lucide-react';

interface User {
  id: string;
  full_name: string;
  email: string;
}

interface UserStats {
  communityRatingPoints: number;
  shopPoints: number;
  totalReviews: number;
  networkConnections: number;
  qualityCommendations: number;
  reliabilityCommendations: number;
  courtesyCommendations: number;
}

const AdminTestingDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadUserStats();
    }
  }, [selectedUser]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email')
        .order('full_name');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadUserStats = async () => {
    if (!selectedUser) return;
    
    try {
      // Get provider profile stats
      const { data: providerData } = await supabase
        .from('provider_profiles')
        .select(`
          community_rating_points,
          shop_points,
          total_reviews,
          network_connections,
          quality_commendations,
          reliability_commendations,
          courtesy_commendations
        `)
        .eq('user_id', selectedUser)
        .single();

      // Get customer credits if no provider profile
      const { data: creditsData } = await supabase
        .from('user_credits')
        .select('total_credits, shop_points')
        .eq('user_id', selectedUser)
        .single();

      setUserStats({
        communityRatingPoints: providerData?.community_rating_points || creditsData?.total_credits || 0,
        shopPoints: providerData?.shop_points || creditsData?.shop_points || 0,
        totalReviews: providerData?.total_reviews || 0,
        networkConnections: providerData?.network_connections || 0,
        qualityCommendations: providerData?.quality_commendations || 0,
        reliabilityCommendations: providerData?.reliability_commendations || 0,
        courtesyCommendations: providerData?.courtesy_commendations || 0,
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const calculateShopPoints = (communityPoints: number) => {
    if (communityPoints < 10) return Math.floor(communityPoints * 0.5);
    if (communityPoints < 50) return Math.floor(communityPoints * 0.75);
    if (communityPoints < 100) return Math.floor(communityPoints * 1.0);
    if (communityPoints < 500) return Math.floor(communityPoints * 1.25);
    return Math.floor(communityPoints * 1.5);
  };

  const getTierInfo = (points: number) => {
    if (points >= 500) return { tier: 'Elite', rate: '1.5x', color: 'bg-purple-500' };
    if (points >= 100) return { tier: 'Premium', rate: '1.25x', color: 'bg-yellow-500' };
    if (points >= 50) return { tier: 'Established', rate: '1.0x', color: 'bg-blue-500' };
    if (points >= 10) return { tier: 'Growing', rate: '0.75x', color: 'bg-green-500' };
    return { tier: 'New', rate: '0.5x', color: 'bg-gray-500' };
  };

  const awardPoints = async (points: number, reason: string) => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.rpc('award_community_rating_points', {
        p_user_id: selectedUser,
        p_points: points,
        p_reason: reason
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Awarded ${points} points for: ${reason}`,
      });
      
      await loadUserStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestReview = async (rating: number, withCommendations = false) => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.rpc('admin_create_test_review', {
        p_provider_user_id: selectedUser,
        p_rating: rating,
        p_comment: rating >= 4 ? 'Excellent service! Very professional.' : 'Service was okay.',
        p_add_commendations: withCommendations
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Created ${rating}★ review${withCommendations ? ' with commendations' : ''}`,
      });
      
      await loadUserStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCommendation = async (type: string) => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.rpc('admin_add_commendation', {
        p_provider_user_id: selectedUser,
        p_commendation_type: type
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Added ${type} commendation`,
      });
      
      await loadUserStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const tierInfo = userStats ? getTierInfo(userStats.communityRatingPoints) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin Testing Dashboard</h2>
        <Badge variant="secondary">Community Rating System</Badge>
      </div>

      {/* User Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a user to test with..." />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedUser && userStats && (
        <>
          {/* Shop Points Economy Display */}
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Shop Points Economy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userStats.communityRatingPoints}</div>
                  <div className="text-sm text-gray-600">Community Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{userStats.shopPoints}</div>
                  <div className="text-sm text-gray-600">Shop Points</div>
                </div>
                <div className="text-center">
                  {tierInfo && (
                    <>
                      <Badge className={`${tierInfo.color} text-white`}>{tierInfo.tier}</Badge>
                      <div className="text-sm text-gray-600 mt-1">Conversion: {tierInfo.rate}</div>
                    </>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {calculateShopPoints(userStats.communityRatingPoints)}
                  </div>
                  <div className="text-sm text-gray-600">Calculated Shop Points</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Rating Controls */}
          <Card className="bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Community Rating Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button 
                  onClick={() => awardPoints(10, 'Admin test +10')}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  +10 Points
                </Button>
                <Button 
                  onClick={() => awardPoints(50, 'Admin test +50')}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  +50 Points
                </Button>
                <Button 
                  onClick={() => awardPoints(100, 'Admin test +100')}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  +100 Points
                </Button>
                <Button 
                  onClick={() => awardPoints(-5, 'Admin penalty')}
                  disabled={loading}
                  variant="destructive"
                >
                  -5 Points
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Review Testing */}
          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Review Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      onClick={() => createTestReview(rating)}
                      disabled={loading}
                      variant={rating >= 4 ? "default" : "outline"}
                      className="flex items-center gap-1"
                    >
                      {rating}
                      <Star className="h-3 w-3" />
                    </Button>
                  ))}
                </div>
                <Button 
                  onClick={() => createTestReview(5, true)}
                  disabled={loading}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  5★ + Detailed Review (Bonus Points)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Commendation Testing */}
          <Card className="bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Commendations ({userStats.qualityCommendations + userStats.reliabilityCommendations + userStats.courtesyCommendations})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Button 
                  onClick={() => addCommendation('quality')}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  +Quality ({userStats.qualityCommendations})
                </Button>
                <Button 
                  onClick={() => addCommendation('reliability')}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  +Reliability ({userStats.reliabilityCommendations})
                </Button>
                <Button 
                  onClick={() => addCommendation('courtesy')}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  +Courtesy ({userStats.courtesyCommendations})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Network Connections */}
          <Card className="bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Network Connections ({userStats.networkConnections})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => awardPoints(0, 'Network connection test')}
                disabled={loading}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Simulate Network Growth
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminTestingDashboard;
