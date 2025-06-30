
import React from 'react';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Target,
  CreditCard,
  Wallet,
  ArrowUpRight
} from 'lucide-react';

const FinancialAnalytics = () => {
  const financialMetrics = [
    {
      title: "Monthly Revenue",
      value: "$45,230",
      change: "+15.2%",
      icon: DollarSign,
      color: "from-green-600 to-emerald-600"
    },
    {
      title: "Profit Margin",
      value: "28.5%",
      change: "+3.1%",
      icon: Target,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Average Transaction",
      value: "$187",
      change: "+8.7%",
      icon: CreditCard,
      color: "from-purple-600 to-violet-600"
    },
    {
      title: "Cash Flow",
      value: "$12,450",
      change: "+22.3%",
      icon: Wallet,
      color: "from-yellow-600 to-orange-600"
    }
  ];

  const revenueStreams = [
    { category: "Service Fees", amount: "$28,500", percentage: 63 },
    { category: "Subscription", amount: "$8,200", percentage: 18 },
    { category: "Premium Features", amount: "$5,800", percentage: 13 },
    { category: "Other", amount: "$2,730", percentage: 6 }
  ];

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white text-shadow-lg mb-2">
                Financial Analytics
              </h1>
              <p className="text-white/90 text-shadow">
                Comprehensive financial analysis and revenue insights
              </p>
            </div>

            {/* Financial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {financialMetrics.map((metric, index) => (
                <Card key={index} className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white/90 mb-1">{metric.title}</p>
                        <p className="text-3xl font-black text-white text-shadow-lg">{metric.value}</p>
                        <p className="text-sm text-green-400 mt-1 flex items-center">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart */}
              <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-shadow flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Revenue Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-white/70">Revenue trend chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Breakdown */}
              <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-shadow flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Revenue Streams
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {revenueStreams.map((stream, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">{stream.category}</span>
                          <span className="text-white/70">{stream.amount}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                            style={{ width: `${stream.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Financial Forecasting */}
            <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-shadow flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Financial Forecasting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="text-white font-medium mb-2">Next Month Projection</h3>
                    <p className="text-2xl font-bold text-green-400">$52,800</p>
                    <p className="text-white/70 text-sm">+16.7% growth expected</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-medium mb-2">Quarterly Target</h3>
                    <p className="text-2xl font-bold text-blue-400">$150,000</p>
                    <p className="text-white/70 text-sm">87% progress to goal</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-medium mb-2">Annual Forecast</h3>
                    <p className="text-2xl font-bold text-purple-400">$600,000</p>
                    <p className="text-white/70 text-sm">Based on current trends</p>
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
