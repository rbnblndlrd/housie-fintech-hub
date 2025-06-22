
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Shield, AlertTriangle, Eye, Ban, Users, TrendingUp, Lock, Search } from "lucide-react";
import { useState } from "react";

const FraudMegaMenu = () => {
  const [loading, setLoading] = useState(false);

  // Mock fraud data - in real app, this would come from Supabase
  const fraudStats = {
    alertsToday: 15,
    highRisk: 3,
    blocked: 12,
    investigating: 5
  };

  const recentAlerts = [
    { 
      id: 1, 
      type: "Multiple Failed Payments", 
      user: "suspicious@email.com", 
      riskLevel: "high", 
      timestamp: "5 min ago"
    },
    { 
      id: 2, 
      type: "Rapid Account Creation", 
      user: "newuser2024@test.com", 
      riskLevel: "medium", 
      timestamp: "12 min ago"
    },
    { 
      id: 3, 
      type: "Unusual Booking Pattern", 
      user: "frequent@booker.com", 
      riskLevel: "low", 
      timestamp: "25 min ago"
    }
  ];

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

  const handleViewAlert = (alertId: number, alertType: string) => {
    console.log(`🔍 Viewing fraud alert: ${alertType} (ID: ${alertId})`);
  };

  const handleBlockUser = (alertId: number, userEmail: string) => {
    console.log(`🚫 Blocking user: ${userEmail} (Alert ID: ${alertId})`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-500" />
          Fraud Detection Center
          <Badge variant="destructive">{fraudStats.alertsToday} alerts</Badge>
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
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-2 border rounded text-xs">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-3 w-3 ${
                    alert.riskLevel === 'high' ? 'text-red-500' : 
                    alert.riskLevel === 'medium' ? 'text-orange-500' : 'text-yellow-500'
                  }`} />
                  <div>
                    <p className="font-medium text-xs">{alert.type}</p>
                    <p className="text-muted-foreground text-xs">{alert.user}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={
                    alert.riskLevel === 'high' ? 'destructive' : 
                    alert.riskLevel === 'medium' ? 'secondary' : 'outline'
                  } className="text-xs px-1 py-0">
                    {alert.riskLevel}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewAlert(alert.id, alert.type)}
                    className="h-6 w-6 p-0"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FraudMegaMenu;
