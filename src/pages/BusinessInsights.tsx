
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Users, TrendingUp, Star, AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const BusinessInsights = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();
  const { data, loading, error, refreshData } = useAnalyticsData(user?.id, currentRole);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const insights = [
    {
      title: "Peak Hours",
      value: "2-4 PM",
      description: "Highest booking activity",
      icon: Target
    },
    {
      title: "Top Service",
      value: "Home Cleaning",
      description: "45% of all bookings",
      icon: Star
    },
    {
      title: "Growth Rate",
      value: "+23%",
      description: "Month-over-month",
      icon: TrendingUp
    },
    {
      title: "Customer Retention",
      value: "78%",
      description: "Repeat customers",
      icon: Users
    }
  ];

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="pt-14 px-2 pb-4">
          <div className="max-w-none mx-2">
            <Card className="border-red-200 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Error loading business insights</p>
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
    <div className="min-h-screen">
      <div className="pt-14 px-2 pb-4">
        <div className="max-w-none mx-2">
          {/* Header with Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/analytics-dashboard')}
                className="text-white hover:bg-white/10 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Analytics
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-3">
                  <Target className="h-7 w-7 text-white" />
                  Business Insights
                </h1>
                <p className="text-white/90 drop-shadow-lg">Strategic business intelligence and market trends</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/analytics-dashboard')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Analytics Home
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {insights.map((insight, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <insight.icon className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-sm text-gray-600 mb-1">{insight.title}</h3>
                  {loading ? (
                    <Skeleton className="h-8 w-24 mb-2" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900 mb-1">{insight.value}</p>
                  )}
                  <p className="text-xs text-gray-500">{insight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mb-6">
            <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle>Service Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {loading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Home Cleaning', value: 45, color: COLORS[0] },
                          { name: 'Plumbing', value: 25, color: COLORS[1] },
                          { name: 'Electrical', value: 20, color: COLORS[2] },
                          { name: 'Other', value: 10, color: COLORS[3] }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {[45, 25, 20, 10].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle>Customer Satisfaction Trends</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {loading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.bookingsByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completed" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle>Market Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">Montreal</div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Primary Market</div>
                  <div className="text-xs text-gray-600">65% of total bookings</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">Laval</div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Growing Market</div>
                  <div className="text-xs text-gray-600">25% of total bookings</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">Other</div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Emerging</div>
                  <div className="text-xs text-gray-600">10% of total bookings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessInsights;
