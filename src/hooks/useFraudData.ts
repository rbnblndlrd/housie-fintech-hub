
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

  const calculateStats = (
    logs: FraudLog[], 
    queue: ReviewQueueItem[], 
    blocks: UserBlock[]
  ): FraudStats => {
    console.log('📊 Calculating stats from fresh data:', {
      logsCount: logs.length,
      queueCount: queue.length,
      blocksCount: blocks.length
    });

    const totalChecks = logs.length;
    const highRiskDetected = logs.filter(log => log.risk_score >= 50).length;
    const blockedUsers = blocks.filter(block => block.is_active).length;
    const pendingReviews = queue.filter(item => item.status === 'pending').length;

    // Calculate today's alerts (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const todayAlerts = logs.filter(log => log.created_at > oneDayAgo).length;

    // Calculate weekly trend
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    
    const thisWeekAlerts = logs.filter(log => log.created_at > oneWeekAgo).length;
    const lastWeekAlerts = logs.filter(log => 
      log.created_at > twoWeeksAgo && log.created_at <= oneWeekAgo
    ).length;
    
    const weeklyTrend = lastWeekAlerts > 0 ? 
      Math.round(((thisWeekAlerts - lastWeekAlerts) / lastWeekAlerts) * 100) : 0;

    const calculatedStats = {
      totalChecks,
      highRiskDetected,
      blockedUsers,
      pendingReviews,
      todayAlerts,
      weeklyTrend
    };

    console.log('📊 Calculated final stats:', calculatedStats);
    return calculatedStats;
  };

  const loadFraudData = async () => {
    console.log('🔄 Starting comprehensive fraud data reload...');
    setLoading(true);
    setError(null);
    
    try {
      // Load fraud logs with user data
      console.log('📊 Loading fraud logs...');
      const { data: rawLogsData, error: logsError } = await supabase
        .from('fraud_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (logsError) {
        console.error('❌ Fraud logs query error:', logsError);
        throw new Error(`Failed to load fraud logs: ${logsError.message}`);
      }

      console.log('✅ Raw fraud logs loaded:', rawLogsData?.length || 0);

      // Get user data for fraud logs
      let processedLogsData: FraudLog[] = [];
      if (rawLogsData && rawLogsData.length > 0) {
        const userIds = rawLogsData
          .filter(log => log.user_id)
          .map(log => log.user_id);
        const uniqueUserIds = [...new Set(userIds)];
        
        let usersData: any[] = [];
        if (uniqueUserIds.length > 0) {
          const { data: userData, error: usersError } = await supabase
            .from('users')
            .select('id, full_name, email')
            .in('id', uniqueUserIds);

          if (usersError) {
            console.warn('⚠️ Users query error:', usersError);
          } else {
            usersData = userData || [];
          }
        }

        const userMap = usersData.reduce((acc, user) => {
          acc[user.id] = { full_name: user.full_name, email: user.email };
          return acc;
        }, {} as Record<string, { full_name: string; email: string }>);

        processedLogsData = rawLogsData.map(log => ({
          ...log,
          users: log.user_id ? userMap[log.user_id] || null : null
        })) as FraudLog[];
      }

      // Load review queue
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
        console.error('❌ Review queue error:', queueError);
      }

      const processedQueueData = (queueData || []).map(item => ({
        ...item,
        users: Array.isArray(item.users) ? item.users[0] : item.users
      })) as ReviewQueueItem[];

      // Load user blocks
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
        .order('blocked_at', { ascending: false });

      if (blocksError) {
        console.error('❌ User blocks error:', blocksError);
      }

      const processedBlocksData = (blocksData || []).map(block => ({
        ...block,
        users: Array.isArray(block.users) ? block.users[0] : block.users
      })) as UserBlock[];

      // Calculate high-risk users
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

      // Calculate realtime alerts (last 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const recentAlerts = processedLogsData.filter(log => log.created_at > oneDayAgo);

      // Update all state
      setFraudLogs(processedLogsData);
      setReviewQueue(processedQueueData);
      setUserBlocks(processedBlocksData);
      setHighRiskUsers(highRiskUsersList);
      setRealtimeAlerts(recentAlerts);

      // Calculate and set stats from fresh data
      const freshStats = calculateStats(processedLogsData, processedQueueData, processedBlocksData);
      setStats(freshStats);

      console.log('✅ All fraud data loaded successfully');
      toast({
        title: "Fraud Data Loaded",
        description: `Found ${processedLogsData.length} fraud checks, ${freshStats.highRiskDetected} high-risk`,
      });

    } catch (error: any) {
      console.error('💥 Fraud data loading failed:', error);
      setError(error.message || 'Failed to load fraud data');
      toast({
        title: "Data Loading Error",
        description: error.message || "Failed to load fraud detection data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
