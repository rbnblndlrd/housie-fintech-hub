import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Award, Star } from 'lucide-react';

interface EarningsImpactForecastProps {
  currentDayTotal?: number;
  projectedTotal?: number;
  jobValue?: number;
  prestigeMilestone?: {
    name: string;
    required: number;
    current: number;
  };
}

const EarningsImpactForecast: React.FC<EarningsImpactForecastProps> = ({
  currentDayTotal = 245,
  projectedTotal = 365,
  jobValue = 120,
  prestigeMilestone = {
    name: "One-Woman Army",
    required: 5,
    current: 4
  }
}) => {
  const increase = projectedTotal - currentDayTotal;
  const isNearMilestone = prestigeMilestone && (prestigeMilestone.current + 1) >= prestigeMilestone.required;

  return (
    <Card className="fintech-card border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="h-5 w-5 text-green-600" />
          Earnings Impact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Daily Total Projection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current day total</span>
            <span className="font-semibold">${currentDayTotal}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">With this job</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-green-600">${projectedTotal}</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </div>
          
          <div className="text-xs text-gray-500 text-right">
            +${increase} increase
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Today's Progress</span>
            <span className="text-sm font-medium">${projectedTotal} / $400 goal</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((projectedTotal / 400) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Prestige Milestone */}
        {isNearMilestone && (
          <div className="pt-3 border-t">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Award className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-yellow-800">
                    Milestone Alert!
                  </span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                    {prestigeMilestone.current + 1}/{prestigeMilestone.required}
                  </Badge>
                </div>
                <p className="text-xs text-yellow-700">
                  Accepting this puts you 1 job away from that shiny new "{prestigeMilestone.name}" stamp!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Job Value Breakdown */}
        <div className="pt-3 border-t">
          <div className="text-xs text-gray-500 mb-2">This job value:</div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Base rate</span>
            <span className="font-medium">${jobValue}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Estimated 2.5 hrs @ $48/hr</span>
            <Star className="h-3 w-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsImpactForecast;