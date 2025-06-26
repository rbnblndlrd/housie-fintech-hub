
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, Circle, InfoWindow, Polygon } from '@react-google-maps/api';
import { Provider } from "@/types/service";
import { GOOGLE_MAPS_API_KEY, mapOptions } from './map/GoogleMapConfig';
import { useGoogleMaps } from './map/GoogleMapsProvider';
import { useQuebecData } from '@/hooks/useQuebecData';

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

// Business Intelligence Data for Provider Mode
interface BusinessIntelligenceArea {
  area: string;
  lat: number;
  lng: number;
  populationDensity: number;
  avgHouseholdIncome: number;
  providerCount: number;
  demographicScore: number;
  demandScore: number;
  competitionLevel: 'low' | 'medium' | 'high';
  tipPotential: 'low' | 'medium' | 'high';
  opportunityScore: number;
}

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

  // Business Intelligence Areas for Provider Mode
  const getBusinessIntelligenceAreas = (): BusinessIntelligenceArea[] => {
    return [
      {
        area: "Montreal Downtown",
        lat: 45.5088,
        lng: -73.5878,
        populationDensity: 12500,
        avgHouseholdIncome: 52000,
        providerCount: 245,
        demographicScore: 85,
        demandScore: 88,
        competitionLevel: 'high',
        tipPotential: 'medium',
        opportunityScore: 72
      },
      {
        area: "Westmount",
        lat: 45.4848,
        lng: -73.5915,
        populationDensity: 8200,
        avgHouseholdIncome: 95000,
        providerCount: 67,
        demographicScore: 65,
        demandScore: 75,
        competitionLevel: 'low',
        tipPotential: 'high',
        opportunityScore: 91
      },
      {
        area: "Longueuil",
        lat: 45.4215,
        lng: -73.4597,
        populationDensity: 3500,
        avgHouseholdIncome: 67000,
        providerCount: 89,
        demographicScore: 70,
        demandScore: 65,
        competitionLevel: 'medium',
        tipPotential: 'medium',
        opportunityScore: 78
      },
      {
        area: "Laval",
        lat: 45.5731,
        lng: -73.7113,
        populationDensity: 4200,
        avgHouseholdIncome: 71000,
        providerCount: 156,
        demographicScore: 75,
        demandScore: 78,
        competitionLevel: 'medium',
        tipPotential: 'medium',
        opportunityScore: 82
      }
    ];
  };

  // Create Quebec data overlays based on enabled layers
  const renderQuebecOverlays = () => {
    const overlays = [];

    // Crime Heat Map Overlay
    if (enabledLayers.crime && crimeData.length > 0) {
      crimeData.forEach((crime, index) => {
        const safetyScore = crime.area === 'Montreal Downtown' ? 7.8 :
                           crime.area === 'Longueuil' ? 8.5 :
                           crime.area === 'Laval' ? 8.2 : 9.2;
        
        // Create a rough polygon for the area (simplified for demo)
        const areaPolygons = {
          'Montreal Downtown': [
            { lat: 45.495, lng: -73.600 },
            { lat: 45.515, lng: -73.600 },
            { lat: 45.515, lng: -73.570 },
            { lat: 45.495, lng: -73.570 }
          ],
          'Longueuil': [
            { lat: 45.410, lng: -73.480 },
            { lat: 45.430, lng: -73.480 },
            { lat: 45.430, lng: -73.450 },
            { lat: 45.410, lng: -73.450 }
          ],
          'Laval': [
            { lat: 45.560, lng: -73.730 },
            { lat: 45.580, lng: -73.730 },
            { lat: 45.580, lng: -73.700 },
            { lat: 45.560, lng: -73.700 }
          ],
          'Westmount': [
            { lat: 45.475, lng: -73.605 },
            { lat: 45.495, lng: -73.605 },
            { lat: 45.495, lng: -73.575 },
            { lat: 45.475, lng: -73.575 }
          ]
        };

        const polygon = areaPolygons[crime.area as keyof typeof areaPolygons];
        if (polygon) {
          // Higher crime = lower safety score = more red
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
        // Create a rough polygon for the area
        const areaPolygons = {
          'Montreal Downtown': [
            { lat: 45.495, lng: -73.600 },
            { lat: 45.515, lng: -73.600 },
            { lat: 45.515, lng: -73.570 },
            { lat: 45.495, lng: -73.570 }
          ],
          'Longueuil': [
            { lat: 45.410, lng: -73.480 },
            { lat: 45.430, lng: -73.480 },
            { lat: 45.430, lng: -73.450 },
            { lat: 45.410, lng: -73.450 }
          ],
          'Laval': [
            { lat: 45.560, lng: -73.730 },
            { lat: 45.580, lng: -73.730 },
            { lat: 45.580, lng: -73.700 },
            { lat: 45.560, lng: -73.700 }
          ],
          'Westmount': [
            { lat: 45.475, lng: -73.605 },
            { lat: 45.495, lng: -73.605 },
            { lat: 45.495, lng: -73.575 },
            { lat: 45.475, lng: -73.575 }
          ]
        };

        const polygon = areaPolygons[demo.area as keyof typeof areaPolygons];
        if (polygon) {
          // Higher income = more blue intensity
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

        // Create multiple markers to represent density
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

  // Create Provider Mode overlays based on enabled layers with realistic data
  const renderProviderOverlays = () => {
    const overlays = [];
    const businessAreas = getBusinessIntelligenceAreas();

    // Area polygons for provider overlays
    const areaPolygons = {
      'Montreal Downtown': [
        { lat: 45.495, lng: -73.600 },
        { lat: 45.515, lng: -73.600 },
        { lat: 45.515, lng: -73.570 },
        { lat: 45.495, lng: -73.570 }
      ],
      'Longueuil': [
        { lat: 45.410, lng: -73.480 },
        { lat: 45.430, lng: -73.480 },
        { lat: 45.430, lng: -73.450 },
        { lat: 45.410, lng: -73.450 }
      ],
      'Laval': [
        { lat: 45.560, lng: -73.730 },
        { lat: 45.580, lng: -73.730 },
        { lat: 45.580, lng: -73.700 },
        { lat: 45.560, lng: -73.700 }
      ],
      'Westmount': [
        { lat: 45.475, lng: -73.605 },
        { lat: 45.495, lng: -73.605 },
        { lat: 45.495, lng: -73.575 },
        { lat: 45.475, lng: -73.575 }
      ]
    };

    // Demand Hot Zones (Orange) - Based on population density + demographics
    if (enabledLayers.demand) {
      businessAreas.forEach((area, index) => {
        const polygon = areaPolygons[area.area as keyof typeof areaPolygons];
        if (polygon) {
          // Calculate demand intensity based on population density and demographics
          const demandIntensity = Math.min(1, area.demandScore / 100);
          
          overlays.push(
            <Polygon
              key={`demand-${index}`}
              paths={polygon}
              options={{
                fillColor: '#f97316',
                fillOpacity: demandIntensity * 0.6,
                strokeColor: '#ea580c',
                strokeOpacity: 0.8,
                strokeWeight: 2
              }}
            />
          );
        }
      });
    }

    // Competition Analysis (Red) - Based on provider density
    if (enabledLayers.competition) {
      businessAreas.forEach((area, index) => {
        const polygon = areaPolygons[area.area as keyof typeof areaPolygons];
        if (polygon) {
          // Calculate competition intensity based on provider density
          const providerDensity = area.providerCount / (area.populationDensity / 1000);
          const competitionIntensity = Math.min(1, providerDensity / 2);
          
          overlays.push(
            <Polygon
              key={`competition-${index}`}
              paths={polygon}
              options={{
                fillColor: '#dc2626',
                fillOpacity: competitionIntensity * 0.5,
                strokeColor: '#b91c1c',
                strokeOpacity: 0.7,
                strokeWeight: 2
              }}
            />
          );
        }
      });
    }

    // Tip Zone Mapping (Gold) - Based on household income
    if (enabledLayers.tips) {
      businessAreas.forEach((area, index) => {
        const polygon = areaPolygons[area.area as keyof typeof areaPolygons];
        if (polygon) {
          // Calculate tip intensity based on household income
          const tipIntensity = Math.min(1, area.avgHouseholdIncome / 100000);
          
          overlays.push(
            <Polygon
              key={`tips-${index}`}
              paths={polygon}
              options={{
                fillColor: '#eab308',
                fillOpacity: tipIntensity * 0.5,
                strokeColor: '#ca8a04',
                strokeOpacity: 0.7,
                strokeWeight: 2
              }}
            />
          );
        }
      });
    }

    // Opportunity Areas (Green) - Based on opportunity calculation
    if (enabledLayers.opportunity) {
      businessAreas.forEach((area, index) => {
        const polygon = areaPolygons[area.area as keyof typeof areaPolygons];
        if (polygon) {
          // Use calculated opportunity score
          const opportunityIntensity = Math.min(1, area.opportunityScore / 100);
          
          overlays.push(
            <Polygon
              key={`opportunity-${index}`}
              paths={polygon}
              options={{
                fillColor: '#16a34a',
                fillOpacity: opportunityIntensity * 0.5,
                strokeColor: '#15803d',
                strokeOpacity: 0.7,
                strokeWeight: 2
              }}
            />
          );
        }
      });
    }

    return overlays;
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

        {/* Provider Mode Overlays */}
        {mode === 'interactive' && renderProviderOverlays()}

        {/* Custom children (for privacy markers, job overlays, heat zones, etc.) */}
        {children}
      </GoogleMap>
    </div>
  );
};
