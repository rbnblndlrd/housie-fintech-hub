
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Truck, 
  Users, 
  MapPin, 
  Route,
  Zap,
  TrendingUp,
  Clock,
  AlertTriangle,
  Activity,
  DollarSign,
  Radio,
  Brain
} from 'lucide-react';
import { useFleetOperations } from '@/hooks/useFleetOperations';

interface FleetManagerModeProps {
  onDataLayerToggle: (layer: string, enabled: boolean) => void;
  enabledLayers: Record<string, boolean>;
}

const FleetManagerMode: React.FC<FleetManagerModeProps> = ({
  onDataLayerToggle,
  enabledLayers
}) => {
  const {
    activeVehicles,
    currentJobs,
    performanceZones,
    routeOptimization,
    isLoading,
    fleetStats
  } = useFleetOperations();

  const handleLayerToggle = (layerName: string) => {
    const newState = !enabledLayers[layerName];
    onDataLayerToggle(layerName, newState);
  };

  const handleEmergencyDispatch = () => {
    console.log('🚨 Emergency dispatch activated');
    // Emergency dispatch logic would go here
  };

  if (isLoading) {
    return (
      <div className="w-80 bg-gray-900 border-l border-gray-700 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-3"></div>
          <p className="text-gray-300">Loading operations center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col overflow-y-auto text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-400" />
          Operations Command
        </h2>
        <p className="text-sm text-gray-400 mt-1">Fleet coordination and performance</p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-gray-700 rounded p-2 text-center">
            <div className="text-lg font-bold text-blue-400">{fleetStats.activeVehicles}</div>
            <div className="text-xs text-gray-400">Active</div>
          </div>
          <div className="bg-gray-700 rounded p-2 text-center">
            <div className="text-lg font-bold text-green-400">{fleetStats.activeJobs}</div>
            <div className="text-xs text-gray-400">Jobs</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="data-layers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 m-2 bg-gray-800">
            <TabsTrigger value="data-layers" className="data-[state=active]:bg-gray-700">Data Layers</TabsTrigger>
            <TabsTrigger value="operations" className="data-[state=active]:bg-gray-700">Operations</TabsTrigger>
          </TabsList>

          <TabsContent value="data-layers" className="p-4 space-y-4">
            {/* Live Fleet Tracking */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <Truck className="h-4 w-4 text-blue-400" />
                  Live Fleet Tracking
                </CardTitle>
                <p className="text-xs text-gray-400">Real-time vehicle locations</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="fleet-layer" className="text-sm text-gray-300">Fleet Positions</Label>
                  <Switch
                    id="fleet-layer"
                    checked={enabledLayers.fleetTracking || false}
                    onCheckedChange={() => handleLayerToggle('fleetTracking')}
                  />
                </div>
                <div className="text-xs text-gray-400">
                  GPS tracking every 30 seconds
                </div>
              </CardContent>
            </Card>

            {/* Job Distribution */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <MapPin className="h-4 w-4 text-purple-400" />
                  Job Distribution
                </CardTitle>
                <p className="text-xs text-gray-400">Current assignments and workload</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="jobs-layer" className="text-sm text-gray-300">Workload Zones</Label>
                  <Switch
                    id="jobs-layer"
                    checked={enabledLayers.jobDistribution || false}
                    onCheckedChange={() => handleLayerToggle('jobDistribution')}
                  />
                </div>
                <div className="text-xs text-gray-400">
                  Active jobs + pending assignments
                </div>
              </CardContent>
            </Card>

            {/* Performance Zones */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  Performance Zones
                </CardTitle>
                <p className="text-xs text-gray-400">Revenue and efficiency by area</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="performance-layer" className="text-sm text-gray-300">Revenue Heat Map</Label>
                  <Switch
                    id="performance-layer"
                    checked={enabledLayers.performanceZones || false}
                    onCheckedChange={() => handleLayerToggle('performanceZones')}
                  />
                </div>
                <div className="text-xs text-gray-400">
                  $/hour efficiency metrics
                </div>
              </CardContent>
            </Card>

            {/* Route Optimization */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <Route className="h-4 w-4 text-orange-400" />
                  Route Optimization
                </CardTitle>
                <p className="text-xs text-gray-400">Multi-vehicle coordination</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="routes-layer" className="text-sm text-gray-300">Optimized Routes</Label>
                  <Switch
                    id="routes-layer"
                    checked={enabledLayers.routeOptimization || false}
                    onCheckedChange={() => handleLayerToggle('routeOptimization')}
                  />
                </div>
                <div className="text-xs text-gray-400">
                  AI-powered route planning
                </div>
              </CardContent>
            </Card>

            {/* Coming Soon Features */}
            <Card className="bg-gray-800 border-gray-700 border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <Clock className="h-4 w-4 text-orange-400" />
                  Coming Soon
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400">Team Communication Hub</span>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-gray-700">Soon</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400">Predictive Analytics</span>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-gray-700">Soon</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="p-4 space-y-4">
            {/* Emergency Dispatch */}
            <Card className="bg-red-900 border-red-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  Emergency Dispatch
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  onClick={handleEmergencyDispatch}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Activate Emergency Protocol
                </Button>
              </CardContent>
            </Card>

            {/* Fleet Performance */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  Fleet Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Today's Revenue</span>
                  <span className="font-medium text-green-400">${fleetStats.todayRevenue}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Avg. Efficiency</span>
                  <span className="font-medium text-blue-400">{fleetStats.avgEfficiency}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Jobs Completed</span>
                  <span className="font-medium text-white">{fleetStats.completedJobs}</span>
                </div>
              </CardContent>
            </Card>

            {/* Active Vehicles */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <Truck className="h-4 w-4 text-blue-400" />
                  Vehicle Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {activeVehicles.slice(0, 4).map((vehicle, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: vehicle.status === 'active' ? '#10b981' : vehicle.status === 'en-route' ? '#3b82f6' : '#f59e0b' }}
                      />
                      <span className="text-gray-300">{vehicle.id}</span>
                    </div>
                    <span className="text-gray-400 capitalize">{vehicle.status}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Button variant="outline" size="sm" className="w-full text-xs bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600">
                  Assign Emergency Job
                </Button>
                <Button variant="outline" size="sm" className="w-full text-xs bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600">
                  Optimize All Routes
                </Button>
                <Button variant="outline" size="sm" className="w-full text-xs bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600">
                  Send Team Message
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FleetManagerMode;
