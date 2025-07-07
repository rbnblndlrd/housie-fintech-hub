import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Navigation, 
  Filter, 
  Users, 
  DollarSign, 
  Clock,
  Zap,
  Home,
  Flame,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useMapTheme } from '@/hooks/useMapTheme';
import MapThemeSelector from '@/components/map/MapThemeSelector';
import { usePokemonGOJobs, PokemonGOJob, Provider } from '@/hooks/usePokemonGOJobs';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicmJuYmxuZGxyZCIsImEiOiJjbWNmdGYzN2wwY2RuMmtwd3M3d2hzM3NxIn0.MZfduMhwltc3eC8V5xYgcQ';

interface PokemonGOJobMapProps {
  isDashboard?: boolean;
}

const PokemonGOJobMap: React.FC<PokemonGOJobMapProps> = ({ isDashboard = false }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedJob, setSelectedJob] = useState<PokemonGOJob | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'individual' | 'opportunity' | 'emergency'>('all');
  const { isDark } = useMapTheme();
  
  // Use the Pokemon GO jobs hook
  const { jobs, providers, stats, loading, acceptJob, filterJobs } = usePokemonGOJobs();


  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with theme-based style
    const mapStyle = isDark 
      ? 'mapbox://styles/mapbox/dark-v11'
      : 'mapbox://styles/mapbox/light-v11';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [-73.5673, 45.5017], // Montreal coordinates
      zoom: 12,
      pitch: 45, // Add 3D tilt for Pokemon GO feel
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geolocation control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      if (map.current) {
        map.current.remove();
      }
    };
  }, [isDark]);

  // Update markers when jobs or filters change
  useEffect(() => {
    if (!map.current || loading) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filter jobs based on active filter
    const filteredJobs = filterJobs(activeFilter);

    // Add job markers
    filteredJobs.forEach(job => {
      const markerEl = createJobMarker(job);
      
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([job.coordinates.lng, job.coordinates.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Add provider markers
    providers.forEach(provider => {
      const markerEl = createProviderMarker(provider);
      
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([provider.coordinates.lng, provider.coordinates.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [activeFilter, jobs, providers, loading]);

  const createJobMarker = (job: PokemonGOJob) => {
    const el = document.createElement('div');
    el.className = 'job-marker cursor-pointer transform transition-all duration-200 hover:scale-110';
    
    const getJobColor = () => {
      switch (job.type) {
        case 'individual': return '#3b82f6'; // Blue
        case 'opportunity': return '#f59e0b'; // Gold
        case 'emergency': return '#ef4444'; // Red
        default: return '#3b82f6';
      }
    };

    const getJobIcon = () => {
      switch (job.type) {
        case 'individual': return '🏠';
        case 'opportunity': return '💰';
        case 'emergency': return '🔥';
        default: return '🏠';
      }
    };

    const isPulsing = job.type === 'emergency';

    el.innerHTML = `
      <div class="relative">
        <div class="flex flex-col items-center">
          <div class="
            w-12 h-12 md:w-14 md:h-14 
            rounded-full 
            flex items-center justify-center 
            text-white font-bold text-lg
            shadow-lg border-2 border-white
            ${isPulsing ? 'animate-pulse' : ''}
          " style="background-color: ${getJobColor()}">
            ${getJobIcon()}
          </div>
          <div class="
            mt-1 px-2 py-1 
            bg-white rounded-full 
            text-xs font-bold
            shadow-md border
            min-w-[50px] text-center
          " style="color: ${getJobColor()}">
            $${job.price}
          </div>
        </div>
        ${isPulsing ? '<div class="absolute inset-0 rounded-full border-2 border-red-400 animate-ping"></div>' : ''}
      </div>
    `;

    el.addEventListener('click', () => {
      setSelectedJob(job);
    });

    return el;
  };

  const createProviderMarker = (provider: Provider) => {
    const el = document.createElement('div');
    el.className = 'provider-marker cursor-pointer transform transition-all duration-200 hover:scale-110';
    
    const getProviderColor = () => {
      if (!provider.available) return '#9ca3af'; // Gray
      return provider.type === 'crew' ? '#8b5cf6' : '#10b981'; // Purple for crew, Green for individual
    };

    const getProviderIcon = () => {
      return provider.type === 'crew' ? '👥' : '👤';
    };

    el.innerHTML = `
      <div class="flex flex-col items-center">
        <div class="
          w-10 h-10 md:w-12 md:h-12 
          rounded-full 
          flex items-center justify-center 
          text-white font-bold
          shadow-lg border-2 border-white
          ${provider.available ? '' : 'opacity-50'}
        " style="background-color: ${getProviderColor()}">
          ${getProviderIcon()}
        </div>
        <div class="
          mt-1 px-2 py-1 
          bg-white rounded-full 
          text-xs font-bold text-gray-800
          shadow-md border
          max-w-[80px] text-center truncate
        ">
          ⭐${provider.rating}
        </div>
      </div>
    `;

    return el;
  };

  const handleAcceptJob = async () => {
    if (selectedJob) {
      const success = await acceptJob(selectedJob.id);
      if (success) {
        setSelectedJob(null);
      }
    }
  };

  // Responsive container classes
  const containerClasses = isDashboard 
    ? "w-full h-full" 
    : "absolute inset-0 w-full h-full";

  const containerStyles = isDashboard
    ? { width: '100%', height: '100%' }
    : { width: '100%', height: '100vh' };

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className={containerClasses}
        style={containerStyles}
      />
      
      {/* Mobile-First Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <MapThemeSelector />
        
        {/* Stats Toggle Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowStats(!showStats)}
          className="bg-white/90 backdrop-blur-sm"
        >
          <Activity className="h-4 w-4 mr-2" />
          Stats
        </Button>
        
        {/* Filter Toggle Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white/90 backdrop-blur-sm"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        
        {/* Live Stats */}
        {showStats && (
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Live Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="font-bold text-blue-700">{stats.totalJobs}</div>
                  <div className="text-blue-600">Total Jobs</div>
                </div>
                <div className="bg-red-50 p-2 rounded">
                  <div className="font-bold text-red-700">{stats.emergencyJobs}</div>
                  <div className="text-red-600">Emergency</div>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <div className="font-bold text-green-700">${stats.avgPayment}</div>
                  <div className="text-green-600">Avg Pay</div>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <div className="font-bold text-purple-700">{stats.nearbyProviders}</div>
                  <div className="text-purple-600">Providers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Filter Options */}
        {showFilters && (
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-3 space-y-2">
              {[
                { id: 'all', label: 'All Jobs', icon: '🗺️', count: stats.totalJobs },
                { id: 'individual', label: 'Individual', icon: '🏠', count: filterJobs('individual').length },
                { id: 'opportunity', label: 'Crew Jobs', icon: '💰', count: filterJobs('opportunity').length },
                { id: 'emergency', label: 'Emergency', icon: '🔥', count: filterJobs('emergency').length }
              ].map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setActiveFilter(filter.id as any);
                    setShowFilters(false);
                  }}
                  className="w-full justify-between text-sm"
                >
                  <div className="flex items-center">
                    <span className="mr-2">{filter.icon}</span>
                    {filter.label}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Current Location FAB */}
      <div className="absolute bottom-20 right-4 z-10">
        <Button
          size="sm"
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg"
          onClick={() => {
            navigator.geolocation.getCurrentPosition((position) => {
              map.current?.flyTo({
                center: [position.coords.longitude, position.coords.latitude],
                zoom: 14
              });
            });
          }}
        >
          <Navigation className="h-5 w-5" />
        </Button>
      </div>

      {/* Job Detail Popup */}
      {selectedJob && (
        <div className="absolute inset-x-4 bottom-4 z-20 md:inset-x-auto md:bottom-auto md:top-4 md:right-4 md:w-80">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{selectedJob.title}</h3>
                  <p className="text-sm text-gray-600">{selectedJob.customer}</p>
                </div>
                <Badge 
                  variant={selectedJob.type === 'emergency' ? 'destructive' : 'default'}
                  className="ml-2"
                >
                  {selectedJob.type === 'emergency' && <Flame className="h-3 w-3 mr-1" />}
                  {selectedJob.type.charAt(0).toUpperCase() + selectedJob.type.slice(1)}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-green-600">${selectedJob.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-600">{selectedJob.timeEstimate}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedJob.postedTime}
                  </div>
                </div>
                
                <div className="text-sm">
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-700">{selectedJob.address}</span>
                  </div>
                  <p className="text-gray-600">{selectedJob.description}</p>
                </div>
                
                {selectedJob.requirements && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-700">Requirements:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedJob.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleAcceptJob}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Accept Job
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedJob(null)}
                    className="px-3"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PokemonGOJobMap;