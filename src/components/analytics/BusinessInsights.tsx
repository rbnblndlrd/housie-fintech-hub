
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, PieChart, Calendar, DollarSign, MapPin } from 'lucide-react';

const BusinessInsights = () => {
  const revenueByMonth = [
    { month: 'Jan', revenue: 18500, jobs: 45 },
    { month: 'Feb', revenue: 21200, jobs: 52 },
    { month: 'Mar', revenue: 19800, jobs: 48 },
    { month: 'Apr', revenue: 24600, jobs: 58 },
    { month: 'May', revenue: 26100, jobs: 62 },
    { month: 'Jun', revenue: 24580, jobs: 59 }
  ];

  const serviceDistribution = [
    { category: 'Plumbing', percentage: 35, color: 'bg-blue-500' },
    { category: 'HVAC', percentage: 25, color: 'bg-green-500' },
    { category: 'Electrical', percentage: 20, color: 'bg-yellow-500' },
    { category: 'Cleaning', percentage: 20, color: 'bg-purple-500' }
  ];

  const locationInsights = [
    { area: 'Downtown Montreal', jobs: 45, revenue: '$8,200', growth: '+18%' },
    { area: 'Westmount', jobs: 32, revenue: '$6,800', growth: '+12%' },
    { area: 'NDG', jobs: 28, revenue: '$5,400', growth: '+25%' },
    { area: 'Plateau', jobs: 35, revenue: '$6,200', growth: '+8%' }
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Trends Chart */}
      <Card className="autumn-card-fintech-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-black text-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              Revenue Trends
            </div>
            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-lg font-bold border-2 border-green-200">
              6 Months
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Chart Placeholder with Data Visualization */}
            <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-4 border-green-200 p-6">
              <div className="flex items-end justify-between h-full">
                {revenueByMonth.map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1">
                    <div className="text-xs font-bold text-green-800">${(data.revenue / 1000).toFixed(0)}k</div>
                    <div 
                      className="bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg w-12 transition-all duration-500 hover:scale-105"
                      style={{ 
                        height: `${(data.revenue / 30000) * 180}px`,
                        minHeight: '20px'
                      }}
                    ></div>
                    <div className="text-sm font-bold text-green-700">{data.month}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-xl border-3 border-green-200">
                <div className="text-3xl font-black text-green-800">$24.6K</div>
                <div className="text-green-600 font-bold">Avg Monthly</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl border-3 border-blue-200">
                <div className="text-3xl font-black text-blue-800">+18.5%</div>
                <div className="text-blue-600 font-bold">Growth Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl border-3 border-purple-200">
                <div className="text-3xl font-black text-purple-800">54</div>
                <div className="text-purple-600 font-bold">Avg Jobs/Month</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Distribution */}
      <Card className="autumn-card-fintech-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl flex items-center justify-center">
              <PieChart className="h-5 w-5 text-white" />
            </div>
            Service Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {serviceDistribution.map((service, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-black text-gray-900 text-lg">{service.category}</span>
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200 px-3 py-1 text-sm font-bold">
                    {service.percentage}%
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`${service.color} h-4 rounded-full transition-all duration-700 shadow-md`}
                    style={{ width: `${service.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location Insights */}
      <Card className="autumn-card-fintech-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            Location Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {locationInsights.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border-3 border-indigo-200">
                <div className="flex-1">
                  <h4 className="font-black text-indigo-900 text-lg mb-2">{location.area}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-indigo-600" />
                      <span className="text-indigo-700 font-bold">{location.jobs} jobs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-indigo-600" />
                      <span className="text-indigo-700 font-bold">{location.revenue}</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-indigo-500 text-white px-4 py-2 text-lg font-bold">
                  {location.growth}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessInsights;
