
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, AlertTriangle, Eye, Users, TrendingUp, Clock } from 'lucide-react';
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

const FraudDetectionSection = () => {
  const [fraudLogs, setFraudLogs] = useState<FraudLog[]>([]);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>([]);
  const [stats, setStats] = useState({
    totalChecks: 0,
    highRiskDetected: 0,
    blockedUsers: 0,
    pendingReviews: 0
  });
  const [loading, setLoading] = useState(true);
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
        .limit(50);

      if (logsError) throw logsError;
      
      // Type assertion to handle the joined data properly
      const typedLogsData = (logsData || []).map(log => ({
        ...log,
        users: Array.isArray(log.users) ? log.users[0] : log.users
      })) as FraudLog[];
      
      setFraudLogs(typedLogsData);

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
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (queueError) throw queueError;
      
      // Type assertion to handle the joined data properly
      const typedQueueData = (queueData || []).map(item => ({
        ...item,
        users: Array.isArray(item.users) ? item.users[0] : item.users
      })) as ReviewQueueItem[];
      
      setReviewQueue(typedQueueData);

      // Calculate stats
      const totalChecks = typedLogsData?.length || 0;
      const highRiskDetected = typedLogsData?.filter(log => log.risk_score >= 70).length || 0;
      
      const { data: blockedData } = await supabase
        .from('user_blocks')
        .select('id')
        .eq('is_active', true);
      
      setStats({
        totalChecks,
        highRiskDetected,
        blockedUsers: blockedData?.length || 0,
        pendingReviews: typedQueueData?.length || 0
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-sm font-medium text-gray-600">High Risk Detected</p>
                <p className="text-2xl font-bold">{stats.highRiskDetected}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-orange-600" />
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
      </div>

      {/* Main Content */}
      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Fraud Logs</TabsTrigger>
          <TabsTrigger value="queue">Review Queue</TabsTrigger>
        </TabsList>

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

        <TabsContent value="queue">
          <Card>
            <CardHeader>
              <CardTitle>Manual Review Queue</CardTitle>
              <CardDescription>
                Transactions requiring manual review due to elevated risk scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {reviewQueue.map((item) => (
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
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                  {reviewQueue.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No items in review queue</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FraudDetectionSection;
