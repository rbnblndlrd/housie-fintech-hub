
import React from 'react';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  Target, 
  Lightbulb, 
  TrendingUp,
  Users,
  MapPin,
  Clock,
  Star
} from 'lucide-react';

const BusinessInsights = () => {
  const insights = [
    {
      title: "Peak Hours",
      insight: "Most bookings occur between 2-6 PM on weekdays",
      impact: "High",
      icon: Clock,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Top Markets",
      insight: "Downtown and suburbs show 40% higher demand",
      impact: "High",
      icon: MapPin,
      color: "from-green-600 to-emerald-600"
    },
    {
      title: "Customer Retention",
      insight: "Users with 5+ star ratings return 3x more",
      impact: "Medium",
      icon: Star,
      color: "from-yellow-600 to-orange-600"
    },
    {
      title: "Service Categories",
      insight: "Cleaning and handyman services drive 60% of revenue",
      impact: "High",
      icon: Target,
      color: "from-purple-600 to-violet-600"
    }
  ];

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
                Business Insights
              </h1>
              <p className="text-white/90 drop-shadow-md">
                AI-powered insights to drive your business decisions
              </p>
            </div>

            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {insights.map((insight, index) => (
                <Card key={index} className="fintech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className={`w-8 h-8 bg-gradient-to-r ${insight.color} rounded-lg flex items-center justify-center`}>
                        <insight.icon className="h-4 w-4 text-white" />
                      </div>
                      {insight.title}
                      <span className={`ml-auto px-2 py-1 text-xs rounded ${
                        insight.impact === 'High' ? 'bg-red-500/20 text-red-600' : 'bg-yellow-500/20 text-yellow-600'
                      }`}>
                        {insight.impact} Impact
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{insight.insight}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Recommendations */}
            <Card className="fintech-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Optimize Pricing Strategy</h3>
                    <p className="text-sm opacity-80">Consider dynamic pricing during peak hours (2-6 PM) to maximize revenue</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Expand in High-Demand Areas</h3>
                    <p className="text-sm opacity-80">Focus marketing efforts on downtown and suburban areas for better ROI</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Enhance Quality Control</h3>
                    <p className="text-sm opacity-80">Implement quality assurance programs to maintain high ratings and customer retention</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Analysis */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Market Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <p className="opacity-70">Market analysis charts will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessInsights;
