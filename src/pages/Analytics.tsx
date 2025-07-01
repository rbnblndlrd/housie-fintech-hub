
import React from 'react';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Target,
  PieChart,
  BarChart3,
  FileText,
  Calculator,
  Award,
  Clock,
  MapPin
} from 'lucide-react';
import PerformanceMetrics from '@/components/analytics/PerformanceMetrics';
import BusinessInsights from '@/components/analytics/BusinessInsights';
import TaxReporting from '@/components/analytics/TaxReporting';

const Analytics = () => {
  const kpiData = [
    {
      title: 'Monthly Revenue',
      value: '$24,580',
      change: '+18.5%',
      icon: DollarSign,
      color: 'from-green-600 to-green-800',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Clients',
      value: '342',
      change: '+12.3%',
      icon: Users,
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Jobs Completed',
      value: '158',
      change: '+8.7%',
      icon: Calendar,
      color: 'from-purple-600 to-purple-800',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Efficiency Rate',
      value: '94.2%',
      change: '+2.1%',
      icon: Target,
      color: 'from-orange-600 to-orange-800',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Team Performance',
      value: '4.8/5',
      change: '+0.3',
      icon: Award,
      color: 'from-yellow-600 to-yellow-800',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Avg Response Time',
      value: '12 min',
      change: '-15%',
      icon: Clock,
      color: 'from-indigo-600 to-indigo-800',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-20 px-6 pb-8">
          {/* Maximum Width Container */}
          <div className="max-w-[98vw] mx-auto">
            {/* Analytics Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-5xl font-black text-white text-shadow-xl mb-2">
                  Business Analytics Hub
                </h1>
                <p className="text-white/90 text-xl text-shadow">
                  Comprehensive performance insights and financial reporting
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg">
                  <FileText className="h-5 w-5 mr-2" />
                  Export Report
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-4 text-lg font-bold shadow-xl border-4 border-purple-300">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Live Dashboard
                </Button>
              </div>
            </div>

            {/* KPI Cards Grid - LARGE and WIDE */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
              {kpiData.map((kpi, index) => (
                <Card key={index} className="autumn-card-fintech-xl">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <kpi.icon className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-lg font-bold text-gray-700 mb-2">{kpi.title}</p>
                      <p className="text-3xl font-black text-gray-900 mb-2">{kpi.value}</p>
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-bold text-sm">{kpi.change}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
              {/* Performance Metrics - LARGE cards */}
              <PerformanceMetrics />
              
              {/* Business Insights - BIG charts */}
              <BusinessInsights />
            </div>

            {/* Tax Reporting Section - SUBSTANTIAL real estate */}
            <TaxReporting />
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
