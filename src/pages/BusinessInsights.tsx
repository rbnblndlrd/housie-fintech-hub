
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Star,
  PieChart,
  BarChart3,
  Clock
} from 'lucide-react';
import { LineChart, Line, PieChart as RechartsPieChart, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const BusinessInsights = () => {
  const navigate = useNavigate();

  const revenueData = [
    { month: 'Jul', revenue: 22500 },
    { month: 'Aug', revenue: 24800 },
    { month: 'Sep', revenue: 26200 },
    { month: 'Oct', revenue: 27800 },
    { month: 'Nov', revenue: 28500 },
    { month: 'Dec', revenue: 29000 }
  ];

  const serviceDistribution = [
    { name: 'Regular Cleaning', value: 45, color: '#3B82F6' },
    { name: 'Deep Cleaning', value: 30, color: '#10B981' },
    { name: 'Move-in/out', value: 15, color: '#F59E0B' },
    { name: 'Commercial', value: 10, color: '#EF4444' }
  ];

  const kpiData = [
    { 
      label: "Revenue", 
      value: "$28,750", 
      change: "+12% vs last month",
      icon: <DollarSign className="h-6 w-6" />,
      color: "text-green-600"
    },
    { 
      label: "Bookings", 
      value: "127", 
      change: "+8% vs last month",
      icon: <Calendar className="h-6 w-6" />,
      color: "text-blue-600"
    },
    { 
      label: "Avg. Rate", 
      value: "$35/hr", 
      change: "+5% vs last month",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-purple-600"
    },
    { 
      label: "Rating", 
      value: "4.8", 
      change: "+0.2 vs last month",
      icon: <Star className="h-6 w-6" />,
      color: "text-yellow-600"
    }
  ];

  const peakHours = [
    { time: "10:00 - 12:00", usage: 85 },
    { time: "14:00 - 16:00", usage: 70 },
    { time: "09:00 - 10:00", usage: 60 }
  ];

  const chartConfig = {
    revenue: { label: "Revenue", color: "#3B82F6" }
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
              <h1 className="text-4xl font-bold text-gray-900">Business Insights</h1>
            </div>
            <p className="text-gray-600">Comprehensive analytics and business metrics</p>
            
            {/* Controls */}
            <div className="flex gap-3 mt-6">
              <Button variant="outline">Date Range</Button>
              <Button variant="outline">Pro+</Button>
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
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <h3 className="text-sm text-gray-600 mb-1">{kpi.label}</h3>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{kpi.value}</p>
                  <p className="text-sm text-green-600">{kpi.change}</p>
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
                <ChartContainer config={chartConfig} className="h-80">
                  <LineChart data={revenueData}>
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
              </CardContent>
            </Card>

            {/* Service Distribution */}
            <Card className="fintech-chart-container">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎯 Service Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <RechartsPieChart 
                        data={serviceDistribution}
                        cx="50%" 
                        cy="50%" 
                        outerRadius={80}
                        dataKey="value"
                      >
                        {serviceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RechartsPieChart>
                      <ChartTooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {serviceDistribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Peak Hours */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 Peak Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                        <span className="text-sm font-semibold">{hour.usage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Satisfaction */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">94%</div>
                  <div className="text-sm text-gray-600">Overall satisfaction</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">5 stars</span>
                    <span className="font-semibold">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">4 stars</span>
                    <span className="font-semibold">16%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">3 stars</span>
                    <span className="font-semibold">4%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Sources */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Booking Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Direct bookings</span>
                    <span className="font-semibold">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Search results</span>
                    <span className="font-semibold">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Referrals</span>
                    <span className="font-semibold">20%</span>
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

export default BusinessInsights;
