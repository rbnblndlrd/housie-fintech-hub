
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Database, RefreshCw, Terminal, Bug, Settings, Download, Trash2, Users, Calendar, AlertTriangle } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const DevelopmentToolsSection = () => {
  const { stats, generateTestData, clearTestData, resetAnalytics, createBackup } = useAdminData();
  const { toast } = useToast();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleAction = async (actionKey: string, actionFn: () => Promise<any>, confirmMessage?: string) => {
    if (confirmMessage && !confirm(confirmMessage)) {
      return;
    }

    setLoading(prev => ({ ...prev, [actionKey]: true }));
    try {
      const result = await actionFn();
      if (result?.success !== false) {
        console.log(`✅ ${actionKey} completed successfully`);
      }
    } catch (error) {
      console.error(`❌ ${actionKey} failed:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [actionKey]: false }));
    }
  };

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
      action: "Open Console",
      onClick: () => window.open('https://supabase.com/dashboard/project/dsfaxqfexebqogdxigdu/sql/new', '_blank')
    },
    {
      name: "API Explorer",
      description: "Test API endpoints and view documentation",
      status: "available", 
      action: "Launch Explorer",
      onClick: () => window.open('https://supabase.com/dashboard/project/dsfaxqfexebqogdxigdu/api', '_blank')
    },
    {
      name: "Log Viewer",
      description: "View application logs and error reports",
      status: "available",
      action: "View Logs",
      onClick: () => window.open('https://supabase.com/dashboard/project/dsfaxqfexebqogdxigdu/logs/explorer', '_blank')
    },
    {
      name: "Cache Manager",
      description: "Clear caches and view cache statistics",
      status: "available",
      action: "Manage Cache",
      onClick: () => handleAction('clear-cache', async () => {
        // Clear browser cache programmatically
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
        toast({
          title: "Success",
          description: "Browser cache cleared successfully",
        });
        return { success: true };
      })
    },
    {
      name: "Queue Monitor",
      description: "Monitor background jobs and queue status",
      status: "available",
      action: "View Queue",
      onClick: () => window.open('https://supabase.com/dashboard/project/dsfaxqfexebqogdxigdu/database/tables', '_blank')
    },
    {
      name: "System Config",
      description: "Update system configuration settings",
      status: "restricted",
      action: "Configure",
      onClick: () => toast({
        title: "Restricted",
        description: "System configuration requires elevated permissions",
        variant: "destructive",
      })
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
                    onClick={tool.onClick}
                  >
                    {tool.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Test Data Management</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={loading['generate-users']}
              onClick={() => handleAction('generate-users', () => generateTestData('users'))}
            >
              <Users className="h-4 w-4" />
              {loading['generate-users'] ? 'Generating...' : 'Generate Test Users'}
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={loading['generate-bookings']}
              onClick={() => handleAction('generate-bookings', () => generateTestData('bookings'))}
            >
              <Calendar className="h-4 w-4" />
              {loading['generate-bookings'] ? 'Generating...' : 'Generate Test Bookings'}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="flex items-center gap-2"
                  disabled={loading['clear-users']}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Test Users
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Test Users</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all test users (those with email pattern testuser_*). This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleAction('clear-users', () => clearTestData('users'))}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {loading['clear-users'] ? 'Clearing...' : 'Clear Users'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="flex items-center gap-2"
                  disabled={loading['clear-bookings']}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Test Bookings
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Test Bookings</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all test bookings (those with instructions containing "TEST"). This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleAction('clear-bookings', () => clearTestData('bookings'))}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {loading['clear-bookings'] ? 'Clearing...' : 'Clear Bookings'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">System Operations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  disabled={loading['reset-analytics']}
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset Analytics
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Analytics Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear old fraud logs, API usage logs, and inactive user sessions (older than 7 days). This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleAction('reset-analytics', resetAnalytics)}
                  >
                    {loading['reset-analytics'] ? 'Resetting...' : 'Reset Analytics'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={loading['backup-db']}
              onClick={() => handleAction('backup-db', createBackup)}
            >
              <Database className="h-4 w-4" />
              {loading['backup-db'] ? 'Creating...' : 'Create Backup'}
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" />
              Reload Application
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {
                const data = {
                  stats,
                  timestamp: new Date().toISOString(),
                  userAgent: navigator.userAgent
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `admin-report-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
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
      </CardContent>
    </Card>
  );
};

export default DevelopmentToolsSection;
