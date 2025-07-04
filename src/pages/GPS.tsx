
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
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/kanban')}
                  className="text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Tickets
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-white text-shadow-lg">GPS Job Analyzer</h1>
                  <p className="text-white/90 text-shadow">Route optimization and job analysis</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Job Details */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="fintech-card">
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

                {/* Route Analysis */}
                <Card className="fintech-card">
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
              </div>

              {/* Mapbox Map */}
              <div className="lg:col-span-2">
                <Card className="fintech-chart-container h-[600px] overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Route className="h-5 w-5" />
                      Interactive Map
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-[calc(100%-60px)]">
                    <GPSNavigationMap />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GPS;
