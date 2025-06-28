
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Navigation, MapPin, Clock, ExternalLink, Shield, ArrowLeft } from 'lucide-react';
import { mapboxNavigationService, MapboxNavigationOptions } from '@/services/mapboxService';

type NavigationPreference = 'google_maps' | 'housie_navigation' | 'system_default';

interface UnifiedNavigationProps {
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  jobId?: string;
  navigationPreference: NavigationPreference;
  onNavigationStart?: () => void;
  onNavigationComplete?: () => void;
  onStatusUpdate?: (status: 'en_route' | 'on_site' | 'complete') => void;
}

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({
  destination,
  jobId,
  navigationPreference,
  onNavigationStart,
  onNavigationComplete,
  onStatusUpdate
}) => {
  const { toast } = useToast();
  const [isNavigating, setIsNavigating] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ duration: number; distance: number } | null>(null);
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location Not Available",
        description: "GPS location services are not available on this device",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Location error:', error);
        toast({
          title: "Location Error",
          description: "Unable to get your current location",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const startNavigation = async () => {
    if (!userLocation) {
      getCurrentLocation();
      return;
    }

    setIsNavigating(true);
    onNavigationStart?.();

    switch (navigationPreference) {
      case 'google_maps':
        startGoogleMapsNavigation();
        break;
      case 'housie_navigation':
        await startHousieNavigation();
        break;
      case 'system_default':
        startSystemNavigation();
        break;
    }
  };

  const startGoogleMapsNavigation = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/${userLocation!.lat},${userLocation!.lng}/${destination.lat},${destination.lng}`;
    window.open(googleMapsUrl, '_blank');
    
    toast({
      title: "Navigation Started",
      description: "Opened Google Maps for navigation",
    });

    // Update job status
    onStatusUpdate?.('en_route');
  };

  const startHousieNavigation = async () => {
    if (!mapContainer) return;

    try {
      // Initialize Mapbox navigation
      await mapboxNavigationService.initializeMap(mapContainer);
      
      const navigationOptions: MapboxNavigationOptions = {
        origin: [userLocation!.lng, userLocation!.lat],
        destination: [destination.lng, destination.lat],
        language: 'fr', // Quebec French as default
        voiceGuidance: true,
        alternatives: true
      };

      const route = await mapboxNavigationService.calculateRoute(navigationOptions);
      
      if (route) {
        setRouteInfo({
          duration: route.duration,
          distance: route.distance
        });
        
        mapboxNavigationService.startNavigation(route);
        
        toast({
          title: "HOUSIE Navigation Started",
          description: "Privacy-First GPS navigation active",
        });

        // Update job status
        onStatusUpdate?.('en_route');
      } else {
        throw new Error('Unable to calculate route');
      }
    } catch (error) {
      console.error('Mapbox navigation error:', error);
      toast({
        title: "Navigation Error",
        description: "Unable to start HOUSIE Navigation. Try Google Maps instead.",
        variant: "destructive",
      });
      setIsNavigating(false);
    }
  };

  const startSystemNavigation = () => {
    const systemUrl = `geo:${destination.lat},${destination.lng}?q=${encodeURIComponent(destination.address)}`;
    window.location.href = systemUrl;
    
    toast({
      title: "Navigation Started",
      description: "Opened system default navigation app",
    });

    // Update job status
    onStatusUpdate?.('en_route');
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    
    if (navigationPreference === 'housie_navigation') {
      mapboxNavigationService.stopNavigation();
    }
    
    onNavigationComplete?.();
    
    toast({
      title: "Navigation Stopped",
      description: "You can restart navigation anytime",
    });
  };

  const getNavigationTypeDisplay = () => {
    switch (navigationPreference) {
      case 'google_maps':
        return { name: 'Google Maps', icon: <MapPin className="h-4 w-4" />, badge: null };
      case 'housie_navigation':
        return { 
          name: 'HOUSIE Navigation', 
          icon: <Shield className="h-4 w-4" />, 
          badge: <Badge className="bg-blue-600 text-white text-xs">Privacy-First GPS</Badge> 
        };
      case 'system_default':
        return { name: 'System Default', icon: <ExternalLink className="h-4 w-4" />, badge: null };
    }
  };

  const navDisplay = getNavigationTypeDisplay();

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Navigation Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">Navigation</span>
              {navDisplay.badge}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {navDisplay.icon}
              <span>{navDisplay.name}</span>
            </div>
          </div>

          {/* Destination Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-sm">Destination</div>
                <div className="text-sm text-gray-600">{destination.address}</div>
                {routeInfo && (
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{Math.round(routeInfo.duration / 60)} min</span>
                    </div>
                    <div>{(routeInfo.distance / 1000).toFixed(1)} km</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mapbox Navigation Container */}
          {navigationPreference === 'housie_navigation' && isNavigating && (
            <div 
              ref={setMapContainer}
              className="w-full h-64 rounded-lg border bg-gray-100"
            />
          )}

          {/* Quebec Privacy Message for HOUSIE Navigation */}
          {navigationPreference === 'housie_navigation' && (
            <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span className="font-medium">Your Quebec routes stay in Quebec</span>
              </div>
              <div className="text-blue-600 mt-1">
                Unlike other platforms, we don't sell your location data
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex gap-2">
            {!isNavigating ? (
              <Button 
                onClick={startNavigation}
                className="flex-1"
                disabled={!userLocation}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Start Navigation
              </Button>
            ) : (
              <Button 
                onClick={stopNavigation}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Stop Navigation
              </Button>
            )}
            
            {navigationPreference !== 'google_maps' && (
              <Button
                variant="outline"
                onClick={startGoogleMapsNavigation}
                className="text-xs px-3"
              >
                Use Google Maps
              </Button>
            )}
          </div>

          {/* Status Message */}
          {isNavigating && (
            <div className="text-center text-sm text-green-700 bg-green-50 p-2 rounded">
              Navigation active - Job status updated to "En Route"
            </div>
          )}

          {!userLocation && (
            <div className="text-center text-sm text-amber-700 bg-amber-50 p-2 rounded">
              Getting your location for navigation...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedNavigation;
