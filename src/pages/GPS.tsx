
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GPSNavigationMap from '@/components/map/GPSNavigationMap';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  User, 
  Phone,
  ArrowLeft,
  Route,
  Calculator,
  Fuel
} from 'lucide-react';

const GPS = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const ticket = location.state?.ticket;

  if (!user) {
    navigate('/auth');
    return null;
  }

  const jobDetails = ticket || {
    id: '1',
    title: 'Emergency Plumbing Repair',
    client: 'Marie Tremblay',
    location: 'Downtown Montreal',
    estimatedDuration: 120,
    priority: 'high'
  };

  const routeAnalysis = {
    distance: '12.5 km',
    estimatedTime: '18 mins',
    fuelCost: '$3.45',
    optimalRoute: 'Via Rue Saint-Catherine',
    trafficCondition: 'Light',
    alternativeRoutes: 2
  };

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        {/* Back Button - Floating over map */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/kanban')}
          className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white/95 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tickets
        </Button>

        {/* Job Details Panel - Floating over map */}
        <Card className="absolute top-4 right-4 z-20 w-80 max-h-[calc(100vh-100px)] overflow-y-auto bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{jobDetails.title}</h3>
              <Badge className={`${
                jobDetails.priority === 'high' ? 'bg-red-100 text-red-800' : 
                jobDetails.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-green-100 text-green-800'
              }`}>
                {jobDetails.priority} priority
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Client: {jobDetails.client}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Location: {jobDetails.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Duration: {jobDetails.estimatedDuration} minutes</span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button className="w-full fintech-button-primary">
                <Phone className="h-4 w-4 mr-2" />
                Call Client
              </Button>
              <Button className="w-full fintech-button-secondary">
                <Navigation className="h-4 w-4 mr-2" />
                Start Navigation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Route Analysis Panel - Floating over map */}
        <Card className="absolute bottom-4 left-4 z-20 w-80 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Route Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{routeAnalysis.distance}</div>
                <div className="text-sm opacity-70">Distance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{routeAnalysis.estimatedTime}</div>
                <div className="text-sm opacity-70">ETA</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Fuel Cost</span>
                <span className="font-semibold">{routeAnalysis.fuelCost}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Traffic</span>
                <Badge className="bg-green-100 text-green-800">{routeAnalysis.trafficCondition}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Alt. Routes</span>
                <span className="font-semibold">{routeAnalysis.alternativeRoutes}</span>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm opacity-70 mb-2">Recommended Route:</p>
              <p className="font-medium">{routeAnalysis.optimalRoute}</p>
            </div>
          </CardContent>
        </Card>

        {/* Full-Screen Map */}
        <div className="absolute inset-0 w-full h-full">
          <GPSNavigationMap />
        </div>
      </div>
    </>
  );
};

export default GPS;
