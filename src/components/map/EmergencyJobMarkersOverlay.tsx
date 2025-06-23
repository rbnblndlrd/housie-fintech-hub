
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap } from 'lucide-react';

interface EmergencyJob {
  id: string;
  title: string;
  description: string;
  price: string;
  timePosted: string;
  location: string;
  priority: string;
}

interface EmergencyJobMarkersOverlayProps {
  emergencyJobs: EmergencyJob[];
  onJobSelect: (job: EmergencyJob) => void;
}

const EmergencyJobMarkersOverlay: React.FC<EmergencyJobMarkersOverlayProps> = ({
  emergencyJobs,
  onJobSelect
}) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-10">
      <div className="flex gap-2 flex-wrap">
        {emergencyJobs.map((job) => (
          <Button
            key={job.id}
            variant="destructive"
            size="sm"
            onClick={() => onJobSelect(job)}
            className="flex items-center gap-2 shadow-lg"
          >
            <Zap className="h-4 w-4" />
            ${job.price}
            <Badge variant="secondary" className="ml-1">
              {job.timePosted}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default EmergencyJobMarkersOverlay;
