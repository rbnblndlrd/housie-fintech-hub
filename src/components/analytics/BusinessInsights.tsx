
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Target, 
  Lightbulb, 
  TrendingUp,
  Users,
  MapPin,
  Clock,
  Star,
  PieChart
} from 'lucide-react';

const BusinessInsights = () => {
  const insights = [
    {
      title: "Peak Hours Analysis",
      insight: "Most bookings occur between 2-6 PM on weekdays",
      impact: "High",
      icon: Clock,
      color: "from-blue-600 to-cyan-600",
      trend: "+24% efficiency during peak optimization"
    },
    {
      title: "Geographic Hotspots",
      insight: "Downtown and suburbs show 40% higher demand",
      impact: "High",
      icon: MapPin,
      color: "from-green-600 to-emerald-600",
      trend: "+15% revenue in target areas"
    },
    {
      title: "Customer Retention",
      insight: "Users with 5+ star ratings return 3x more often",
      impact: "Medium",
      icon: Star,
      color: "from-yellow-600 to-orange-600",
      trend: "92% customer satisfaction rate"
    },
    {
      title: "Service Mix Optimization",
      insight: "Cleaning and handyman services drive 60% of revenue",
      impact: "High",
      icon: Target,
      color: "from-purple-600 to-violet-600",
      trend: "+18% profit margin increase"
    }
  ];

  const chartData = [
    { category: "Cleaning", percentage: 35, revenue: "$12,500" },
    { category: "Handyman", percentage: 25, revenue: "$8,750" },
    { category: "Plumbing", percentage: 20, revenue: "$7,000" },
    { category: "Electrical", percentage: 15, revenue: "$5,250" },
    { category: "Other", percentage: 5, revenue: "$1,750" }
  ];

  return (
    <div className="space-y-6">
      {/* AI Insights Grid */}
      <Card className="banking-card">
        <CardHeader>
          <CardTitle className="banking-title flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            AI-Powered Business Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 bg-white/50 rounded-xl border-2 border-gray-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-8 h-8 bg-gradient-to-br ${insight.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <insight.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="banking-title text-sm">{insight.title}</h4>
                      <Badge className={`text-xs ${
                        insight.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {insight.impact}
                      </Badge>
                    </div>
                    <p className="banking-text text-xs mb-2">{insight.insight}</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-green-600 text-xs font-semibold">{insight.trend}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Breakdown Chart */}
      <Card className="banking-card">
        <CardHeader>
          <CardTitle className="banking-title flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center">
              <PieChart className="h-4 w-4 text-white" />
            </div>
            Service Category Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="banking-text font-semibold">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="banking-text text-sm">{item.revenue}</span>
                      <Badge className="banking-badge text-xs">{item.percentage}%</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-gray-300">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="banking-card">
        <CardHeader>
          <CardTitle className="banking-title flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            Strategic Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
              <Lightbulb className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="banking-title text-sm mb-1">Optimize Peak Hour Pricing</h4>
                <p className="banking-text text-xs">Consider dynamic pricing during 2-6 PM to maximize revenue by 15-20%</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <Target className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="banking-title text-sm mb-1">Expand Geographic Coverage</h4>
                <p className="banking-text text-xs">Focus marketing efforts on high-demand suburban areas for better ROI</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
              <Users className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="banking-title text-sm mb-1">Quality Assurance Program</h4>
                <p className="banking-text text-xs">Implement systematic quality checks to maintain high ratings and customer retention</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessInsights;
