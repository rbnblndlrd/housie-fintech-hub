
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreamBadge } from '@/components/ui/cream-badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Server, Database, Wifi, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const systemMetrics = [
  { name: 'CPU Usage', value: 45, status: 'normal', color: 'bg-green-500' },
  { name: 'Memory Usage', value: 68, status: 'warning', color: 'bg-yellow-500' },
  { name: 'Database Load', value: 32, status: 'normal', color: 'bg-green-500' },
  { name: 'API Response Time', value: 89, status: 'critical', color: 'bg-red-500' },
];

const services = [
  { name: 'Web Application', status: 'operational', uptime: '99.99%' },
  { name: 'Payment Gateway', status: 'operational', uptime: '99.95%' },
  { name: 'Notification Service', status: 'degraded', uptime: '98.5%' },
  { name: 'Search Engine', status: 'operational', uptime: '99.8%' },
  { name: 'File Storage', status: 'maintenance', uptime: '95.2%' },
];

const PlatformHealthSection = () => {
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

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="fintech-metric-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Server className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Uptime Global</p>
                <p className="text-2xl font-bold text-gray-900">99.8%</p>
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
                <p className="text-sm font-medium text-gray-600">Base de Données</p>
                <p className="text-2xl font-bold text-gray-900">Stable</p>
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
                <p className="text-sm font-medium text-gray-600">API Calls</p>
                <p className="text-2xl font-bold text-gray-900">2.3M</p>
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
                <p className="text-sm font-medium text-gray-600">Temps Réponse</p>
                <p className="text-2xl font-bold text-gray-900">245ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics */}
      <Card className="fintech-chart-container">
        <CardHeader>
          <CardTitle>Métriques Système</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {systemMetrics.map((metric) => (
            <div key={metric.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{metric.value}%</span>
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
          ))}
        </CardContent>
      </Card>

      {/* Service Status */}
      <Card className="fintech-chart-container">
        <CardHeader>
          <CardTitle>État des Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getServiceStatusIcon(service.status)}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{service.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Uptime: {service.uptime}</p>
                  </div>
                </div>
                <CreamBadge variant={getServiceStatusVariant(service.status)}>
                  {getServiceStatusText(service.status)}
                </CreamBadge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformHealthSection;
