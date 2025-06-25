
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Route, Clock, Plus, MoreVertical, Navigation } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  address: string;
  timeSlot: string;
  estimatedDuration: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed';
  travelTime?: string;
}

interface RouteManagementCardProps {
  todaysJobs: Job[];
  totalTravelTime: string;
  onOptimizeRoute: () => void;
  onReorderJobs: (jobs: Job[]) => void;
  onAddStop: () => void;
}

const RouteManagementCard: React.FC<RouteManagementCardProps> = ({
  todaysJobs,
  totalTravelTime,
  onOptimizeRoute,
  onAddStop
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Route className="h-4 w-4" />
          🛣️ Route Management
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Route summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Total Travel Time</span>
          </div>
          <span className="text-sm font-medium text-blue-600">{totalTravelTime}</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button onClick={onOptimizeRoute} size="sm" className="flex-1">
            <Navigation className="h-4 w-4 mr-2" />
            Optimize Route
          </Button>
          <Button onClick={onAddStop} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Today's job queue */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-700">Today's Jobs ({todaysJobs.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {todaysJobs.map((job, index) => (
              <div key={job.id} className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                        #{index + 1}
                      </span>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-1">{job.title}</div>
                    <div className="text-xs text-gray-600 mb-1">{job.address}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{job.timeSlot}</span>
                      <span>•</span>
                      <span>{job.estimatedDuration}</span>
                      {job.travelTime && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600">{job.travelTime} travel</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteManagementCard;
