
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FraudLog {
  id: string;
  session_id: string;
  user_id: string | null;
  action_type: string;
  risk_score: number;
  action_taken: string;
  reasons: string[];
  created_at: string;
  users?: {
    full_name: string;
    email: string;
  } | null;
}

interface ReviewQueueItem {
  id: string;
  user_id: string;
  fraud_session_id: string;
  action_type: string;
  risk_score: number;
  priority: string;
  status: string;
  created_at: string;
  users?: {
    full_name: string;
    email: string;
  } | null;
}

interface UserBlock {
  id: string;
  user_id: string;
  reason: string;
  block_type: string;
  is_active: boolean;
  blocked_at: string;
  expires_at: string | null;
  users?: {
    full_name: string;
    email: string;
  } | null;
}

interface HighRiskUser {
  user_id: string;
  full_name: string;
  email: string;
  risk_score: number;
  last_activity: string;
}

interface FraudStats {
  totalChecks: number;
  highRiskDetected: number;
  blockedUsers: number;
  pendingReviews: number;
  todayAlerts: number;
  weeklyTrend: number;
}

export const useFraudData = () => {
  const [fraudLogs, setFraudLogs] = useState<FraudLog[]>([]);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>([]);
  const [userBlocks, setUserBlocks] = useState<UserBlock[]>([]);
  const [highRiskUsers, setHighRiskUsers] = useState<HighRiskUser[]>([]);
  const [realtimeAlerts, setRealtimeAlerts] = useState<FraudLog[]>([]);
  const [stats, setStats] = useState<FraudStats>({
    totalChecks: 0,
    highRiskDetected: 0,
    blockedUsers: 0,
    pendingReviews: 0,
    todayAlerts: 0,
    weeklyTrend: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadFraudData = async () => {
    console.log('🔄 Starting enhanced fraud data reload...');
    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Load raw fraud logs with enhanced error handling
      console.log('📊 Loading fraud logs with enhanced query...');
      const { data: rawLogsData, error: logsError, count: logsCount } = await supabase
        .from('fraud_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(1000);

      console.log('📊 Raw fraud logs query result:', {
        data: rawLogsData,
        count: logsCount,
        error: logsError,
        dataLength: rawLogsData?.length
      });

      if (logsError) {
        console.error('❌ Fraud logs query error:', logsError);
        throw new Error(`Failed to load fraud logs: ${logsError.message}`);
      }

      if (!rawLogsData) {
        console.warn('⚠️ No fraud logs data returned');
        setFraudLogs([]);
      } else {
        console.log('✅ Successfully loaded', rawLogsData.length, 'fraud logs');
        
        // Step 2: Get unique user IDs for user data lookup
        const userIds = rawLogsData.filter(log => log.user_id).map(log => log.user_id);
        const uniqueUserIds = [...new Set(userIds)];
        
        let usersData: any[] = [];
        if (uniqueUserIds.length > 0) {
          console.log('👥 Loading user data for', uniqueUserIds.length, 'unique users...');
          const { data: userData, error: usersError } = await supabase
            .from('users')
            .select('id, full_name, email')
            .in('id', uniqueUserIds);

          if (usersError) {
            console.warn('⚠️ Users query error (continuing without user data):', usersError);
          } else {
            usersData = userData || [];
            console.log('👥 Successfully loaded user data for', usersData.length, 'users');
          }
        }

        // Step 3: Create user lookup map and combine data
        const userMap = usersData.reduce((acc, user) => {
          acc[user.id] = { full_name: user.full_name, email: user.email };
          return acc;
        }, {} as Record<string, { full_name: string; email: string }>);

        const processedLogsData = rawLogsData.map(log => ({
          ...log,
          users: log.user_id ? userMap[log.user_id] || null : null
        })) as FraudLog[];

        setFraudLogs(processedLogsData);
        console.log('✅ Final processed fraud logs:', processedLogsData.length);

        // Step 4: Calculate recent alerts (last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const recentAlerts = processedLogsData.filter(log => log.created_at > oneDayAgo);
        setRealtimeAlerts(recentAlerts);
        console.log('📢 Recent alerts (24h):', recentAlerts.length);

        // Step 5: Calculate high-risk users (risk score >= 50 instead of 70)
        const riskUsers = processedLogsData
          .filter(log => log.risk_score >= 50 && log.user_id && log.users)
          .reduce((acc, log) => {
            const userId = log.user_id!;
            if (!acc[userId] || log.risk_score > acc[userId].risk_score) {
              acc[userId] = {
                user_id: userId,
                full_name: log.users!.full_name || 'Unknown User',
                email: log.users!.email || 'No email',
                risk_score: log.risk_score,
                last_activity: log.created_at
              };
            }
            return acc;
          }, {} as Record<string, HighRiskUser>);

        const highRiskUsersList = Object.values(riskUsers)
          .sort((a, b) => b.risk_score - a.risk_score)
          .slice(0, 20);

        setHighRiskUsers(highRiskUsersList);
        console.log('⚠️ High-risk users (score >= 50):', highRiskUsersList.length);

        // Step 6: Calculate comprehensive stats
        const totalChecks = processedLogsData.length;
        const highRiskDetected = processedLogsData.filter(log => log.risk_score >= 50).length;
        const todayAlerts = recentAlerts.length;

        // Calculate weekly trend
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
        
        const thisWeekAlerts = processedLogsData.filter(log => log.created_at > oneWeekAgo).length;
        const lastWeekAlerts = processedLogsData.filter(log => 
          log.created_at > twoWeeksAgo && log.created_at <= oneWeekAgo
        ).length;
        
        const weeklyTrend = lastWeekAlerts > 0 ? 
          Math.round(((thisWeekAlerts - lastWeekAlerts) / lastWeekAlerts) * 100) : 0;

        console.log('📊 Calculated stats:', {
          totalChecks,
          highRiskDetected,
          todayAlerts,
          thisWeekAlerts,
          lastWeekAlerts,
          weeklyTrend
        });
      }

      // Step 7: Load review queue
      console.log('📋 Loading review queue...');
      const { data: queueData, error: queueError } = await supabase
        .from('review_queue')
        .select(`
          *,
          users:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (queueError) {
        console.error('❌ Review queue query error:', queueError);
      } else {
        const processedQueueData = (queueData || []).map(item => ({
          ...item,
          users: Array.isArray(item.users) ? item.users[0] : item.users
        })) as ReviewQueueItem[];

        setReviewQueue(processedQueueData);
        console.log('✅ Review queue items:', processedQueueData.length);
      }

      // Step 8: Load user blocks
      console.log('🚫 Loading user blocks...');
      const { data: blocksData, error: blocksError } = await supabase
        .from('user_blocks')
        .select(`
          *,
          users:user_id (
            full_name,
            email
          )
        `)
        .eq('is_active', true)
        .order('blocked_at', { ascending: false });

      if (blocksError) {
        console.error('❌ User blocks query error:', blocksError);
      } else {
        const processedBlocksData = (blocksData || []).map(block => ({
          ...block,
          users: Array.isArray(block.users) ? block.users[0] : block.users
        })) as UserBlock[];

        setUserBlocks(processedBlocksData);
        console.log('✅ User blocks:', processedBlocksData.length);
      }

      // Step 9: Update final stats
      const finalStats = {
        totalChecks: fraudLogs.length,
        highRiskDetected: fraudLogs.filter(log => log.risk_score >= 50).length,
        blockedUsers: userBlocks.length,
        pendingReviews: reviewQueue.filter(item => item.status === 'pending').length,
        todayAlerts: realtimeAlerts.length,
        weeklyTrend: 0 // Will be calculated properly with data
      };

      setStats(finalStats);
      console.log('📊 Final dashboard stats:', finalStats);

      toast({
        title: "Fraud Data Loaded",
        description: `Found ${finalStats.totalChecks} fraud checks, ${finalStats.highRiskDetected} high-risk`,
      });

    } catch (error: any) {
      console.error('💥 Complete fraud data loading failed:', error);
      setError(error.message || 'Failed to load fraud data');
      toast({
        title: "Data Loading Error",
        description: error.message || "Failed to load fraud detection data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('✅ Fraud data loading complete');
    }
  };

  const handleUnblockUser = async (blockId: string) => {
    console.log(`🔓 Unblocking user with block ID: ${blockId}`);
    
    try {
      const { error } = await supabase
        .from('user_blocks')
        .update({ 
          is_active: false, 
          unblocked_at: new Date().toISOString() 
        })
        .eq('id', blockId);

      if (error) {
        console.error('❌ Error unblocking user:', error);
        throw error;
      }

      console.log('✅ User unblocked successfully');
      toast({
        title: "User Unblocked",
        description: "User has been successfully unblocked.",
      });

      await loadFraudData();
    } catch (error: any) {
      console.error('❌ Error unblocking user:', error);
      toast({
        title: "Error",
        description: "Failed to unblock user.",
        variant: "destructive",
      });
    }
  };

  const forceRefresh = async () => {
    console.log('🔄 Force refresh triggered by user');
    await loadFraudData();
  };

  useEffect(() => {
    console.log('🚀 Initializing fraud data hook...');
    loadFraudData();

    // Set up real-time subscriptions
    console.log('📡 Setting up real-time subscriptions...');
    const channel = supabase
      .channel('fraud-detection-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fraud_logs'
        },
        (payload) => {
          console.log('📡 Fraud logs real-time update:', payload);
          setTimeout(() => loadFraudData(), 1000);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'review_queue'
        },
        (payload) => {
          console.log('📡 Review queue real-time update:', payload);
          setTimeout(() => loadFraudData(), 1000);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_blocks'
        },
        (payload) => {
          console.log('📡 User blocks real-time update:', payload);
          setTimeout(() => loadFraudData(), 1000);
        }
      )
      .subscribe((status) => {
        console.log('📡 Real-time subscription status:', status);
      });

    return () => {
      console.log('📡 Cleaning up real-time subscriptions...');
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    fraudLogs,
    reviewQueue,
    userBlocks,
    highRiskUsers,
    realtimeAlerts,
    stats,
    loading,
    error,
    loadFraudData,
    handleUnblockUser,
    forceRefresh
  };
};
