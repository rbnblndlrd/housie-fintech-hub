
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, AlertTriangle, Eye, Users, TrendingUp, Clock, Ban, CheckCircle, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import FraudManagementActions from './FraudManagementActions';
import UserRiskProfileCard from './UserRiskProfileCard';

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

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'block': return 'destructive';
      case 'require_verification': return 'secondary';
      case 'review': return 'outline';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      default: return 'default';
    }
  };

  const filteredReviewQueue = reviewQueue.filter(item => {
    const matchesSearch = !searchTerm || 
      item.users?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Checks</p>
                <p className="text-2xl font-bold">{stats.totalChecks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-2xl font-bold">{stats.highRiskDetected}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Ban className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Blocked Users</p>
                <p className="text-2xl font-bold">{stats.blockedUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold">{stats.pendingReviews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Alerts</p>
                <p className="text-2xl font-bold">{stats.todayAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Trend</p>
                <p className={`text-2xl font-bold ${stats.weeklyTrend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {stats.weeklyTrend >= 0 ? '+' : ''}{stats.weeklyTrend}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Alerts Banner */}
      {realtimeAlerts.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
              <p className="text-red-800 font-medium">
                {realtimeAlerts.length} new fraud alert(s) in the last 24 hours
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Main Content */}
      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="queue">Review Queue</TabsTrigger>
          <TabsTrigger value="risks">High Risk Users</TabsTrigger>
          <TabsTrigger value="blocks">Blocked Users</TabsTrigger>
          <TabsTrigger value="logs">Fraud Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="queue">
          <Card>
            <CardHeader>
              <CardTitle>Manual Review Queue</CardTitle>
              <CardDescription>
                Transactions requiring manual review due to elevated risk scores
              </CardDescription>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Search by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredReviewQueue.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Clock className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="font-medium">
                            {item.users?.full_name || 'Unknown User'} • {item.action_type}
                          </p>
                          <p className="text-sm text-gray-600">{item.users?.email}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Risk: {item.risk_score}</Badge>
                        <Badge variant={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <Badge variant={item.status === 'pending' ? 'secondary' : 'default'}>
                          {item.status}
                        </Badge>
                        {item.status === 'pending' && (
                          <FraudManagementActions 
                            reviewItem={item} 
                            onUpdate={loadFraudData}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredReviewQueue.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      {searchTerm || statusFilter !== 'all' ? 'No matching items found' : 'No items in review queue'}
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks">
          <Card>
            <CardHeader>
              <CardTitle>High Risk Users</CardTitle>
              <CardDescription>
                Users with elevated risk scores requiring monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {highRiskUsers.map((user) => (
                  <UserRiskProfileCard
                    key={user.user_id}
                    userId={user.user_id}
                    userEmail={user.email}
                    userName={user.full_name}
                    riskScore={user.risk_score}
                  />
                ))}
                {highRiskUsers.length === 0 && (
                  <p className="text-center text-gray-500 py-8 col-span-full">No high-risk users found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocks">
          <Card>
            <CardHeader>
              <CardTitle>Blocked Users Management</CardTitle>
              <CardDescription>
                Manage user blocks and restrictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {userBlocks.map((block) => (
                    <div key={block.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Ban className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-medium">
                            {block.users?.full_name || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-600">{block.users?.email}</p>
                          <p className="text-sm text-gray-600">Reason: {block.reason}</p>
                          <p className="text-xs text-gray-500">
                            Blocked: {new Date(block.blocked_at).toLocaleString()}
                          </p>
                          {block.expires_at && (
                            <p className="text-xs text-gray-500">
                              Expires: {new Date(block.expires_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="destructive">{block.block_type}</Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUnblockUser(block.id)}
                        >
                          Unblock
                        </Button>
                      </div>
                    </div>
                  ))}
                  {userBlocks.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No blocked users</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Recent Fraud Detection Logs</CardTitle>
              <CardDescription>
                Real-time fraud detection results and risk assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {fraudLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getRiskColor(log.risk_score)}`} />
                        <div>
                          <p className="font-medium">
                            {log.users?.full_name || 'Unknown User'} • {log.action_type}
                          </p>
                          <p className="text-sm text-gray-600">{log.users?.email}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(log.created_at).toLocaleString()}
                          </p>
                          {log.reasons.length > 0 && (
                            <p className="text-xs text-gray-500">
                              Reasons: {log.reasons.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Risk: {log.risk_score}</Badge>
                        <Badge variant={getActionColor(log.action_taken)}>
                          {log.action_taken}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {fraudLogs.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No fraud logs found</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Trends & Analytics</CardTitle>
                <CardDescription>
                  Platform security insights and fraud prevention metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Risk Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Low Risk (0-39)</span>
                        <span className="text-sm font-medium">
                          {fraudLogs.filter(log => log.risk_score < 40).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Medium Risk (40-59)</span>
                        <span className="text-sm font-medium">
                          {fraudLogs.filter(log => log.risk_score >= 40 && log.risk_score < 60).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">High Risk (60-79)</span>
                        <span className="text-sm font-medium">
                          {fraudLogs.filter(log => log.risk_score >= 60 && log.risk_score < 80).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Critical Risk (80+)</span>
                        <span className="text-sm font-medium">
                          {fraudLogs.filter(log => log.risk_score >= 80).length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Action Types</h4>
                    <div className="space-y-2">
                      {['registration', 'booking', 'payment', 'messaging', 'login'].map(type => (
                        <div key={type} className="flex justify-between">
                          <span className="text-sm capitalize">{type}</span>
                          <span className="text-sm font-medium">
                            {fraudLogs.filter(log => log.action_type === type).length}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FraudDetectionSection;
