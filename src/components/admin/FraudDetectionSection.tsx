import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import FraudStatsCards from './fraud/FraudStatsCards';
import FraudAlertsSection from './fraud/FraudAlertsSection';
import FraudReviewQueue from './fraud/FraudReviewQueue';
import FraudHighRiskUsers from './fraud/FraudHighRiskUsers';
import FraudBlockedUsers from './fraud/FraudBlockedUsers';
import FraudLogsSection from './fraud/FraudLogsSection';
import FraudAnalyticsSection from './fraud/FraudAnalyticsSection';
import { Card, CardContent } from '@/components/ui/card';

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

const FraudDetectionSection = () => {
  const [fraudLogs, setFraudLogs] = useState<FraudLog[]>([]);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>([]);
  const [userBlocks, setUserBlocks] = useState<UserBlock[]>([]);
  const [highRiskUsers, setHighRiskUsers] = useState<HighRiskUser[]>([]);
  const [realtimeAlerts, setRealtimeAlerts] = useState<FraudLog[]>([]);
  const [stats, setStats] = useState({
    totalChecks: 0,
    highRiskDetected: 0,
    blockedUsers: 0,
    pendingReviews: 0,
    todayAlerts: 0,
    weeklyTrend: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const loadFraudData = async () => {
    try {
      // Load recent fraud logs
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

      if (logsError) throw logsError;
      
      const typedLogsData = (logsData || []).map(log => ({
        ...log,
        users: Array.isArray(log.users) ? log.users[0] : log.users
      })) as FraudLog[];
      
      setFraudLogs(typedLogsData);

      // Set recent alerts (last 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const recentAlerts = typedLogsData.filter(log => log.created_at > oneDayAgo);
      setRealtimeAlerts(recentAlerts);

      // Load review queue
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

      if (queueError) throw queueError;
      
      const typedQueueData = (queueData || []).map(item => ({
        ...item,
        users: Array.isArray(item.users) ? item.users[0] : item.users
      })) as ReviewQueueItem[];
      
      setReviewQueue(typedQueueData);

      // Load user blocks
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

      if (blocksError) throw blocksError;
      
      const typedBlocksData = (blocksData || []).map(block => ({
        ...block,
        users: Array.isArray(block.users) ? block.users[0] : block.users
      })) as UserBlock[];
      
      setUserBlocks(typedBlocksData);

      // Calculate high-risk users (simplified)
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

      setHighRiskUsers(Object.values(riskUsers).slice(0, 20));

      // Calculate stats
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
      
      setStats({
        totalChecks,
        highRiskDetected,
        blockedUsers: typedBlocksData?.length || 0,
        pendingReviews: typedQueueData?.filter(item => item.status === 'pending').length || 0,
        todayAlerts,
        weeklyTrend
      });

    } catch (error) {
      console.error('Error loading fraud data:', error);
      toast({
        title: "Error",
        description: "Failed to load fraud detection data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFraudData();

    // Set up real-time subscription for fraud logs
    const channel = supabase
      .channel('fraud-detection-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fraud_logs'
        },
        () => {
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
        () => {
          loadFraudData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUnblockUser = async (blockId: string) => {
    try {
      const { error } = await supabase
        .from('user_blocks')
        .update({ 
          is_active: false, 
          unblocked_at: new Date().toISOString() 
        })
        .eq('id', blockId);

      if (error) throw error;

      toast({
        title: "User Unblocked",
        description: "User has been successfully unblocked.",
      });

      loadFraudData();
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast({
        title: "Error",
        description: "Failed to unblock user.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FraudStatsCards stats={stats} />
      <FraudAlertsSection realtimeAlerts={realtimeAlerts} />

      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="queue">Review Queue</TabsTrigger>
          <TabsTrigger value="risks">High Risk Users</TabsTrigger>
          <TabsTrigger value="blocks">Blocked Users</TabsTrigger>
          <TabsTrigger value="logs">Fraud Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="queue">
          <FraudReviewQueue
            reviewQueue={reviewQueue}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onUpdate={loadFraudData}
          />
        </TabsContent>

        <TabsContent value="risks">
          <FraudHighRiskUsers highRiskUsers={highRiskUsers} />
        </TabsContent>

        <TabsContent value="blocks">
          <FraudBlockedUsers 
            userBlocks={userBlocks}
            onUnblockUser={handleUnblockUser}
          />
        </TabsContent>

        <TabsContent value="logs">
          <FraudLogsSection fraudLogs={fraudLogs} />
        </TabsContent>

        <TabsContent value="analytics">
          <FraudAnalyticsSection fraudLogs={fraudLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FraudDetectionSection;
