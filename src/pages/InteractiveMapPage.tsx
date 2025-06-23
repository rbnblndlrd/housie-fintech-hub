
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from "@/components/Header";
import HeatZoneMap from "@/components/HeatZoneMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  AlertTriangle,
  Clock,
  DollarSign,
  MapPin,
  Zap,
  TrendingUp,
  Filter,
  Star
} from 'lucide-react';

const InteractiveMapPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showEmergencyJobs, setShowEmergencyJobs] = useState(true);
  
  // Determine user role for navigation
  const userRole = user?.user_metadata?.user_role || 'customer';
  const dashboardPath = userRole === 'provider' ? '/provider-dashboard' : '/customer-dashboard';

  // Mock emergency jobs data - this would come from your backend
  const emergencyJobs = [
    {
      id: 1,
      title: "Urgent Plumbing Repair",
      location: "Downtown Toronto",
      price: 150,
      timePosted: "5 mins ago",
      priority: "high",
      description: "Water leak in apartment building basement"
    },
    {
      id: 2,
      title: "Emergency Electrical Issue",
      location: "North York",
      price: 200,
      timePosted: "12 mins ago",
      priority: "critical",
      description: "Power outage in commercial building"
    },
    {
      id: 3,
      title: "Heating System Failure",
      location: "Etobicoke",
      price: 180,
      timePosted: "18 mins ago",
      priority: "high",
      description: "No heat in residential complex"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(dashboardPath)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactive Map</h1>
                <p className="text-gray-600">Discover service demand and opportunities in your area</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={showEmergencyJobs ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowEmergencyJobs(!showEmergencyJobs)}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Emergency Jobs
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <Card className="fintech-card h-[600px]">
                <CardContent className="p-0 h-full">
                  <HeatZoneMap userRole={userRole} />
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Emergency Jobs Panel */}
              {showEmergencyJobs && (
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      Emergency Jobs
                      <Badge variant="destructive" className="ml-2">
                        {emergencyJobs.length}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Premium listings requiring immediate attention
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {emergencyJobs.map((job) => (
                        <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{job.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(job.priority)}`}></div>
                                <span className="text-sm text-gray-600 capitalize">{job.priority} Priority</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">
                                ${job.price}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {job.timePosted}
                            </div>
                          </div>
                          {userRole === 'provider' && (
                            <Button size="sm" className="w-full mt-3">
                              Accept Job
                            </Button>
                          )}
                        </div>
                      ))}
                      <Separator />
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          Want your listings to appear here?
                        </p>
                        <Button variant="outline" size="sm">
                          Upgrade to Premium
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Map Stats */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Live Market Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Active Zones</span>
                      <span className="text-lg font-bold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Available Providers</span>
                      <span className="text-lg font-bold">47</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Avg. Response Time</span>
                      <span className="text-lg font-bold">2.3h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Peak Demand Zone</span>
                      <span className="text-sm font-medium">Downtown</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Filters */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Quick Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      High Demand
                    </Button>
                    <Button variant="outline" size="sm">
                      Low Competition
                    </Button>
                    <Button variant="outline" size="sm">
                      Residential
                    </Button>
                    <Button variant="outline" size="sm">
                      Commercial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapPage;
