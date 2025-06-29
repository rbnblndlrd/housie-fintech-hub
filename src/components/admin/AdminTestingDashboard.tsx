
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Star, Award, MessageCircle, ThumbsUp, ShoppingBag, AlertTriangle } from 'lucide-react';
import ShopPointsWidget from './ShopPointsWidget';

// Use AdminUser to avoid conflicts with other User types
interface AdminUser {
  id: string;
  full_name: string;
  email: string;
}

interface UserStats {
  communityRatingPoints: number;
  totalReviews: number;
  networkConnections: number;
  qualityCommendations: number;
  reliabilityCommendations: number;
  courtesyCommendations: number;
  shopPoints: number;
}

const AdminTestingDashboard = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Load user stats when selected user changes
  useEffect(() => {
    if (selectedUser) {
      loadUserStats(selectedUser.id);
    }
  }, [selectedUser]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email')
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('❌ Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async (userId: string) => {
    try {
      // Get provider profile data
      const { data: providerProfile, error: providerError } = await supabase
        .from('provider_profiles')
        .select(`
          community_rating_points,
          shop_points,
          network_connections,
          total_reviews,
          quality_commendations,
          reliability_commendations,
          courtesy_commendations
        `)
        .eq('user_id', userId)
        .single();

      if (providerError && providerError.code !== 'PGRST116') {
        console.error('Provider profile error:', providerError);
      }

      // Get user credits for customers  
      const { data: userCredits, error: creditsError } = await supabase
        .from('user_credits')
        .select('total_credits, shop_points')
        .eq('user_id', userId)
        .single();

      if (creditsError && creditsError.code !== 'PGRST116') {
        console.error('User credits error:', creditsError);
      }

      // Use provider data if available, otherwise use customer data
      const communityRatingPoints = providerProfile?.community_rating_points || userCredits?.total_credits || 0;
      const shopPoints = providerProfile?.shop_points || userCredits?.shop_points || 0;

      setUserStats({
        communityRatingPoints,
        totalReviews: providerProfile?.total_reviews || 0,
        networkConnections: providerProfile?.network_connections || 0,
        qualityCommendations: providerProfile?.quality_commendations || 0,
        reliabilityCommendations: providerProfile?.reliability_commendations || 0,
        courtesyCommendations: providerProfile?.courtesy_commendations || 0,
        shopPoints
      });
    } catch (error: any) {
      console.error('❌ Error loading user stats:', error);
      toast({
        title: "Error",
        description: "Failed to load user statistics",
        variant: "destructive"
      });
    }
  };

  const addCommunityPoints = async (points: number, reason: string) => {
    if (!selectedUser) return;

    setOperationLoading(true);
    setLastError(null);
    
    try {
      console.log('🎯 Adding community points:', { userId: selectedUser.id, points, reason });
      
      const { error } = await supabase.rpc('award_community_rating_points', {
        p_user_id: selectedUser.id,
        p_points: points,
        p_reason: reason
      });

      if (error) {
        console.error('❌ Community points error:', error);
        throw error;
      }

      console.log('✅ Successfully added community points');
      
      toast({
        title: "Success",
        description: `Added ${points} community points to ${selectedUser.full_name}`,
      });

      // Reload user stats
      await loadUserStats(selectedUser.id);
    } catch (error: any) {
      console.error('❌ Error adding community points:', error);
      const errorMsg = error.message || "Failed to add community points";
      setLastError(errorMsg);
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setOperationLoading(false);
    }
  };

  const createTestReview = async (rating: number) => {
    if (!selectedUser) return;

    setOperationLoading(true);
    setLastError(null);
    
    try {
      console.log('🎯 Creating test review:', { userId: selectedUser.id, rating });
      
      const { error } = await supabase.rpc('admin_create_test_review', {
        p_provider_user_id: selectedUser.id,
        p_rating: rating,
        p_comment: `Admin test review - ${rating} stars`,
        p_add_commendations: rating >= 4
      });

      if (error) {
        console.error('❌ Test review error:', error);
        
        // Provide specific error handling
        if (error.code === '23503') {
          const errorMsg = "Database constraint violation. The user may not have a proper provider profile or required dependencies are missing.";
          setLastError(errorMsg);
          throw new Error(errorMsg);
        }
        
        throw error;
      }

      console.log('✅ Successfully created test review');
      
      toast({
        title: "Success",
        description: `Created ${rating}-star test review for ${selectedUser.full_name}`,
      });

      // Reload user stats
      await loadUserStats(selectedUser.id);
    } catch (error: any) {
      console.error('❌ Error creating test review:', error);
      const errorMsg = error.message || "Failed to create test review";
      setLastError(errorMsg);
      
      toast({
        title: "Error", 
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setOperationLoading(false);
    }
  };

  const addCommendation = async (type: string) => {
    if (!selectedUser) return;

    setOperationLoading(true);
    setLastError(null);
    
    try {
      console.log('🎯 Adding commendation:', { userId: selectedUser.id, type });
      
      const { error } = await supabase.rpc('admin_add_commendation', {
        p_provider_user_id: selectedUser.id,
        p_commendation_type: type
      });

      if (error) {
        console.error('❌ Commendation error:', error);
        
        // Provide specific error handling
        if (error.code === '23503') {
          const errorMsg = "Database constraint violation. The user may not have a proper provider profile or required dependencies are missing.";
          setLastError(errorMsg);
          throw new Error(errorMsg);
        }
        
        throw error;
      }

      console.log('✅ Successfully added commendation');
      
      toast({
        title: "Success",
        description: `Added ${type} commendation to ${selectedUser.full_name}`,
      });

      // Reload user stats
      await loadUserStats(selectedUser.id);
    } catch (error: any) {
      console.error('❌ Error adding commendation:', error);
      const errorMsg = error.message || "Failed to add commendation";
      setLastError(errorMsg);
      
      toast({
        title: "Error",
        description: errorMsg, 
        variant: "destructive"
      });
    } finally {
      setOperationLoading(false);
    }
  };

  const retryLastOperation = () => {
    setLastError(null);
    // You could store the last operation and retry it here
    toast({
      title: "Info",
      description: "Please try the operation again",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Community Rating & Shop Points Testing Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Display */}
          {lastError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-900 mb-1">Operation Failed</h4>
                  <p className="text-red-700 text-sm mb-3">{lastError}</p>
                  <div className="text-xs text-red-600 mb-3">
                    <p><strong>Possible solutions:</strong></p>
                    <ul className="list-disc list-inside ml-2 mt-1">
                      <li>Ensure the user has a provider profile created</li>
                      <li>Check that all required database dependencies exist</li>
                      <li>Verify RLS policies allow the operation</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={retryLastOperation}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Retry Operation
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* User Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select User</label>
            <Select
              value={selectedUser?.id || ""}
              onValueChange={(value) => {
                const user = users.find(u => u.id === value);
                setSelectedUser(user || null);
                setLastError(null); // Clear error when switching users
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a user to test with..." />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name || user.email} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedUser && (
            <>
              <Separator />
              
              {/* User Stats Display */}
              {userStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{userStats.communityRatingPoints}</div>
                    <div className="text-sm text-gray-600">Community Points</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{userStats.shopPoints}</div>
                    <div className="text-sm text-gray-600">Shop Points</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{userStats.totalReviews}</div>
                    <div className="text-sm text-gray-600">Reviews</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {userStats.qualityCommendations + userStats.reliabilityCommendations + userStats.courtesyCommendations}
                    </div>
                    <div className="text-sm text-gray-600">Commendations</div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Community Points Controls */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Community Points
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => addCommunityPoints(10, "Admin test - 10 points")}
                    disabled={operationLoading}
                    variant="outline"
                    size="sm"
                  >
                    +10 Points
                  </Button>
                  <Button
                    onClick={() => addCommunityPoints(25, "Admin test - 25 points")}
                    disabled={operationLoading}
                    variant="outline"
                    size="sm"
                  >
                    +25 Points
                  </Button>
                  <Button
                    onClick={() => addCommunityPoints(50, "Admin test - 50 points")}
                    disabled={operationLoading}
                    variant="outline"
                    size="sm"
                  >
                    +50 Points
                  </Button>
                  <Button
                    onClick={() => addCommunityPoints(100, "Admin test - 100 points")}
                    disabled={operationLoading}
                    variant="outline"
                    size="sm"
                  >
                    +100 Points
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Review Creation Controls */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Test Reviews
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      onClick={() => createTestReview(rating)}
                      disabled={operationLoading}
                      variant="outline"
                      size="sm"
                    >
                      {rating} Star{rating !== 1 ? 's' : ''}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Commendation Controls */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Commendations
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => addCommendation('quality')}
                    disabled={operationLoading}
                    variant="outline"
                    size="sm"
                  >
                    Quality
                  </Button>
                  <Button
                    onClick={() => addCommendation('reliability')}
                    disabled={operationLoading}
                    variant="outline"
                    size="sm"
                  >
                    Reliability
                  </Button>
                  <Button
                    onClick={() => addCommendation('courtesy')}
                    disabled={operationLoading}
                    variant="outline"
                    size="sm"
                  >
                    Courtesy
                  </Button>
                </div>
              </div>

              {/* Shop Points Widget */}
              {userStats && (
                <>
                  <Separator />
                  <ShopPointsWidget 
                    communityPoints={userStats.communityRatingPoints}
                    shopPoints={userStats.shopPoints}
                  />
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTestingDashboard;
