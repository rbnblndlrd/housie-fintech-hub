
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Shield, AlertTriangle, Eye, Ban } from "lucide-react";

const FraudDetectionSection = () => {
  const fraudAlerts = [
    { 
      id: 1, 
      type: "Multiple Failed Payments", 
      user: "suspicious@email.com", 
      riskLevel: "high", 
      timestamp: "5 min ago",
      details: "5 consecutive payment failures"
    },
    { 
      id: 2, 
      type: "Rapid Account Creation", 
      user: "newuser2024@test.com", 
      riskLevel: "medium", 
      timestamp: "12 min ago",
      details: "3 accounts from same IP in 10 minutes"
    },
    { 
      id: 3, 
      type: "Unusual Booking Pattern", 
      user: "frequent@booker.com", 
      riskLevel: "low", 
      timestamp: "25 min ago",
      details: "20 bookings in last 2 hours"
    }
  ];

  const stats = {
    alertsToday: 15,
    highRisk: 3,
    mediumRisk: 7,
    lowRisk: 5,
    blockedUsers: 12
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Fraud Detection
          <Badge variant="destructive">{stats.alertsToday} alerts</Badge>
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
          <div className="space-y-3">
            {fraudAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.riskLevel === 'high' ? 'text-red-500' : 
                    alert.riskLevel === 'medium' ? 'text-orange-500' : 'text-yellow-500'
                  }`} />
                  <div>
                    <p className="font-medium">{alert.type}</p>
                    <p className="text-sm text-muted-foreground">{alert.user}</p>
                    <p className="text-xs text-muted-foreground">{alert.details}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={
                    alert.riskLevel === 'high' ? 'destructive' : 
                    alert.riskLevel === 'medium' ? 'secondary' : 'outline'
                  }>
                    {alert.riskLevel} risk
                  </Badge>
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Ban className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FraudDetectionSection;
