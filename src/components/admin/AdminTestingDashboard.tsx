import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User } from 'lucide-react';
import ShopPointsWidget from './ShopPointsWidget';
import OperationResultDisplay from './testing/OperationResultDisplay';
import UserStatsDisplay from './testing/UserStatsDisplay';
import CommunityPointsSection from './testing/CommunityPointsSection';
import TestReviewsSection from './testing/TestReviewsSection';
import CommendationsSection from './testing/CommendationsSection';
import { AdminUser, UserStats, AdminFunctionResult } from '@/types/adminTesting';

const AdminTestingDashboard = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const [lastResult, setLastResult] = useState<AdminFunctionResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

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
      // Load from unified user_profiles table first
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select(`
          community_rating_points,
          shop_points,
          network_connections_count,
          total_reviews_received,
          quality_commendations,
          reliability_commendations,
          courtesy_commendations,
          total_bookings
        `)
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('User profile error:', profileError);
      }

      // Fallback to user_credits for shop points if needed
      const { data: userCredits, error: creditsError } = await supabase
        .from('user_credits')
        .select('total_credits, shop_points')
        .eq('user_id', userId)
        .single();

      if (creditsError && creditsError.code !== 'PGRST116') {
        console.error('User credits error:', creditsError);
      }

      // Safely extract values with fallbacks for missing columns
      const communityRatingPoints = userProfile?.community_rating_points || userCredits?.total_credits || 0;
      const shopPoints = userProfile?.shop_points || userCredits?.shop_points || 0;

      setUserStats({
        communityRatingPoints,
        totalReviews: userProfile?.total_reviews_received || 0,
        networkConnections: userProfile?.network_connections_count || 0,
        qualityCommendations: userProfile?.quality_commendations || 0,
        reliabilityCommendations: userProfile?.reliability_commendations || 0,
        courtesyCommendations: userProfile?.courtesy_commendations || 0,
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
    setLastResult(null);
    
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

      await loadUserStats(selectedUser.id);
    } catch (error: any) {
      console.error('❌ Error adding community points:', error);
      const errorMsg = error.message || "Failed to add community points";
      
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
    setLastResult(null);
    
    try {
      console.log('🎯 Creating test review:', { userId: selectedUser.id, rating });
      
      const { data, error } = await supabase.rpc('admin_create_test_review', {
        p_provider_user_id: selectedUser.id,
        p_rating: rating,
        p_comment: `Admin test review - ${rating} stars`,
        p_add_commendations: rating >= 4
      });

      if (error) {
        console.error('❌ Test review error:', error);
        throw error;
      }

      const result = data as unknown as AdminFunctionResult;
      setLastResult(result);

      if (result.success) {
        console.log('✅ Successfully created test review:', result);
        
        toast({
          title: "Success",
          description: result.message || `Created ${rating}-star test review for ${selectedUser.full_name}`,
        });

        await loadUserStats(selectedUser.id);
      } else {
        console.error('❌ Test review failed:', result);
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error: any) {
      console.error('❌ Error creating test review:', error);
      const errorMsg = error.message || "Failed to create test review";
      
      setLastResult({
        success: false,
        error: errorMsg
      });
      
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
    setLastResult(null);
    
    try {
      console.log('🎯 Adding commendation:', { userId: selectedUser.id, type });
      
      const { data, error } = await supabase.rpc('admin_add_commendation', {
        p_provider_user_id: selectedUser.id,
        p_commendation_type: type
      });

      if (error) {
        console.error('❌ Commendation error:', error);
        throw error;
      }

      const result = data as unknown as AdminFunctionResult;
      setLastResult(result);

      if (result.success) {
        console.log('✅ Successfully added commendation:', result);
        
        toast({
          title: "Success",
          description: result.message || `Added ${type} commendation to ${selectedUser.full_name}`,
        });

        await loadUserStats(selectedUser.id);
      } else {
        console.error('❌ Commendation failed:', result);
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error: any) {
      console.error('❌ Error adding commendation:', error);
      const errorMsg = error.message || "Failed to add commendation";
      
      setLastResult({
        success: false,
        error: errorMsg
      });
      
      toast({
        title: "Error",
        description: errorMsg, 
        variant: "destructive"
      });
    } finally {
      setOperationLoading(false);
    }
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
            Community Rating & Shop Points Testing Dashboard (Unified Profile System)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {lastResult && <OperationResultDisplay result={lastResult} />}

          <div className="space-y-2">
            <label className="text-sm font-medium">Select User</label>
            <Select
              value={selectedUser?.id || ""}
              onValueChange={(value) => {
                const user = users.find(u => u.id === value);
                setSelectedUser(user || null);
                setLastResult(null);
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
              
              {userStats && <UserStatsDisplay userStats={userStats} />}

              <Separator />

              <CommunityPointsSection 
                onAddPoints={addCommunityPoints}
                disabled={operationLoading}
              />

              <Separator />

              <TestReviewsSection 
                onCreateReview={createTestReview}
                disabled={operationLoading}
              />

              <Separator />

              <CommendationsSection 
                onAddCommendation={addCommendation}
                disabled={operationLoading}
              />

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
