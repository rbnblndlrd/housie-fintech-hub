import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Volume2, VolumeX, Minimize2, GripVertical, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface EmergencyJob {
  id: string;
  title: string;
  description: string;
  price: string;
  timePosted: string;
  location: string;
  priority: string;
}

interface EmergencyJobsOverlayProps {
  position: string;
  visible: boolean;
  minimized: boolean;
  draggable: boolean;
  onMinimize: () => void;
  onToggleAudio: () => void;
  audioEnabled: boolean;
  emergencyCount: number;
  isFleetMode: boolean;
}

const EmergencyJobsOverlay: React.FC<EmergencyJobsOverlayProps> = ({
  position,
  visible,
  minimized,
  draggable,
  onMinimize,
  onToggleAudio,
  audioEnabled,
  emergencyCount,
  isFleetMode
}) => {
  const [selectedJob, setSelectedJob] = useState<EmergencyJob | null>(null);

  const sampleJobs: EmergencyJob[] = [
    {
      id: '1',
      title: 'Pipe Burst Emergency',
      description: 'Urgent plumbing repair needed in apartment building',
      price: '$180',
      timePosted: '2 min ago',
      location: 'Downtown Montreal',
      priority: 'High'
    },
    {
      id: '2',
      title: 'Electrical Outage',
      description: 'Power outage in residential home, electrician needed',
      price: '$220',
      timePosted: '5 min ago',
      location: 'Plateau-Mont-Royal',
      priority: 'Critical'
    },
    {
      id: '3',
      title: 'Heating System Failure',
      description: 'No heat in elderly care facility, immediate attention required',
      price: '$350',
      timePosted: '8 min ago',
      location: 'Westmount',
      priority: 'Critical'
    },
    {
      id: '4',
      title: 'Water Damage Cleanup',
      description: 'Basement flooding requires immediate cleanup',
      price: '$150',
      timePosted: '12 min ago',
      location: 'Verdun',
      priority: 'High'
    }
  ];

  const isMobile = useIsMobile();

  if (!visible) return null;

  if (minimized) {
    return (
      <div className="bg-red-500/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-red-600 min-w-[200px]">
        <div 
          className="flex items-center justify-between cursor-pointer"
          data-draggable-header="true"
          onClick={onMinimize}
        >
          <div className="flex items-center gap-2">
            {draggable && <GripVertical className="h-4 w-4 text-red-100" data-grip="true" />}
            <Zap className="h-4 w-4 text-yellow-300" />
            <span className="text-white font-semibold text-sm">Emergency Jobs</span>
            <Badge variant="destructive" className="bg-yellow-400 text-red-800 text-xs">
              {emergencyCount}
            </Badge>
          </div>
          <ChevronUp className="h-4 w-4 text-red-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-500/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-red-600 w-80">
      {/* Header with drag handle */}
      <div 
        className="flex items-center justify-between mb-4 pb-2 border-b border-red-400"
        data-draggable-header="true"
      >
        <div className="flex items-center gap-2">
          {draggable && <GripVertical className="h-4 w-4 text-red-100 drag-handle" data-grip="true" />}
          <Zap className="h-5 w-5 text-yellow-300" />
          <h3 className="text-white font-bold">Emergency Jobs</h3>
          <Badge variant="destructive" className="bg-yellow-400 text-red-800">
            {emergencyCount}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleAudio}
            className="h-7 w-7 p-1 text-red-100 hover:bg-red-400/50"
          >
            {audioEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMinimize}
            className="h-7 w-7 p-1 text-red-100 hover:bg-red-400/50"
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {sampleJobs.slice(0, emergencyCount).map((job) => (
          <div
            key={job.id}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-red-400/30 hover:bg-white/20 transition-all cursor-pointer"
            onClick={() => setSelectedJob(job)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold text-sm">{job.title}</span>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={job.priority === 'Critical' ? 'destructive' : 'secondary'}
                  className={`text-xs ${
                    job.priority === 'Critical' 
                      ? 'bg-yellow-400 text-red-800' 
                      : 'bg-orange-400 text-white'
                  }`}
                >
                  {job.priority}
                </Badge>
                <span className="text-yellow-300 font-bold">{job.price}</span>
              </div>
            </div>
            <p className="text-red-100 text-xs mb-2">{job.description}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-red-200">{job.location}</span>
              <span className="text-yellow-200">{job.timePosted}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Job Details */}
      {selectedJob && (
        <div className="mt-4 pt-3 border-t border-red-400">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-semibold">{selectedJob.title}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedJob(null)}
                className="h-6 w-6 p-1 text-red-100 hover:bg-red-400/50"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-red-100 text-sm mb-3">{selectedJob.description}</p>
            <div className="flex items-center gap-4 text-xs text-red-200 mb-3">
              <span>{selectedJob.location}</span>
              <span>{selectedJob.timePosted}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-red-800 font-semibold"
              >
                Accept Job - {selectedJob.price}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-red-400 text-red-100 hover:bg-red-400/20"
              >
                Details
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-red-400 flex items-center justify-between">
        <span className="text-red-200 text-xs">
          {isFleetMode ? 'Fleet Emergency Queue' : 'Personal Emergency Feed'}
        </span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className="text-yellow-300 text-xs">Live</span>
        </div>
      </div>
    </div>
  );
};

export default EmergencyJobsOverlay;
