import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Shield, MapPin } from 'lucide-react';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicmJuYmxuZGxyZCIsImEiOiJjbWNmdGYzN2wwY2RuMmtwd3M3d2hzM3NxIn0.MZfduMhwltc3eC8V5xYgcQ';

interface PrivacyMiniMapProps {
  isEditing: boolean;
  onPrivacyZoneChange?: (radiusKm: number) => void;
  initialRadius?: number;
}

const PrivacyMiniMap: React.FC<PrivacyMiniMapProps> = ({ 
  isEditing, 
  onPrivacyZoneChange,
  initialRadius = 3
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const privacyCircleSource = useRef<string>('privacy-circle');
  const [privacyRadius, setPrivacyRadius] = useState([initialRadius]);
  
  // Montreal center coordinates
  const montrealCenter: [number, number] = [-73.5673, 45.5017];

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize mini-map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: montrealCenter,
      zoom: 10,
      pitch: 0,
      bearing: 0,
      interactive: false, // Make mini-map non-interactive
      attributionControl: false
    });

    // Add user location marker
    const userMarker = new mapboxgl.Marker({
      color: '#3b82f6',
      scale: 0.8
    })
      .setLngLat(montrealCenter)
      .addTo(map.current);

    // Add privacy circle on map load
    map.current.on('load', () => {
      if (!map.current) return;
      
      // Add source for privacy circle
      map.current.addSource(privacyCircleSource.current, {
        type: 'geojson',
        data: generateCircleGeoJSON(montrealCenter, privacyRadius[0])
      });

      // Add fill layer for privacy zone (translucent red/orange blur)
      map.current.addLayer({
        id: 'privacy-zone-fill',
        type: 'fill',
        source: privacyCircleSource.current,
        paint: {
          'fill-color': ['interpolate', ['linear'], ['zoom'],
            8, '#ff6b35',
            12, '#ff8c42'
          ],
          'fill-opacity': 0.3
        }
      });

      // Add stroke layer for privacy zone
      map.current.addLayer({
        id: 'privacy-zone-stroke',
        type: 'line',
        source: privacyCircleSource.current,
        paint: {
          'line-color': '#ff6b35',
          'line-width': 2,
          'line-opacity': 0.7
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

  // Update privacy circle when radius changes
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const source = map.current.getSource(privacyCircleSource.current) as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(generateCircleGeoJSON(montrealCenter, privacyRadius[0]));
    }

    // Adjust zoom based on radius
    const zoom = privacyRadius[0] <= 2 ? 12 : 
                privacyRadius[0] <= 5 ? 11 : 
                privacyRadius[0] <= 10 ? 10 : 
                privacyRadius[0] <= 15 ? 9 : 8;
    
    map.current.easeTo({ zoom, duration: 500 });
  }, [privacyRadius]);

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
    setPrivacyRadius(value);
    onPrivacyZoneChange?.(value[0]);
  };

  const getPrivacyLevelText = (radius: number) => {
    if (radius <= 1) return 'Maximum Privacy';
    if (radius <= 3) return 'High Privacy';
    if (radius <= 8) return 'Balanced Privacy';
    if (radius <= 15) return 'Open Visibility';
    return 'Wide Visibility';
  };

  return (
    <Card className="bg-card/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-orange-600" />
          Privacy Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mini Map */}
        <div className="relative">
          <div 
            ref={mapContainer}
            className="w-full h-48 rounded-lg shadow-sm border"
            style={{ background: '#f8f9fa' }}
          />
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
            <MapPin className="h-3 w-3 inline mr-1" />
            Your location appears within this area
          </div>
        </div>

        {/* Privacy Radius Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Comfort Zone: {privacyRadius[0]}km
            </Label>
            <span className="text-sm text-muted-foreground">
              {getPrivacyLevelText(privacyRadius[0])}
            </span>
          </div>
          
          <Slider
            value={privacyRadius}
            onValueChange={handleRadiusChange}
            max={25}
            min={0.5}
            step={0.5}
            className="w-full"
            disabled={!isEditing}
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.5km - Max Privacy</span>
            <span>25km - Wide Area</span>
          </div>
        </div>

        {/* Privacy Info */}
        <div className="p-3 bg-orange-50/50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            <Shield className="h-4 w-4 inline mr-1" />
            Your exact location is never shown. Others see you within this fuzzy area for safety and privacy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacyMiniMap;