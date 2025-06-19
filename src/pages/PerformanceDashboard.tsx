
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users,
  Target,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const PerformanceDashboard = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('month');

  const performanceData = [
    { month: 'Jul', performance: 95 },
    { month: 'Aug', performance: 88 },
    { month: 'Sep', performance: 92 },
    { month: 'Oct', performance: 96 },
    { month: 'Nov', performance: 89 },
    { month: 'Dec', performance: 94 }
  ];

  const bookingTrends = [
    { month: 'Jul', bookings: 95 },
    { month: 'Aug', bookings: 110 },
    { month: 'Sep', bookings: 125 },
    { month: 'Oct', bookings: 142 },
    { month: 'Nov', bookings: 118 },
    { month: 'Dec', bookings: 138 }
  ];

  const kpiMetrics = [
    { label: "Efficiency", value: "92%", target: "90%", status: "above", icon: <Target className="h-5 w-5" /> },
    { label: "Response Time", value: "12m", target: "15m", status: "below", icon: <Clock className="h-5 w-5" /> },
    { label: "Retention", value: "87%", target: "85%", status: "above", icon: <Users className="h-5 w-5" /> },
    { label: "Growth Rate", value: "+15%", target: "+12%", status: "above", icon: <TrendingUp className="h-5 w-5" /> }
  ];

  const serviceQuality = [
    { metric: "Overall Rating", score: "4.8", stars: 5 },
    { metric: "Punctuality", score: "4.9", stars: 5 },
    { metric: "Quality", score: "4.7", stars: 5 },
    { metric: "Communication", score: "4.8", stars: 5 }
  ];

  const chartConfig = {
    performance: { label: "Performance", color: "#3B82F6" },
    bookings: { label: "Bookings", color: "#10B981" }
  };

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
                ← Retour aux Analytiques
              </Button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Performance Dashboard</h1>
            </div>
            <p className="text-gray-600">Track your business KPIs and performance metrics</p>
            
            {/* Controls */}
            <div className="flex gap-3 mt-6">
              <Button variant="outline">Date Range</Button>
              <Button variant="outline">Starter+</Button>
              <Button variant="outline">🎯 Set Goals</Button>
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
                  <p className="text-3xl font-bold text-gray-900 mb-2">{kpi.value}</p>
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
                  Monthly Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="performance" 
                      stroke="#06B6D4" 
                      strokeWidth={3}
                      dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Booking Trends */}
            <Card className="fintech-chart-container">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🟢 Booking Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <BarChart data={bookingTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="bookings" fill="#10B981" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Service Quality */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⭐ Service Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceQuality.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.score}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400">⭐</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Booking Metrics */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Booking Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Acceptance Rate</span>
                    <span className="font-semibold">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancellation Rate</span>
                    <span className="font-semibold">2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Repeat Customers</span>
                    <span className="font-semibold">68%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">No-Shows</span>
                    <span className="font-semibold">1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Efficiency Metrics */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Efficiency Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Service Time</span>
                    <span className="font-semibold">2.3h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travel Efficiency</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Schedule Utilization</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Peak Hour Usage</span>
                    <span className="font-semibold">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
