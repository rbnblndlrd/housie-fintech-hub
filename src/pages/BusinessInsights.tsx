
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Star,
  PieChart,
  BarChart3,
  Clock,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, PieChart as RechartsPieChart, Cell, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const BusinessInsights = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = 'provider'; // Default to provider role for business insights
  const { data, loading, error, refreshData } = useAnalyticsData(user?.id, userRole);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const kpiData = [
    { 
      label: "Revenue", 
      value: loading ? "..." : formatCurrency(data.monthlyRevenue), 
      change: loading ? "..." : `${data.monthlyGrowth > 0 ? '+' : ''}${data.monthlyGrowth.toFixed(1)}% vs last month`,
      icon: <DollarSign className="h-6 w-6" />,
      color: "text-green-600"
    },
    { 
      label: "Bookings", 
      value: loading ? "..." : data.monthlyBookings.toString(), 
      change: loading ? "..." : `${data.totalBookings} total bookings`,
      icon: <Calendar className="h-6 w-6" />,
      color: "text-blue-600"
    },
    { 
      label: "Avg. Value", 
      value: loading ? "..." : formatCurrency(data.averageBookingValue), 
      change: loading ? "..." : `${data.completionRate.toFixed(1)}% completion rate`,
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-purple-600"
    },
    { 
      label: "Total Revenue", 
      value: loading ? "..." : formatCurrency(data.totalRevenue), 
      change: loading ? "..." : "All-time earnings",
      icon: <Star className="h-6 w-6" />,
      color: "text-yellow-600"
    }
  ];

  // Calculate peak hours from booking data
  const calculatePeakHours = () => {
    if (!data.bookingsByMonth.length) return [];
    
    // Mock peak hours calculation - in reality this would analyze booking timestamps
    const totalBookings = data.totalBookings;
    return [
      { time: "10:00 - 12:00", usage: Math.min(85, (totalBookings / 10) * 15) },
      { time: "14:00 - 16:00", usage: Math.min(70, (totalBookings / 10) * 12) },
      { time: "09:00 - 10:00", usage: Math.min(60, (totalBookings / 10) * 10) }
    ];
  };

  const peakHours = calculatePeakHours();

  const chartConfig = {
    revenue: { label: "Revenue", color: "#3B82F6" }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

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
                    <p className="font-medium">Error loading business insights</p>
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
                onClick={() => navigate('/analytics-dashboard')}
                variant="outline"
                className="bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
              >
                ← Back to Analytics
              </Button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Business Insights</h1>
            </div>
            <p className="text-gray-600">Comprehensive analytics and business metrics</p>
            
            {/* Controls */}
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={refreshData} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <Button variant="outline">📊 Export Report</Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi, index) => (
              <Card key={index} className="fintech-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 bg-gray-50 rounded-lg ${kpi.color}`}>
                      {kpi.icon}
                    </div>
                    <TrendingUp className={`h-4 w-4 ${data.monthlyGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  </div>
                  <h3 className="text-sm text-gray-600 mb-1">{kpi.label}</h3>
                  {loading ? (
                    <Skeleton className="h-8 w-20 mb-2" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 mb-2">{kpi.value}</p>
                  )}
                  <p className={`text-sm ${data.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Trend */}
            <Card className="fintech-chart-container">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📈 Revenue Trend
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
                        dataKey="revenue" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Service Distribution */}
            <Card className="fintech-chart-container">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎯 Revenue by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-80 w-full" />
                ) : data.revenueByCategory.length > 0 ? (
                  <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPieChart>
                        <Pie
                          data={data.revenueByCategory}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="revenue"
                        >
                          {data.revenueByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {data.revenueByCategory.map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm font-medium">{category.category}</span>
                          </div>
                          <span className="text-sm font-bold">{formatCurrency(category.revenue)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-gray-500">
                    No category data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Peak Hours */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 Business Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {peakHours.map((hour, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{hour.time}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-orange-500 transition-all duration-300"
                              style={{ width: `${hour.usage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold">{hour.usage.toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Performance */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Business Performance</CardTitle>
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
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-semibold text-green-600">{data.completionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Bookings</span>
                      <span className="font-semibold">{data.totalBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Growth</span>
                      <span className={`font-semibold ${data.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.monthlyGrowth > 0 ? '+' : ''}{data.monthlyGrowth.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg. Booking Value</span>
                      <span className="font-semibold">{formatCurrency(data.averageBookingValue)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Services */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Top Services</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : data.topServices.length > 0 ? (
                  <div className="space-y-4">
                    {data.topServices.slice(0, 3).map((service, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{service.title}</p>
                          <p className="text-xs text-gray-500">{service.count} booking{service.count !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{formatCurrency(service.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No service data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInsights;
