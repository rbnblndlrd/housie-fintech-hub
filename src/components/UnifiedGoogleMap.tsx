import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, Circle, InfoWindow, Polygon, Polyline } from '@react-google-maps/api';
import { Provider } from "@/types/service";
import { GOOGLE_MAPS_API_KEY, mapOptions } from './map/GoogleMapConfig';
import { useGoogleMaps } from './map/GoogleMapsProvider';
import { useQuebecData } from '@/hooks/useQuebecData';
import { useProviderIntelligence } from '@/hooks/useProviderIntelligence';
import { useFleetOperations } from '@/hooks/useFleetOperations';

interface UnifiedGoogleMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  className?: string;
  providers?: Provider[];
  hoveredProviderId?: string | null;
  onProviderClick?: (provider: Provider) => void;
  mode?: 'services' | 'interactive' | 'privacy' | 'heatZones';
  children?: React.ReactNode;
  mapStyles?: google.maps.MapTypeStyle[];
  enabledLayers?: Record<string, boolean>;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '300px'
};

export const UnifiedGoogleMap: React.FC<UnifiedGoogleMapProps> = ({
  center,
  zoom,
  className = "",
  providers = [],
  hoveredProviderId = null,
  onProviderClick,
  mode = 'services',
  children,
  mapStyles,
  enabledLayers = {}
}) => {
  const { isLoaded, loadError } = useGoogleMaps();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const { crimeData, demographicData, serviceData } = useQuebecData();
  const { 
    demandData, 
    competitionData, 
    tipData, 
    opportunityData 
  } = useProviderIntelligence();
  const {
    activeVehicles,
    currentJobs,
    performanceZones,
    routeOptimization
  } = useFleetOperations();

  // Debug logging for mapStyles changes
  useEffect(() => {
    console.log('🗺️ UnifiedGoogleMap: mapStyles updated:', {
      hasStyles: !!mapStyles,
      stylesLength: mapStyles?.length || 0,
      firstStyleType: mapStyles?.[0]?.featureType || 'none'
    });
  }, [mapStyles]);

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log('✅ Unified Google Map loaded successfully');
    setMap(map);
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    console.log('🧹 Cleaning up Unified Google Map');
    setMap(null);
  }, []);

  const handleMarkerClick = (provider: Provider) => {
    setSelectedProvider(provider);
    if (onProviderClick) {
      onProviderClick(provider);
    }
  };

  const getMarkerIcon = (availability: string) => {
    if (!window.google?.maps?.SymbolPath) {
      return undefined;
    }
    
    try {
      return {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: availability === 'Available' ? '#10b981' : '#f59e0b',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2
      };
    } catch (error) {
      console.error('Error creating marker icon:', error);
      return undefined;
    }
  };

  // Create map options with custom styles if provided
  const customMapOptions = {
    ...mapOptions,
    ...(mapStyles && { styles: mapStyles })
  };

  // Debug logging for custom map options
  console.log('🗺️ UnifiedGoogleMap render:', {
    hasMapStyles: !!mapStyles,
    stylesLength: mapStyles?.length || 0,
    customMapOptionsHasStyles: !!customMapOptions.styles,
    mode
  });

  // Find hovered provider
  const hoveredProvider = providers.find(p => p.id && p.id.toString() === hoveredProviderId);

  // Quebec data area polygons for Customer Mode
  const quebecAreaPolygons = {
    'Montreal Downtown': [
      { lat: 45.501, lng: -73.567 },
      { lat: 45.515, lng: -73.567 },
      { lat: 45.515, lng: -73.545 },
      { lat: 45.501, lng: -73.545 }
    ],
    'Longueuil': [
      { lat: 45.531, lng: -73.518 },
      { lat: 45.545, lng: -73.518 },
      { lat: 45.545, lng: -73.496 },
      { lat: 45.531, lng: -73.496 }
    ],
    'Laval': [
      { lat: 45.570, lng: -73.692 },
      { lat: 45.584, lng: -73.692 },
      { lat: 45.584, lng: -73.670 },
      { lat: 45.570, lng: -73.670 }
    ],
    'Gatineau': [
      { lat: 45.477, lng: -75.701 },
      { lat: 45.491, lng: -75.701 },
      { lat: 45.491, lng: -75.679 },
      { lat: 45.477, lng: -75.679 }
    ]
  };

  // Completely different area polygons for each layer type
  const demandPolygons = {
    'NDG Residential': [
      { lat: 45.470, lng: -73.625 },
      { lat: 45.485, lng: -73.625 },
      { lat: 45.485, lng: -73.605 },
      { lat: 45.470, lng: -73.605 }
    ],
    'McGill University Area': [
      { lat: 45.500, lng: -73.582 },
      { lat: 45.510, lng: -73.582 },
      { lat: 45.510, lng: -73.572 },
      { lat: 45.500, lng: -73.572 }
    ],
    'Concordia Campus Zone': [
      { lat: 45.492, lng: -73.585 },
      { lat: 45.502, lng: -73.585 },
      { lat: 45.502, lng: -73.572 },
      { lat: 45.492, lng: -73.572 }
    ],
    'Plateau Residential': [
      { lat: 45.520, lng: -73.585 },
      { lat: 45.530, lng: -73.585 },
      { lat: 45.530, lng: -73.570 },
      { lat: 45.520, lng: -73.570 }
    ],
    'Rosemont Family District': [
      { lat: 45.546, lng: -73.590 },
      { lat: 45.557, lng: -73.590 },
      { lat: 45.557, lng: -73.569 },
      { lat: 45.546, lng: -73.569 }
    ],
    'Brossard Suburbs': [
      { lat: 45.453, lng: -73.480 },
      { lat: 45.463, lng: -73.480 },
      { lat: 45.463, lng: -73.456 },
      { lat: 45.453, lng: -73.456 }
    ],
    'Laval University Hub': [
      { lat: 46.773, lng: -71.285 },
      { lat: 46.783, lng: -71.285 },
      { lat: 46.783, lng: -71.266 },
      { lat: 46.773, lng: -71.266 }
    ],
    'Dollard-des-Ormeaux': [
      { lat: 45.489, lng: -73.834 },
      { lat: 45.499, lng: -73.834 },
      { lat: 45.499, lng: -73.814 },
      { lat: 45.489, lng: -73.814 }
    ]
  };

  const competitionPolygons = {
    'St-Laurent Business Strip': [
      { lat: 45.525, lng: -73.630 },
      { lat: 45.540, lng: -73.630 },
      { lat: 45.540, lng: -73.608 },
      { lat: 45.525, lng: -73.608 }
    ],
    'Cavendish Mall Corridor': [
      { lat: 45.454, lng: -73.640 },
      { lat: 45.466, lng: -73.640 },
      { lat: 45.466, lng: -73.618 },
      { lat: 45.454, lng: -73.618 }
    ],
    'Technoparc Montreal': [
      { lat: 45.500, lng: -73.665 },
      { lat: 45.511, lng: -73.665 },
      { lat: 45.511, lng: -73.635 },
      { lat: 45.500, lng: -73.635 }
    ],
    'Marché Central': [
      { lat: 45.539, lng: -73.660 },
      { lat: 45.550, lng: -73.660 },
      { lat: 45.550, lng: -73.637 },
      { lat: 45.539, lng: -73.637 }
    ],
    'Quartier DIX30': [
      { lat: 45.498, lng: -73.476 },
      { lat: 45.509, lng: -73.476 },
      { lat: 45.509, lng: -73.455 },
      { lat: 45.498, lng: -73.455 }
    ],
    'Anjou Industrial Park': [
      { lat: 45.600, lng: -73.556 },
      { lat: 45.611, lng: -73.556 },
      { lat: 45.611, lng: -73.535 },
      { lat: 45.600, lng: -73.535 }
    ],
    'Galeries d\'Anjou Area': [
      { lat: 45.603, lng: -73.570 },
      { lat: 45.614, lng: -73.570 },
      { lat: 45.614, lng: -73.549 },
      { lat: 45.603, lng: -73.549 }
    ]
  };

  const tipPolygons = {
    'Westmount Luxury': [
      { lat: 45.479, lng: -73.602 },
      { lat: 45.490, lng: -73.602 },
      { lat: 45.490, lng: -73.581 },
      { lat: 45.479, lng: -73.581 }
    ],
    'Outremont Affluent': [
      { lat: 45.513, lng: -73.616 },
      { lat: 45.524, lng: -73.616 },
      { lat: 45.524, lng: -73.595 },
      { lat: 45.513, lng: -73.595 }
    ],
    'Town of Mount Royal': [
      { lat: 45.507, lng: -73.640 },
      { lat: 45.518, lng: -73.640 },
      { lat: 45.518, lng: -73.619 },
      { lat: 45.507, lng: -73.619 }
    ],
    'Beaconsfield Waterfront': [
      { lat: 45.421, lng: -73.872 },
      { lat: 45.432, lng: -73.872 },
      { lat: 45.432, lng: -73.851 },
      { lat: 45.421, lng: -73.851 }
    ],
    'Kirkland Executive': [
      { lat: 45.441, lng: -73.855 },
      { lat: 45.452, lng: -73.855 },
      { lat: 45.452, lng: -73.835 },
      { lat: 45.441, lng: -73.835 }
    ],
    'Brossard Professionals': [
      { lat: 45.445, lng: -73.452 },
      { lat: 45.456, lng: -73.452 },
      { lat: 45.456, lng: -73.432 },
      { lat: 45.445, lng: -73.432 }
    ],
    'Laval Executive District': [
      { lat: 45.559, lng: -73.734 },
      { lat: 45.570, lng: -73.734 },
      { lat: 45.570, lng: -73.713 },
      { lat: 45.559, lng: -73.713 }
    ],
    'Dollard Professionals': [
      { lat: 45.487, lng: -73.850 },
      { lat: 45.498, lng: -73.850 },
      { lat: 45.498, lng: -73.830 },
      { lat: 45.487, lng: -73.830 }
    ]
  };

  const opportunityPolygons = {
    'Pierrefonds Growth Zone': [
      { lat: 45.489, lng: -73.870 },
      { lat: 45.500, lng: -73.870 },
      { lat: 45.500, lng: -73.849 },
      { lat: 45.489, lng: -73.849 }
    ],
    'Ste-Dorothée Emerging': [
      { lat: 45.560, lng: -73.812 },
      { lat: 45.571, lng: -73.812 },
      { lat: 45.571, lng: -73.790 },
      { lat: 45.560, lng: -73.790 }
    ],
    'Rivière-des-Prairies': [
      { lat: 45.640, lng: -73.509 },
      { lat: 45.651, lng: -73.509 },
      { lat: 45.651, lng: -73.488 },
      { lat: 45.640, lng: -73.488 }
    ],
    'Pointe-aux-Trembles': [
      { lat: 45.682, lng: -73.506 },
      { lat: 45.693, lng: -73.506 },
      { lat: 45.693, lng: -73.485 },
      { lat: 45.682, lng: -73.485 }
    ],
    'Candiac New Development': [
      { lat: 45.380, lng: -73.526 },
      { lat: 45.391, lng: -73.526 },
      { lat: 45.391, lng: -73.505 },
      { lat: 45.380, lng: -73.505 }
    ],
    'Mirabel Airport Region': [
      { lat: 45.673, lng: -74.047 },
      { lat: 45.684, lng: -74.047 },
      { lat: 45.684, lng: -74.026 },
      { lat: 45.673, lng: -74.026 }
    ],
    'Vaudreuil-Dorion': [
      { lat: 45.396, lng: -74.040 },
      { lat: 45.407, lng: -74.040 },
      { lat: 45.407, lng: -74.018 },
      { lat: 45.396, lng: -74.018 }
    ],
    'Terrebonne Expansion': [
      { lat: 45.695, lng: -73.656 },
      { lat: 45.706, lng: -73.656 },
      { lat: 45.706, lng: -73.635 },
      { lat: 45.695, lng: -73.635 }
    ]
  };

  if (loadError) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center p-6">
          <div className="text-red-600 mb-3 text-xl">🗺️ Maps Loading Error</div>
          <p className="text-gray-700 mb-2 font-medium">Google Maps failed to load</p>
          
          <div className="text-sm text-gray-600 space-y-1">
            {loadError.message.includes('RefererNotAllowedMapError') ? (
              <>
                <p className="text-red-600 font-medium">🚨 Domain Authorization Error</p>
                <p>Your Google Maps API key is not authorized for this domain</p>
                <p className="mt-2"><strong>Fix:</strong> Go to Google Cloud Console → APIs & Services → Credentials</p>
                <p>Add this domain to your API key restrictions:</p>
                <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                  *.lovable.app
                </p>
              </>
            ) : (
              <>
                <p className="text-red-600 font-medium">Error: {loadError.message}</p>
                {import.meta.env.DEV ? (
                  <p>🏠 <strong>Development:</strong> Check your .env file and API key</p>
                ) : (
                  <p>🚀 <strong>Production:</strong> Check GitHub Actions environment variables</p>
                )}
              </>
            )}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
            <p><strong>Build Mode:</strong> {import.meta.env.MODE}</p>
            <p><strong>Environment:</strong> {import.meta.env.DEV ? 'Development' : 'Production'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center p-6">
          <div className="text-red-600 mb-3 text-xl">🗺️ Maps Configuration Required</div>
          <p className="text-gray-700 mb-2 font-medium">Google Maps API key not configured</p>
          
          <div className="text-sm text-gray-600 space-y-1">
            {import.meta.env.DEV ? (
              <>
                <p>🏠 <strong>Development:</strong> Add VITE_GOOGLE_MAPS_API_KEY to your .env file</p>
                <p>📁 Create .env in project root with your API key</p>
              </>
            ) : (
              <>
                <p>🚀 <strong>Production:</strong> Check GitHub Actions workflow</p>
                <p>🔐 Ensure VITE_GOOGLE_MAPS_API_KEY secret is set in GitHub</p>
                <p>⚙️ Verify workflow injects the environment variable during build</p>
              </>
            )}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
            <p><strong>Build Mode:</strong> {import.meta.env.MODE}</p>
            <p><strong>Environment:</strong> {import.meta.env.DEV ? 'Development' : 'Production'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Montreal map...</p>
          <p className="text-xs text-gray-500 mt-1">
            {import.meta.env.DEV ? 'Development' : 'Production'} Mode
          </p>
        </div>
      </div>
    );
  }

  // Create Quebec data overlays based on enabled layers
  const renderQuebecOverlays = () => {
    const overlays = [];

    // Crime Heat Map Overlay
    if (enabledLayers.crime && crimeData.length > 0) {
      crimeData.forEach((crime, index) => {
        const safetyScore = crime.area === 'Montreal Downtown' ? 7.8 :
                           crime.area === 'Longueuil' ? 8.5 :
                           crime.area === 'Laval' ? 8.2 : 9.2;
        
        const polygon = quebecAreaPolygons[crime.area as keyof typeof quebecAreaPolygons];
        if (polygon) {
          const redIntensity = Math.max(0.2, (10 - safetyScore) / 10);
          
          overlays.push(
            <Polygon
              key={`crime-${index}`}
              paths={polygon}
              options={{
                fillColor: '#ef4444',
                fillOpacity: redIntensity * 0.5,
                strokeColor: '#dc2626',
                strokeOpacity: 0.8,
                strokeWeight: 2
              }}
            />
          );
        }
      });
    }

    // Demographics Income Overlay
    if (enabledLayers.demographics && demographicData.length > 0) {
      demographicData.forEach((demo, index) => {
        const polygon = quebecAreaPolygons[demo.area as keyof typeof quebecAreaPolygons];
        if (polygon) {
          const blueIntensity = Math.min(1, demo.avgIncome / 100000);
          
          overlays.push(
            <Polygon
              key={`demo-${index}`}
              paths={polygon}
              options={{
                fillColor: '#3b82f6',
                fillOpacity: blueIntensity * 0.4,
                strokeColor: '#2563eb',
                strokeOpacity: 0.6,
                strokeWeight: 1
              }}
            />
          );
        }
      });
    }

    // Service Provider Density Overlay
    if (enabledLayers.services && serviceData.length > 0) {
      serviceData.forEach((service, index) => {
        const providerCount = service.area === 'Montreal Downtown' ? 245 :
                             service.area === 'Longueuil' ? 89 :
                             service.area === 'Laval' ? 156 : 67;

        const markersToShow = Math.min(10, Math.ceil(providerCount / 25));
        
        for (let i = 0; i < markersToShow; i++) {
          const offsetLat = (Math.random() - 0.5) * 0.02;
          const offsetLng = (Math.random() - 0.5) * 0.02;
          
          overlays.push(
            <Marker
              key={`service-${index}-${i}`}
              position={{
                lat: service.lat + offsetLat,
                lng: service.lng + offsetLng
              }}
              icon={{
                path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                scale: 6,
                fillColor: '#22c55e',
                fillOpacity: 0.8,
                strokeColor: '#16a34a',
                strokeWeight: 1
              }}
            />
          );
        }
      });
    }

    return overlays;
  };

  // Create Provider Mode overlays with completely independent geographic areas
  const renderProviderOverlays = () => {
    const overlays = [];

    // Demand Hot Zones (Orange) - Residential & Student Areas
    if (enabledLayers.demand && demandData.length > 0) {
      demandData.forEach((area, index) => {
        const polygon = demandPolygons[area.area as keyof typeof demandPolygons];
        if (polygon) {
          const demandIntensity = Math.min(1, area.demandScore / 100);
          
          overlays.push(
            <Polygon
              key={`demand-${index}`}
              paths={polygon}
              options={{
                fillColor: '#f97316',
                fillOpacity: demandIntensity * 0.7,
                strokeColor: '#ea580c',
                strokeOpacity: 0.9,
                strokeWeight: 2
              }}
            />
          );
        }
      });
    }

    // Competition Analysis (Red) - Commercial Corridors & Business Parks
    if (enabledLayers.competition && competitionData.length > 0) {
      competitionData.forEach((area, index) => {
        const polygon = competitionPolygons[area.area as keyof typeof competitionPolygons];
        if (polygon) {
          const competitionIntensity = Math.min(1, area.marketSaturation);
          
          overlays.push(
            <Polygon
              key={`competition-${index}`}
              paths={polygon}
              options={{
                fillColor: '#dc2626',
                fillOpacity: competitionIntensity * 0.6,
                strokeColor: '#b91c1c',
                strokeOpacity: 0.8,
                strokeWeight: 2
              }}
            />
          );
        }
      });
    }

    // Tip Zone Mapping (Gold) - Wealth Clusters
    if (enabledLayers.tips && tipData.length > 0) {
      tipData.forEach((area, index) => {
        const polygon = tipPolygons[area.area as keyof typeof tipPolygons];
        if (polygon) {
          const tipIntensity = Math.min(1, area.spendingIndex / 2);
          
          overlays.push(
            <Polygon
              key={`tips-${index}`}
              paths={polygon}
              options={{
                fillColor: '#eab308',
                fillOpacity: tipIntensity * 0.65,
                strokeColor: '#ca8a04',
                strokeOpacity: 0.8,
                strokeWeight: 2
              }}
            />
          );
        }
      });
    }

    // Opportunity Areas (Green) - Growth Zones & Market Gaps
    if (enabledLayers.opportunity && opportunityData.length > 0) {
      opportunityData.forEach((area, index) => {
        const polygon = opportunityPolygons[area.area as keyof typeof opportunityPolygons];
        if (polygon) {
          const opportunityIntensity = Math.min(1, area.marketGap / 3);
          
          overlays.push(
            <Polygon
              key={`opportunity-${index}`}
              paths={polygon}
              options={{
                fillColor: '#16a34a',
                fillOpacity: opportunityIntensity * 0.6,
                strokeColor: '#15803d',
                strokeOpacity: 0.8,
                strokeWeight: 2
              }}
            />
          );
        }
      });
    }

    return overlays;
  };

  // Create Fleet Manager overlays
  const renderFleetManagerOverlays = () => {
    const overlays = [];

    // Live Fleet Tracking (Blue vehicle icons)
    if (enabledLayers.fleetTracking && activeVehicles.length > 0) {
      activeVehicles.forEach((vehicle, index) => {
        const statusColor = vehicle.status === 'active' ? '#10b981' :
                           vehicle.status === 'en-route' ? '#3b82f6' :
                           vehicle.status === 'available' ? '#f59e0b' : '#6b7280';

        overlays.push(
          <Marker
            key={`fleet-vehicle-${index}`}
            position={{ lat: vehicle.lat, lng: vehicle.lng }}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
              scale: 12,
              fillColor: statusColor,
              fillOpacity: 0.9,
              strokeColor: '#ffffff',
              strokeWeight: 3
            }}
            title={`${vehicle.id} - ${vehicle.driverName} (${vehicle.status})`}
          />
        );
      });
    }

    // Job Distribution (Purple zones showing workload density)
    if (enabledLayers.jobDistribution && currentJobs.length > 0) {
      currentJobs.forEach((job, index) => {
        const intensityRadius = job.priority === 'high' ? 2000 :
                               job.priority === 'medium' ? 1500 : 1000;
        
        overlays.push(
          <Circle
            key={`job-zone-${index}`}
            center={{ lat: job.lat, lng: job.lng }}
            radius={intensityRadius}
            options={{
              fillColor: '#8b5cf6',
              fillOpacity: job.priority === 'high' ? 0.4 : job.priority === 'medium' ? 0.3 : 0.2,
              strokeColor: '#7c3aed',
              strokeOpacity: 0.6,
              strokeWeight: 2
            }}
          />
        );
      });
    }

    // Performance Zones (Green gradients showing profitable areas)
    if (enabledLayers.performanceZones && performanceZones.length > 0) {
      performanceZones.forEach((zone, index) => {
        const performanceIntensity = Math.min(1, zone.revenuePerHour / 120);
        const radius = 1800 + (zone.jobCount * 10);
        
        overlays.push(
          <Circle
            key={`performance-zone-${index}`}
            center={{ lat: zone.lat, lng: zone.lng }}
            radius={radius}
            options={{
              fillColor: '#16a34a',
              fillOpacity: performanceIntensity * 0.5,
              strokeColor: '#15803d',
              strokeOpacity: 0.7,
              strokeWeight: 2
            }}
          />
        );
      });
    }

    // Route Optimization (Colored lines showing optimized paths)
    if (enabledLayers.routeOptimization && routeOptimization.length > 0) {
      routeOptimization.forEach((route, index) => {
        const pathCoordinates = route.route.map(point => ({
          lat: point.lat,
          lng: point.lng
        }));

        if (pathCoordinates.length > 1) {
          overlays.push(
            <Polyline
              key={`route-${index}`}
              path={pathCoordinates}
              options={{
                strokeColor: index % 2 === 0 ? '#f97316' : '#06b6d4',
                strokeOpacity: 0.8,
                strokeWeight: 4,
                icons: [{
                  icon: {
                    path: window.google?.maps?.SymbolPath?.FORWARD_CLOSED_ARROW || 0,
                    scale: 3,
                    strokeColor: '#ffffff'
                  },
                  offset: '100%',
                  repeat: '200px'
                }]
              }}
            />
          );
        }
      });
    }

    return overlays;
  };

  return (
    <div className={`w-full h-full rounded-lg ${className}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={customMapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Provider Markers - Only show in services/interactive modes */}
        {(mode === 'services' || mode === 'interactive') && providers.map(provider => (
          <Marker
            key={provider.id}
            position={{ lat: provider.lat, lng: provider.lng }}
            onClick={() => handleMarkerClick(provider)}
            icon={getMarkerIcon(provider.availability)}
            title={`${provider.name} - ${provider.service}`}
          />
        ))}

        {/* Service Radius Circle for Hovered Provider */}
        {hoveredProvider && (mode === 'services' || mode === 'interactive') && (
          <Circle
            center={{ lat: hoveredProvider.lat, lng: hoveredProvider.lng }}
            radius={hoveredProvider.serviceRadius ? hoveredProvider.serviceRadius * 1000 : 10000}
            options={{
              fillColor: '#3b82f6',
              fillOpacity: 0.1,
              strokeColor: '#3b82f6',
              strokeOpacity: 0.4,
              strokeWeight: 2,
            }}
          />
        )}

        {/* Info Window for Selected Provider */}
        {selectedProvider && (mode === 'services' || mode === 'interactive') && (
          <InfoWindow
            position={{ lat: selectedProvider.lat, lng: selectedProvider.lng }}
            onCloseClick={() => setSelectedProvider(null)}
          >
            <div className="p-3 min-w-[200px]">
              <h3 className="font-semibold text-gray-900 mb-2">{selectedProvider.name}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div>🔧 {selectedProvider.service}</div>
                <div>⭐ {selectedProvider.rating}/5</div>
                <div>📍 {selectedProvider.availability}</div>
                {selectedProvider.hourlyRate && (
                  <div>💰 ${selectedProvider.hourlyRate}/hour</div>
                )}
              </div>
            </div>
          </InfoWindow>
        )}

        {/* Quebec Data Overlays for Customer Mode */}
        {mode === 'interactive' && renderQuebecOverlays()}

        {/* Provider Mode Overlays with Independent Data */}
        {mode === 'interactive' && renderProviderOverlays()}

        {/* Fleet Manager Overlays */}
        {mode === 'interactive' && renderFleetManagerOverlays()}

        {/* Custom children (for privacy markers, job overlays, heat zones, etc.) */}
        {children}
      </GoogleMap>
    </div>
  );
};
