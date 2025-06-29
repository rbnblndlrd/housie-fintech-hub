
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
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
  const { currentRole } = useRoleSwitch();
  const { data, loading, error, refreshData } = useAnalyticsData(user?.id, currentRole);

  console.log('📊 AnalyticsDashboard render:', { hasUser: !!user, currentRole });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const getDashboardPath = () => {
    return '/dashboard'; // Use unified dashboard
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
              <Button 
                variant="outline" 
                onClick={() => navigate(getDashboardPath())}
              >
                🏠 Main Dashboard
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

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <ChartContainer config={chartConfig} className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="revenue" stroke={chartConfig.revenue.color} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Booking Volume</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <ChartContainer config={chartConfig} className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="bookings" fill={chartConfig.bookings.color} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
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
