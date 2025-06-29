
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
import { Target, Users, TrendingUp, Star, AlertTriangle } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <Card className="border-red-200">
              <CardContent className="p-6">
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Button
                onClick={() => navigate('/analytics-dashboard')}
                variant="outline"
                className="bg-green-600 text-white hover:bg-green-700 border-green-600"
              >
                ← Back to Analytics
              </Button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-8 w-8 text-green-600" />
              <h1 className="text-4xl font-bold text-gray-900">Business Insights</h1>
            </div>
            <p className="text-gray-600">Strategic business intelligence and market trends</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {insights.map((insight, index) => (
              <Card key={index} className="fintech-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
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

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Service Distribution</CardTitle>
              </CardHeader>
              <CardContent>
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

            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Customer Satisfaction Trends</CardTitle>
              </CardHeader>
              <CardContent>
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

          <Card className="fintech-card">
            <CardHeader>
              <CardTitle>Market Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">Montreal</div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Primary Market</div>
                  <div className="text-xs text-gray-600">65% of total bookings</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">Laval</div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Growing Market</div>
                  <div className="text-xs text-gray-600">25% of total bookings</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl">
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
