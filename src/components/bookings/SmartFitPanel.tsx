import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, AlertTriangle, CheckCircle, Route } from 'lucide-react';

interface SmartFitPanelProps {
  booking?: any;
  estimatedEndTime?: string;
  travelTime?: number;
  conflicts?: boolean;
  routeDistance?: string;
}

const SmartFitPanel: React.FC<SmartFitPanelProps> = ({
  booking,
  estimatedEndTime = "4:15 PM",
  travelTime = 22,
  conflicts = false,
  routeDistance = "3.2 mi"
}) => {
  return (
    <Card className="fintech-card border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          Can I fit this job today?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Route and Timing */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-700">
              You'd wrap this job by <span className="font-semibold">{estimatedEndTime}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Route className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-700">
              <span className="font-semibold">{travelTime} mins</span> travel time • {routeDistance}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-700">
              Route preview available
            </span>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-blue-600">
              View Map
            </Button>
          </div>
        </div>

        {/* Conflict Detection */}
        <div className="pt-3 border-t">
          {conflicts ? (
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Schedule Conflict</p>
                <p className="text-xs text-amber-700">
                  This overlaps your Verdun job by 45 min
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Perfect Fit!</p>
                <p className="text-xs text-green-700">
                  No conflicts detected — want to squeeze it in?
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action */}
        <div className="pt-3 border-t">
          <div className="text-xs text-gray-500 mb-2">Annette's recommendation:</div>
          <p className="text-sm text-purple-700 italic">
            "Oooh, this one's a juicy fit — $120, done before lunch. Want it?"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartFitPanel;