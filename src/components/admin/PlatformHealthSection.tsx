
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreamBadge } from '@/components/ui/cream-badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Server, Database, Wifi, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';

const PlatformHealthSection = () => {
  const { analytics, loading, error, refreshAnalytics } = useAdminAnalytics();

  // Calculate system metrics based on real data
  const systemMetrics = [
    { 
      name: 'API Usage', 
      value: Math.min(85, (analytics.totalApiCalls / 1000) * 100), 
      status: analytics.totalApiCalls > 800 ? 'warning' : 'normal', 
      color: analytics.totalApiCalls > 800 ? 'bg-yellow-500' : 'bg-green-500' 
    },
    { 
      name: 'Error Rate', 
      value: analytics.errorRate, 
      status: analytics.errorRate > 5 ? 'critical' : analytics.errorRate > 2 ? 'warning' : 'normal', 
      color: analytics.errorRate > 5 ? 'bg-red-500' : analytics.errorRate > 2 ? 'bg-yellow-500' : 'bg-green-500' 
    },
    { 
      name: 'Response Time', 
      value: Math.min(100, (analytics.avgResponseTime / 500) * 100), 
      status: analytics.avgResponseTime > 400 ? 'warning' : 'normal', 
      color: analytics.avgResponseTime > 400 ? 'bg-yellow-500' : 'bg-green-500' 
    },
    { 
      name: 'System Load', 
      value: Math.min(90, (analytics.totalApiCalls / 2000) * 100), 
      status: analytics.totalApiCalls > 1500 ? 'warning' : 'normal', 
      color: analytics.totalApiCalls > 1500 ? 'bg-yellow-500' : 'bg-green-500' 
    },
  ];

  // Mock services but with some real data integration
  const services = [
    { 
      name: 'Web Application', 
      status: 'operational', 
      uptime: '99.99%',
      responseTime: `${analytics.avgResponseTime}ms`
    },
    { 
      name: 'Payment Gateway', 
      status: 'operational', 
      uptime: '99.95%',
      responseTime: '180ms'
    },
    { 
      name: 'Notification Service', 
      status: analytics.errorRate > 5 ? 'degraded' : 'operational', 
      uptime: analytics.errorRate > 5 ? '98.5%' : '99.8%',
      responseTime: '450ms'
    },
    { 
      name: 'Search Engine', 
      status: 'operational', 
      uptime: '99.8%',
      responseTime: '120ms'
    },
    { 
      name: 'File Storage', 
      status: 'operational', 
      uptime: '99.2%',
      responseTime: '230ms'
    },
  ];

  const getServiceStatusVariant = (status: string) => {
    switch (status) {
      case 'operational': return 'success';
      case 'degraded': return 'warning';
      case 'maintenance': return 'info';
      case 'outage': return 'error';
      default: return 'neutral';
    }
  };

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'maintenance': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'outage': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getServiceStatusText = (status: string) => {
    switch (status) {
      case 'operational': return 'Opérationnel';
      case 'degraded': return 'Dégradé';
      case 'maintenance': return 'Maintenance';
      case 'outage': return 'Panne';
      default: return status;
    }
  };

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="font-medium">Error loading platform health</p>
              <p className="text-sm text-red-500">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshAnalytics}
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Platform Health</h2>
          <p className="text-gray-600">Real-time system monitoring and performance metrics</p>
        </div>
        <Button variant="outline" onClick={refreshAnalytics} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="fintech-metric-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Server className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{analytics.systemUptime}%</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-metric-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Database Status</p>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">Stable</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-metric-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Wifi className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">API Calls (24h)</p>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalApiCalls.toLocaleString()}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-metric-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{analytics.avgResponseTime}ms</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics */}
      <Card className="fintech-chart-container">
        <CardHeader>
          <CardTitle>System Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            systemMetrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{metric.value.toFixed(1)}%</span>
                    <CreamBadge 
                      variant={
                        metric.status === 'normal' ? 'success' :
                        metric.status === 'warning' ? 'warning' : 'error'
                      }
                    >
                      {metric.status === 'normal' ? 'Normal' :
                       metric.status === 'warning' ? 'Attention' : 'Critique'}
                    </CreamBadge>
                  </div>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Service Status */}
      <Card className="fintech-chart-container">
        <CardHeader>
          <CardTitle>Service Health Status</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getServiceStatusIcon(service.status)}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{service.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Uptime: {service.uptime} | Response: {service.responseTime}
                      </p>
                    </div>
                  </div>
                  <CreamBadge variant={getServiceStatusVariant(service.status)}>
                    {getServiceStatusText(service.status)}
                  </CreamBadge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformHealthSection;
