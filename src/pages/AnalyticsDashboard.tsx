
import React from 'react';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Calendar,
  MapPin,
  Star,
  Clock
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const analyticsCards = [
    {
      title: "Total Revenue",
      value: "$124,350",
      change: "+12.5%",
      icon: DollarSign,
      color: "from-green-600 to-emerald-600"
    },
    {
      title: "Active Users",
      value: "8,493",
      change: "+8.2%",
      icon: Users,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Bookings",
      value: "2,847",
      change: "+15.3%",
      icon: Calendar,
      color: "from-purple-600 to-violet-600"
    },
    {
      title: "Avg Rating",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      color: "from-yellow-600 to-orange-600"
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
              <h1 className="text-4xl font-bold text-white text-shadow-lg mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-white/90 text-shadow">
                Monitor your platform performance and key metrics
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {analyticsCards.map((card, index) => (
                <Card key={index} className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white/90 mb-1">{card.title}</p>
                        <p className="text-3xl font-black text-white text-shadow-lg">{card.value}</p>
                        <p className="text-sm text-green-400 mt-1">{card.change}</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center`}>
                        <card.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-shadow flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-white/70">Revenue chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-shadow flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Growth Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-white/70">Growth chart will be displayed here</p>
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

export default AnalyticsDashboard;
