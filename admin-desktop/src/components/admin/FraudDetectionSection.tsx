
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Shield, AlertTriangle, Eye, Ban, RefreshCw, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getSupabase } from "../../lib/supabase";

interface FraudAlert {
  id: string;
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

interface UserBlock {
  id: string;
  user_id: string;
  reason: string;
  block_type: string;
  is_active: boolean;
  blocked_at: string;
  users?: {
    full_name: string;
    email: string;
  } | null;
}

const FraudDetectionSection = () => {
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [userBlocks, setUserBlocks] = useState<UserBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    alertsToday: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
    blockedUsers: 0
  });

  const loadFraudData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const supabase = getSupabase();
      
      // Load fraud logs
      const { data: fraudLogsData, error: fraudError } = await supabase
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

      if (fraudError) {
        console.error('Error loading fraud logs:', fraudError);
        throw new Error(`Failed to load fraud logs: ${fraudError.message}`);
      }

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
        .order('blocked_at', { ascending: false });

      if (blocksError) {
        console.error('Error loading user blocks:', blocksError);
      }

      // Process fraud logs
      const processedAlerts = (fraudLogsData || []).map(log => ({
        ...log,
        users: Array.isArray(log.users) ? log.users[0] : log.users
      })) as FraudAlert[];

      // Process user blocks
      const processedBlocks = (blocksData || []).map(block => ({
        ...block,
        users: Array.isArray(block.users) ? block.users[0] : block.users
      })) as UserBlock[];

      setFraudAlerts(processedAlerts);
      setUserBlocks(processedBlocks);

      // Calculate stats
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const todayAlerts = processedAlerts.filter(alert => alert.created_at > oneDayAgo);
      
      const highRisk = todayAlerts.filter(alert => alert.risk_score >= 70).length;
      const mediumRisk = todayAlerts.filter(alert => alert.risk_score >= 40 && alert.risk_score < 70).length;
      const lowRisk = todayAlerts.filter(alert => alert.risk_score < 40).length;
      const blockedUsers = processedBlocks.filter(block => block.is_active).length;

      setStats({
        alertsToday: todayAlerts.length,
        highRisk,
        mediumRisk,
        lowRisk,
        blockedUsers
      });

      console.log('✅ Fraud data loaded successfully');
    } catch (error: any) {
      console.error('Failed to load fraud data:', error);
      setError(error.message || 'Failed to load fraud data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFraudData();
  }, []);

  const handleViewAlert = (alertId: string, alertType: string) => {
    console.log(`Viewing fraud alert: ${alertType} (ID: ${alertId})`);
  };

  const handleBlockUser = (alertId: string, userEmail: string) => {
    console.log(`Blocking user: ${userEmail} (Alert ID: ${alertId})`);
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-orange-500';
      default: return 'text-yellow-500';
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'destructive' as const;
      case 'medium': return 'secondary' as const;
      default: return 'outline' as const;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Fraud Detection
            <Badge variant="secondary">Loading...</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading fraud detection data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Fraud Detection
            <Badge variant="destructive">Error</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-destructive flex items-center gap-2 justify-center">
            <AlertCircle className="h-4 w-4" />
            {error}
            <Button
              variant="outline"
              size="sm"
              onClick={loadFraudData}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Fraud Detection
          <Badge variant="destructive">{stats.alertsToday} alerts</Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadFraudData}
            className="ml-auto"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.highRisk}</p>
            <p className="text-sm text-muted-foreground">High Risk</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.mediumRisk}</p>
            <p className="text-sm text-muted-foreground">Medium Risk</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.lowRisk}</p>
            <p className="text-sm text-muted-foreground">Low Risk</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.blockedUsers}</p>
            <p className="text-sm text-muted-foreground">Blocked</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.alertsToday}</p>
            <p className="text-sm text-muted-foreground">Total Today</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Recent Fraud Alerts</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {fraudAlerts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No fraud alerts found
              </div>
            ) : (
              fraudAlerts.slice(0, 10).map((alert) => {
                const riskLevel = getRiskLevel(alert.risk_score);
                const userDisplay = alert.users?.email || alert.users?.full_name || 'Unknown User';
                
                return (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <AlertTriangle className={`h-5 w-5 ${getRiskColor(riskLevel)}`} />
                      <div>
                        <p className="font-medium">{alert.action_type}</p>
                        <p className="text-sm text-muted-foreground">{userDisplay}</p>
                        <p className="text-xs text-muted-foreground">
                          {alert.reasons?.join(', ') || 'No specific reasons'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getRiskBadgeVariant(riskLevel)}>
                        {riskLevel} risk ({alert.risk_score})
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.created_at).toLocaleString()}
                      </span>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewAlert(alert.id, alert.action_type)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleBlockUser(alert.id, userDisplay)}
                        >
                          <Ban className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FraudDetectionSection;
