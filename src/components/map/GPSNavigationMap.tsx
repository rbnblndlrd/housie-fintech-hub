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
  Zap,
  Locate
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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [routeSource, setRouteSource] = useState<string | null>(null);

  // Quebec coordinates (fallback)
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

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Fallback to Quebec coordinates
          setUserLocation(quebecCenter);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      setUserLocation(quebecCenter);
    }
  }, []);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current || !userLocation) return;

    try {
      // Initialize map with user location or fallback
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [userLocation.lng, userLocation.lat],
        zoom: 12,
        attributionControl: false
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Wait for map to load before adding route data
      map.current.on('load', () => {
        console.log('Mapbox map loaded successfully');
        
        // Add route source for drawing routes
        map.current!.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
        });

        // Add route layer
        map.current!.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': 'hsl(221.2, 83.2%, 53.3%)', // Primary blue from design system
            'line-width': 4,
            'line-opacity': 0.8
          }
        });
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
  }, [userLocation]);

  // Create custom marker with job type icon
  const createJobMarker = (job: JobLocation) => {
    const markerColor = job.status === 'emergency' ? '#ef4444' : 
                       job.status === 'confirmed' ? '#10b981' : '#f59e0b';
    
    const jobIcon = job.type === 'plumbing' ? '🔧' :
                   job.type === 'electrical' ? '⚡' :
                   job.type === 'hvac' ? '🏠' : '🛠️';
    
    const el = document.createElement('div');
    el.className = 'job-marker';
    el.innerHTML = `
      <div style="
        background-color: ${markerColor};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        transition: transform 0.2s ease;
      ">${jobIcon}</div>
    `;
    
    // Add hover effect
    el.addEventListener('mouseenter', () => {
      const markerDiv = el.querySelector('div') as HTMLElement;
      if (markerDiv) markerDiv.style.transform = 'scale(1.1)';
    });
    
    el.addEventListener('mouseleave', () => {
      const markerDiv = el.querySelector('div') as HTMLElement;
      if (markerDiv) markerDiv.style.transform = 'scale(1)';
    });
    
    return el;
  };

  // Add job markers to map
  useEffect(() => {
    if (!map.current || !userLocation) return;

    // Wait for map to be loaded before adding markers
    const addMarkersWhenReady = () => {
      // Clear existing markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      // Add user location marker with accuracy circle
      const userLocationEl = document.createElement('div');
      userLocationEl.innerHTML = `
        <div style="
          position: relative;
          width: 20px;
          height: 20px;
        ">
          <div style="
            background-color: rgba(59, 130, 246, 0.2);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            position: absolute;
            top: -10px;
            left: -10px;
            animation: pulse 2s infinite;
          "></div>
          <div style="
            background-color: #3b82f6;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            position: relative;
            z-index: 1;
          "></div>
        </div>
      `;
      
      const userMarker = new mapboxgl.Marker(userLocationEl)
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map.current!);
      
      markers.current.push(userMarker);

      // Add job markers with custom icons
      todayJobs.forEach(job => {
        const el = createJobMarker(job);

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
        el.className = 'emergency-marker';
        el.innerHTML = `
          <div style="
            background-color: #ef4444;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 4px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
            animation: pulse 1.5s infinite;
          ">🚨</div>
        `;

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
  }, [todayJobs, emergencyJobAlert, userLocation]);

  // Update route visualization when optimized
  useEffect(() => {
    if (!map.current || !map.current.loaded() || !userLocation) return;

    if (optimizedRoute) {
      // Create route coordinates (user location + job locations in optimized order)
      const coordinates = [
        [userLocation.lng, userLocation.lat],
        ...todayJobs.map(job => [job.lng, job.lat])
      ];

      // Update route source
      const routeData = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates
        }
      };

      if (map.current.getSource('route')) {
        (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData(routeData);
      }

      // Fit map to show entire route
      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach(coord => bounds.extend(coord as [number, number]));
      map.current.fitBounds(bounds, { padding: 100, duration: 1000 });
    } else {
      // Clear route
      if (map.current.getSource('route')) {
        (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        });
      }
    }
  }, [optimizedRoute, todayJobs, userLocation]);

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

  const handleLocateUser = () => {
    if (userLocation && map.current) {
      map.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 14,
        duration: 1000
      });
    }
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
      <Card className="absolute bottom-24 left-4 z-10 w-72 md:bottom-20">
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

      {/* Locate User Button */}
      <Button
        size="sm"
        variant="outline"
        className="absolute top-20 right-4 z-10 bg-white/90 backdrop-blur-sm"
        onClick={handleLocateUser}
      >
        <Locate className="h-4 w-4" />
      </Button>

      {/* Bottom Action Panel */}
      <Card className="absolute bottom-4 left-4 right-4 z-10">
        <CardContent className="p-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
                Complete
              </Button>
              <Button variant="outline" size="sm" className="text-destructive border-destructive/50">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency
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
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default GPSNavigationMap;