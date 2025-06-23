import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Target, 
  TrendingUp, 
  Users, 
  Star,
  Lightbulb,
  AlertCircle
} from 'lucide-react';

const BusinessInsights = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { data, loading, error, refreshData } = useAnalyticsData(user?.id, currentRole);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const insights = [
    {
      type: "growth",
      title: "Revenue Growth Opportunity",
      description: `Your monthly growth rate is ${data.monthlyGrowth.toFixed(1)}%. Consider targeting ${data.monthlyGrowth < 10 ? 'higher-value services' : 'new market segments'}.`,
      priority: data.monthlyGrowth < 5 ? "high" : "medium",
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      type: "efficiency",
      title: "Booking Efficiency",
      description: `Average booking value: ${formatCurrency(data.averageBookingValue)}. ${data.averageBookingValue < 100 ? 'Consider bundling services to increase value.' : 'Great job maintaining high booking values!'}`,
      priority: data.averageBookingValue < 100 ? "medium" : "low",
      icon: <Target className="h-5 w-5" />
    },
    {
      type: "capacity",
      title: "Service Capacity",
      description: `You've completed ${data.totalBookings} bookings. ${data.monthlyBookings < 10 ? 'Focus on marketing to increase monthly bookings.' : 'Consider scaling your service offerings.'}`,
      priority: data.monthlyBookings < 10 ? "high" : "low",
      icon: <Users className="h-5 w-5" />
    }
  ];

  const recommendations = [
    {
      title: "Optimize Peak Hours",
      description: "Analyze your busiest times and adjust pricing dynamically",
      impact: "15-25% revenue increase",
      effort: "Medium"
    },
    {
      title: "Service Bundling",
      description: "Create package deals for commonly requested services",
      impact: "20-30% higher booking value",
      effort: "Low"
    },
    {
      title: "Customer Retention",
      description: "Implement loyalty programs for repeat customers",
      impact: "35% increase in repeat bookings",
      effort: "High"
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
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Error loading business insights</p>
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
                onClick={() => navigate('/analytics-dashboard')}
                variant="outline"
                className="bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
              >
                ← Back to Analytics
              </Button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Business Insights</h1>
            </div>
            <p className="text-gray-600">AI-powered insights and recommendations for your business growth</p>
            
            {/* Controls */}
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={refreshData} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/analytics-dashboard')}
              >
                📊 Analytics Dashboard
              </Button>
            </div>
          </div>

          {/* Key Insights */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {insights.map((insight, index) => (
              <Card key={index} className="fintech-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {insight.icon}
                    </div>
                    <Badge 
                      variant={insight.priority === 'high' ? 'destructive' : insight.priority === 'medium' ? 'default' : 'secondary'}
                    >
                      {insight.priority} priority
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
                  {loading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : (
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recommendations */}
          <Card className="fintech-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Actionable Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-3 gap-6">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-600 font-medium">Impact: {rec.impact}</span>
                      <span className="text-blue-600 font-medium">Effort: {rec.effort}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Business Health Score */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Business Health Score</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Revenue Growth</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${Math.max(0, Math.min(100, data.monthlyGrowth * 5))}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{data.monthlyGrowth.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Booking Volume</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (data.monthlyBookings / 20) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{data.monthlyBookings}/20</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Value</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (data.averageBookingValue / 200) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(data.averageBookingValue)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completion Rate</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: `${data.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{data.completionRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Market Insights */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Market Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      Based on your performance data, you're positioned well in the local market. 
                      Focus on customer retention and service quality to maintain growth.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(data.totalRevenue)}</p>
                      <p className="text-sm text-green-700">Total Revenue</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{data.totalBookings}</p>
                      <p className="text-sm text-blue-700">Total Bookings</p>
                    </div>
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
