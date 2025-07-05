import React, { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import mapboxgl from 'mapbox-gl';
import { montrealNeighborhoods, calculateNeighborhoodPopulation, findClosestNeighborhood } from '@/data/montrealNeighborhoods';

interface NeighborhoodArrowNavigationProps {
  map: mapboxgl.Map | null;
  jobs?: Array<{ coordinates: { lat: number; lng: number }; priority: string }>;
  providers?: Array<{ lat: number; lng: number; availability: string }>;
  onNavigate?: (neighborhoodName: string, coordinates: { lat: number; lng: number }) => void;
}

interface DirectionalNeighborhood {
  name: string;
  coordinates: { lat: number; lng: number };
  population: number;
  distance: number;
}

const NeighborhoodArrowNavigation: React.FC<NeighborhoodArrowNavigationProps> = ({
  map,
  jobs = [],
  providers = [],
  onNavigate
}) => {
  const [currentCenter, setCurrentCenter] = useState<{ lat: number; lng: number }>({ lat: 45.5017, lng: -73.5673 });
  const [directionalNeighborhoods, setDirectionalNeighborhoods] = useState<{
    north: DirectionalNeighborhood | null;
    south: DirectionalNeighborhood | null;
    east: DirectionalNeighborhood | null;
    west: DirectionalNeighborhood | null;
  }>({
    north: null,
    south: null,
    east: null,
    west: null
  });
  const [isNavigating, setIsNavigating] = useState(false);

  // Update current center when map moves
  useEffect(() => {
    if (!map) return;

    const updateCenter = () => {
      const center = map.getCenter();
      setCurrentCenter({ lat: center.lat, lng: center.lng });
    };

    map.on('moveend', updateCenter);
    updateCenter(); // Initial call

    return () => {
      map.off('moveend', updateCenter);
    };
  }, [map]);

  // Calculate neighborhood populations and find directional neighbors
  useEffect(() => {
    const calculateDirectionalNeighborhoods = () => {
      // Calculate population for each neighborhood
      const neighborhoodsWithPopulation = montrealNeighborhoods.map(neighborhood => ({
        ...neighborhood,
        population: calculateNeighborhoodPopulation(neighborhood, jobs, providers)
      })).filter(n => n.population > 0); // Only include populated neighborhoods

      // Find closest neighborhood in each direction
      const directions = {
        north: findClosestNeighborhood(currentCenter, neighborhoodsWithPopulation, 'north'),
        south: findClosestNeighborhood(currentCenter, neighborhoodsWithPopulation, 'south'),
        east: findClosestNeighborhood(currentCenter, neighborhoodsWithPopulation, 'east'),
        west: findClosestNeighborhood(currentCenter, neighborhoodsWithPopulation, 'west')
      };

      setDirectionalNeighborhoods(directions);
    };

    calculateDirectionalNeighborhoods();
  }, [currentCenter, jobs, providers]);

  const handleNavigate = async (direction: 'north' | 'south' | 'east' | 'west') => {
    const neighborhood = directionalNeighborhoods[direction];
    if (!neighborhood || !map || isNavigating) return;

    setIsNavigating(true);
    
    try {
      // Trigger haptic feedback if supported
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      // Smooth animated transition
      const targetZoom = Math.max(map.getZoom(), 13); // Ensure good neighborhood view
      
      map.flyTo({
        center: [neighborhood.coordinates.lng, neighborhood.coordinates.lat],
        zoom: targetZoom,
        duration: 1500, // 1.5 second smooth transition
        essential: true
      });

      // Callback for external handling
      if (onNavigate) {
        onNavigate(neighborhood.name, neighborhood.coordinates);
      }

      // Wait for transition to complete
      setTimeout(() => {
        setIsNavigating(false);
      }, 1600);

    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
    }
  };

  const ArrowButton = ({ 
    direction, 
    Icon, 
    position 
  }: { 
    direction: 'north' | 'south' | 'east' | 'west';
    Icon: React.ComponentType<{ className?: string }>;
    position: string;
  }) => {
    const neighborhood = directionalNeighborhoods[direction];
    const isEnabled = !!neighborhood && !isNavigating;

    return (
      <Button
        variant="secondary"
        size="sm"
        className={cn(
          "absolute z-40 h-11 w-11 p-0 bg-background/80 backdrop-blur-sm border-2 border-border/50 hover:bg-background/90 transition-all duration-200 shadow-lg",
          position,
          isEnabled ? "opacity-100" : "opacity-40 cursor-not-allowed",
          isNavigating && "animate-pulse"
        )}
        onClick={() => handleNavigate(direction)}
        disabled={!isEnabled}
        title={neighborhood ? `Navigate to ${neighborhood.name}` : `No populated area ${direction}`}
      >
        <Icon className={cn(
          "h-5 w-5 transition-colors",
          isEnabled ? "text-foreground" : "text-muted-foreground"
        )} />
        
        {/* Neighborhood name tooltip */}
        {neighborhood && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md whitespace-nowrap z-50">
              {direction === 'north' && `↑ ${neighborhood.name}`}
              {direction === 'south' && `↓ ${neighborhood.name}`}
              {direction === 'east' && `→ ${neighborhood.name}`}
              {direction === 'west' && `← ${neighborhood.name}`}
            </div>
          </div>
        )}
      </Button>
    );
  };

  return (
    <>
      {/* North Arrow */}
      <ArrowButton
        direction="north"
        Icon={ChevronUp}
        position="top-20 left-1/2 transform -translate-x-1/2"
      />

      {/* South Arrow */}
      <ArrowButton
        direction="south"
        Icon={ChevronDown}
        position="bottom-20 left-1/2 transform -translate-x-1/2"
      />

      {/* East Arrow */}
      <ArrowButton
        direction="east"
        Icon={ChevronRight}
        position="right-4 top-1/2 transform -translate-y-1/2"
      />

      {/* West Arrow */}
      <ArrowButton
        direction="west"
        Icon={ChevronLeft}
        position="left-4 top-1/2 transform -translate-y-1/2"
      />

      {/* Navigation Status */}
      {isNavigating && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Navigating...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default NeighborhoodArrowNavigation;