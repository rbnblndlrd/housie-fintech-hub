
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, MapPin, Clock, Star, Users, CreditCard } from 'lucide-react';

const CompetitiveAdvantage = () => {
  const advantages = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Privacy-First Mapping",
      description: "We use Mapbox instead of Google Maps to protect your location data and privacy.",
      badge: "Privacy Protected"
    },
    {
      icon: <MapPin className="h-8 w-8 text-green-600" />,
      title: "Local Quebec Focus",
      description: "Built specifically for Quebec with local compliance (RBQ, CCQ) and regulations.",
      badge: "Quebec Native"
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-600" />,
      title: "Real-Time GPS Tracking",
      description: "Live provider tracking and GPS navigation for emergency services.",
      badge: "Real-Time"
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      title: "Community Rating System",
      description: "Advanced commendation system beyond simple star ratings.",
      badge: "Community Driven"
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Professional Verification",
      description: "RBQ, CCQ, and professional license verification built-in.",
      badge: "Verified Pros"
    },
    {
      icon: <CreditCard className="h-8 w-8 text-pink-600" />,
      title: "Transparent Pricing",
      description: "No hidden fees, transparent pricing with Quebec tax compliance.",
      badge: "Fair Pricing"
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-4">
              Why Choose HOUSIE?
            </h1>
            <p className="text-xl text-white/90 drop-shadow-lg max-w-3xl mx-auto">
              We're not just another service marketplace. We're built for Quebec, 
              by Quebecers, with your privacy and safety as our top priorities.
            </p>
          </div>

          {/* Advantages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {advantages.map((advantage, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      {advantage.icon}
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      {advantage.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{advantage.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{advantage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparison Section */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center">HOUSIE vs. Others</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4">Feature</th>
                      <th className="text-center py-4 px-4 text-blue-600 font-bold">HOUSIE</th>
                      <th className="text-center py-4 px-4 text-gray-500">Others</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-4 px-4 font-medium">Privacy-First Maps</td>
                      <td className="py-4 px-4 text-center text-green-600">✓</td>
                      <td className="py-4 px-4 text-center text-red-500">✗</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-medium">Quebec License Verification</td>
                      <td className="py-4 px-4 text-center text-green-600">✓</td>
                      <td className="py-4 px-4 text-center text-red-500">✗</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-medium">Real-Time GPS Tracking</td>
                      <td className="py-4 px-4 text-center text-green-600">✓</td>
                      <td className="py-4 px-4 text-center text-yellow-500">Limited</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-medium">Community Commendations</td>
                      <td className="py-4 px-4 text-center text-green-600">✓</td>
                      <td className="py-4 px-4 text-center text-red-500">✗</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-medium">Local Quebec Focus</td>
                      <td className="py-4 px-4 text-center text-green-600">✓</td>
                      <td className="py-4 px-4 text-center text-red-500">✗</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveAdvantage;
