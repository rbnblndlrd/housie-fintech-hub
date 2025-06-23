
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminData } from '@/hooks/useAdminData';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';

const OverviewSection = () => {
  const { stats, loading: statsLoading, error: statsError, loadAdminStats } = useAdminData();
  const { analytics, loading: analyticsLoading, error: analyticsError, refreshAnalytics } = useAdminAnalytics();

  const loading = statsLoading || analyticsLoading;
  const error = statsError || analyticsError;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

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
                    trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {change}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="font-medium">Error loading overview data</p>
              <p className="text-sm text-red-500">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                loadAdminStats();
                refreshAnalytics();
              }}
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
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change={stats.userGrowth > 0 ? `+${stats.userGrowth.toFixed(1)}% ce mois` : `${stats.userGrowth.toFixed(1)}% ce mois`}
          trend={stats.userGrowth >= 0 ? 'up' : 'down'}
          icon={Users}
          color="bg-gradient-to-r from-blue-600 to-blue-700"
          loading={loading}
        />
        <MetricCard
          title="Revenue"
          value={formatCurrency(stats.totalRevenue)}
          change={stats.revenueGrowth > 0 ? `+${stats.revenueGrowth.toFixed(1)}% ce mois` : `${stats.revenueGrowth.toFixed(1)}% ce mois`}
          trend={stats.revenueGrowth >= 0 ? 'up' : 'down'}
          icon={DollarSign}
          color="bg-gradient-to-r from-green-600 to-green-700"
          loading={loading}
        />
        <MetricCard
          title="Bookings"
          value={stats.monthlyBookings.toString()}
          change={`${stats.bookingGrowth > 0 ? '+' : ''}${stats.bookingGrowth.toFixed(1)}% vs mois dernier`}
          trend={stats.bookingGrowth >= 0 ? 'up' : 'down'}
          icon={Calendar}
          color="bg-gradient-to-r from-purple-600 to-purple-700"
          loading={loading}
        />
        <MetricCard
          title="Alerts"
          value={stats.alertsCount.toString()}
          change={`${stats.highRiskAlerts} haute priorité`}
          trend={stats.alertsCount > 5 ? 'down' : 'up'}
          icon={AlertTriangle}
          color="bg-gradient-to-r from-orange-600 to-red-600"
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="fintech-chart-container">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              📈 Revenue Trend
              <Button variant="ghost" size="sm" onClick={refreshAnalytics}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : analytics.monthlyBookings.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={analytics.monthlyBookings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? 'Revenue' : 'Bookings'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No revenue data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service Categories */}
        <Card className="fintech-chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Categories de Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : analytics.serviceCategories.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={analytics.serviceCategories}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="revenue"
                    >
                      {analytics.serviceCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {analytics.serviceCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold">{formatCurrency(category.revenue)}</span>
                        <p className="text-xs text-gray-500">{category.count} services</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No service category data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Regional Distribution */}
      <Card className="fintech-chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🗺️ Distribution Géographique
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : analytics.regionalData.length > 0 ? (
            <div className="space-y-4">
              {analytics.regionalData.slice(0, 5).map((region, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{region.region}</p>
                      <p className="text-sm text-gray-600">{region.users} utilisateurs</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{region.bookings} réservations</p>
                    <p className="text-sm text-gray-600">{formatCurrency(region.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">
              No regional data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewSection;
