
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  PieChart,
  Calendar,
  DollarSign,
  Target,
  Clock,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.user_role || 'seeker';
  const { data, loading, error, refreshData } = useAnalyticsData(user?.id, userRole);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const analyticsPages = [
    {
      title: "Performance Dashboard",
      description: "Track your business KPIs and performance metrics",
      icon: <BarChart3 className="h-8 w-8" />,
      path: "/performance-dashboard",
      color: "from-blue-500 to-blue-600",
      stats: `${data.completionRate.toFixed(1)}% Completion Rate`
    },
    {
      title: "Business Insights", 
      description: "Comprehensive analytics and business metrics",
      icon: <PieChart className="h-8 w-8" />,
      path: "/business-insights",
      color: "from-purple-500 to-purple-600",
      stats: formatCurrency(data.monthlyRevenue)
    },
    {
      title: "Tax Reports & Compliance",
      description: "Tax compliance dashboard and official documents",
      icon: <FileText className="h-8 w-8" />,
      path: "/tax-reports",
      color: "from-green-500 to-emerald-500",
      stats: formatCurrency(data.totalRevenue)
    },
    {
      title: "Financial Analytics",
      description: "Revenue analysis and financial reporting",
      icon: <DollarSign className="h-8 w-8" />,
      path: "/analytics",
      color: "from-orange-500 to-orange-600",
      stats: formatCurrency(data.averageBookingValue)
    }
  ];

  const quickStats = [
    { 
      label: "Total Revenue", 
      value: formatCurrency(data.totalRevenue), 
      change: data.monthlyGrowth > 0 ? `+${data.monthlyGrowth.toFixed(1)}%` : `${data.monthlyGrowth.toFixed(1)}%`, 
      icon: <DollarSign className="h-5 w-5" /> 
    },
    { 
      label: "Bookings", 
      value: data.totalBookings.toString(), 
      change: `+${data.monthlyBookings} this month`, 
      icon: <Calendar className="h-5 w-5" /> 
    },
    { 
      label: "Avg. Value", 
      value: formatCurrency(data.averageBookingValue), 
      change: `${data.totalBookings} total`, 
      icon: <TrendingUp className="h-5 w-5" /> 
    },
    { 
      label: "Completion Rate", 
      value: `${data.completionRate.toFixed(1)}%`, 
      change: "Business metric", 
      icon: <Target className="h-5 w-5" /> 
    }
  ];

  const chartConfig = {
    bookings: { label: "Bookings", color: "#3B82F6" },
    revenue: { label: "Revenue", color: "#10B981" }
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
                onClick={() => navigate('/provider-dashboard')}
                variant="outline"
                className="bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
              >
                ← Back to Dashboard
              </Button>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Business Analytics
            </h1>
            <p className="text-gray-600">Real-time insights and comprehensive business metrics</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <Card key={index} className="fintech-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      {loading ? (
                        <Skeleton className="h-8 w-24 mb-2" />
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="p-2 bg-blue-50 rounded-lg mb-2">
                        {stat.icon}
                      </div>
                      <Badge variant="secondary" className={data.monthlyGrowth >= 0 ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"}>
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Trends */}
            <Card className="fintech-chart-container">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Monthly Trends
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
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
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
                  <PieChart className="h-5 w-5 text-green-600" />
                  Revenue by Category
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
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
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

          {/* Top Services */}
          <Card className="fintech-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Top Performing Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : data.topServices.length > 0 ? (
                <div className="space-y-3">
                  {data.topServices.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{service.title}</p>
                          <p className="text-sm text-gray-600">{service.count} booking{service.count !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatCurrency(service.revenue)}</p>
                        <p className="text-sm text-gray-500">Total revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No service data available</p>
              )}
            </CardContent>
          </Card>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analyticsPages.map((page, index) => (
              <Card 
                key={index} 
                className="fintech-card hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => navigate(page.path)}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className={`p-4 bg-gradient-to-r ${page.color} rounded-2xl text-white group-hover:scale-110 transition-transform duration-200`}>
                      {page.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{page.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-gray-700">
                          {loading ? <Skeleton className="h-4 w-20" /> : page.stats}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          View Details →
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
