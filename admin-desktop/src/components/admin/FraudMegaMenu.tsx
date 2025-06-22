
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Shield, AlertTriangle, Eye, Ban, Users, TrendingUp, Lock, Search, RefreshCw } from "lucide-react";
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

const FraudMegaMenu = () => {
  const [loading, setLoading] = useState(false);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [fraudStats, setFraudStats] = useState({
    alertsToday: 0,
    highRisk: 0,
    blocked: 0,
    investigating: 0
  });

  const loadFraudData = async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      
      // Load recent fraud logs
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
        .limit(5);

      if (fraudError) {
        console.error('Error loading fraud logs:', fraudError);
      } else if (fraudLogsData) {
        const processedAlerts = fraudLogsData.map(log => ({
          ...log,
          users: Array.isArray(log.users) ? log.users[0] : log.users
        })) as FraudAlert[];
        setFraudAlerts(processedAlerts);
      }

      // Calculate stats
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      // Get today's alerts
      const { data: todayAlerts } = await supabase
        .from('fraud_logs')
        .select('*')
        .gte('created_at', oneDayAgo);

      // Get high risk alerts
      const { data: highRiskAlerts } = await supabase
        .from('fraud_logs')
        .select('*')
        .gte('risk_score', 70)
        .gte('created_at', oneDayAgo);

      // Get active blocks
      const { data: activeBlocks } = await supabase
        .from('user_blocks')
        .select('*')
        .eq('is_active', true);

      // Get pending reviews
      const { data: pendingReviews } = await supabase
        .from('review_queue')
        .select('*')
        .eq('status', 'pending');

      setFraudStats({
        alertsToday: todayAlerts?.length || 0,
        highRisk: highRiskAlerts?.length || 0,
        blocked: activeBlocks?.length || 0,
        investigating: pendingReviews?.length || 0
      });

    } catch (error) {
      console.error('Failed to load fraud data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFraudData();
  }, []);

  const quickActions = [
    { 
      id: 1, 
      title: "Block User", 
      icon: Ban, 
      variant: "destructive" as const,
      action: "block_user"
    },
    { 
      id: 2, 
      title: "Investigate", 
      icon: Search, 
      variant: "outline" as const,
      action: "investigate"
    },
    { 
      id: 3, 
      title: "Lock Account", 
      icon: Lock, 
      variant: "secondary" as const,
      action: "lock_account"
    },
    { 
      id: 4, 
      title: "View Details", 
      icon: Eye, 
      variant: "outline" as const,
      action: "view_details"
    }
  ];

  const handleQuickAction = async (actionType: string) => {
    console.log(`🚨 Fraud Quick Action: ${actionType}`);
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`✅ Fraud action ${actionType} completed successfully`);
    } catch (error) {
      console.error('Fraud action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAlert = (alertId: string, alertType: string) => {
    console.log(`🔍 Viewing fraud alert: ${alertType} (ID: ${alertId})`);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-500" />
          Fraud Detection Center
          <Badge variant="destructive">{fraudStats.alertsToday} alerts</Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadFraudData}
            disabled={loading}
            className="ml-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fraud Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-2 bg-red-50 dark:bg-red-950 rounded">
            <p className="text-xl font-bold text-red-600">{fraudStats.highRisk}</p>
            <p className="text-xs text-muted-foreground">High Risk</p>
          </div>
          <div className="text-center p-2 bg-orange-50 dark:bg-orange-950 rounded">
            <p className="text-xl font-bold text-orange-600">{fraudStats.investigating}</p>
            <p className="text-xs text-muted-foreground">Investigating</p>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-950 rounded">
            <p className="text-xl font-bold">{fraudStats.blocked}</p>
            <p className="text-xs text-muted-foreground">Blocked</p>
          </div>
          <div className="text-center p-2 bg-blue-50 dark:bg-blue-950 rounded">
            <p className="text-xl font-bold text-blue-600">{fraudStats.alertsToday}</p>
            <p className="text-xs text-muted-foreground">Total Today</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h4 className="font-medium mb-2 text-sm">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant}
                size="sm"
                disabled={loading}
                onClick={() => handleQuickAction(action.action)}
                className="flex items-center gap-2 h-8"
              >
                <action.icon className="h-3 w-3" />
                {action.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div>
          <h4 className="font-medium mb-2 text-sm">Recent Alerts</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Loading fraud alerts...
              </div>
            ) : fraudAlerts.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No recent fraud alerts
              </div>
            ) : (
              fraudAlerts.map((alert) => {
                const riskLevel = getRiskLevel(alert.risk_score);
                return (
                  <div key={alert.id} className="flex items-center justify-between p-2 border rounded text-xs">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-3 w-3 ${getRiskColor(riskLevel)}`} />
                      <div>
                        <p className="font-medium text-xs">{alert.action_type}</p>
                        <p className="text-muted-foreground text-xs">
                          {alert.users?.email || alert.users?.full_name || 'Unknown User'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant={getRiskBadgeVariant(riskLevel)} className="text-xs px-1 py-0">
                        {riskLevel} ({alert.risk_score})
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewAlert(alert.id, alert.action_type)}
                        className="h-6 w-6 p-0"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
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

export default FraudMegaMenu;
