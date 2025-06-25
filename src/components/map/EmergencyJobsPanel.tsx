
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Volume2, VolumeX, Eye } from 'lucide-react';

interface EmergencyJobsPanelProps {
  emergencyCount: number;
  audioEnabled: boolean;
  onToggleAudio: (enabled: boolean) => void;
  onViewAll: () => void;
  recentJobs: Array<{
    id: string;
    title: string;
    distance: string;
    price: string;
    urgency: 'high' | 'medium';
  }>;
}

const EmergencyJobsPanel: React.FC<EmergencyJobsPanelProps> = ({
  emergencyCount,
  audioEnabled,
  onToggleAudio,
  onViewAll,
  recentJobs
}) => {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-red-700 flex items-center gap-2 text-sm">
          <AlertTriangle className="h-4 w-4" />
          🚨 Emergency Jobs Available
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{emergencyCount}</div>
            <div className="text-xs text-red-600">Nearby urgent requests</div>
          </div>
          <Badge variant="destructive" className="animate-pulse">
            ACTIVE
          </Badge>
        </div>

        {/* Audio notifications toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {audioEnabled ? <Volume2 className="h-4 w-4 text-red-600" /> : <VolumeX className="h-4 w-4 text-gray-500" />}
            <Label htmlFor="audio-alerts" className="text-sm">Audio Alerts</Label>
          </div>
          <Switch
            id="audio-alerts"
            checked={audioEnabled}
            onCheckedChange={onToggleAudio}
          />
        </div>

        {/* Recent emergency jobs preview */}
        <div className="space-y-2">
          {recentJobs.slice(0, 2).map((job) => (
            <div key={job.id} className="bg-white rounded p-2 border border-red-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  <div className="text-xs text-gray-600">{job.distance} away</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-red-600">${job.price}</div>
                  <Badge variant={job.urgency === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                    {job.urgency}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button 
          onClick={onViewAll} 
          variant="destructive" 
          size="sm" 
          className="w-full"
        >
          <Eye className="h-4 w-4 mr-2" />
          View All Emergency Jobs
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmergencyJobsPanel;
