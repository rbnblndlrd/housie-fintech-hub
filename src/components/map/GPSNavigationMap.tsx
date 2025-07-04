import React, { useState, useEffect } from 'react';
import { UnifiedGoogleMap } from "@/components/UnifiedGoogleMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { 
  Navigation, 
  Phone, 
  CheckCircle, 
  AlertTriangle, 
  Route, 
  MapPin, 
  Clock, 
  DollarSign,
  Users,
  Activity,
  AlertCircle,
  Home,
  Wrench,
  Zap
} from 'lucide-react';

interface JobLocation {
  id: string;
  title: string;
  address: string;
  lat: number;
  lng: number;
  type: 'plumbing' | 'electrical' | 'hvac' | 'general';
  status: 'pending' | 'confirmed' | 'emergency';
  hourlyRate: number;
  estimatedDuration: number;
  customerName: string;
  customerPhone: string;
  distance?: string;
  travelTime?: string;
}

interface IntelligenceOverlay {
  id: string;
  name: string;
  enabled: boolean;
  color: string;
  icon: React.ReactNode;
}

const GPSNavigationMap: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 45.5017, lng: -73.5673 });
  const [emergencyJobAlert, setEmergencyJobAlert] = useState<JobLocation | null>(null);
  const [intelligenceOverlays, setIntelligenceOverlays] = useState<IntelligenceOverlay[]>([
    { id: 'crime', name: 'Crime & Safety', enabled: false, color: '#ef4444', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'demographics', name: 'Demographics', enabled: false, color: '#3b82f6', icon: <Users className="h-4 w-4" /> },
    { id: 'density', name: 'Service Density', enabled: false, color: '#8b5cf6', icon: <Activity className="h-4 w-4" /> },
    { id: 'traffic', name: 'Traffic', enabled: false, color: '#f59e0b', icon: <Route className="h-4 w-4" /> }
  ]);

  // Sample job locations for today
  const [todayJobs] = useState<JobLocation[]>([
    {
      id: '1',
      title: 'Kitchen Faucet Repair',
      address: '123 Saint-Catherine St, Montreal',
      lat: 45.5088,
      lng: -73.5878,
      type: 'plumbing',
      status: 'confirmed',
      hourlyRate: 85,
      estimatedDuration: 90,
      customerName: 'Marie Dubois',
      customerPhone: '+1 514-555-0123',
      distance: '2.3 km',
      travelTime: '8 mins'
    },
    {
      id: '2',
      title: 'Electrical Outlet Installation',
      address: '456 Rue Sherbrooke, Montreal',
      lat: 45.5176,
      lng: -73.5787,
      type: 'electrical',
      status: 'confirmed',
      hourlyRate: 95,
      estimatedDuration: 120,
      customerName: 'Jean Tremblay',
      customerPhone: '+1 514-555-0456',
      distance: '3.1 km',
      travelTime: '12 mins'
    },
    {
      id: '3',
      title: 'HVAC System Check',
      address: '789 Boulevard Saint-Laurent, Montreal',
      lat: 45.5152,
      lng: -73.5689,
      type: 'hvac',
      status: 'pending',
      hourlyRate: 105,
      estimatedDuration: 180,
      customerName: 'Sophie Gagnon',
      customerPhone: '+1 514-555-0789',
      distance: '1.8 km',
      travelTime: '6 mins'
    }
  ]);

  const [selectedJob, setSelectedJob] = useState<JobLocation | null>(null);
  const [optimizedRoute, setOptimizedRoute] = useState(false);

  // Simulate emergency job alert
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!emergencyJobAlert) {
        setEmergencyJobAlert({
          id: 'emergency-1',
          title: 'Burst Pipe Emergency',
          address: '321 Rue Peel, Montreal',
          lat: 45.5030,
          lng: -73.5731,
          type: 'plumbing',
          status: 'emergency',
          hourlyRate: 175,
          estimatedDuration: 60,
          customerName: 'Emergency Service',
          customerPhone: '+1 514-555-9999',
          distance: '0.8 km',
          travelTime: '4 mins'
        });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [emergencyJobAlert]);

  const getJobIcon = (type: string) => {
    switch (type) {
      case 'plumbing': return <Wrench className="h-4 w-4" />;
      case 'electrical': return <Zap className="h-4 w-4" />;
      case 'hvac': return <Home className="h-4 w-4" />;
      default: return <Wrench className="h-4 w-4" />;
    }
  };

  const getJobIconColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'emergency': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleJobMarkerClick = (job: JobLocation) => {
    setSelectedJob(job);
  };

  const handleToggleOverlay = (overlayId: string) => {
    setIntelligenceOverlays(prev => 
      prev.map(overlay => 
        overlay.id === overlayId 
          ? { ...overlay, enabled: !overlay.enabled }
          : overlay
      )
    );
  };

  const handleNavigateToJob = (job: JobLocation) => {
    // In a real app, this would integrate with navigation apps
    console.log(`Navigating to ${job.address}`);
    window.open(`https://maps.google.com/maps?daddr=${job.lat},${job.lng}`, '_blank');
  };

  const handleCallCustomer = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleOptimizeRoute = () => {
    setOptimizedRoute(!optimizedRoute);
    // In a real app, this would reorder jobs for optimal routing
  };

  const handleAcceptEmergency = () => {
    if (emergencyJobAlert) {
      console.log('Accepting emergency job:', emergencyJobAlert.title);
      setEmergencyJobAlert(null);
    }
  };

  const handleDismissEmergency = () => {
    setEmergencyJobAlert(null);
  };

  const enabledOverlayData = intelligenceOverlays.reduce((acc, overlay) => {
    acc[overlay.id] = overlay.enabled;
    return acc;
  }, {} as Record<string, boolean>);

  return (
    <div className="relative h-[600px] w-full">
      {/* Emergency Job Alert */}
      {emergencyJobAlert && (
        <Alert className="absolute top-4 left-4 right-4 z-10 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-red-800">EMERGENCY JOB NEARBY</span>
              <div className="text-sm text-red-700 mt-1">
                {emergencyJobAlert.title} - ${emergencyJobAlert.hourlyRate}/hour - {emergencyJobAlert.distance} away
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Button 
                size="sm" 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleAcceptEmergency}
              >
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleDismissEmergency}
              >
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Intelligence Overlays Toggle */}
      <Card className="absolute top-4 right-4 z-10 w-64">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Intelligence Overlays</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {intelligenceOverlays.map((overlay) => (
            <div key={overlay.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div style={{ color: overlay.color }}>
                  {overlay.icon}
                </div>
                <span className="text-sm">{overlay.name}</span>
              </div>
              <Switch
                checked={overlay.enabled}
                onCheckedChange={() => handleToggleOverlay(overlay.id)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Route Optimization Panel */}
      <Card className="absolute bottom-20 left-4 z-10 w-72">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Route Optimization</span>
            <Button
              size="sm"
              variant={optimizedRoute ? "default" : "outline"}
              onClick={handleOptimizeRoute}
            >
              <Route className="h-4 w-4 mr-2" />
              {optimizedRoute ? 'Optimized' : 'Optimize'}
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Distance:</span>
              <span className="font-medium">{optimizedRoute ? '6.8 km' : '7.2 km'}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Time:</span>
              <span className="font-medium">{optimizedRoute ? '22 mins' : '26 mins'}</span>
            </div>
            <div className="flex justify-between">
              <span>Fuel Cost:</span>
              <span className="font-medium">{optimizedRoute ? '$2.85' : '$3.20'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Action Panel */}
      <Card className="absolute bottom-4 left-4 right-4 z-10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Navigation className="h-4 w-4 mr-2" />
                Navigate to Next Job
              </Button>
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Call Customer
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency Backup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Details Popup */}
      {selectedJob && (
        <Card className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 w-80">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                {getJobIcon(selectedJob.type)}
                {selectedJob.title}
              </CardTitle>
              <Badge 
                className={`${
                  selectedJob.status === 'emergency' ? 'bg-red-100 text-red-800' :
                  selectedJob.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}
              >
                {selectedJob.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{selectedJob.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{selectedJob.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{selectedJob.estimatedDuration} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>${selectedJob.hourlyRate}/hour</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => handleNavigateToJob(selectedJob)}
              >
                Navigate Here
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleCallCustomer(selectedJob.customerPhone)}
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setSelectedJob(null)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Google Maps with Job Markers */}
      <UnifiedGoogleMap
        center={currentLocation}
        zoom={13}
        className="w-full h-full rounded-lg"
        providers={[]}
        mode="interactive"
        enabledLayers={enabledOverlayData}
      >
        {/* Custom job markers would be rendered here */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Current location indicator */}
          <div 
            className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}
          />
          
          {/* Job location markers */}
          {todayJobs.map((job, index) => (
            <div
              key={job.id}
              className="absolute cursor-pointer"
              style={{
                left: `${45 + index * 5}%`,
                top: `${40 + index * 3}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 5
              }}
              onClick={() => handleJobMarkerClick(job)}
            >
              <div 
                className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                style={{ backgroundColor: getJobIconColor(job.status) }}
              >
                <div className="text-white text-xs">
                  {getJobIcon(job.type)}
                </div>
              </div>
            </div>
          ))}

          {/* Emergency job marker */}
          {emergencyJobAlert && (
            <div
              className="absolute cursor-pointer animate-pulse"
              style={{
                left: '48%',
                top: '52%',
                transform: 'translate(-50%, -50%)',
                zIndex: 15
              }}
              onClick={() => handleJobMarkerClick(emergencyJobAlert)}
            >
              <div className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center bg-red-500">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
            </div>
          )}
        </div>
      </UnifiedGoogleMap>
    </div>
  );
};

export default GPSNavigationMap;