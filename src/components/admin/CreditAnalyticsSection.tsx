
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, AlertTriangle, Coins, Shield, Activity, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreditAnalytics {
  totalRevenue: number;
  totalApiCosts: number;
  profitMargin: number;
  activeUsers: number;
  dailyUsage: any[];
  featureUsage: any[];
  revenueByPackage: any[];
  abuseAlerts: any[];
}

const CreditAnalyticsSection = () => {
  const [analytics, setAnalytics] = useState<CreditAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);

      // Fetch credit usage logs for revenue and cost analysis
      const { data: usageLogs, error: usageError } = await supabase
        .from('credit_usage_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - (timeRange === '7d' ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString());

      if (usageError) throw usageError;

      // Fetch abuse logs
      const { data: abuseLogs, error: abuseError } = await supabase
        .from('abuse_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .order('created_at', { ascending: false });

      if (abuseError) throw abuseError;

      // Calculate analytics
      const totalApiCosts = usageLogs?.reduce((sum, log) => sum + Number(log.api_cost_estimate || 0), 0) || 0;
      const totalCreditsUsed = usageLogs?.reduce((sum, log) => sum + log.credits_spent, 0) || 0;
      const totalRevenue = totalCreditsUsed * 0.10; // $0.10 per credit

      // Group usage by feature
      const featureUsage = usageLogs?.reduce((acc, log) => {
        const existing = acc.find(item => item.feature === log.feature_used);
        if (existing) {
          existing.usage += log.credits_spent;
          existing.cost += Number(log.api_cost_estimate || 0);
        } else {
          acc.push({
            feature: log.feature_used,
            usage: log.credits_spent,
            cost: Number(log.api_cost_estimate || 0),
            revenue: log.credits_spent * 0.10
          });
        }
        return acc;
      }, [] as any[]) || [];

      // Group by date for daily usage chart
      const dailyUsage = usageLogs?.reduce((acc, log) => {
        const date = new Date(log.created_at).toLocaleDateString();
        const existing = acc.find(item => item.date === date);
        if (existing) {
          existing.credits += log.credits_spent;
          existing.revenue += log.credits_spent * 0.10;
          existing.cost += Number(log.api_cost_estimate || 0);
        } else {
          acc.push({
            date,
            credits: log.credits_spent,
            revenue: log.credits_spent * 0.10,
            cost: Number(log.api_cost_estimate || 0)
          });
        }
        return acc;
      }, [] as any[]) || [];

      setAnalytics({
        totalRevenue,
        totalApiCosts,
        profitMargin: totalApiCosts > 0 ? ((totalRevenue - totalApiCosts) / totalApiCosts) * 100 : 0,
        activeUsers: new Set(usageLogs?.map(log => log.user_id)).size,
        dailyUsage: dailyUsage.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        featureUsage,
        revenueByPackage: [], // Would need package purchase data
        abuseAlerts: abuseLogs || []
      });

    } catch (error) {
      console.error('Error fetching credit analytics:', error);
      toast.error('Failed to load credit analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="fintech-chart-container">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-8 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card className="fintech-chart-container">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Failed to load analytics data</p>
        </CardContent>
      </Card>
    );
  }

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Credit & Rate Limiting Analytics</h2>
        <div className="flex gap-2">
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('7d')}
            size="sm"
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('30d')}
            size="sm"
          >
            30 Days
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="fintech-chart-container">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${analytics.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-chart-container">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Costs</p>
                <p className="text-2xl font-bold text-red-600">
                  ${analytics.totalApiCosts.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-chart-container">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.profitMargin.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Coins className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-chart-container">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-purple-600">
                  {analytics.activeUsers}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="usage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usage">Daily Usage</TabsTrigger>
          <TabsTrigger value="features">Feature Analysis</TabsTrigger>
          <TabsTrigger value="abuse">Abuse Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-6">
          <Card className="fintech-chart-container">
            <CardHeader>
              <CardTitle>Daily Revenue vs Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics.dailyUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue ($)" />
                  <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} name="API Cost ($)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="fintech-chart-container">
              <CardHeader>
                <CardTitle>Feature Usage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.featureUsage}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="usage"
                      nameKey="feature"
                    >
                      {analytics.featureUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="fintech-chart-container">
              <CardHeader>
                <CardTitle>Feature Profitability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.featureUsage.map((feature, index) => {
                    const profit = feature.revenue - feature.cost;
                    const margin = feature.cost > 0 ? ((profit / feature.cost) * 100) : 0;
                    
                    return (
                      <div key={feature.feature} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize">
                            {feature.feature.replace('_', ' ')}
                          </span>
                          <Badge variant={margin > 200 ? 'default' : margin > 100 ? 'default' : 'destructive'}>
                            {margin.toFixed(0)}% margin
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>Revenue: ${feature.revenue.toFixed(2)}</div>
                          <div>Cost: ${feature.cost.toFixed(2)}</div>
                          <div>Profit: ${profit.toFixed(2)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="abuse" className="space-y-6">
          <Card className="fintech-chart-container">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Recent Abuse Alerts (Last 24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.abuseAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No abuse alerts in the last 24 hours</p>
                  <p className="text-sm text-gray-500">Rate limiting system is working effectively</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analytics.abuseAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="font-medium capitalize">
                              {alert.abuse_type.replace('_', ' ')}
                            </p>
                            <p className="text-sm text-gray-600">
                              Action: {alert.action_taken}
                            </p>
                          </div>
                        </div>
                        <Badge variant={alert.severity === 'high' ? 'destructive' : 'default'}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreditAnalyticsSection;
