import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  DollarSign, 
  MapPin, 
  Navigation,
  Route,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import { Job } from '@/hooks/useRouteOptimizer';
import { useToast } from '@/hooks/use-toast';

interface FloatingRoutePanelProps {
  jobs: Job[];
  totalEarnings: number;
  totalTime: number;
  onOptimizeRoute: () => void;
  onStartNavigation: () => void;
}

const FloatingRoutePanel: React.FC<FloatingRoutePanelProps> = ({
  jobs,
  totalEarnings,
  totalTime,
  onOptimizeRoute,
  onStartNavigation
}) => {
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-3 w-3 text-blue-600" />;
      case 'confirmed':
        return <CheckCircle className="h-3 w-3 text-blue-600" />;
      default:
        return <AlertCircle className="h-3 w-3 text-orange-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const calculateDistance = (index: number) => {
    // Mock distance calculation between jobs
    const distances = [2.3, 5.1, 3.7, 4.2];
    return distances[index] || Math.random() * 5 + 1;
  };

  const calculateTravelTime = (distance: number) => {
    // Estimate travel time (average city speed ~25 km/h)
    return Math.round(distance / 25 * 60);
  };

  const handleOptimizeRoute = () => {
    onOptimizeRoute();
    toast({
      title: "Route Optimized",
      description: "Route has been optimized for efficiency and time",
    });
  };

  const handleStartNavigation = () => {
    onStartNavigation();
    toast({
      title: "Navigation Started", 
      description: "GPS navigation to first job location",
    });
  };

  return (
    <div className="fixed left-4 top-20 w-80 z-50 pointer-events-auto">
      <Card className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Route className="h-5 w-5 text-blue-600" />
            Today's Route
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Est. {totalTime}h</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>Total: ${totalEarnings}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Job List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {jobs.map((job, index) => {
              const distance = calculateDistance(index);
              const travelTime = calculateTravelTime(distance);
              
              return (
                <div key={job.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{job.customerName}</span>
                      <Badge className={`${getStatusColor(job.status)} text-xs`}>
                        {getStatusIcon(job.status)}
                        <span className="ml-1 capitalize">{job.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{distance.toFixed(1)} km</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{travelTime} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t">
            <Button 
              onClick={handleOptimizeRoute}
              variant="outline" 
              className="w-full"
            >
              <Zap className="h-4 w-4 mr-2" />
              Optimize Route
            </Button>
            
            <Button 
              onClick={handleStartNavigation}
              className="w-full fintech-button-primary"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Start Navigation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FloatingRoutePanel;