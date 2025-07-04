import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  AlertCircle,
  Home,
  Wrench,
  Zap
} from 'lucide-react';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicmJuYmxuZGxyZCIsImEiOiJjbWNmdGYzN2wwY2RuMmtwd3M3d2hzM3NxIn0.MZfduMhwltc3eC8V5xYgcQ';

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

const GPSNavigationMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  
  const [emergencyJobAlert, setEmergencyJobAlert] = useState<JobLocation | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobLocation | null>(null);
  const [optimizedRoute, setOptimizedRoute] = useState(false);

  // Quebec coordinates
  const quebecCenter = { lat: 46.8139, lng: -71.2082 };

  // Sample job locations for today
  const [todayJobs] = useState<JobLocation[]>([
    {
      id: '1',
      title: 'Kitchen Faucet Repair',
      address: '123 Saint-Catherine St, Quebec City',
      lat: 46.8095,
      lng: -71.2155,
      type: 'plumbing',
      status: 'confirmed',
      hourlyRate: 85,
      estimatedDuration: 90,
      customerName: 'Marie Dubois',
      customerPhone: '+1 418-555-0123',
      distance: '2.3 km',
      travelTime: '8 mins'
    },
    {
      id: '2',
      title: 'Electrical Outlet Installation',
      address: '456 Grande Allée, Quebec City',
      lat: 46.8025,
      lng: -71.2198,
      type: 'electrical',
      status: 'confirmed',
      hourlyRate: 95,
      estimatedDuration: 120,
      customerName: 'Jean Tremblay',
      customerPhone: '+1 418-555-0456',
      distance: '3.1 km',
      travelTime: '12 mins'
    },
    {
      id: '3',
      title: 'HVAC System Check',
      address: '789 Rue Saint-Jean, Quebec City',
      lat: 46.8123,
      lng: -71.2089,
      type: 'hvac',
      status: 'pending',
      hourlyRate: 105,
      estimatedDuration: 180,
      customerName: 'Sophie Gagnon',
      customerPhone: '+1 418-555-0789',
      distance: '1.8 km',
      travelTime: '6 mins'
    }
  ]);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Initialize map with proper error handling
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [quebecCenter.lng, quebecCenter.lat],
        zoom: 10,
        attributionControl: false
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Wait for map to load before adding markers
      map.current.on('load', () => {
        console.log('Mapbox map loaded successfully');
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
      });

    } catch (error) {
      console.error('Failed to initialize Mapbox map:', error);
    }

    // Cleanup function
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Add job markers to map
  useEffect(() => {
    if (!map.current) return;

    // Wait for map to be loaded before adding markers
    const addMarkersWhenReady = () => {
      // Clear existing markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      // Add current location marker (user location)
      const userLocationEl = document.createElement('div');
      userLocationEl.style.backgroundColor = '#3b82f6';
      userLocationEl.style.width = '16px';
      userLocationEl.style.height = '16px';
      userLocationEl.style.borderRadius = '50%';
      userLocationEl.style.border = '3px solid white';
      userLocationEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      const userMarker = new mapboxgl.Marker(userLocationEl)
        .setLngLat([quebecCenter.lng, quebecCenter.lat])
        .addTo(map.current!);
      
      markers.current.push(userMarker);

      // Add job markers
      todayJobs.forEach(job => {
      const markerColor = job.status === 'emergency' ? '#ef4444' : 
                         job.status === 'confirmed' ? '#10b981' : '#f59e0b';

      // Create marker element
      const el = document.createElement('div');
      el.className = 'job-marker';
      el.style.backgroundColor = markerColor;
      el.style.width = '12px';
      el.style.height = '12px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-3">
          <h3 class="font-semibold text-gray-900 mb-2">${job.title}</h3>
          <div class="space-y-1 text-sm text-gray-600">
            <div>📍 ${job.address}</div>
            <div>👤 ${job.customerName}</div>
            <div>⏱️ ${job.estimatedDuration} minutes</div>
            <div>💰 $${job.hourlyRate}/hour</div>
            <div>🚗 ${job.distance} - ${job.travelTime}</div>
          </div>
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([job.lng, job.lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click event
      el.addEventListener('click', () => {
        setSelectedJob(job);
      });

      markers.current.push(marker);
    });

     // Add emergency job marker if exists
     if (emergencyJobAlert) {
       const el = document.createElement('div');
       el.className = 'emergency-marker animate-pulse';
       el.style.backgroundColor = '#ef4444';
       el.style.width = '16px';
       el.style.height = '16px';
       el.style.borderRadius = '50%';
       el.style.border = '3px solid white';
       el.style.cursor = 'pointer';
       el.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.5)';

       const marker = new mapboxgl.Marker(el)
         .setLngLat([emergencyJobAlert.lng, emergencyJobAlert.lat])
         .addTo(map.current!);

       markers.current.push(marker);
     }
   };

   if (map.current.loaded()) {
     addMarkersWhenReady();
   } else {
     map.current.on('load', addMarkersWhenReady);
   }
  }, [todayJobs, emergencyJobAlert]);

  // Simulate emergency job alert
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!emergencyJobAlert) {
        setEmergencyJobAlert({
          id: 'emergency-1',
          title: 'Burst Pipe Emergency',
          address: '321 Rue de la Paix, Quebec City',
          lat: 46.8156,
          lng: -71.2067,
          type: 'plumbing',
          status: 'emergency',
          hourlyRate: 175,
          estimatedDuration: 60,
          customerName: 'Emergency Service',
          customerPhone: '+1 418-555-9999',
          distance: '0.8 km',
          travelTime: '4 mins'
        });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [emergencyJobAlert]);

  const handleNavigateToJob = (job: JobLocation) => {
    window.open(`https://maps.google.com/maps?daddr=${job.lat},${job.lng}`, '_blank');
  };

  const handleCallCustomer = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleOptimizeRoute = () => {
    setOptimizedRoute(!optimizedRoute);
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

  return (
    <div className="relative h-full w-full">
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
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base flex items-center gap-2">
                {selectedJob.type === 'plumbing' && <Wrench className="h-4 w-4" />}
                {selectedJob.type === 'electrical' && <Zap className="h-4 w-4" />}
                {selectedJob.type === 'hvac' && <Home className="h-4 w-4" />}
                {selectedJob.title}
              </h3>
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

      {/* Mapbox Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg bg-gray-100"
        style={{ minHeight: '500px' }} 
      />
    </div>
  );
};

export default GPSNavigationMap;