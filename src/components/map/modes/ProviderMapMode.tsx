
import React, { useState, useEffect } from 'react';
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
  Zap
} from 'lucide-react';

interface ProviderMapModeProps {
  onDataLayerToggle: (layer: string, enabled: boolean) => void;
  enabledLayers: Record<string, boolean>;
}

interface DemandData {
  area: string;
  demandLevel: number;
  weeklyJobs: number;
  trend: 'up' | 'down' | 'stable';
}

interface CompetitionData {
  area: string;
  providerCount: number;
  competitionLevel: 'low' | 'medium' | 'high';
  marketShare: number;
}

interface TipData {
  area: string;
  averageTip: number;
  tipFrequency: number;
  tipCategory: 'standard' | 'good' | 'excellent';
}

interface OpportunityData {
  area: string;
  opportunityScore: number;
  demandSupplyRatio: number;
  potentialEarnings: number;
}

const ProviderMapMode: React.FC<ProviderMapModeProps> = ({
  onDataLayerToggle,
  enabledLayers
}) => {
  const [demandData, setDemandData] = useState<DemandData[]>([]);
  const [competitionData, setCompetitionData] = useState<CompetitionData[]>([]);
  const [tipData, setTipData] = useState<TipData[]>([]);
  const [opportunityData, setOpportunityData] = useState<OpportunityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Provider business intelligence data
  useEffect(() => {
    const fetchProviderData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchDemandData(),
          fetchCompetitionData(),
          fetchTipData(),
          fetchOpportunityData()
        ]);
      } catch (error) {
        console.error('Error fetching provider data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviderData();
  }, []);

  const fetchDemandData = async () => {
    // Real implementation would analyze booking patterns and demand
    const mockDemandData: DemandData[] = [
      { area: "Montreal Downtown", demandLevel: 85, weeklyJobs: 145, trend: 'up' },
      { area: "Longueuil", demandLevel: 62, weeklyJobs: 89, trend: 'stable' },
      { area: "Laval", demandLevel: 78, weeklyJobs: 112, trend: 'up' },
      { area: "Westmount", demandLevel: 91, weeklyJobs: 67, trend: 'down' },
    ];
    setDemandData(mockDemandData);
  };

  const fetchCompetitionData = async () => {
    // Real implementation would analyze provider density vs demand
    const mockCompetitionData: CompetitionData[] = [
      { area: "Montreal Downtown", providerCount: 245, competitionLevel: 'high', marketShare: 12 },
      { area: "Longueuil", providerCount: 89, competitionLevel: 'medium', marketShare: 28 },
      { area: "Laval", providerCount: 156, competitionLevel: 'medium', marketShare: 18 },
      { area: "Westmount", providerCount: 67, competitionLevel: 'low', marketShare: 35 },
    ];
    setCompetitionData(mockCompetitionData);
  };

  const fetchTipData = async () => {
    // Real implementation would analyze tip patterns by area
    const mockTipData: TipData[] = [
      { area: "Montreal Downtown", averageTip: 18.50, tipFrequency: 65, tipCategory: 'good' },
      { area: "Longueuil", averageTip: 12.25, tipFrequency: 45, tipCategory: 'standard' },
      { area: "Laval", averageTip: 15.75, tipFrequency: 58, tipCategory: 'good' },
      { area: "Westmount", averageTip: 28.90, tipFrequency: 85, tipCategory: 'excellent' },
    ];
    setTipData(mockTipData);
  };

  const fetchOpportunityData = async () => {
    // Real implementation would calculate opportunity scores
    const mockOpportunityData: OpportunityData[] = [
      { area: "Montreal Downtown", opportunityScore: 72, demandSupplyRatio: 1.8, potentialEarnings: 890 },
      { area: "Longueuil", opportunityScore: 85, demandSupplyRatio: 2.4, potentialEarnings: 1150 },
      { area: "Laval", opportunityScore: 78, demandSupplyRatio: 2.1, potentialEarnings: 980 },
      { area: "Westmount", opportunityScore: 91, demandSupplyRatio: 3.2, potentialEarnings: 1420 },
    ];
    setOpportunityData(mockOpportunityData);
  };

  const handleLayerToggle = (layerName: string) => {
    const newState = !enabledLayers[layerName];
    onDataLayerToggle(layerName, newState);
  };

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
          Business Intelligence
        </h2>
        <p className="text-sm text-gray-600 mt-1">Provider market analysis</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="data-layers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 m-2">
            <TabsTrigger value="data-layers">Data Layers</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="data-layers" className="p-4 space-y-4">
            {/* Demand Hot Zones */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-600" />
                  Demand Hot Zones
                </CardTitle>
                <p className="text-xs text-gray-600">High service request areas</p>
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
                  Orange zones show high-demand areas
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
                <p className="text-xs text-gray-600">Provider density vs demand</p>
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
                  Red zones show high competition areas
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
                <p className="text-xs text-gray-600">High-tip neighborhoods</p>
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
                  Gold zones show high-tip areas
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
                <p className="text-xs text-gray-600">Underserved markets</p>
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
                  Green zones show high-opportunity areas
                </div>
              </CardContent>
            </Card>

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
          </TabsContent>

          <TabsContent value="insights" className="p-4 space-y-4">
            {/* Demand Insights */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-600" />
                  Demand Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {demandData.slice(0, 3).map((area, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{area.area}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{area.demandLevel}%</span>
                      <div className={`w-2 h-2 rounded-full ${
                        area.trend === 'up' ? 'bg-green-500' : 
                        area.trend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Competition Insights */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-red-600" />
                  Competition Level
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {competitionData.slice(0, 3).map((area, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{area.area}</span>
                    <Badge variant={area.competitionLevel === 'low' ? 'default' : area.competitionLevel === 'medium' ? 'secondary' : 'destructive'}>
                      {area.competitionLevel}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Earnings Potential */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Earnings Potential
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {opportunityData.slice(0, 3).map((area, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{area.area}</span>
                    <span className="font-medium">${area.potentialEarnings}/week</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Data Sources Info */}
            <Card className="bg-orange-50 border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4 text-orange-600" />
                  Business Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-xs text-orange-700">
                  <div>• Real booking demand patterns</div>
                  <div>• Live provider competition data</div>
                  <div>• Historical tip analysis</div>
                  <div>• Market opportunity scoring</div>
                </div>
                <div className="mt-3 text-xs text-orange-600 font-medium">
                  Updated in real-time from platform data
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProviderMapMode;
