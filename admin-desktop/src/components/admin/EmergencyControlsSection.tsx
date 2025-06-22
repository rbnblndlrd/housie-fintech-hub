
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AlertTriangle, Power, Shield, Database, Zap } from "lucide-react";

const EmergencyControlsSection = () => {
  const systemStatus = {
    platform: "operational",
    payments: "operational", 
    chat: "operational",
    notifications: "degraded",
    api: "operational"
  };

  const emergencyActions = [
    {
      id: 1,
      title: "Disable New Registrations",
      description: "Temporarily stop new user registrations",
      status: "inactive",
      critical: false
    },
    {
      id: 2, 
      title: "Emergency Maintenance Mode",
      description: "Put platform in maintenance mode",
      status: "inactive",
      critical: true
    },
    {
      id: 3,
      title: "Disable Payments",
      description: "Temporarily disable all payment processing",
      status: "inactive", 
      critical: true
    },
    {
      id: 4,
      title: "Rate Limit API",
      description: "Enforce strict API rate limiting",
      status: "inactive",
      critical: false
    }
  ];

  const handleEmergencyAction = (actionId: number, actionTitle: string) => {
    console.log(`Emergency action triggered: ${actionTitle} (ID: ${actionId})`);
    // In a real app, this would make an API call to toggle the emergency control
  };

  const handleCriticalAction = (actionType: string) => {
    console.log(`Critical emergency action: ${actionType}`);
    // In a real app, this would require additional confirmation and make API calls
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Emergency Controls
          <Badge variant="outline">Admin Only</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">System Status</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(systemStatus).map(([service, status]) => (
              <div key={service} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  status === 'operational' ? 'bg-green-500' : 
                  status === 'degraded' ? 'bg-orange-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm capitalize">{service}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Emergency Actions</h4>
          <div className="grid gap-3">
            {emergencyActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {action.critical ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Shield className="h-5 w-5 text-orange-500" />
                  )}
                  <div>
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={action.status === 'active' ? 'destructive' : 'outline'}>
                    {action.status}
                  </Badge>
                  <Button 
                    variant={action.status === 'active' ? 'default' : action.critical ? 'destructive' : 'secondary'}
                    size="sm"
                    onClick={() => handleEmergencyAction(action.id, action.title)}
                  >
                    <Power className="h-3 w-3 mr-1" />
                    {action.status === 'active' ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-red-600" />
            <span className="font-medium text-red-600">Critical Emergency Actions</span>
          </div>
          <p className="text-sm text-red-600 mb-3">
            These actions will immediately affect all users. Use only in genuine emergencies.
          </p>
          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleCriticalAction('Emergency Database Backup')}
            >
              <Database className="h-3 w-3 mr-1" />
              Emergency Database Backup
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleCriticalAction('Platform Shutdown')}
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Platform Shutdown
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyControlsSection;
