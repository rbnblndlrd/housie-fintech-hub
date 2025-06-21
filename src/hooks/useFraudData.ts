
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
  const { toast } = useToast();

  const loadFraudData = async () => {
    console.log('🔄 Loading fraud data...');
    
    try {
      // Load recent fraud logs
      console.log('📊 Loading fraud logs...');
      const { data: logsData, error: logsError } = await supabase
        .from('fraud_logs')
        .select(`
          *,
          users:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (logsError) {
        console.error('❌ Error loading fraud logs:', logsError);
        throw logsError;
      }
      
      console.log(`✅ Loaded ${logsData?.length || 0} fraud logs`);
      
      const typedLogsData = (logsData || []).map(log => ({
        ...log,
        users: Array.isArray(log.users) ? log.users[0] : log.users
      })) as FraudLog[];
      
      setFraudLogs(typedLogsData);

      // Set recent alerts (last 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const recentAlerts = typedLogsData.filter(log => log.created_at > oneDayAgo);
      setRealtimeAlerts(recentAlerts);
      console.log(`📢 Found ${recentAlerts.length} recent alerts`);

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
        console.error('❌ Error loading review queue:', queueError);
        throw queueError;
      }
      
      console.log(`✅ Loaded ${queueData?.length || 0} review queue items`);
      
      const typedQueueData = (queueData || []).map(item => ({
        ...item,
        users: Array.isArray(item.users) ? item.users[0] : item.users
      })) as ReviewQueueItem[];
      
      setReviewQueue(typedQueueData);

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
        .eq('is_active', true)
        .order('blocked_at', { ascending: false });

      if (blocksError) {
        console.error('❌ Error loading user blocks:', blocksError);
        throw blocksError;
      }
      
      console.log(`✅ Loaded ${blocksData?.length || 0} user blocks`);
      
      const typedBlocksData = (blocksData || []).map(block => ({
        ...block,
        users: Array.isArray(block.users) ? block.users[0] : block.users
      })) as UserBlock[];
      
      setUserBlocks(typedBlocksData);

      // Calculate high-risk users (simplified)
      console.log('⚠️ Calculating high-risk users...');
      const riskUsers = typedLogsData
        .filter(log => log.risk_score >= 70 && log.users)
        .reduce((acc, log) => {
          const userId = log.user_id!;
          if (!acc[userId] || log.risk_score > acc[userId].risk_score) {
            acc[userId] = {
              user_id: userId,
              full_name: log.users!.full_name,
              email: log.users!.email,
              risk_score: log.risk_score,
              last_activity: log.created_at
            };
          }
          return acc;
        }, {} as Record<string, HighRiskUser>);

      const highRiskUsersList = Object.values(riskUsers).slice(0, 20);
      setHighRiskUsers(highRiskUsersList);
      console.log(`⚠️ Found ${highRiskUsersList.length} high-risk users`);

      // Calculate stats
      console.log('📈 Calculating stats...');
      const totalChecks = typedLogsData?.length || 0;
      const highRiskDetected = typedLogsData?.filter(log => log.risk_score >= 70).length || 0;
      const todayAlerts = recentAlerts.length;
      
      // Calculate weekly trend
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const weeklyAlerts = typedLogsData.filter(log => log.created_at > oneWeekAgo).length;
      const previousWeekAlerts = typedLogsData.filter(log => 
        log.created_at > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() &&
        log.created_at <= oneWeekAgo
      ).length;
      const weeklyTrend = previousWeekAlerts > 0 ? 
        Math.round(((weeklyAlerts - previousWeekAlerts) / previousWeekAlerts) * 100) : 0;
      
      const calculatedStats = {
        totalChecks,
        highRiskDetected,
        blockedUsers: typedBlocksData?.length || 0,
        pendingReviews: typedQueueData?.filter(item => item.status === 'pending').length || 0,
        todayAlerts,
        weeklyTrend
      };
      
      setStats(calculatedStats);
      console.log('📊 Stats calculated:', calculatedStats);

    } catch (error) {
      console.error('💥 Error loading fraud data:', error);
      toast({
        title: "Error",
        description: "Failed to load fraud detection data",
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

      if (error) throw error;

      console.log('✅ User unblocked successfully');
      toast({
        title: "User Unblocked",
        description: "User has been successfully unblocked.",
      });

      loadFraudData();
    } catch (error) {
      console.error('❌ Error unblocking user:', error);
      toast({
        title: "Error",
        description: "Failed to unblock user.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadFraudData();

    // Set up real-time subscription for fraud logs
    console.log('📡 Setting up real-time subscriptions...');
    const channel = supabase
      .channel('fraud-detection-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fraud_logs'
        },
        (payload) => {
          console.log('📡 Fraud logs changed:', payload);
          loadFraudData();
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
          console.log('📡 Review queue changed:', payload);
          loadFraudData();
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
          console.log('📡 User blocks changed:', payload);
          loadFraudData();
        }
      )
      .subscribe();

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
    loadFraudData,
    handleUnblockUser
  };
};
