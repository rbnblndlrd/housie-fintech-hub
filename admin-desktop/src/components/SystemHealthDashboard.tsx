
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Activity, Database, Wifi, Zap, RefreshCw, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { SystemHealthService, type SystemMetrics, type ServiceStatus } from '../services/systemHealthService';
import { toast } from 'sonner';

const SystemHealthDashboard = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadHealthData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadHealthData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading system health data...');
      
      const [metricsData, statusData] = await Promise.all([
        SystemHealthService.getSystemMetrics(),
        SystemHealthService.getServiceStatus()
      ]);

      setMetrics(metricsData);
      setServiceStatus(statusData);
      setLastUpdate(new Date());

      console.log('✅ System health data loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load system health:', error);
      toast.error('Failed to load system health data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational': return 'bg-green-600 text-white';
      case 'degraded': return 'bg-yellow-500 text-white';
      case 'maintenance': return 'bg-blue-500 text-white';
      case 'outage': return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational': return <CheckCircle className="h-4 w-4" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4" />;
      case 'maintenance': return <Activity className="h-4 w-4" />;
      case 'outage': return <XCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getMetricColor = (value: number, metric: string) => {
    switch (metric) {
      case 'cpu':
        if (value < 50) return 'text-green-600';
        if (value < 80) return 'text-yellow-600';
        return 'text-red-600';
      case 'memory':
        if (value < 60) return 'text-green-600';
        if (value < 85) return 'text-yellow-600';
        return 'text-red-600';
      case 'database':
        if (value < 40) return 'text-green-600';
        if (value < 70) return 'text-yellow-600';
        return 'text-red-600';
      case 'api':
        if (value < 90) return 'text-green-600';
        if (value < 95) return 'text-yellow-600';
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressBarColor = (value: number, metric: string) => {
    switch (metric) {
      case 'cpu':
        if (value < 50) return 'bg-green-500';
        if (value < 80) return 'bg-yellow-500';
        return 'bg-red-500';
      case 'memory':
        if (value < 60) return 'bg-green-500';
        if (value < 85) return 'bg-yellow-500';
        return 'bg-red-500';
      case 'database':
        if (value < 40) return 'bg-green-500';
        if (value < 70) return 'bg-yellow-500';
        return 'bg-red-500';
      case 'api':
        if (value < 90) return 'bg-green-500';
        if (value < 95) return 'bg-yellow-500';
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading && !metrics) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg">Loading system health data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold">System Health</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <Button onClick={loadHealthData} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.uptime}%</div>
              <div className="text-sm text-gray-600">Global Uptime</div>
              <div className="text-xs text-gray-500">System availability</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.databaseStatus}</div>
              <div className="text-sm text-gray-600">Database Status</div>
              <div className="text-xs text-gray-500">Connection health</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{(metrics.apiCalls / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-gray-600">API Calls</div>
              <div className="text-xs text-gray-500">Total requests</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{metrics.responseTime}ms</div>
              <div className="text-sm text-gray-600">Response Time</div>
              <div className="text-xs text-gray-500">Average latency</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Metrics */}
        {metrics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <span className={`text-sm font-bold ${getMetricColor(metrics.cpuUsage, 'cpu')}`}>
                      {metrics.cpuUsage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressBarColor(metrics.cpuUsage, 'cpu')}`}
                      style={{ width: `${metrics.cpuUsage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {metrics.cpuUsage < 50 ? 'Normal' : metrics.cpuUsage < 80 ? 'Attention' : 'Critical'}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className={`text-sm font-bold ${getMetricColor(metrics.memoryUsage, 'memory')}`}>
                      {metrics.memoryUsage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressBarColor(metrics.memoryUsage, 'memory')}`}
                      style={{ width: `${metrics.memoryUsage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {metrics.memoryUsage < 60 ? 'Normal' : metrics.memoryUsage < 85 ? 'Attention' : 'Critical'}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Database Load</span>
                    <span className={`text-sm font-bold ${getMetricColor(metrics.databaseLoad, 'database')}`}>
                      {metrics.databaseLoad}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressBarColor(metrics.databaseLoad, 'database')}`}
                      style={{ width: `${metrics.databaseLoad}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {metrics.databaseLoad < 40 ? 'Normal' : metrics.databaseLoad < 70 ? 'Attention' : 'Critical'}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">API Response Time</span>
                    <span className={`text-sm font-bold ${getMetricColor(metrics.apiResponseTime, 'api')}`}>
                      {metrics.apiResponseTime}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressBarColor(metrics.apiResponseTime, 'api')}`}
                      style={{ width: `${metrics.apiResponseTime}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {metrics.apiResponseTime < 90 ? 'Normal' : metrics.apiResponseTime < 95 ? 'Attention' : 'Critical'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service Status */}
        {serviceStatus && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Service Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(serviceStatus).map(([serviceName, service]) => (
                <div key={serviceName} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <div className="font-medium capitalize">
                        {serviceName.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Uptime: {service.uptime}%
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SystemHealthDashboard;
