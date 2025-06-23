import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const PerformanceDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { data, loading, error, refreshData } = useAnalyticsData(user?.id, currentRole);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const getDashboardPath = () => {
    return currentRole === 'provider' ? '/provider-dashboard' : '/customer-dashboard';
  };

  const kpiMetrics = [
    { 
      label: "Completion Rate", 
      value: `${data.completionRate.toFixed(1)}%`, 
      target: "90%", 
      status: data.completionRate >= 90 ? "above" : "below", 
      icon: <Target className="h-5 w-5" /> 
    },
    { 
      label: "Monthly Revenue", 
      value: formatCurrency(data.monthlyRevenue), 
      target: "Growth", 
      status: data.monthlyGrowth > 0 ? "above" : "below", 
      icon: <Clock className="h-5 w-5" /> 
    },
    { 
      label: "Avg Booking Value", 
      value: formatCurrency(data.averageBookingValue), 
      target: "Optimize", 
      status: data.averageBookingValue > 100 ? "above" : "below", 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      label: "Growth Rate", 
      value: `${data.monthlyGrowth > 0 ? '+' : ''}${data.monthlyGrowth.toFixed(1)}%`, 
      target: "+10%", 
      status: data.monthlyGrowth >= 10 ? "above" : "below", 
      icon: <TrendingUp className="h-5 w-5" /> 
    }
  ];

  const chartConfig = {
    bookings: { label: "Bookings", color: "#3B82F6" },
    revenue: { label: "Revenue", color: "#10B981" }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <Card className="border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Error loading performance data</p>
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshData}
                    className="ml-auto"
                  >
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Button
                onClick={() => navigate(getDashboardPath())}
                variant="outline"
                className="bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
              >
                ← Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Performance Dashboard</h1>
            </div>
            <p className="text-gray-600">Track your business KPIs and performance metrics with real-time data</p>
            
            {/* Controls */}
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={refreshData} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <Button variant="outline">🎯 Performance Goals</Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiMetrics.map((kpi, index) => (
              <Card key={index} className="fintech-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {kpi.icon}
                    </div>
                    <Badge 
                      variant={kpi.status === 'above' ? 'default' : 'secondary'}
                      className={kpi.status === 'above' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                    >
                      {kpi.status === 'above' ? 'Above target' : 'Below target'}
                    </Badge>
                  </div>
                  <h3 className="text-sm text-gray-600 mb-1">{kpi.label}</h3>
                  {loading ? (
                    <Skeleton className="h-8 w-20 mb-2" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 mb-2">{kpi.value}</p>
                  )}
                  <p className="text-sm text-gray-500">Target: {kpi.target}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Performance */}
            <Card className="fintech-chart-container">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Monthly Bookings Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <ChartContainer config={chartConfig} className="h-80">
                    <LineChart data={data.bookingsByMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="bookings" 
                        stroke="#06B6D4" 
                        strokeWidth={3}
                        dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Revenue Trends */}
            <Card className="fintech-chart-container">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🟢 Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <ChartContainer config={chartConfig} className="h-80">
                    <BarChart data={data.bookingsByMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="#10B981" radius={4} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Service Quality */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⭐ Service Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="font-semibold">{data.completionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Bookings</span>
                      <span className="font-semibold">{data.totalBookings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly Bookings</span>
                      <span className="font-semibold">{data.monthlyBookings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Value</span>
                      <span className="font-semibold">{formatCurrency(data.averageBookingValue)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Revenue Metrics */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Revenue Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="font-semibold">{formatCurrency(data.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Revenue</span>
                      <span className="font-semibold">{formatCurrency(data.monthlyRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth Rate</span>
                      <span className={`font-semibold ${data.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.monthlyGrowth > 0 ? '+' : ''}{data.monthlyGrowth.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg per Booking</span>
                      <span className="font-semibold">{formatCurrency(data.averageBookingValue)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : data.revenueByCategory.length > 0 ? (
                  <div className="space-y-4">
                    {data.revenueByCategory.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{category.category}</span>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(category.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No category data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
