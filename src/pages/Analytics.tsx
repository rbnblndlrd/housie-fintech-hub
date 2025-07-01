
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  MapPin,
  ArrowRight
} from 'lucide-react';

const Analytics = () => {
  const navigate = useNavigate();

  const kpiData = [
    {
      title: 'Monthly Revenue',
      value: '$24,580',
      change: '+18.5%',
      icon: DollarSign,
      color: 'from-green-600 to-green-800'
    },
    {
      title: 'Active Clients',
      value: '342',
      change: '+12.3%',
      icon: Users,
      color: 'from-blue-600 to-blue-800'
    },
    {
      title: 'Jobs Completed',
      value: '158',
      change: '+8.7%',
      icon: Calendar,
      color: 'from-purple-600 to-purple-800'
    },
    {
      title: 'Efficiency Rate',
      value: '94.2%',
      change: '+2.1%',
      icon: Target,
      color: 'from-orange-600 to-orange-800'
    }
  ];

  const quickAnalyticsActions = [
    {
      title: 'Performance Dashboard',
      description: 'Team and system performance metrics',
      icon: Award,
      route: '/performance-dashboard',
      color: 'from-blue-600 to-blue-800'
    },
    {
      title: 'Business Insights',
      description: 'AI-powered business analytics',
      icon: PieChart,
      route: '/business-insights',
      color: 'from-purple-600 to-purple-800'
    },
    {
      title: 'Tax Reports',
      description: 'Financial reporting and tax documents',
      icon: FileText,
      route: '/tax-reports',
      color: 'from-green-600 to-green-800'
    }
  ];

  const performancePreview = [
    { name: 'Marc Dubois', jobs: 23, rating: 4.9, efficiency: 96 },
    { name: 'Sophie Lavoie', jobs: 19, rating: 4.8, efficiency: 94 },
    { name: 'Pierre Gagnon', jobs: 21, rating: 4.7, efficiency: 92 }
  ];

  const businessInsights = [
    { insight: 'Peak hours: 2-6 PM weekdays', impact: 'High', color: 'text-red-600' },
    { insight: 'Downtown demand +40%', impact: 'High', color: 'text-red-600' },
    { insight: '5+ star users return 3x more', impact: 'Medium', color: 'text-yellow-600' }
  ];

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen" style={{ background: '#F5F2E9' }}>
        <Header />
        <div className="pt-20 px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Analytics Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-black banking-title mb-2">
                  Business Analytics Hub
                </h1>
                <p className="banking-text text-lg">
                  Comprehensive performance insights and financial reporting
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button className="banking-button-secondary">
                  <FileText className="h-5 w-5 mr-2" />
                  Export Report
                </Button>
                <Button className="banking-button-primary">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Live Dashboard
                </Button>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpiData.map((kpi, index) => (
                <Card key={index} className="banking-card">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className={`w-12 h-12 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <kpi.icon className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-sm font-semibold banking-text mb-2">{kpi.title}</p>
                      <p className="text-2xl font-black banking-title mb-2">{kpi.value}</p>
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-green-600 font-bold text-sm">{kpi.change}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <Card className="banking-card">
                <CardHeader>
                  <CardTitle className="banking-title">Quick Analytics Access</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quickAnalyticsActions.map((action, index) => (
                      <div key={index} className="p-6 bg-white/50 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all cursor-pointer"
                        onClick={() => navigate(action.route)}>
                        <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="banking-title text-lg mb-2">{action.title}</h3>
                        <p className="banking-text text-sm mb-4">{action.description}</p>
                        <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#B8860B' }}>
                          View Details
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Preview */}
              <Card className="banking-card">
                <CardHeader>
                  <CardTitle className="banking-title flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    Team Performance Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {performancePreview.map((member, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border-2 border-gray-200">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold banking-text text-sm">{member.name}</div>
                          <div className="text-xs banking-text opacity-70">
                            {member.jobs} jobs • {member.rating}/5 • {member.efficiency}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 banking-button-secondary text-sm">
                    View Full Performance Dashboard
                  </Button>
                </CardContent>
              </Card>

              {/* Business Insights Preview */}
              <Card className="banking-card">
                <CardHeader>
                  <CardTitle className="banking-title flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                      <PieChart className="h-4 w-4 text-white" />
                    </div>
                    Key Business Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {businessInsights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border-2 border-gray-200">
                        <div className="flex-1">
                          <p className="banking-text text-sm">{insight.insight}</p>
                          <Badge className={`mt-2 text-xs ${insight.color} bg-transparent border`}>
                            {insight.impact} Impact
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 banking-button-secondary text-sm">
                    View All Business Insights
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
