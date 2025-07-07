
import React, { useState } from 'react';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  MapPin,
  Clock,
  Star,
  Activity,
  Eye,
  Download,
  Brain,
  Target,
  Lightbulb,
  BarChart3,
  PieChart as PieChartIcon,
  CreditCard,
  Wallet,
  ArrowUpRight,
  FileText,
  Receipt,
  Calculator,
  Zap
} from 'lucide-react';

const AnalyticsDashboard = () => {
  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, bookings: 320 },
    { month: 'Feb', revenue: 52000, bookings: 380 },
    { month: 'Mar', revenue: 48000, bookings: 350 },
    { month: 'Apr', revenue: 61000, bookings: 420 },
    { month: 'May', revenue: 55000, bookings: 390 },
    { month: 'Jun', revenue: 67000, bookings: 450 },
  ];

  const categoryData = [
    { name: 'Cleaning', value: 35, color: '#8B5CF6' },
    { name: 'Handyman', value: 25, color: '#06B6D4' },
    { name: 'Plumbing', value: 20, color: '#10B981' },
    { name: 'Electrical', value: 12, color: '#F59E0B' },
    { name: 'Other', value: 8, color: '#EF4444' },
  ];

  // Performance metrics data
  const performanceMetrics = [
    {
      title: "Response Time",
      value: "230ms",
      status: "good",
      icon: Clock,
      color: "from-green-600 to-emerald-600"
    },
    {
      title: "Completion Rate",
      value: "94.2%",
      status: "excellent",
      icon: Activity,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Customer Satisfaction",
      value: "4.8/5",
      status: "excellent",
      icon: Star,
      color: "from-yellow-600 to-orange-600"
    },
    {
      title: "Growth Rate",
      value: "+15.3%",
      status: "good",
      icon: TrendingUp,
      color: "from-purple-600 to-violet-600"
    }
  ];

  // Business insights data
  const insights = [
    {
      title: "Peak Hours",
      insight: "Most bookings occur between 2-6 PM on weekdays",
      impact: "High",
      icon: Clock,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Top Markets",
      insight: "Downtown and suburbs show 40% higher demand",
      impact: "High",
      icon: MapPin,
      color: "from-green-600 to-emerald-600"
    },
    {
      title: "Customer Retention",
      insight: "Users with 5+ star ratings return 3x more",
      impact: "Medium",
      icon: Star,
      color: "from-yellow-600 to-orange-600"
    },
    {
      title: "Service Categories",
      insight: "Cleaning and handyman services drive 60% of revenue",
      impact: "High",
      icon: Target,
      color: "from-purple-600 to-violet-600"
    }
  ];

  // Financial metrics data
  const financialMetrics = [
    {
      title: "Monthly Revenue",
      value: "$45,230",
      change: "+15.2%",
      icon: DollarSign,
      color: "from-green-600 to-emerald-600"
    },
    {
      title: "Profit Margin",
      value: "28.5%",
      change: "+3.1%",
      icon: Target,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Average Transaction",
      value: "$187",
      change: "+8.7%",
      icon: CreditCard,
      color: "from-purple-600 to-violet-600"
    },
    {
      title: "Cash Flow",
      value: "$12,450",
      change: "+22.3%",
      icon: Wallet,
      color: "from-yellow-600 to-orange-600"
    }
  ];

  // Tax summary data
  const taxSummary = [
    {
      title: "Total Revenue",
      value: "$124,350",
      period: "2024 YTD",
      icon: DollarSign,
      color: "from-green-600 to-emerald-600"
    },
    {
      title: "Deductible Expenses",
      value: "$18,420",
      period: "2024 YTD",
      icon: Receipt,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Net Income",
      value: "$105,930",
      period: "2024 YTD",
      icon: Calculator,
      color: "from-purple-600 to-violet-600"
    }
  ];

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-white/90 drop-shadow-md">
                Comprehensive insights into your business performance
              </p>
            </div>

            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="fintech-metric-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80 mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold">$328K</p>
                      <p className="text-sm text-green-600 font-semibold mt-1">+12.5%</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="fintech-metric-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80 mb-1">Total Bookings</p>
                      <p className="text-3xl font-bold">2,310</p>
                      <p className="text-sm text-blue-600 font-semibold mt-1">+8.2%</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="fintech-metric-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80 mb-1">Active Users</p>
                      <p className="text-3xl font-bold">1,847</p>
                      <p className="text-sm text-purple-600 font-semibold mt-1">+15.3%</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="fintech-metric-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80 mb-1">Avg Rating</p>
                      <p className="text-3xl font-bold">4.8</p>
                      <p className="text-sm text-yellow-600 font-semibold mt-1">+0.2</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Tabs */}
            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-card/20 backdrop-blur-md">
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Performance
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Business Insights
                </TabsTrigger>
                <TabsTrigger value="growth" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Growth
                </TabsTrigger>
                <TabsTrigger value="tax" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Tax Reports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="performance" className="space-y-6">
                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {performanceMetrics.map((metric, index) => (
                    <Card key={index} className="fintech-metric-card">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium opacity-80 mb-1">{metric.title}</p>
                            <p className="text-3xl font-bold">{metric.value}</p>
                            <p className="text-sm text-green-600 mt-1 capitalize">{metric.status}</p>
                          </div>
                          <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                            <metric.icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Chart */}
                  <Card className="fintech-chart-container">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Revenue Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#8B5CF6" 
                            fill="url(#colorRevenue)" 
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
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Service Categories
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
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 space-y-2">
                        {categoryData.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm">{item.name}</span>
                            </div>
                            <span className="text-sm font-medium">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                {/* Key Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {insights.map((insight, index) => (
                    <Card key={index} className="fintech-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className={`w-8 h-8 bg-gradient-to-r ${insight.color} rounded-lg flex items-center justify-center`}>
                            <insight.icon className="h-4 w-4 text-white" />
                          </div>
                          {insight.title}
                          <span className={`ml-auto px-2 py-1 text-xs rounded ${
                            insight.impact === 'High' ? 'bg-red-500/20 text-red-600' : 'bg-yellow-500/20 text-yellow-600'
                          }`}>
                            {insight.impact} Impact
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{insight.insight}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* AI Recommendations */}
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Lightbulb className="h-5 w-5 text-yellow-500 mt-1" />
                      <div>
                        <h3 className="font-medium">Optimize Pricing Strategy</h3>
                        <p className="text-sm opacity-80">Consider dynamic pricing during peak hours (2-6 PM) to maximize revenue</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Lightbulb className="h-5 w-5 text-yellow-500 mt-1" />
                      <div>
                        <h3 className="font-medium">Expand in High-Demand Areas</h3>
                        <p className="text-sm opacity-80">Focus marketing efforts on downtown and suburban areas for better ROI</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Lightbulb className="h-5 w-5 text-yellow-500 mt-1" />
                      <div>
                        <h3 className="font-medium">Enhance Quality Control</h3>
                        <p className="text-sm opacity-80">Implement quality assurance programs to maintain high ratings and customer retention</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="growth" className="space-y-6">
                {/* Financial Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {financialMetrics.map((metric, index) => (
                    <Card key={index} className="fintech-metric-card">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium opacity-80 mb-1">{metric.title}</p>
                            <p className="text-3xl font-bold">{metric.value}</p>
                            <p className="text-sm text-green-600 mt-1 flex items-center">
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                              {metric.change}
                            </p>
                          </div>
                          <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                            <metric.icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Financial Forecasting */}
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Financial Forecasting
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <h3 className="font-medium mb-2">Next Month Projection</h3>
                        <p className="text-2xl font-bold text-green-600">$52,800</p>
                        <p className="opacity-70 text-sm">+16.7% growth expected</p>
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium mb-2">Quarterly Target</h3>
                        <p className="text-2xl font-bold text-blue-600">$150,000</p>
                        <p className="opacity-70 text-sm">87% progress to goal</p>
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium mb-2">Annual Forecast</h3>
                        <p className="text-2xl font-bold text-purple-600">$600,000</p>
                        <p className="opacity-70 text-sm">Based on current trends</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tax" className="space-y-6">
                {/* Tax Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {taxSummary.map((item, index) => (
                    <Card key={index} className="fintech-metric-card">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium opacity-80 mb-1">{item.title}</p>
                            <p className="text-3xl font-bold">{item.value}</p>
                            <p className="text-sm opacity-70 mt-1">{item.period}</p>
                          </div>
                          <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center`}>
                            <item.icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Generate Custom Report */}
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Generate Tax Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Report Type</label>
                        <select className="fintech-input w-full">
                          <option>Income Statement</option>
                          <option>Expense Report</option>
                          <option>Tax Summary</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Date Range</label>
                        <select className="fintech-input w-full">
                          <option>Last Quarter</option>
                          <option>Last 6 Months</option>
                          <option>Year to Date</option>
                          <option>Custom Range</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Format</label>
                        <select className="fintech-input w-full">
                          <option>PDF</option>
                          <option>Excel</option>
                          <option>CSV</option>
                        </select>
                      </div>
                    </div>
                    <Button className="fintech-button-primary w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsDashboard;
