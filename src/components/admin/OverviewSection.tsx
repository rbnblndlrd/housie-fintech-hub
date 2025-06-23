import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminData } from '@/hooks/useAdminData';
import { Skeleton } from '@/components/ui/skeleton';

const OverviewSection = () => {
  const { stats, loading, error, loadAdminStats } = useAdminData();

  // Mock data for charts (keeping charts as visualization examples)
  const revenueData = [
    { month: 'Jan', revenue: 125000, fees: 6250, bookings: 450 },
    { month: 'Fév', revenue: 148000, fees: 7400, bookings: 520 },
    { month: 'Mar', revenue: 167000, fees: 8350, bookings: 580 },
    { month: 'Avr', revenue: 189000, fees: 9450, bookings: 650 },
    { month: 'Mai', revenue: 215000, fees: 10750, bookings: 720 },
    { month: 'Jun', revenue: stats.totalRevenue, fees: stats.totalRevenue * 0.05, bookings: stats.monthlyBookings },
  ];

  const categoryData = [
    { name: 'Nettoyage', value: 45, revenue: 112000, color: '#8B5CF6' },
    { name: 'Entretien Paysager', value: 28, revenue: 68000, color: '#06B6D4' },
    { name: 'Construction', value: 15, revenue: 35000, color: '#10B981' },
    { name: 'Bien-être', value: 8, revenue: 20000, color: '#F59E0B' },
    { name: 'Soins Animaux', value: 4, revenue: 13000, color: '#EF4444' },
  ];

  const geoData = [
    { region: 'Montréal', bookings: Math.floor(stats.monthlyBookings * 0.5), revenue: Math.floor(stats.totalRevenue * 0.4) },
    { region: 'Québec', bookings: Math.floor(stats.monthlyBookings * 0.27), revenue: Math.floor(stats.totalRevenue * 0.25) },
    { region: 'Gatineau', bookings: Math.floor(stats.monthlyBookings * 0.13), revenue: Math.floor(stats.totalRevenue * 0.15) },
    { region: 'Sherbrooke', bookings: Math.floor(stats.monthlyBookings * 0.07), revenue: Math.floor(stats.totalRevenue * 0.12) },
    { region: 'Trois-Rivières', bookings: Math.floor(stats.monthlyBookings * 0.03), revenue: Math.floor(stats.totalRevenue * 0.08) },
  ];

  const MetricCard = ({ title, value, change, trend, icon: Icon, color, loading: cardLoading, suffix = "" }) => (
    <Card className="fintech-card hover:shadow-[0_12px_40px_-4px_rgba(0,0,0,0.15)] transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            {cardLoading ? (
              <Skeleton className="h-8 w-24 mb-2" />
            ) : (
              <p className="text-3xl font-black text-gray-900">{value}{suffix}</p>
            )}
            <div className="flex items-center mt-2">
              {cardLoading ? (
                <Skeleton className="h-4 w-20" />
              ) : (
                <>
                  {trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : trend === 'down' ? (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  ) : null}
                  <span className={`text-sm font-semibold ${
                    trend === 'up' ? 'text-green-600' : 
                    trend === 'down' ? 'text-red-600' : 
                    'text-gray-500'
                  }`}>
                    {change !== undefined ? `${change > 0 ? '+' : ''}${change.toFixed(1)}%` : 'N/A'}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
                </>
              )}
            </div>
          </div>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color}`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="space-y-8">
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-medium">Erreur de chargement des données</p>
                <p className="text-sm text-red-500">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadAdminStats}
                className="ml-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Vue d'ensemble</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={loadAdminStats}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Utilisateurs Totaux"
          value={loading ? "..." : stats.totalUsers.toLocaleString()}
          change={stats.userGrowth}
          trend={stats.userGrowth > 0 ? 'up' : stats.userGrowth < 0 ? 'down' : 'neutral'}
          icon={Users}
          color="bg-gradient-to-r from-blue-600 to-purple-600"
          loading={loading}
        />
        <MetricCard
          title="Prestataires Actifs"
          value={loading ? "..." : stats.activeProviders.toLocaleString()}
          change={stats.providerGrowth}
          trend={stats.providerGrowth > 0 ? 'up' : stats.providerGrowth < 0 ? 'down' : 'neutral'}
          icon={Users}
          color="bg-gradient-to-r from-green-600 to-emerald-600"
          loading={loading}
        />
        <MetricCard
          title="Réservations Mensuelles"
          value={loading ? "..." : stats.monthlyBookings.toLocaleString()}
          change={stats.bookingGrowth}
          trend={stats.bookingGrowth > 0 ? 'up' : stats.bookingGrowth < 0 ? 'down' : 'neutral'}
          icon={Calendar}
          color="bg-gradient-to-r from-orange-600 to-red-600"
          loading={loading}
        />
        <MetricCard
          title="Revenus Totaux"
          value={loading ? "..." : `${(stats.totalRevenue / 1000).toFixed(0)}K`}
          change={stats.revenueGrowth}
          trend={stats.revenueGrowth > 0 ? 'up' : stats.revenueGrowth < 0 ? 'down' : 'neutral'}
          icon={DollarSign}
          color="bg-gradient-to-r from-purple-600 to-pink-600"
          loading={loading}
          suffix=" $"
        />
      </div>

      {/* Alerts Summary */}
      {(stats.alertsCount > 0 || stats.highRiskAlerts > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">
                  {stats.alertsCount} alertes détectées aujourd'hui
                </p>
                {stats.highRiskAlerts > 0 && (
                  <p className="text-sm text-orange-700">
                    {stats.highRiskAlerts} alertes à haut risque nécessitent une attention immédiate
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trends */}
        <Card className="fintech-chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Tendances des Revenus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
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
                  dataKey="revenue" 
                  stroke="url(#colorRevenue)" 
                  fill="url(#colorRevenue)" 
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Categories */}
        <Card className="fintech-chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              Catégories de Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-gray-700">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{category.value}%</div>
                    <div className="text-sm text-gray-500">{category.revenue.toLocaleString()} $</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card className="fintech-chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            Distribution Géographique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={geoData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="region" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar 
                dataKey="bookings" 
                fill="url(#colorBookings)" 
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewSection;
