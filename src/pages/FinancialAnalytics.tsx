import React from 'react';
import VideoBackground from '@/components/common/VideoBackground';
import AnalyticsNavigation from '@/components/dashboard/AnalyticsNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart,
  BarChart3,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const FinancialAnalytics = () => {
  const financialMetrics = [
    {
      title: "Revenue Growth",
      value: "+15.2%",
      change: "vs last month",
      icon: TrendingUp,
      color: "from-green-600 to-emerald-600",
      trending: "up"
    },
    {
      title: "Profit Margin",
      value: "28.5%",
      change: "+3.1% vs target",
      icon: PieChart,
      color: "from-blue-600 to-cyan-600",
      trending: "up"
    },
    {
      title: "Cash Flow",
      value: "$12,450",
      change: "+22.3% this quarter",
      icon: Wallet,
      color: "from-purple-600 to-violet-600",
      trending: "up"
    },
    {
      title: "Operating Costs",
      value: "$8,230",
      change: "-5.2% optimized",
      icon: CreditCard,
      color: "from-yellow-600 to-orange-600",
      trending: "down"
    }
  ];

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        {/* Analytics Navigation - Left Side - Desktop Only */}
        <div className="hidden md:block fixed top-80 left-12 z-40 w-52">
          <AnalyticsNavigation />
        </div>

        <div className="pt-20 px-4 pb-8 md:pl-[280px]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
                Financial Analytics
              </h1>
              <p className="text-white/90 drop-shadow-md">
                Deep dive into your financial performance and projections
              </p>
            </div>

            {/* Financial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {financialMetrics.map((metric, index) => (
                <Card key={index} className="fintech-metric-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium opacity-80 mb-1">{metric.title}</p>
                        <p className="text-3xl font-bold">{metric.value}</p>
                        <p className={`text-sm mt-1 flex items-center ${
                          metric.trending === 'up' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {metric.trending === 'up' ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
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

            {/* Financial Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="fintech-chart-container">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <p className="opacity-70">Revenue breakdown chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="fintech-chart-container">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Financial Forecasting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <p className="opacity-70">Financial forecasting chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Insights */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Key Financial Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="font-medium mb-2">Projected Monthly Revenue</h3>
                    <p className="text-2xl font-bold text-green-600">$52,800</p>
                    <p className="opacity-70 text-sm">+16.7% growth expected</p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium mb-2">Break-even Point</h3>
                    <p className="text-2xl font-bold text-blue-600">Day 18</p>
                    <p className="opacity-70 text-sm">Of each month</p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium mb-2">ROI on Marketing</h3>
                    <p className="text-2xl font-bold text-purple-600">340%</p>
                    <p className="opacity-70 text-sm">Above industry average</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinancialAnalytics;