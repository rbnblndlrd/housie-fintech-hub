
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp, DollarSign, Users, Target } from 'lucide-react';

interface LocationAnalyticsPanelProps {
  currentArea: string;
  marketDemand: 'Low' | 'Medium' | 'High';
  averagePrice: number;
  competition: 'Low' | 'Medium' | 'High';
  opportunityLevel: 'Low' | 'Medium' | 'High';
  insights: string[];
}

const LocationAnalyticsPanel: React.FC<LocationAnalyticsPanelProps> = ({
  currentArea,
  marketDemand,
  averagePrice,
  competition,
  opportunityLevel,
  insights
}) => {
  const getDemandColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getOpportunityColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          📍 Location Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Current area */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current Area:</span>
          <span className="text-sm font-medium">{currentArea}</span>
        </div>

        {/* Analytics grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-gray-600">Demand</span>
            </div>
            <Badge className={getDemandColor(marketDemand)}>
              {marketDemand}
            </Badge>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-gray-600">Avg Price</span>
            </div>
            <div className="font-medium text-blue-600">${averagePrice}/hr</div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-3 w-3 text-orange-600" />
              <span className="text-xs text-gray-600">Competition</span>
            </div>
            <Badge className={getDemandColor(competition)}>
              {competition}
            </Badge>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-3 w-3 text-purple-600" />
              <span className="text-xs text-gray-600">Opportunity</span>
            </div>
            <Badge className={getOpportunityColor(opportunityLevel)}>
              {opportunityLevel}
            </Badge>
          </div>
        </div>

        {/* Area insights */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-700">Area Insights</h4>
          {insights.map((insight, index) => (
            <div key={index} className="text-xs text-gray-600 bg-blue-50 p-2 rounded border-l-2 border-blue-200">
              {insight}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationAnalyticsPanel;
