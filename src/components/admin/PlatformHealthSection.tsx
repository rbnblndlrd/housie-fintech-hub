
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, TrendingUp, Users, Zap, Star, Bell } from 'lucide-react';

const PlatformHealthSection = () => {
  // Mock system health data
  const systemMetrics = [
    { time: '00:00', uptime: 99.8, response: 120, users: 1250 },
    { time: '04:00', uptime: 99.9, response: 98, users: 890 },
    { time: '08:00', uptime: 99.7, response: 145, users: 2340 },
    { time: '12:00', uptime: 99.9, response: 110, users: 3420 },
    { time: '16:00', uptime: 99.8, response: 135, users: 2890 },
    { time: '20:00', uptime: 99.9, response: 102, users: 1560 },
  ];

  const satisfactionData = [
    { month: 'Jan', rating: 4.2, reviews: 234 },
    { month: 'Fév', rating: 4.4, reviews: 289 },
    { month: 'Mar', rating: 4.3, reviews: 312 },
    { month: 'Avr', rating: 4.6, reviews: 345 },
    { month: 'Mai', rating: 4.5, reviews: 398 },
    { month: 'Jun', rating: 4.7, reviews: 423 },
  ];

  const featureAdoption = [
    { feature: 'Réservation en ligne', adoption: 94, users: 14923 },
    { feature: 'Chat en temps réel', adoption: 78, users: 12360 },
    { feature: 'Paiements mobiles', adoption: 82, users: 13004 },
    { feature: 'Notifications push', adoption: 67, users: 10618 },
    { feature: 'Évaluations/Reviews', adoption: 89, users: 14103 },
    { feature: 'Géolocalisation', adoption: 91, users: 14420 },
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Temps de réponse élevé',
      description: 'Les temps de réponse API dépassent 150ms',
      time: '2024-06-17 14:30',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'info',
      title: 'Mise à jour système planifiée',
      description: 'Maintenance prévue ce soir de 02h00 à 04h00',
      time: '2024-06-17 10:15',
      severity: 'low'
    },
    {
      id: 3,
      type: 'success',
      title: 'Pic de trafic géré avec succès',
      description: 'Le système a bien géré 150% du trafic habituel',
      time: '2024-06-17 09:45',
      severity: 'low'
    },
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };

  const getAlertBadge = (severity) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">Critique</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800">Moyen</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* System Health KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Disponibilité</p>
                <p className="text-3xl font-black text-gray-900">99.9%</p>
                <p className="text-sm text-green-600 font-semibold mt-1">Excellent</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Temps de Réponse</p>
                <p className="text-3xl font-black text-gray-900">118ms</p>
                <p className="text-sm text-green-600 font-semibold mt-1">Optimal</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Utilisateurs Actifs</p>
                <p className="text-3xl font-black text-gray-900">2,840</p>
                <p className="text-sm text-blue-600 font-semibold mt-1">En temps réel</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Satisfaction</p>
                <p className="text-3xl font-black text-gray-900">4.7★</p>
                <p className="text-sm text-green-600 font-semibold mt-1">+0.2 ce mois</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Monitoring Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Performance */}
        <Card className="fintech-chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
              Performance Système (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={systemMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="time" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="uptime" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="response" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Satisfaction */}
        <Card className="fintech-chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Star className="h-4 w-4 text-white" />
              </div>
              Évolution Satisfaction Client
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis domain={[3.5, 5]} stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="rating" 
                  stroke="#8B5CF6" 
                  fill="url(#colorRating)" 
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Feature Adoption */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            Adoption des Fonctionnalités
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featureAdoption.map((feature, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{feature.feature}</h3>
                  <span className="text-2xl font-black text-gray-900">{feature.adoption}%</span>
                </div>
                <Progress value={feature.adoption} className="h-3 mb-3" />
                <p className="text-sm text-gray-600">
                  {feature.users.toLocaleString()} utilisateurs actifs
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card className="fintech-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                <Bell className="h-4 w-4 text-white" />
              </div>
              Alertes Système
            </CardTitle>
            <Button variant="outline" size="sm" className="rounded-lg">
              Voir Toutes les Alertes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                    {getAlertBadge(alert.severity)}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{alert.description}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  Résoudre
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformHealthSection;
