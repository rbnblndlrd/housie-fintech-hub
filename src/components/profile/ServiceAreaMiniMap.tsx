import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MapPin, Briefcase } from 'lucide-react';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicmJuYmxuZGxyZCIsImEiOiJjbWNmdGYzN2wwY2RuMmtwd3M3d2hzM3NxIn0.MZfduMhwltc3eC8V5xYgcQ';

interface ServiceAreaMiniMapProps {
  isEditing: boolean;
  onServiceAreaChange?: (city: string, radiusKm: number) => void;
  initialCity?: string;
  initialRadius?: number;
}

const ServiceAreaMiniMap: React.FC<ServiceAreaMiniMapProps> = ({ 
  isEditing, 
  onServiceAreaChange,
  initialCity = 'Montreal',
  initialRadius = 15
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const serviceCircleSource = useRef<string>('service-circle');
  const [serviceRadius, setServiceRadius] = useState([initialRadius]);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Quebec cities with coordinates
  const quebecCities = [
    { name: 'Montreal', coordinates: [-73.5673, 45.5017] as [number, number], maxRadius: 50 },
    { name: 'Quebec City', coordinates: [-71.2080, 46.8139] as [number, number], maxRadius: 30 },
    { name: 'Laval', coordinates: [-73.6919, 45.6066] as [number, number], maxRadius: 25 },
    { name: 'Longueuil', coordinates: [-73.5301, 45.5372] as [number, number], maxRadius: 20 },
    { name: 'Gatineau', coordinates: [-75.7035, 45.4765] as [number, number], maxRadius: 25 },
    { name: 'Sherbrooke', coordinates: [-71.8991, 45.4042] as [number, number], maxRadius: 20 },
    { name: 'Trois-Rivières', coordinates: [-72.5477, 46.3448] as [number, number], maxRadius: 15 }
  ];

  const currentCity = quebecCities.find(city => city.name === selectedCity) || quebecCities[0];

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize mini-map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: currentCity.coordinates,
      zoom: 10,
      pitch: 0,
      bearing: 0,
      interactive: false, // Make mini-map non-interactive
      attributionControl: false
    });

    // Add business location marker
    const businessMarker = new mapboxgl.Marker({
      color: '#22c55e',
      scale: 0.8
    })
      .setLngLat(currentCity.coordinates)
      .addTo(map.current);

    // Add service area circle on map load
    map.current.on('load', () => {
      if (!map.current) return;
      
      // Add source for service circle
      map.current.addSource(serviceCircleSource.current, {
        type: 'geojson',
        data: generateCircleGeoJSON(currentCity.coordinates, serviceRadius[0])
      });

      // Add fill layer for service area (solid green)
      map.current.addLayer({
        id: 'service-area-fill',
        type: 'fill',
        source: serviceCircleSource.current,
        paint: {
          'fill-color': '#22c55e',
          'fill-opacity': 0.2
        }
      });

      // Add stroke layer for service area
      map.current.addLayer({
        id: 'service-area-stroke',
        type: 'line',
        source: serviceCircleSource.current,
        paint: {
          'line-color': '#22c55e',
          'line-width': 3,
          'line-opacity': 0.8
        }
      });
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Update service circle when radius or city changes
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const source = map.current.getSource(serviceCircleSource.current) as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(generateCircleGeoJSON(currentCity.coordinates, serviceRadius[0]));
    }

    // Update map center and zoom
    const zoom = serviceRadius[0] <= 5 ? 12 : 
                serviceRadius[0] <= 15 ? 10 : 
                serviceRadius[0] <= 30 ? 9 : 8;
    
    map.current.easeTo({ 
      center: currentCity.coordinates, 
      zoom, 
      duration: 500 
    });
  }, [serviceRadius, selectedCity, currentCity]);

  const generateCircleGeoJSON = (center: [number, number], radiusKm: number) => {
    const points = 64;
    const coords: number[][] = [];
    const radiusInRadians = (radiusKm * 1000) / 6371000; // Earth radius in meters

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const lat = center[1] + (radiusInRadians * Math.sin(angle)) * (180 / Math.PI);
      const lng = center[0] + (radiusInRadians * Math.cos(angle)) * (180 / Math.PI) / Math.cos(center[1] * Math.PI / 180);
      coords.push([lng, lat]);
    }
    coords.push(coords[0]); // Close the polygon

    return {
      type: 'Feature' as const,
      geometry: {
        type: 'Polygon' as const,
        coordinates: [coords]
      },
      properties: {}
    };
  };

  const handleRadiusChange = (value: number[]) => {
    const maxRadius = currentCity.maxRadius;
    const clampedValue = Math.min(value[0], maxRadius);
    setServiceRadius([clampedValue]);
    onServiceAreaChange?.(selectedCity, clampedValue);
  };

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    setShowSuggestions(false);
    // Reset radius to a reasonable default for the new city
    const newCity = quebecCities.find(city => city.name === cityName);
    if (newCity) {
      const defaultRadius = Math.min(15, newCity.maxRadius);
      setServiceRadius([defaultRadius]);
      onServiceAreaChange?.(cityName, defaultRadius);
    }
  };

  const getServiceAreaText = (radius: number) => {
    if (radius <= 5) return `${radius}km - Local`;
    if (radius <= 15) return `${radius}km - Regional`;
    if (radius >= currentCity.maxRadius) return `All of ${selectedCity}`;
    return `${radius}km - Extended`;
  };

  const filteredCities = quebecCities.filter(city => 
    city.name.toLowerCase().includes(selectedCity.toLowerCase())
  );

  return (
    <Card className="bg-card/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-green-600" />
          Service Coverage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* City Input */}
        <div className="relative">
          <Label className="text-sm font-medium">Service City</Label>
          <Input
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Enter city name (e.g. Montreal)"
            disabled={!isEditing}
            className="mt-1"
          />
          
          {/* City Suggestions */}
          {showSuggestions && isEditing && filteredCities.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-32 overflow-y-auto">
              {filteredCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleCityChange(city.name)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                >
                  {city.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mini Map */}
        <div className="relative">
          <div 
            ref={mapContainer}
            className="w-full h-48 rounded-lg shadow-sm border"
            style={{ background: '#f8f9fa' }}
          />
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
            <MapPin className="h-3 w-3 inline mr-1" />
            You will receive job opportunities within this area
          </div>
        </div>

        {/* Service Radius Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Coverage: {getServiceAreaText(serviceRadius[0])}
            </Label>
            <span className="text-sm text-muted-foreground">
              Max: {currentCity.maxRadius}km
            </span>
          </div>
          
          <Slider
            value={serviceRadius}
            onValueChange={handleRadiusChange}
            max={currentCity.maxRadius}
            min={5}
            step={5}
            className="w-full"
            disabled={!isEditing}
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5km - Local</span>
            <span>15km - Regional</span>
            <span>{currentCity.maxRadius}km - City Wide</span>
          </div>
        </div>

        {/* Service Info */}
        <div className="p-3 bg-green-50/50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <Briefcase className="h-4 w-4 inline mr-1" />
            Jobs within your service area will appear on the map. Expand coverage to reach more opportunities.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceAreaMiniMap;