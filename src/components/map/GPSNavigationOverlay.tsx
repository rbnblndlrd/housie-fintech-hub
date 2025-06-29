
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation, Clock, MapPin, Phone, X } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  address: string;
  customerName: string;
  customerPhone: string;
  estimatedDuration: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  coordinates: { lat: number; lng: number };
}

interface GPSNavigationOverlayProps {
  selectedJob: Job | null;
  onStartNavigation: (job: Job) => void;
  onCompleteJob: (jobId: string) => void;
  onCancelNavigation: () => void;
}

const GPSNavigationOverlay: React.FC<GPSNavigationOverlayProps> = ({
  selectedJob,
  onStartNavigation,
  onCompleteJob,
  onCancelNavigation
}) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [eta, setEta] = useState<string>('Calculating...');

  useEffect(() => {
    if (isNavigating && selectedJob) {
      // Simulate ETA calculation
      const mockEta = Math.floor(Math.random() * 30) + 10;
      setEta(`${mockEta} min`);
    }
  }, [isNavigating, selectedJob]);

  if (!selectedJob) return null;

  const handleStartNavigation = () => {
    console.log('🧭 Starting GPS navigation to:', selectedJob.address);
    setIsNavigating(true);
    onStartNavigation(selectedJob);
  };

  const handleCompleteJob = () => {
    console.log('✅ Job completed:', selectedJob.id);
    setIsNavigating(false);
    onCompleteJob(selectedJob.id);
  };

  const getPriorityColor = (priority: Job['priority']) => {
    switch (priority) {
      case 'emergency': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      default: return 'bg-green-600';
    }
  };

  return (
    <div className="absolute bottom-6 left-6 right-6 z-50 pointer-events-auto">
      <Card className="fintech-card">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${getPriorityColor(selectedJob.priority)} text-white`}>
                  {selectedJob.priority.toUpperCase()}
                </Badge>
                <h3 className="font-semibold text-gray-900">{selectedJob.title}</h3>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {selectedJob.address}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {selectedJob.estimatedDuration}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelNavigation}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{selectedJob.customerName}</p>
                <p className="text-sm text-gray-600">{selectedJob.customerPhone}</p>
              </div>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-3">
            {!isNavigating ? (
              <Button
                onClick={handleStartNavigation}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Start Navigation
              </Button>
            ) : (
              <>
                <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-center">
                  <div className="text-blue-800 font-medium">Navigating</div>
                  <div className="text-blue-600 text-sm">ETA: {eta}</div>
                </div>
                <Button
                  onClick={handleCompleteJob}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Complete Job
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GPSNavigationOverlay;
