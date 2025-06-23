
import React from 'react';
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
  DollarSign, 
  Users,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const AnalyticsDashboard = () => {
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

  const kpiCards = [
    { 
      title: "Total Revenue", 
      value: formatCurrency(data.totalRevenue), 
      change: `${data.monthlyGrowth > 0 ? '+' : ''}${data.monthlyGrowth.toFixed(1)}%`,
      icon: <DollarSign className="h-5 w-5" />,
      trend: data.monthlyGrowth >= 0 ? 'up' : 'down'
    },
    { 
      title: "Monthly Revenue", 
      value: formatCurrency(data.monthlyRevenue), 
      change: "This month",
      icon: <TrendingUp className="h-5 w-5" />,
      trend: 'neutral'
    },
    { 
      title: "Total Bookings", 
      value: data.totalBookings.toString(), 
      change: `${data.monthlyBookings} this month`,
      icon: <Calendar className="h-5 w-5" />,
      trend: 'neutral'
    },
    { 
      title: "Avg Booking Value", 
      value: formatCurrency(data.averageBookingValue), 
      change: "Per booking",
      icon: <Users className="h-5 w-5" />,
      trend: 'neutral'
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
                    <p className="font-medium">Error loading analytics data</p>
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
              <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
            </div>
            <p className="text-gray-600">Comprehensive analytics and business insights</p>
            
            {/* Sub-navigation */}
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={refreshData} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/performance-dashboard')}
              >
                📊 Performance
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/business-insights')}
              >
                🎯 Business Insights
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/tax-reports')}
              >
                📋 Tax Reports
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiCards.map((card, index) => (
              <Card key={index} className="fintech-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {card.icon}
                    </div>
                    <Badge 
                      variant={card.trend === 'up' ? 'default' : 'secondary'}
                      className={card.trend === 'up' ? 'bg-green-100 text-green-700' : ''}
                    >
                      {card.change}
                    </Badge>
                  </div>
                  <h3 className="text-sm text-gray-600 mb-1">{card.title}</h3>
                  {loading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Bookings */}
            <Card className="fintech-chart-container">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Monthly Bookings Trend
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

            {/* Revenue by Category */}
            <Card className="fintech-chart-container">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💰 Revenue by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <ChartContainer config={chartConfig} className="h-80">
                    <BarChart data={data.revenueByCategory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="category" stroke="#666" />
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
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Monthly Revenue */}
            <Card className="fintech-chart-container">
              <CardHeader>
                <CardTitle>Monthly Revenue Trends</CardTitle>
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
                      <Bar dataKey="revenue" fill="#3B82F6" radius={4} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Top Services */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Top Performing Services</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : data.topServices.length > 0 ? (
                  <div className="space-y-4">
                    {data.topServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{service.title}</span>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(service.revenue)}</p>
                          <p className="text-sm text-gray-500">{service.count} bookings</p>
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

export default AnalyticsDashboard;
