
import React, { useState } from 'react';
import { GoogleMap as ReactGoogleMap, LoadScript, Polygon, InfoWindow } from '@react-google-maps/api';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  MapPin, 
  TrendingUp, 
  Filter
} from 'lucide-react';

interface HeatZone {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number }[];
  center: { lat: number; lng: number };
  demandLevel: number;
  availableProviders: number;
  professions: {
    [key: string]: {
      demand: number;
      providers: number;
      trending: 'up' | 'down' | 'stable';
    };
  };
  zoneType: 'residential' | 'commercial' | 'mixed';
  description: string;
}

interface HeatZoneMapProps {
  userRole: 'customer' | 'provider';
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '380px'
};

const mapOptions = {
  styles: [
    {
      featureType: "all",
      elementType: "geometry.fill",
      stylers: [{ color: "#fef7cd" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17a2b8" }]
    }
  ]
};

// Mock heat zone data
const mockHeatZones: HeatZone[] = [
  {
    id: "downtown-toronto",
    name: "Downtown Toronto",
    coordinates: [
      { lat: 43.6532, lng: -79.3832 },
      { lat: 43.6532, lng: -79.3732 },
      { lat: 43.6432, lng: -79.3732 },
      { lat: 43.6432, lng: -79.3832 }
    ],
    center: { lat: 43.6482, lng: -79.3782 },
    demandLevel: 85,
    availableProviders: 12,
    professions: {
      cleaning: { demand: 90, providers: 8, trending: 'up' },
      handyman: { demand: 75, providers: 5, trending: 'stable' },
      moving: { demand: 95, providers: 2, trending: 'up' }
    },
    zoneType: 'commercial',
    description: 'High-density commercial area with consistent service demand'
  },
  {
    id: "north-york",
    name: "North York Residential",
    coordinates: [
      { lat: 43.7615, lng: -79.4111 },
      { lat: 43.7615, lng: -79.4011 },
      { lat: 43.7515, lng: -79.4011 },
      { lat: 43.7515, lng: -79.4111 }
    ],
    center: { lat: 43.7565, lng: -79.4061 },
    demandLevel: 65,
    availableProviders: 18,
    professions: {
      lawncare: { demand: 80, providers: 12, trending: 'up' },
      cleaning: { demand: 60, providers: 8, trending: 'stable' }
    },
    zoneType: 'residential',
    description: 'Suburban residential area with seasonal service peaks'
  },
  {
    id: "etobicoke",
    name: "Etobicoke Mixed Zone",
    coordinates: [
      { lat: 43.6204, lng: -79.5204 },
      { lat: 43.6204, lng: -79.5104 },
      { lat: 43.6104, lng: -79.5104 },
      { lat: 43.6104, lng: -79.5204 }
    ],
    center: { lat: 43.6154, lng: -79.5154 },
    demandLevel: 45,
    availableProviders: 22,
    professions: {
      plumbing: { demand: 50, providers: 10, trending: 'stable' },
      electrical: { demand: 40, providers: 8, trending: 'down' }
    },
    zoneType: 'mixed',
    description: 'Mixed residential-commercial area with moderate demand'
  }
];

const professionOptions = [
  { value: 'all', label: 'All Services' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'handyman', label: 'Handyman' },
  { value: 'lawncare', label: 'Lawn Care' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'moving', label: 'Moving' }
];

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

const HeatZoneMap: React.FC<HeatZoneMapProps> = ({ userRole }) => {
  const [selectedZone, setSelectedZone] = useState<HeatZone | null>(null);
  const [selectedProfession, setSelectedProfession] = useState('all');
  const [demandThreshold, setDemandThreshold] = useState([0]);

  const getDemandColor = (demandLevel: number, availableProviders: number) => {
    const ratio = demandLevel / Math.max(availableProviders * 5, 1);
    
    if (ratio > 3) return '#10b981'; // High opportunity - green
    if (ratio > 2) return '#3b82f6'; // Good opportunity - blue  
    if (ratio > 1) return '#f59e0b'; // Moderate opportunity - yellow
    return '#6b7280'; // Low opportunity - gray
  };

  const getDemandOpacity = (demandLevel: number) => {
    return Math.min(0.1 + (demandLevel / 100) * 0.4, 0.5);
  };

  const filteredZones = mockHeatZones.filter(zone => {
    if (selectedProfession === 'all') return zone.demandLevel >= demandThreshold[0];
    
    const professionData = zone.professions[selectedProfession];
    return professionData && professionData.demand >= demandThreshold[0];
  });

  const center = { lat: 43.6532, lng: -79.3832 };

  return (
    <div className="w-full h-full">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={selectedProfession} onValueChange={setSelectedProfession}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {professionOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">Min Demand:</span>
            <Slider
              value={demandThreshold}
              onValueChange={setDemandThreshold}
              max={100}
              step={10}
              className="w-20"
            />
            <span className="text-xs text-gray-600">{demandThreshold[0]}%</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>High Opportunity</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Good</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>Low</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <LoadScript 
        googleMapsApiKey="AIzaSyAJXkmufaWRLR5t4iFFp4qupryDKNZZO9o"
        libraries={libraries}
      >
        <ReactGoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={11}
          options={mapOptions}
        >
          {filteredZones.map(zone => {
            const demandLevel = selectedProfession === 'all' 
              ? zone.demandLevel 
              : zone.professions[selectedProfession]?.demand || 0;
            
            return (
              <Polygon
                key={zone.id}
                paths={zone.coordinates}
                onClick={() => setSelectedZone(zone)}
                options={{
                  fillColor: getDemandColor(demandLevel, zone.availableProviders),
                  fillOpacity: getDemandOpacity(demandLevel),
                  strokeColor: getDemandColor(demandLevel, zone.availableProviders),
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  clickable: true,
                }}
              />
            );
          })}
          
          {selectedZone && (
            <InfoWindow
              position={selectedZone.center}
              onCloseClick={() => setSelectedZone(null)}
            >
              <div className="p-3 max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{selectedZone.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {selectedZone.zoneType}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{selectedZone.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Demand Level:</span>
                    <Badge variant={selectedZone.demandLevel > 70 ? 'default' : 'secondary'}>
                      {selectedZone.demandLevel}%
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Available Providers:</span>
                    <span className="text-sm">{selectedZone.availableProviders}</span>
                  </div>
                  
                  {selectedProfession !== 'all' && selectedZone.professions[selectedProfession] && (
                    <div className="border-t pt-2 mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {professionOptions.find(p => p.value === selectedProfession)?.label}:
                        </span>
                        {selectedZone.professions[selectedProfession].trending === 'up' && (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                      <div className="text-xs text-gray-600">
                        Demand: {selectedZone.professions[selectedProfession].demand}% | 
                        Providers: {selectedZone.professions[selectedProfession].providers}
                      </div>
                    </div>
                  )}
                </div>

                {userRole === 'provider' && (
                  <Button size="sm" className="w-full mt-3">
                    <MapPin className="h-3 w-3 mr-1" />
                    Set as Target Area
                  </Button>
                )}
              </div>
            </InfoWindow>
          )}
        </ReactGoogleMap>
      </LoadScript>
    </div>
  );
};

export default HeatZoneMap;
