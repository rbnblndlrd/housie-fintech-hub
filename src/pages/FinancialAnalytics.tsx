
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, PiggyBank, CreditCard, AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const FinancialAnalytics = () => {
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

  const financialMetrics = [
    {
      title: "Gross Revenue",
      value: formatCurrency(data.totalRevenue),
      change: `+${data.monthlyGrowth.toFixed(1)}%`,
      icon: DollarSign,
      trend: 'up'
    },
    {
      title: "Monthly Recurring",
      value: formatCurrency(data.monthlyRevenue),
      change: "+12.5% vs last month",
      icon: TrendingUp,
      trend: 'up'
    },
    {
      title: "Average Transaction",
      value: formatCurrency(data.averageBookingValue),
      change: "+$5.20 vs last month",
      icon: CreditCard,
      trend: 'up'
    },
    {
      title: "Profit Margin",
      value: "34.5%",
      change: "+2.1% vs last month",
      icon: PiggyBank,
      trend: 'up'
    }
  ];

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <Card className="border-red-200 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Error loading financial data</p>
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
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Navigation */}
          <div className="flex items-center justify-between mb-6">
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
                <h1 className="text-4xl font-bold text-white drop-shadow-lg flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-white" />
                  Financial Analytics
                </h1>
                <p className="text-white/90 drop-shadow-lg">Comprehensive financial metrics and revenue analysis</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {financialMetrics.map((metric, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <metric.icon className="h-5 w-5 text-purple-600" />
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

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.bookingsByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [formatCurrency(value), 'Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Financial Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Total Income</span>
                    <span className="font-bold text-green-600">{formatCurrency(data.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Operating Costs</span>
                    <span className="font-bold text-blue-600">{formatCurrency(data.totalRevenue * 0.4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium">Marketing</span>
                    <span className="font-bold text-orange-600">{formatCurrency(data.totalRevenue * 0.15)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <span className="font-bold">Net Profit</span>
                    <span className="font-bold text-purple-600">{formatCurrency(data.totalRevenue * 0.345)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Payment Methods & Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">67%</div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Credit Cards</div>
                  <div className="text-xs text-gray-600">Primary payment method</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">28%</div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">E-Transfer</div>
                  <div className="text-xs text-gray-600">Growing preference</div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-xl">
                  <div className="text-3xl font-bold text-gray-600 mb-2">5%</div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Cash</div>
                  <div className="text-xs text-gray-600">Traditional method</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalytics;
