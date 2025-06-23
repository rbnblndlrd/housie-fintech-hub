
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, DollarSign } from 'lucide-react';

interface SelectedJob {
  id: string;
  title: string;
  description: string;
  price: string;
  timePosted: string;
  location: string;
  priority: string;
}

interface SelectedJobCardProps {
  selectedJob: SelectedJob | null;
  currentRole: string;
  onClose: () => void;
  onAcceptJob: (jobId: string) => void;
}

const SelectedJobCard: React.FC<SelectedJobCardProps> = ({
  selectedJob,
  currentRole,
  onClose,
  onAcceptJob
}) => {
  if (!selectedJob) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10">
      <Card className="fintech-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <Badge variant="destructive" className="text-xs">
                EMERGENCY
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500"
            >
              ✕
            </Button>
          </div>
          
          <h3 className="font-bold text-lg mb-2">{selectedJob.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{selectedJob.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{selectedJob.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{selectedJob.timePosted}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-xl font-bold text-green-600">{selectedJob.price}</span>
            </div>
          </div>

          {currentRole === 'provider' && (
            <Button 
              onClick={() => onAcceptJob(selectedJob.id)}
              className="w-full fintech-button-primary"
            >
              Accept Emergency Job
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectedJobCard;
