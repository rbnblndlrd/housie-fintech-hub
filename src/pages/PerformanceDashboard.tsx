
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
import { Activity, TrendingUp, Clock, Target, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';

const PerformanceDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();
  const { data, loading, error, refreshData } = useAnalyticsData(user?.id, currentRole);

  const performanceMetrics = [
    { 
      title: "Response Time", 
      value: "2.3s", 
      change: "-0.5s vs last week",
      icon: Clock,
      trend: 'up'
    },
    { 
      title: "Completion Rate", 
      value: `${data.completionRate.toFixed(1)}%`, 
      change: "+2.1% vs last month",
      icon: Target,
      trend: 'up'
    },
    { 
      title: "Customer Rating", 
      value: "4.8/5", 
      change: "+0.2 vs last month",
      icon: TrendingUp,
      trend: 'up'
    },
    { 
      title: "Efficiency Score", 
      value: "87%", 
      change: "+5% vs last week",
      icon: Activity,
      trend: 'up'
    }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <Card className="border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Error loading performance data</p>
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={refreshData} className="ml-auto">
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
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Button
                onClick={() => navigate('/analytics-dashboard')}
                variant="outline"
                className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
              >
                ← Back to Analytics
              </Button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Performance Dashboard</h1>
            </div>
            <p className="text-gray-600">Real-time performance metrics and operational insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {performanceMetrics.map((metric, index) => (
              <Card key={index} className="fintech-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <metric.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'}>
                      {metric.change}
                    </Badge>
                  </div>
                  <h3 className="text-sm text-gray-600 mb-1">{metric.title}</h3>
                  {loading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data.bookingsByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Area type="monotone" dataKey="bookings" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Efficiency Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Task Completion</span>
                    <span className="text-sm text-gray-600">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">On-time Delivery</span>
                    <span className="text-sm text-gray-600">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Quality Score</span>
                    <span className="text-sm text-gray-600">4.8/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Resource Utilization</span>
                    <span className="text-sm text-gray-600">87%</span>
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
