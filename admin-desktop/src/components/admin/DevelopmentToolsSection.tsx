
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Code, Database, RefreshCw, Terminal, Bug, Settings } from "lucide-react";

const DevelopmentToolsSection = () => {
  const devMetrics = {
    apiCalls: 15678,
    errors: 23,
    errorRate: 0.15,
    avgResponseTime: 245,
    activeWebhooks: 12,
    queuedJobs: 456
  };

  const tools = [
    {
      name: "Database Console",
      description: "Execute SQL queries and view database stats",
      status: "available",
      action: "Open Console"
    },
    {
      name: "API Explorer",
      description: "Test API endpoints and view documentation",
      status: "available", 
      action: "Launch Explorer"
    },
    {
      name: "Log Viewer",
      description: "View application logs and error reports",
      status: "available",
      action: "View Logs"
    },
    {
      name: "Cache Manager",
      description: "Clear caches and view cache statistics",
      status: "available",
      action: "Manage Cache"
    },
    {
      name: "Queue Monitor",
      description: "Monitor background jobs and queue status",
      status: "available",
      action: "View Queue"
    },
    {
      name: "System Config",
      description: "Update system configuration settings",
      status: "restricted",
      action: "Configure"
    }
  ];

  const recentErrors = [
    {
      id: 1,
      error: "Database connection timeout",
      endpoint: "/api/users",
      timestamp: "2 min ago",
      severity: "high"
    },
    {
      id: 2,
      error: "Rate limit exceeded", 
      endpoint: "/api/bookings",
      timestamp: "5 min ago",
      severity: "medium"
    },
    {
      id: 3,
      error: "Invalid authentication token",
      endpoint: "/api/auth",
      timestamp: "8 min ago", 
      severity: "low"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Development Tools
          <Badge variant="outline">Debug Mode</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{devMetrics.apiCalls.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">API Calls</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{devMetrics.errors}</p>
            <p className="text-sm text-muted-foreground">Errors</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{devMetrics.errorRate}%</p>
            <p className="text-sm text-muted-foreground">Error Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{devMetrics.avgResponseTime}ms</p>
            <p className="text-sm text-muted-foreground">Avg Response</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{devMetrics.activeWebhooks}</p>
            <p className="text-sm text-muted-foreground">Webhooks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{devMetrics.queuedJobs}</p>
            <p className="text-sm text-muted-foreground">Queued Jobs</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Development Tools</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tools.map((tool, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="font-medium">{tool.name}</p>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={tool.status === 'available' ? 'default' : 'secondary'}>
                    {tool.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={tool.status === 'restricted'}
                  >
                    {tool.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Recent Errors</h4>
          <div className="space-y-3">
            {recentErrors.map((error) => (
              <div key={error.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bug className={`h-4 w-4 ${
                    error.severity === 'high' ? 'text-red-500' : 
                    error.severity === 'medium' ? 'text-orange-500' : 'text-yellow-500'
                  }`} />
                  <div>
                    <p className="font-medium">{error.error}</p>
                    <p className="text-sm text-muted-foreground">{error.endpoint}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{error.timestamp}</span>
                  <Badge variant={
                    error.severity === 'high' ? 'destructive' : 
                    error.severity === 'medium' ? 'secondary' : 'outline'
                  }>
                    {error.severity}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Terminal className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="h-4 w-4" />
            <span className="font-medium">Quick Actions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-3 w-3 mr-1" />
              Clear Cache
            </Button>
            <Button variant="outline" size="sm">
              <Database className="h-3 w-3 mr-1" />
              Backup DB
            </Button>
            <Button variant="outline" size="sm">
              <Terminal className="h-3 w-3 mr-1" />
              Run Migration
            </Button>
            <Button variant="outline" size="sm">
              <Code className="h-3 w-3 mr-1" />
              Generate Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DevelopmentToolsSection;
