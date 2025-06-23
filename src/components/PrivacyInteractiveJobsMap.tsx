
import React, { useState } from 'react';
import { GoogleMap } from "@/components/GoogleMap";
import { usePrivacyEmergencyJobs } from '@/hooks/usePrivacyEmergencyJobs';
import { useRole } from '@/contexts/RoleContext';
import { getProviderFuzzyLocation } from '@/utils/locationPrivacy';
import { montrealProviders } from '@/data/montrealProviders';
import PrivacyMapMarkers from './map/PrivacyMapMarkers';
import MontrealHeatZones from './map/MontrealHeatZones';
import LiveStatsCard from './map/LiveStatsCard';
import LoadingOverlay from './map/LoadingOverlay';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, MapPin, Clock, DollarSign, Shield, Eye, EyeOff } from 'lucide-react';

const PrivacyInteractiveJobsMap: React.FC = () => {
  const { emergencyJobs, liveStats, loading, acceptEmergencyJob } = usePrivacyEmergencyJobs();
  const { currentRole } = useRole();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [showHeatZones, setShowHeatZones] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  // Convert providers to privacy-protected format
  const privacyProviders = montrealProviders.map(provider => ({
    id: provider.id.toString(),
    name: `Provider ${provider.id}`, // Anonymous name
    fuzzyLocation: getProviderFuzzyLocation(provider),
    availability: provider.availability,
    rating: provider.rating,
    verified: provider.verified || false
  }));

  const handleJobSelect = (job: any) => {
    setSelectedJob(job);
  };

  const handleZoneSelect = (zone: any) => {
    setSelectedZone(zone);
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
            Privacy-protected map temporarily unavailable. Job listings still available below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Privacy Notice */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs">
          <div className="flex items-center gap-2 text-blue-800 text-sm font-medium mb-1">
            <Shield className="h-4 w-4" />
            Privacy Protected
          </div>
          <p className="text-xs text-blue-600">
            Locations are anonymized for privacy. Providers shown as fuzzy dots, jobs as service areas.
          </p>
        </div>
      </div>

      {/* Heat Zones Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant={showHeatZones ? "default" : "outline"}
          size="sm"
          onClick={() => setShowHeatZones(!showHeatZones)}
          className="bg-white/90 backdrop-blur-sm"
        >
          {showHeatZones ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          Heat Zones
        </Button>
      </div>

      {/* Google Map */}
      <div className="h-full w-full">
        <GoogleMap
          center={{ lat: 45.5017, lng: -73.5673 }}
          zoom={11}
          className="w-full h-full rounded-lg"
        />
      </div>

      {/* Privacy-Protected Map Markers */}
      <PrivacyMapMarkers
        providers={privacyProviders}
        jobs={emergencyJobs}
        isMapReady={true}
        onProviderClick={(provider) => console.log('Provider clicked:', provider.name)}
        onJobClick={handleJobSelect}
      />

      {/* Montreal Heat Zones */}
      {showHeatZones && (
        <MontrealHeatZones
          zones={liveStats.montrealZones}
          isMapReady={true}
          onZoneClick={handleZoneSelect}
          showLabels={true}
        />
      )}

      {/* Live Stats Card */}
      <LiveStatsCard liveStats={liveStats} />

      {/* Selected Job Details Card */}
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
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Privacy Protected
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
                    <span className="text-sm text-gray-600">{selectedJob.zone}</span>
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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-blue-800 text-sm">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Privacy Notice:</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Exact address will be revealed only after you accept this job.
                </p>
              </div>

              {currentRole === 'provider' && (
                <Button 
                  onClick={() => handleAcceptJob(selectedJob.id)}
                  className="w-full fintech-button-primary"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Accept Emergency Job
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selected Zone Info */}
      {selectedZone && (
        <div className="absolute top-20 left-4 z-10">
          <Card className="fintech-card max-w-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-lg">{selectedZone.zone_name}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedZone(null)}
                  className="text-gray-500"
                >
                  ✕
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Demand:</span>
                  <Badge variant={selectedZone.demand_level === 'high' ? 'destructive' : 'secondary'}>
                    {selectedZone.demand_level}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="capitalize">{selectedZone.zone_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Multiplier:</span>
                  <span className="font-bold text-green-600">
                    {selectedZone.pricing_multiplier}x
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading Overlay */}
      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default PrivacyInteractiveJobsMap;
