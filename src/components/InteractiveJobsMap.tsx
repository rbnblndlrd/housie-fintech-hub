
import React, { useState, useEffect } from 'react';
import { GoogleMap } from "@/components/GoogleMap";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, DollarSign, Zap } from 'lucide-react';
import { useEmergencyJobsData } from '@/hooks/useEmergencyJobsData';
import { useRole } from '@/contexts/RoleContext';

interface MontrealProvider {
  id: number;
  name: string;
  lat: number;
  lng: number;
  service: string;
  rating: number;
  availability: string;
  serviceRadius?: number;
  verified?: boolean;
  hourlyRate?: number;
  distance?: string;
}

const InteractiveJobsMap: React.FC = () => {
  const { emergencyJobs, liveStats, loading, acceptEmergencyJob } = useEmergencyJobsData();
  const { currentRole } = useRole();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  // Sample Montreal providers for the map
  const [providers] = useState<MontrealProvider[]>([
    {
      id: 1,
      name: "Montreal Cleaning Pro",
      lat: 45.5017,
      lng: -73.5673,
      service: "Emergency Cleaning",
      rating: 4.8,
      availability: "Available",
      serviceRadius: 15,
      verified: true,
      hourlyRate: 45,
      distance: "1.2 km"
    },
    {
      id: 2,
      name: "QuickFix Electrical",
      lat: 45.5088,
      lng: -73.5878,
      service: "Electrical Repair",
      rating: 4.9,
      availability: "Available",
      serviceRadius: 20,
      verified: true,
      hourlyRate: 75,
      distance: "2.8 km"
    },
    {
      id: 3,
      name: "Plateau Plumbing",
      lat: 45.5276,
      lng: -73.5794,
      service: "Emergency Plumbing",
      rating: 4.7,
      availability: "Busy",
      serviceRadius: 12,
      verified: true,
      hourlyRate: 65,
      distance: "3.1 km"
    }
  ]);

  const handleJobSelect = (job: any) => {
    setSelectedJob(job);
  };

  const handleAcceptJob = async (jobId: string) => {
    if (currentRole === 'provider') {
      const success = await acceptEmergencyJob(jobId);
      if (success) {
        setSelectedJob(null);
      }
    }
  };

  const handleMapError = (error: string) => {
    console.error('Map error:', error);
    setMapError(error);
  };

  if (mapError) {
    return (
      <div className="relative h-96 w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-red-600 mb-2">🗺️ Map Unavailable</div>
          <p className="text-gray-600 mb-2">{mapError}</p>
          <p className="text-sm text-gray-500">
            Interactive map temporarily unavailable. Job listings still available below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Google Map */}
      <div className="h-full w-full">
        <GoogleMap
          center={{ lat: 45.5017, lng: -73.5673 }}
          zoom={12}
          className="w-full h-full rounded-lg"
          providers={providers}
        />
      </div>

      {/* Job Markers Overlay */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex gap-2 flex-wrap">
          {emergencyJobs.map((job) => (
            <Button
              key={job.id}
              variant="destructive"
              size="sm"
              onClick={() => handleJobSelect(job)}
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

      {/* Live Stats */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="fintech-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{liveStats.availableProviders}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Job Details */}
      {selectedJob && (
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
                  onClick={() => setSelectedJob(null)}
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
                  onClick={() => handleAcceptJob(selectedJob.id)}
                  className="w-full fintech-button-primary"
                >
                  Accept Emergency Job
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading Montreal jobs...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveJobsMap;
