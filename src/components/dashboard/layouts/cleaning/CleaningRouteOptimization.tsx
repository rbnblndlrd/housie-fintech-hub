import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Zap, Clock, Route } from 'lucide-react';

interface CleaningRouteOptimizationProps {
  jobs: any[];
}

const CleaningRouteOptimization: React.FC<CleaningRouteOptimizationProps> = ({ jobs }) => {
  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5 text-purple-500" />
          Route Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="fintech-inner-box p-4 text-center">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-xl font-bold">2.3 hrs</div>
            <div className="text-sm text-muted-foreground">Est. Travel Time</div>
          </div>
          
          <div className="fintech-inner-box p-4 text-center">
            <MapPin className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-xl font-bold">12.4 km</div>
            <div className="text-sm text-muted-foreground">Total Distance</div>
          </div>
          
          <div className="fintech-inner-box p-4 text-center">
            <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-xl font-bold">87%</div>
            <div className="text-sm text-muted-foreground">Efficiency Score</div>
          </div>
        </div>
        
        <div className="fintech-inner-box p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Optimization Suggestions</span>
            <Badge variant="secondary">3 suggestions</Badge>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <span>Swap jobs #2 and #3 to save 15 minutes</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <span>Start at closest location to save 8 minutes</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <span>Group nearby jobs for better efficiency</span>
            </div>
          </div>
          
          <Button className="w-full mt-4" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Apply All Optimizations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CleaningRouteOptimization;