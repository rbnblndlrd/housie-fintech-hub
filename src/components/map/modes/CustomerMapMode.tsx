
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Shield, 
  Users, 
  MapPin,
  Clock,
  Info,
  AlertTriangle,
  ShoppingCart,
  Compass
} from 'lucide-react';
import { useQuebecData } from '@/hooks/useQuebecData';

interface CustomerMapModeProps {
  onDataLayerToggle: (layer: string, enabled: boolean) => void;
  enabledLayers: Record<string, boolean>;
}

type CustomerPreset = 'neighborhood-explorer' | 'service-shopping' | 'emergency-finder';

const CustomerMapMode: React.FC<CustomerMapModeProps> = ({
  onDataLayerToggle,
  enabledLayers
}) => {
  const { isLoading } = useQuebecData();
  const [selectedPreset, setSelectedPreset] = useState<CustomerPreset>('neighborhood-explorer');

  const handleLayerToggle = (layerName: string) => {
    const newState = !enabledLayers[layerName];
    onDataLayerToggle(layerName, newState);
  };

  const presetTabs = [
    { id: 'neighborhood-explorer', label: 'Neighborhood Explorer', icon: Compass },
    { id: 'service-shopping', label: 'Service Shopping', icon: ShoppingCart },
    { id: 'emergency-finder', label: 'Emergency Finder', icon: AlertTriangle }
  ];

  if (isLoading) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600">Loading neighborhood data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Search className="h-5 w-5 text-teal-600" />
          Customer Intelligence
        </h2>
        <p className="text-sm text-gray-600 mt-1">Quebec neighborhood insights</p>
        
        {/* Preset Tabs */}
        <div className="mt-3">
          <Tabs value={selectedPreset} onValueChange={(value) => setSelectedPreset(value as CustomerPreset)}>
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              {presetTabs.map((preset) => (
                <TabsTrigger 
                  key={preset.id} 
                  value={preset.id}
                  className="text-xs data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                >
                  <preset.icon className="h-3 w-3 mr-1" />
                  {preset.label.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="data-layers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 m-2">
            <TabsTrigger value="data-layers">Data Layers</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="data-layers" className="p-4 space-y-4">
            {/* Neighborhood Explorer Content */}
            {selectedPreset === 'neighborhood-explorer' && (
              <>
                {/* Crime & Safety */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4 text-red-600" />
                      Crime & Safety
                    </CardTitle>
                    <p className="text-xs text-gray-600">SPVM public safety statistics</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <Label htmlFor="crime-layer" className="text-sm">Safety Heat Map</Label>
                      <Switch
                        id="crime-layer"
                        checked={enabledLayers.crime || false}
                        onCheckedChange={() => handleLayerToggle('crime')}
                      />
                    </div>
                    <div className="text-xs text-gray-600">
                      Red zones = higher crime rates, Green zones = safer areas
                    </div>
                  </CardContent>
                </Card>

                {/* Demographics */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      Demographics
                    </CardTitle>
                    <p className="text-xs text-gray-600">Census Canada income data</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <Label htmlFor="demographics-layer" className="text-sm">Income Distribution</Label>
                      <Switch
                        id="demographics-layer"
                        checked={enabledLayers.demographics || false}
                        onCheckedChange={() => handleLayerToggle('demographics')}
                      />
                    </div>
                    <div className="text-xs text-gray-600">
                      Blue intensity = household income levels
                    </div>
                  </CardContent>
                </Card>

                {/* Service Availability */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      Service Availability
                    </CardTitle>
                    <p className="text-xs text-gray-600">Provider density mapping</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <Label htmlFor="services-layer" className="text-sm">Provider Density</Label>
                      <Switch
                        id="services-layer"
                        checked={enabledLayers.services || false}
                        onCheckedChange={() => handleLayerToggle('services')}
                      />
                    </div>
                    <div className="text-xs text-gray-600">
                      Green dots = available service providers
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Service Shopping Content */}
            {selectedPreset === 'service-shopping' && (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Service Shopping Features</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-sm text-gray-600">
                      Advanced service discovery and comparison tools
                    </div>
                    <Badge variant="outline" className="mt-2">Coming Soon</Badge>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Emergency Finder Content */}
            {selectedPreset === 'emergency-finder' && (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      Emergency Response
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-sm text-gray-600">
                      24/7 emergency service location and dispatch
                    </div>
                    <Badge variant="outline" className="mt-2">Coming Soon</Badge>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Coming Soon Features */}
            <Card className="border-dashed border-gray-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  Coming Soon
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Transit Integration</span>
                  <Badge variant="outline" className="text-xs">Soon</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Weather Impact Layer</span>
                  <Badge variant="outline" className="text-xs">Soon</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="p-4 space-y-4">
            {/* Data Sources Info */}
            <Card className="bg-teal-50 border-teal-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4 text-teal-600" />
                  Quebec Data Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-xs text-teal-700">
                  <div>• Crime: SPVM public safety reports</div>
                  <div>• Demographics: Statistics Canada census</div>
                  <div>• Services: Quebec business registry</div>
                </div>
                <div className="mt-3 text-xs text-teal-600 font-medium">
                  Real Quebec neighborhood intelligence
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerMapMode;
