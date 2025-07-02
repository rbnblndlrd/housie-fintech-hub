
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  Users, 
  DollarSign, 
  TrendingUp,
  MapPin,
  Clock,
  Info,
  Zap,
  Search,
  Settings
} from 'lucide-react';
import { useProviderIntelligence } from '@/hooks/useProviderIntelligence';

interface ProviderMapModeProps {
  onDataLayerToggle: (layer: string, enabled: boolean) => void;
  enabledLayers: Record<string, boolean>;
}

type ProviderPreset = 'business-intelligence' | 'opportunity-hunter' | 'efficiency-optimizer';

const ProviderMapMode: React.FC<ProviderMapModeProps> = ({
  onDataLayerToggle,
  enabledLayers
}) => {
  const {
    demandData,
    competitionData,
    tipData,
    opportunityData,
    isLoading
  } = useProviderIntelligence();

  const [selectedPreset, setSelectedPreset] = useState<ProviderPreset>('business-intelligence');

  const handleLayerToggle = (layerName: string) => {
    const newState = !enabledLayers[layerName];
    onDataLayerToggle(layerName, newState);
  };

  const presetTabs = [
    { id: 'business-intelligence', label: 'Business Intelligence', icon: Target },
    { id: 'opportunity-hunter', label: 'Opportunity Hunter', icon: Search },
    { id: 'efficiency-optimizer', label: 'Efficiency Optimizer', icon: Settings }
  ];

  if (isLoading) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600">Loading business intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Target className="h-5 w-5 text-orange-600" />
          Provider Hub
        </h2>
        <p className="text-sm text-gray-600 mt-1">Market analysis and optimization</p>
        
        {/* Preset Tabs */}
        <div className="mt-3">
          <Tabs value={selectedPreset} onValueChange={(value) => setSelectedPreset(value as ProviderPreset)}>
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              {presetTabs.map((preset) => (
                <TabsTrigger 
                  key={preset.id} 
                  value={preset.id}
                  className="text-xs data-[state=active]:bg-orange-600 data-[state=active]:text-white"
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
        {/* Temporarily hide the Data Layers/Insights switch */}
        <div className="p-4 space-y-4">
          {/* Business Intelligence Content */}
          {selectedPreset === 'business-intelligence' && (
            <>
              {/* Demand Hot Zones */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-600" />
                    Demand Hot Zones
                  </CardTitle>
                  <p className="text-xs text-gray-600">Service request frequency + demographics</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <Label htmlFor="demand-layer" className="text-sm">Demand Heat Map</Label>
                    <Switch
                      id="demand-layer"
                      checked={enabledLayers.demand || false}
                      onCheckedChange={() => handleLayerToggle('demand')}
                    />
                  </div>
                  <div className="text-xs text-gray-600">
                    Based on monthly service requests and population data
                  </div>
                </CardContent>
              </Card>

              {/* Competition Analysis */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4 text-red-600" />
                    Competition Analysis
                  </CardTitle>
                  <p className="text-xs text-gray-600">Business registry provider density</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <Label htmlFor="competition-layer" className="text-sm">Competition Zones</Label>
                    <Switch
                      id="competition-layer"
                      checked={enabledLayers.competition || false}
                      onCheckedChange={() => handleLayerToggle('competition')}
                    />
                  </div>
                  <div className="text-xs text-gray-600">
                    Market saturation = active providers ÷ business opportunities
                  </div>
                </CardContent>
              </Card>

              {/* Tip Zone Mapping */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-yellow-600" />
                    Tip Zone Mapping
                  </CardTitle>
                  <p className="text-xs text-gray-600">Income + consumer spending patterns</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <Label htmlFor="tips-layer" className="text-sm">Tip Heat Map</Label>
                    <Switch
                      id="tips-layer"
                      checked={enabledLayers.tips || false}
                      onCheckedChange={() => handleLayerToggle('tips')}
                    />
                  </div>
                  <div className="text-xs text-gray-600">
                    Average tip = (income ÷ 2000) × spending index
                  </div>
                </CardContent>
              </Card>

              {/* Opportunity Areas */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Opportunity Areas
                  </CardTitle>
                  <p className="text-xs text-gray-600">Market gaps + growth trends</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <Label htmlFor="opportunity-layer" className="text-sm">Opportunity Zones</Label>
                    <Switch
                      id="opportunity-layer"
                      checked={enabledLayers.opportunity || false}
                      onCheckedChange={() => handleLayerToggle('opportunity')}
                    />
                  </div>
                  <div className="text-xs text-gray-600">
                    Market gap × economic growth factor
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Opportunity Hunter Content */}
          {selectedPreset === 'opportunity-hunter' && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Opportunity Hunter Features</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-gray-600">
                    Advanced market gap detection and growth prediction
                  </div>
                  <Badge variant="outline" className="mt-2">Coming Soon</Badge>
                </CardContent>
              </Card>
            </>
          )}

          {/* Efficiency Optimizer Content */}
          {selectedPreset === 'efficiency-optimizer' && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Efficiency Optimizer Features</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-gray-600">
                    Route optimization and productivity analytics
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
                <span className="text-xs text-gray-500">Seasonal Demand Patterns</span>
                <Badge variant="outline" className="text-xs">Soon</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Route Optimization</span>
                <Badge variant="outline" className="text-xs">Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderMapMode;
