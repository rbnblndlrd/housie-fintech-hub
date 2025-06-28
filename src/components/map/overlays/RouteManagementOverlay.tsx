
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation, Clock, Plus, RotateCcw, MapPin, Minimize2, GripVertical } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  location: string;
  time: string;
  duration: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface RouteManagementOverlayProps {
  position: string;
  visible: boolean;
  minimized: boolean;
  draggable: boolean;
  onMinimize: () => void;
  jobs: Job[];
  totalTravelTime: string;
  nextJobCountdown: string;
  isFleetMode: boolean;
}

const RouteManagementOverlay: React.FC<RouteManagementOverlayProps> = ({
  position,
  visible,
  minimized,
  draggable,
  onMinimize,
  jobs,
  totalTravelTime,
  nextJobCountdown,
  isFleetMode
}) => {
  if (!visible) return null;

  if (minimized) {
    return (
      <div className={`absolute ${position} z-30`}>
        <Button
          variant="outline"
          size="sm"
          onClick={onMinimize}
          className="bg-white/90 backdrop-blur-sm text-gray-900"
        >
          <Navigation className="h-4 w-4 mr-1 text-gray-900" />
          {jobs.length}
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="w-96 bg-white/95 backdrop-blur-sm shadow-lg pointer-events-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2 text-gray-900" data-draggable-header={draggable}>
            {draggable && <GripVertical className="h-4 w-4 cursor-grab text-gray-600" data-grip="true" />}
            <Navigation className="h-4 w-4 text-gray-900" />
            🛣️ {isFleetMode ? 'Fleet Route Management' : 'Route Management'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {totalTravelTime}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <Minimize2 className="h-3 w-3 text-gray-900" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Next Job Countdown */}
        {nextJobCountdown && (
          <div className="p-2 bg-blue-50 rounded border border-blue-200">
            <div className="text-xs text-blue-700 font-medium mb-1">
              Next Job in: {nextJobCountdown}
            </div>
            <div className="text-xs text-blue-600">
              {jobs.find(j => j.status === 'pending')?.title || 'No pending jobs'}
            </div>
          </div>
        )}

        {/* Job Queue */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {jobs.slice(0, 4).map((job, index) => (
            <div
              key={job.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-gray-900">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{job.title}</div>
                  <div className="text-gray-600 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className={`text-xs ${getStatusColor(job.status)}`}>
                  {job.status}
                </Badge>
                <div className="text-xs text-gray-600 mt-1">{job.duration}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="default" className="text-white">
            <RotateCcw className="h-3 w-3 mr-1" />
            {isFleetMode ? 'Optimize Fleet' : 'Optimize Route'}
          </Button>
          <Button size="sm" variant="outline" className="text-gray-900 border-gray-300 hover:bg-gray-50">
            <Plus className="h-3 w-3 mr-1" />
            Add Stop
          </Button>
        </div>

        {isFleetMode && (
          <Button size="sm" variant="outline" className="w-full text-gray-900 border-gray-300 hover:bg-gray-50">
            <Navigation className="h-3 w-3 mr-1" />
            Fleet Dashboard
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteManagementOverlay;
