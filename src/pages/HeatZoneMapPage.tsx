
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import HeatZoneMap from "@/components/HeatZoneMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { 
  MapPin, 
  ArrowLeft, 
  Zap,
  TrendingUp,
  Users,
  Target,
  AlertTriangle
} from 'lucide-react';

const HeatZoneMapPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Determine user role for navigation
  const userRole = user?.user_metadata?.user_role || 'customer';
  const dashboardPath = userRole === 'provider' ? '/provider-dashboard' : '/customer-dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Artistic Header */}
          <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-8 shadow-2xl">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <Button
                variant="ghost"
                onClick={() => navigate(dashboardPath)}
                className="mb-4 text-white hover:bg-white/20 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Heat Zone Intelligence
                  </h1>
                  <p className="text-xl text-white/90">
                    Discover demand hotspots and optimize your service strategy
                  </p>
                </div>
              </div>

              {/* Emergency Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm font-medium text-white">Emergency Jobs</span>
                  </div>
                  <p className="text-2xl font-bold text-white">3</p>
                  <p className="text-xs text-white/70">Active urgent requests</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <span className="text-sm font-medium text-white">High Demand</span>
                  </div>
                  <p className="text-2xl font-bold text-white">12</p>
                  <p className="text-xs text-white/70">Hot zones detected</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    <span className="text-sm font-medium text-white">Available Pros</span>
                  </div>
                  <p className="text-2xl font-bold text-white">47</p>
                  <p className="text-xs text-white/70">Ready to serve</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-purple-400" />
                    <span className="text-sm font-medium text-white">Opportunities</span>
                  </div>
                  <p className="text-2xl font-bold text-white">8</p>
                  <p className="text-xs text-white/70">Prime locations</p>
                </div>
              </div>
            </div>
            
            {/* Artistic background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-yellow-400/20 to-transparent rounded-full blur-2xl"></div>
          </div>

          {/* Map Container with Artistic Frame */}
          <div className="relative">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="h-[80vh] relative">
                  {/* Artistic border overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-transparent to-purple-500/20 pointer-events-none z-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none z-10"></div>
                  
                  <HeatZoneMap userRole={userRole} />
                  
                  {/* Emergency Alert Overlay */}
                  <div className="absolute top-4 right-4 z-20">
                    <Badge variant="destructive" className="bg-red-500/90 backdrop-blur-sm border-0 shadow-lg animate-pulse">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      3 Emergency Jobs
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Action Panel */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 shadow-xl">
              <CardContent className="p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg">Emergency Response</h3>
                </div>
                <p className="text-white/90 mb-4">
                  Respond to urgent service requests in your area
                </p>
                <Button variant="secondary" className="w-full">
                  View Emergency Jobs
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 border-0 shadow-xl">
              <CardContent className="p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg">Target Zones</h3>
                </div>
                <p className="text-white/90 mb-4">
                  Set your preferred work areas and get notified
                </p>
                <Button variant="secondary" className="w-full">
                  Configure Zones
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 border-0 shadow-xl">
              <CardContent className="p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg">Market Insights</h3>
                </div>
                <p className="text-white/90 mb-4">
                  Get detailed analytics on demand patterns
                </p>
                <Button variant="secondary" className="w-full">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatZoneMapPage;
