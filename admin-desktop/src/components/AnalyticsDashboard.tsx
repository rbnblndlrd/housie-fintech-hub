
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BarChart3, TrendingUp, DollarSign, Calendar, Users, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface AnalyticsData {
  totalBookings: number;
  totalRevenue: number;
  averageValue: number;
  growth: number;
  monthlyBookings: number[];
  categoryBreakdown: { name: string; value: number; color: string }[];
  revenueGrowth: number[];
}

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      console.log('📊 Loading analytics data...');
      
      // Mock analytics data - in production this would come from real data
      const mockData: AnalyticsData = {
        totalBookings: 408,
        totalRevenue: 67500,
        averageValue: 165,
        growth: 12.5,
        monthlyBookings: [45, 52, 48, 61, 55, 66],
        categoryBreakdown: [
          { name: 'Nettoyage', value: 45, color: '#8B5CF6' },
          { name: 'Entretien Paysager', value: 28, color: '#06B6D4' },
          { name: 'Construction', value: 15, color: '#10B981' },
          { name: 'Bien-être', value: 8, color: '#F59E0B' },
          { name: 'Soins Animaux', value: 4, color: '#EF4444' }
        ],
        revenueGrowth: [0, 5, 8, 12, 15, 22]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalytics(mockData);
      console.log('✅ Analytics data loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg">Loading analytics data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Analytics Overview</h2>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <Button onClick={loadAnalytics} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalBookings}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
              <div className="text-xs text-gray-500">+12.5% vs last month</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(analytics.totalRevenue)}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-xs text-gray-500">+22.1% vs last month</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(analytics.averageValue)}</div>
              <div className="text-sm text-gray-600">Average Value</div>
              <div className="text-xs text-gray-500">+5.8% vs last month</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">+{analytics.growth}%</div>
              <div className="text-sm text-gray-600">Growth Rate</div>
              <div className="text-xs text-gray-500">Monthly average</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Evolution */}
        {analytics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Booking Evolution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-64 flex items-end justify-between gap-2">
                  {analytics.monthlyBookings.map((value, index) => {
                    const height = (value / Math.max(...analytics.monthlyBookings)) * 200;
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="bg-blue-500 rounded-t w-full"
                          style={{ height: `${height}px` }}
                        ></div>
                        <div className="text-xs text-gray-600 mt-2">{months[index]}</div>
                        <div className="text-xs font-medium">{value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service Categories */}
        {analytics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Service Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative h-64 flex items-center justify-center">
                  {/* Simple pie chart representation */}
                  <div className="w-48 h-48 rounded-full relative overflow-hidden">
                    {analytics.categoryBreakdown.map((category, index) => {
                      const angle = (category.value / 100) * 360;
                      return (
                        <div
                          key={category.name}
                          className="absolute inset-0"
                          style={{
                            background: `conic-gradient(${category.color} ${angle}deg, transparent ${angle}deg)`
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  {analytics.categoryBreakdown.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <div className="text-sm font-medium">{category.value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Revenue Trends */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue Growth Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-end justify-between gap-4">
              {analytics.revenueGrowth.map((growth, index) => {
                const height = Math.abs(growth) * 3; // Scale for visualization
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="text-xs font-medium mb-1">{growth > 0 ? '+' : ''}{growth}%</div>
                    <div 
                      className={`w-full rounded ${growth >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ height: `${Math.max(height, 4)}px` }}
                    ></div>
                    <div className="text-xs text-gray-600 mt-2">{months[index]}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
