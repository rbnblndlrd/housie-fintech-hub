
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Route, Clock, Zap } from 'lucide-react';

const GPSMapWidget = () => {
  const routeData = {
    totalJobs: 6,
    totalDistance: '47 km',
    estimatedTime: '3h 45m',
    fuelSaved: '12L',
    optimizationScore: 94
  };

  const upcomingStops = [
    { location: 'Downtown Montreal', eta: '10:30 AM', status: 'next' },
    { location: 'Westmount', eta: '12:15 PM', status: 'pending' },
    { location: 'NDG', eta: '2:30 PM', status: 'pending' },
    { location: 'Plateau', eta: '4:00 PM', status: 'pending' }
  ];

  return (
    <Card className="autumn-card-fintech-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center">
              <Navigation className="h-5 w-5 text-white" />
            </div>
            Route Optimizer
          </CardTitle>
          <Badge className="bg-green-100 text-green-800 px-4 py-2 text-lg font-bold border-2 border-green-200">
            {routeData.optimizationScore}% Optimized
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Route Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl border-3 border-blue-200">
            <div className="text-2xl font-black text-blue-800">{routeData.totalJobs}</div>
            <div className="text-sm font-bold text-blue-600">Jobs</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl border-3 border-purple-200">
            <div className="text-2xl font-black text-purple-800">{routeData.totalDistance}</div>
            <div className="text-sm font-bold text-purple-600">Distance</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl border-3 border-orange-200">
            <div className="text-2xl font-black text-orange-800">{routeData.estimatedTime}</div>
            <div className="text-sm font-bold text-orange-600">Time</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl border-3 border-green-200">
            <div className="text-2xl font-black text-green-800">{routeData.fuelSaved}</div>
            <div className="text-sm font-bold text-green-600">Fuel Saved</div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-32 mb-6 border-4 border-gray-300 flex items-center justify-center relative overflow-hidden">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-700 font-bold">Interactive Map View</p>
            <p className="text-gray-600 text-sm">Real-time GPS tracking</p>
          </div>
          
          {/* Animated route indicators */}
          <div className="absolute top-4 left-6 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="absolute top-12 right-8 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
          <div className="absolute bottom-6 left-12 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>

        {/* Upcoming Stops */}
        <div className="space-y-3 mb-6">
          <h4 className="font-black text-gray-900 text-lg">Upcoming Stops</h4>
          {upcomingStops.map((stop, index) => (
            <div key={index} className={`flex items-center gap-4 p-3 rounded-lg border-2 ${
              stop.status === 'next' 
                ? 'bg-green-50 border-green-300' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                stop.status === 'next' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}></div>
              <div className="flex-1">
                <div className="font-bold text-gray-900">{stop.location}</div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  ETA: {stop.eta}
                </div>
              </div>
              {stop.status === 'next' && (
                <Badge className="bg-green-500 text-white animate-pulse">
                  NEXT
                </Badge>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3">
            <Route className="h-4 w-4 mr-2" />
            Re-optimize
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold py-3">
            <Zap className="h-4 w-4 mr-2" />
            Live Track
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GPSMapWidget;
