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
          className={`fintech-card backdrop-blur-sm border-2 border-white/20 hover:border-white/40 transition-all duration-300 ${
            isOpen ? 'fintech-card-secondary border-primary/50' : ''
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
        <div className="h-full fintech-card-base fintech-pattern-warm border-l-2 border-white/20 shadow-2xl overflow-y-auto backdrop-blur-sm">
          <Card className="h-full border-none bg-transparent shadow-none">
            <CardHeader className="pb-3 border-b border-white/20">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg fintech-text-header">
                  <Navigation className="h-5 w-5" />
                  Navigation & Route Details
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="h-8 w-8 p-0 fintech-text-secondary hover:fintech-card-secondary"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {currentJob && (
                <div className="mt-2 p-3 fintech-inner-box rounded-lg">
                  <div className="flex items-center gap-2 fintech-text-header font-medium">
                    <MapPin className="h-4 w-4" />
                    Current Route
                  </div>
                  <p className="text-sm fintech-text-secondary mt-1">
                    To {currentJob.customerName} • {currentJob.distance} • {currentJob.estimatedTime}
                  </p>
                </div>
              )}
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Navigation Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 fintech-inner-box">
                  <TabsTrigger value="turn-by-turn" className="fintech-text-secondary">Turn-by-Turn</TabsTrigger>
                  <TabsTrigger value="overview" className="fintech-text-secondary">Overview</TabsTrigger>
                </TabsList>

                <TabsContent value="turn-by-turn" className="mt-4 space-y-4">
                  {/* Turn-by-Turn Directions */}
                  <div>
                    <h3 className="font-medium fintech-text-header mb-3 flex items-center gap-2">
                      <Route className="h-4 w-4" />
                      Turn-by-Turn Directions
                    </h3>
                    <div className="space-y-2">
                      {turnByTurnDirections.map((direction, index) => (
                        <div 
                          key={direction.step}
                          className={`p-3 rounded-lg border fintech-inner-box ${
                            index === 0 
                              ? 'border-primary/40' 
                              : 'border-white/20'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-primary text-primary-foreground' : 'fintech-card-secondary fintech-text-secondary'
                            }`}>
                              {direction.step}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm fintech-text-header">{direction.instruction}</p>
                              <p className="text-xs fintech-text-secondary">{direction.distance}</p>
                            </div>
                            {index === 0 && <ChevronRight className="h-4 w-4 text-primary" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="overview" className="mt-4 space-y-4">
                  {/* Route Overview */}
                  <div>
                    <h3 className="font-medium fintech-text-header mb-3">Route Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 fintech-inner-box rounded-lg">
                        <div className="text-xs fintech-text-secondary">Total Distance</div>
                        <div className="font-semibold fintech-text-header">{currentJob?.distance || "2.2 km"}</div>
                      </div>
                      <div className="p-3 fintech-inner-box rounded-lg">
                        <div className="text-xs fintech-text-secondary">Est. Time</div>
                        <div className="font-semibold fintech-text-header">{currentJob?.estimatedTime || "12 min"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Nearby Services */}
                  <div>
                    <h3 className="font-medium fintech-text-header mb-3">Nearby Services</h3>
                    <div className="space-y-2">
                      {nearbyServices.map((service, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 fintech-inner-box rounded-lg">
                          <service.icon className="h-4 w-4 fintech-text-secondary" />
                          <div className="flex-1">
                            <p className="text-sm font-medium fintech-text-header">{service.name}</p>
                            <p className="text-xs fintech-text-secondary">{service.distance}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Traffic Conditions */}
              <div>
                <h3 className="font-medium fintech-text-header mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Traffic Conditions
                </h3>
                <div className="space-y-2">
                  {trafficConditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm fintech-text-header">
                      <span>{condition.icon}</span>
                      <span>{condition.message}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternative Routes */}
              <div>
                <h3 className="font-medium fintech-text-header mb-3">Alternative Routes</h3>
                <div className="space-y-2">
                  {alternativeRoutes.map((route, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        route.active 
                          ? 'fintech-card-secondary border-primary/40' 
                          : 'fintech-inner-box border-white/20 hover:fintech-card-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm fintech-text-header">{route.name}</p>
                          {route.note && <p className="text-xs fintech-text-secondary">{route.note}</p>}
                        </div>
                        <div className="text-sm font-semibold fintech-text-header">{route.time}</div>
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
                  <h3 className="font-medium fintech-text-header mb-3">Next Job Preview</h3>
                  <div className="p-3 fintech-card-secondary border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="h-4 w-4 text-primary" />
                      <span className="font-medium fintech-text-header">{nextJob.customerName}</span>
                    </div>
                    <p className="text-sm fintech-text-secondary">
                      {nextJob.distance} • After current: {nextJob.estimatedTime} drive
                    </p>
                  </div>
                </div>
              )}

              {/* Voice Navigation */}
              <Button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`w-full fintech-button-primary ${voiceEnabled ? 'bg-primary hover:bg-primary/90' : 'fintech-inner-box'}`}
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