import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  MapPin, 
  Navigation, 
  Zap, 
  Eye,
  GripVertical
} from 'lucide-react';

interface RouteJob {
  id: string;
  time: string;
  customer: string;
  taskName: string;
  address: string;
  status: 'upcoming' | 'current' | 'completed';
}

const mockRouteJobs: RouteJob[] = [
  {
    id: '1',
    time: '9:00 AM',
    customer: 'Marie Dubois',
    taskName: 'Furnace Repair',
    address: '123 Rue St-Denis',
    status: 'current'
  },
  {
    id: '2',
    time: '11:30 AM',
    customer: 'Jean-Paul Tremblay',
    taskName: 'Kitchen Sink Installation',
    address: '456 Ave du Parc',
    status: 'upcoming'
  },
  {
    id: '3',
    time: '2:00 PM',
    customer: 'Sophie Martin',
    taskName: 'Bathroom Tile Repair',
    address: '789 Boul St-Laurent',
    status: 'upcoming'
  }
];

const TodaysRoutePanel = () => {
  const [jobs, setJobs] = useState(mockRouteJobs);
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'upcoming': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const handleOptimize = () => {
    console.log('AI optimizing route...');
    // Future: trigger AI route optimization
  };

  const handleStartGPS = () => {
    console.log('Starting GPS navigation...');
    // Future: open GPS/maps integration
  };

  const displayedJobs = isExpanded ? jobs : jobs.slice(0, 2);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">Today's Schedule</h4>
        <Badge variant="outline" className="text-xs">
          {jobs.length} jobs
        </Badge>
      </div>

      <div className="space-y-3">
        {displayedJobs.map((job, index) => (
          <div
            key={job.id}
            className="bg-muted/30 backdrop-blur-md border border-muted/20 rounded-lg p-3 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">{job.time}</span>
                <Badge className={getStatusColor(job.status)}>
                  {job.status}
                </Badge>
              </div>
            </div>

            <div className="ml-6 space-y-1">
              <h5 className="font-medium text-foreground text-sm">{job.taskName}</h5>
              <p className="text-xs text-muted-foreground">{job.customer}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                {job.address}
              </div>
            </div>
          </div>
        ))}
      </div>

      {jobs.length > 2 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full bg-muted/20 hover:bg-muted/40"
        >
          <Eye className="h-4 w-4 mr-2" />
          {isExpanded ? 'Show Less' : `View All ${jobs.length} Jobs`}
        </Button>
      )}

      <div className="space-y-2 pt-2 border-t border-muted/20">
        <Button
          variant="outline"
          size="sm"
          onClick={handleOptimize}
          className="w-full bg-primary/20 hover:bg-primary/30 text-primary border-primary/30"
        >
          <Zap className="h-4 w-4 mr-2" />
          Optimize Route
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleStartGPS}
          className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Start GPS
        </Button>
      </div>
    </div>
  );
};

export default TodaysRoutePanel;