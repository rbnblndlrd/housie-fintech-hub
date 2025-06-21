
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  AlertTriangle, 
  Shield, 
  Users, 
  Eye, 
  RefreshCw, 
  UserX,
  Clock,
  TrendingUp
} from 'lucide-react';
import { FraudDetectionService, type FraudLog, type ReviewQueueItem, type UserBlock, type FraudStats } from '../services/fraudDetectionService';
import { toast } from 'sonner';

const FraudDetectionDashboard = () => {
  const [fraudLogs, setFraudLogs] = useState<FraudLog[]>([]);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>([]);
  const [userBlocks, setUserBlocks] = useState<UserBlock[]>([]);
  const [stats, setStats] = useState<FraudStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadFraudData();
  }, []);

  const loadFraudData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading fraud detection data...');
      
      const [logs, queue, blocks] = await Promise.all([
        FraudDetectionService.loadFraudLogs(),
        FraudDetectionService.loadReviewQueue(),
        FraudDetectionService.loadUserBlocks()
      ]);

      setFraudLogs(logs);
      setReviewQueue(queue);
      setUserBlocks(blocks);

      const calculatedStats = await FraudDetectionService.calculateStats(logs, queue, blocks);
      setStats(calculatedStats);

      console.log('✅ Fraud detection data loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load fraud data:', error);
      toast.error('Failed to load fraud detection data');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockUser = async (blockId: string) => {
    try {
      setActionLoading(true);
      await FraudDetectionService.unblockUser(blockId);
      await loadFraudData(); // Refresh data
      toast.success('User unblocked successfully');
    } catch (error) {
      console.error('❌ Failed to unblock user:', error);
      toast.error('Failed to unblock user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewAction = async (reviewId: string, status: string, notes?: string) => {
    try {
      setActionLoading(true);
      await FraudDetectionService.updateReviewStatus(reviewId, status, notes);
      await loadFraudData(); // Refresh data
      toast.success(`Review ${status} successfully`);
    } catch (error) {
      console.error('❌ Failed to update review:', error);
      toast.error('Failed to update review status');
    } finally {
      setActionLoading(false);
    }
  };

  const getRiskBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-red-600 text-white';
    if (score >= 50) return 'bg-orange-500 text-white';
    return 'bg-yellow-500 text-white';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg">Loading fraud detection data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold">Fraud Detection Dashboard</h2>
        </div>
        <Button onClick={loadFraudData} disabled={actionLoading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalChecks}</div>
              <div className="text-sm text-gray-600">Total Checks</div>
              <div className="text-xs text-gray-500">All fraud detection runs</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.highRiskDetected}</div>
              <div className="text-sm text-gray-600">High Risk (50+)</div>
              <div className="text-xs text-gray-500">Risk score >= 50</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.blockedUsers}</div>
              <div className="text-sm text-gray-600">Blocked Users</div>
              <div className="text-xs text-gray-500">Currently active blocks</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.pendingReviews}</div>
              <div className="text-sm text-gray-600">Pending Reviews</div>
              <div className="text-xs text-gray-500">Awaiting manual review</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.todayAlerts}</div>
              <div className="text-sm text-gray-600">Today's Alerts</div>
              <div className="text-xs text-gray-500">Last 24 hours</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">+{stats.weeklyTrend}%</div>
              <div className="text-sm text-gray-600">Weekly Trend</div>
              <div className="text-xs text-gray-500">vs previous week</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alert Banner */}
      {stats && stats.todayAlerts > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-800">
                {stats.todayAlerts} new fraud alert(s) in the last 24 hours
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="logs">Fraud Logs</TabsTrigger>
          <TabsTrigger value="queue">Review Queue</TabsTrigger>
          <TabsTrigger value="blocks">Blocked Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Recent Fraud Detection Logs
                <Badge variant="outline">{fraudLogs.length} entries</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {fraudLogs.slice(0, 20).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">Test User {log.user_id.slice(-8)} • {log.action_type}</span>
                        <Badge className="text-xs">TEST</Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {log.metadata?.email || 'No email'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Reasons: {log.reasons.join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getRiskBadgeColor(log.risk_score)}`}>
                        Risk: {log.risk_score}
                      </Badge>
                      <Badge variant={log.action_taken === 'block' ? 'destructive' : 'secondary'}>
                        {log.action_taken}
                      </Badge>
                    </div>
                  </div>
                ))}
                {fraudLogs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No fraud logs found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Review Queue
                <Badge variant="outline">{reviewQueue.filter(item => item.status === 'pending').length} pending</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reviewQueue.filter(item => item.status === 'pending').map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">Review #{item.id.slice(-8)}</span>
                        <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'}>
                          {item.priority}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Risk Score: {item.risk_score} • Action: {item.action_type}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(item.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReviewAction(item.id, 'approved', 'Approved via desktop')}
                        disabled={actionLoading}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleReviewAction(item.id, 'rejected', 'Rejected via desktop')}
                        disabled={actionLoading}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
                {reviewQueue.filter(item => item.status === 'pending').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No pending reviews
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5" />
                Blocked Users Management
                <Badge variant="outline">{userBlocks.length} active blocks</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userBlocks.map((block) => (
                  <div key={block.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">User {block.user_id.slice(-8)}</span>
                        <Badge variant="destructive">{block.block_type}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Reason: {block.reason}
                      </div>
                      <div className="text-xs text-gray-500">
                        Blocked: {new Date(block.blocked_at).toLocaleString()}
                        {block.expires_at && ` • Expires: ${new Date(block.expires_at).toLocaleString()}`}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleUnblockUser(block.id)}
                      disabled={actionLoading}
                    >
                      Unblock
                    </Button>
                  </div>
                ))}
                {userBlocks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No blocked users
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Fraud Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Risk Score Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Low Risk (0-30)</span>
                      <span>{fraudLogs.filter(log => log.risk_score < 30).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Medium Risk (30-50)</span>
                      <span>{fraudLogs.filter(log => log.risk_score >= 30 && log.risk_score < 50).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>High Risk (50+)</span>
                      <span>{fraudLogs.filter(log => log.risk_score >= 50).length}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Action Types</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Blocks</span>
                      <span>{fraudLogs.filter(log => log.action_taken === 'block').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Reviews</span>
                      <span>{fraudLogs.filter(log => log.action_taken === 'review').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Warnings</span>
                      <span>{fraudLogs.filter(log => log.action_taken === 'flag').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FraudDetectionDashboard;
