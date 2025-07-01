
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Star, Clock, Target, Award } from 'lucide-react';

const PerformanceMetrics = () => {
  const teamPerformance = [
    { name: 'Marc Dubois', jobs: 23, rating: 4.9, efficiency: 96, specialty: 'Plumbing' },
    { name: 'Sophie Lavoie', jobs: 19, rating: 4.8, efficiency: 94, specialty: 'HVAC' },
    { name: 'Pierre Gagnon', jobs: 21, rating: 4.7, efficiency: 92, specialty: 'Electrical' },
    { name: 'Luc Bouchard', jobs: 17, rating: 4.9, efficiency: 98, specialty: 'Renovation' }
  ];

  const serviceMetrics = [
    { service: 'Plumbing', volume: 45, revenue: '$8,200', growth: '+15%' },
    { service: 'HVAC', volume: 32, revenue: '$6,800', growth: '+22%' },
    { service: 'Electrical', volume: 28, revenue: '$5,400', growth: '+8%' },
    { service: 'Cleaning', volume: 53, revenue: '$4,200', growth: '+12%' }
  ];

  return (
    <div className="space-y-6">
      {/* Team Performance Card */}
      <Card className="autumn-card-fintech-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {teamPerformance.map((member, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white/80 rounded-xl border-3 border-blue-200 hover:border-blue-400 transition-all duration-200">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-gray-900 text-lg">{member.name}</span>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {member.specialty}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700">{member.jobs} jobs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="text-gray-700">{member.rating}/5</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-700">{member.efficiency}%</span>
                    </div>
                  </div>
                </div>
                
                <Badge className={`px-4 py-2 text-lg font-bold ${
                  member.efficiency >= 95 ? 'bg-green-100 text-green-800 border-green-200' :
                  member.efficiency >= 90 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                  'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  {member.efficiency >= 95 ? '⭐ Excellent' :
                   member.efficiency >= 90 ? '👍 Good' : '📈 Improving'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Metrics Card */}
      <Card className="autumn-card-fintech-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
              <Award className="h-5 w-5 text-white" />
            </div>
            Service Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceMetrics.map((service, index) => (
              <div key={index} className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-3 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-black text-purple-900 text-xl">{service.service}</h4>
                  <Badge className="bg-purple-500 text-white px-3 py-1 text-sm">
                    {service.growth}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-700 font-bold">Volume:</span>
                    <span className="text-purple-900 font-black text-lg">{service.volume} jobs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-700 font-bold">Revenue:</span>
                    <span className="text-purple-900 font-black text-lg">{service.revenue}</span>
                  </div>
                  
                  <div className="w-full bg-purple-200 rounded-full h-3 mt-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-700 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${(service.volume / 60) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
