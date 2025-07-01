
import React from 'react';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Activity
} from 'lucide-react';

const PerformanceDashboard = () => {
  const performanceMetrics = [
    {
      title: "Response Time",
      value: "230ms",
      status: "good",
      icon: Clock,
      color: "from-green-600 to-emerald-600"
    },
    {
      title: "Uptime",
      value: "99.9%",
      status: "excellent",
      icon: CheckCircle,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Error Rate",
      value: "0.1%",
      status: "good",
      icon: AlertTriangle,
      color: "from-yellow-600 to-orange-600"
    },
    {
      title: "Throughput",
      value: "1.2k/min",
      status: "good",
      icon: Activity,
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
                Performance Dashboard
              </h1>
              <p className="text-white/90 drop-shadow-md">
                Monitor system performance and reliability metrics
              </p>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {performanceMetrics.map((metric, index) => (
                <Card key={index} className="fintech-metric-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium opacity-80 mb-1">{metric.title}</p>
                        <p className="text-3xl font-bold">{metric.value}</p>
                        <p className="text-sm text-green-600 mt-1 capitalize">{metric.status}</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                        <metric.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="fintech-chart-container">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    System Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <p className="opacity-70">Performance charts will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="fintech-chart-container">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <p className="opacity-70">Trend analysis will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PerformanceDashboard;
