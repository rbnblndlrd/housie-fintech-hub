import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Navigation, 
  X, 
  Route, 
  Volume2, 
  Clock, 
  MapPin, 
  AlertTriangle,
  Fuel,
  Settings,
  ChevronRight,
  Car,
  Zap
} from 'lucide-react';

interface NavigationOverlayProps {
  isOpen: boolean;
  onToggle: () => void;
  currentJob?: {
    id: string;
    customerName: string;
    address: string;
    distance: string;
    estimatedTime: string;
  };
  nextJob?: {
    customerName: string;
    distance: string;
    estimatedTime: string;
  };
}

const NavigationOverlay: React.FC<NavigationOverlayProps> = ({
  isOpen,
  onToggle,
  currentJob,
  nextJob
}) => {
  const [activeTab, setActiveTab] = useState('turn-by-turn');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [avoidHighway, setAvoidHighway] = useState(false);

  const turnByTurnDirections = [
    { step: 1, instruction: "Head north on Rue St-Laurent", distance: "200m", type: "straight" },
    { step: 2, instruction: "Turn right onto Boulevard René-Lévesque", distance: "1.2km", type: "right" },
    { step: 3, instruction: "Slight left to stay on Boul. René-Lévesque", distance: "800m", type: "slight-left" },
    { step: 4, instruction: `Arrive at ${currentJob?.customerName || "destination"}`, distance: currentJob?.address || "2 Rue Maple", type: "arrive" }
  ];

  const trafficConditions = [
    { severity: "clear", message: "Clear route ahead", icon: "🟢" },
    { severity: "mild", message: "Mild congestion on A-40", icon: "🟡" }
  ];

  const alternativeRoutes = [
    { name: "Route 1 (current)", time: "12 min", note: "", active: true },
    { name: "Route 2", time: "15 min", note: "-3 traffic", active: false },
    { name: "Route 3", time: "18 min", note: "scenic", active: false }
  ];

  const nearbyServices = [
    { type: "fuel", name: "Shell Station", distance: "0.3km", icon: Fuel },
    { type: "charging", name: "Tesla Supercharger", distance: "0.8km", icon: Zap }
  ];

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed top-20 right-4 z-50 pointer-events-auto">
        <Button
          onClick={onToggle}
          variant="outline"
          size="sm"
          className={`bg-white/95 backdrop-blur-sm border-white/20 hover:bg-white transition-all duration-300 ${
            isOpen ? 'bg-blue-50 border-blue-500' : ''
          }`}
        >
          <Navigation className="h-4 w-4 mr-2" />
          Navigation
        </Button>
      </div>

      {/* Navigation Overlay Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 lg:w-96 z-40 transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full bg-white/95 backdrop-blur-sm border-l border-white/20 shadow-2xl overflow-y-auto">
          <Card className="h-full border-none bg-transparent shadow-none">
            <CardHeader className="pb-3 border-b border-white/20">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Navigation className="h-5 w-5 text-blue-600" />
                  Navigation & Route Details
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {currentJob && (
                <div className="mt-2 p-3 bg-blue-50/80 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800 font-medium">
                    <MapPin className="h-4 w-4" />
                    Current Route
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    To {currentJob.customerName} • {currentJob.distance} • {currentJob.estimatedTime}
                  </p>
                </div>
              )}
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Navigation Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="turn-by-turn">Turn-by-Turn</TabsTrigger>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                </TabsList>

                <TabsContent value="turn-by-turn" className="mt-4 space-y-4">
                  {/* Turn-by-Turn Directions */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Route className="h-4 w-4" />
                      Turn-by-Turn Directions
                    </h3>
                    <div className="space-y-2">
                      {turnByTurnDirections.map((direction, index) => (
                        <div 
                          key={direction.step}
                          className={`p-3 rounded-lg border ${
                            index === 0 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-400 text-white'
                            }`}>
                              {direction.step}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{direction.instruction}</p>
                              <p className="text-xs text-gray-600">{direction.distance}</p>
                            </div>
                            {index === 0 && <ChevronRight className="h-4 w-4 text-blue-600" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="overview" className="mt-4 space-y-4">
                  {/* Route Overview */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Route Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600">Total Distance</div>
                        <div className="font-semibold">{currentJob?.distance || "2.2 km"}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600">Est. Time</div>
                        <div className="font-semibold">{currentJob?.estimatedTime || "12 min"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Nearby Services */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Nearby Services</h3>
                    <div className="space-y-2">
                      {nearbyServices.map((service, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          <service.icon className="h-4 w-4 text-gray-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{service.name}</p>
                            <p className="text-xs text-gray-600">{service.distance}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Traffic Conditions */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Traffic Conditions
                </h3>
                <div className="space-y-2">
                  {trafficConditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <span>{condition.icon}</span>
                      <span>{condition.message}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternative Routes */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Alternative Routes</h3>
                <div className="space-y-2">
                  {alternativeRoutes.map((route, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        route.active 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{route.name}</p>
                          {route.note && <p className="text-xs text-gray-600">{route.note}</p>}
                        </div>
                        <div className="text-sm font-semibold">{route.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Route Preferences */}
              <div className="flex gap-2">
                <Button
                  variant={avoidTolls ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAvoidTolls(!avoidTolls)}
                  className="flex-1"
                >
                  Avoid Tolls
                </Button>
                <Button
                  variant={avoidHighway ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAvoidHighway(!avoidHighway)}
                  className="flex-1"
                >
                  Avoid Highway
                </Button>
              </div>

              {/* Next Job Preview */}
              {nextJob && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Next Job Preview</h3>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="h-4 w-4 text-amber-600" />
                      <span className="font-medium text-amber-800">{nextJob.customerName}</span>
                    </div>
                    <p className="text-sm text-amber-600">
                      {nextJob.distance} • After current: {nextJob.estimatedTime} drive
                    </p>
                  </div>
                </div>
              )}

              {/* Voice Navigation */}
              <Button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`w-full ${voiceEnabled ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                variant={voiceEnabled ? "default" : "outline"}
              >
                <Volume2 className="h-4 w-4 mr-2" />
                {voiceEnabled ? 'Voice Navigation Active' : 'Start Voice Navigation'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default NavigationOverlay;