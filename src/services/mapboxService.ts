
import mapboxgl from 'mapbox-gl';

// Mapbox configuration
export const MAPBOX_PUBLIC_TOKEN = 'pk.eyJ1IjoicmJuYmxuZGxyZCIsImEiOiJjbWNmdGYzN2wwY2RuMmtwd3M3d2hzM3NxIn0.MZfduMhwltc3eC8V5xYgcQ';
export const MAPBOX_SECRET_TOKEN = 'sk.eyJ1IjoicmJuYmxuZGxyZCIsImEiOiJjbWNmdHc0cXIwY3NyMndwazhpMnk5NG40In0.OLiOJZ7L1hWMzFZJ0YHo3g';

// Initialize Mapbox
mapboxgl.accessToken = MAPBOX_PUBLIC_TOKEN;

export interface NavigationRoute {
  geometry: any;
  duration: number;
  distance: number;
  instructions: RouteInstruction[];
}

export interface RouteInstruction {
  text: string;
  distance: number;
  time: number;
  sign: number;
}

export interface MapboxNavigationOptions {
  origin: [number, number];
  destination: [number, number];
  waypoints?: [number, number][];
  language?: 'en' | 'fr';
  voiceGuidance?: boolean;
  alternatives?: boolean;
}

class MapboxNavigationService {
  private map: mapboxgl.Map | null = null;
  private currentRoute: NavigationRoute | null = null;
  private isNavigating = false;
  private voiceEnabled = true;
  private language: 'en' | 'fr' = 'en';

  async initializeMap(container: HTMLElement, options?: any): Promise<mapboxgl.Map> {
    const mapOptions = {
      container,
      style: 'mapbox://styles/mapbox/navigation-day-v1', // Quebec-optimized style
      center: [-73.5673, 45.5017] as [number, number], // Montreal center
      zoom: 12,
      ...options
    };

    this.map = new mapboxgl.Map(mapOptions);
    
    await new Promise((resolve) => {
      this.map!.on('load', resolve);
    });

    return this.map;
  }

  async calculateRoute(options: MapboxNavigationOptions): Promise<NavigationRoute | null> {
    const { origin, destination, waypoints = [], language = 'en', alternatives = true } = options;
    
    let coordinates = [origin];
    if (waypoints.length > 0) {
      coordinates.push(...waypoints);
    }
    coordinates.push(destination);

    const coordinatesStr = coordinates.map(coord => coord.join(',')).join(';');
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesStr}?` + 
        new URLSearchParams({
          access_token: MAPBOX_PUBLIC_TOKEN,
          geometries: 'geojson',
          language: language,
          overview: 'full',
          steps: 'true',
          alternatives: alternatives.toString(),
          voice_instructions: 'true',
          banner_instructions: 'true'
        })
      );

      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        
        this.currentRoute = {
          geometry: route.geometry,
          duration: route.duration,
          distance: route.distance,
          instructions: this.parseInstructions(route.legs)
        };

        return this.currentRoute;
      }
    } catch (error) {
      console.error('❌ Mapbox route calculation failed:', error);
    }

    return null;
  }

  private parseInstructions(legs: any[]): RouteInstruction[] {
    const instructions: RouteInstruction[] = [];
    
    legs.forEach(leg => {
      leg.steps?.forEach((step: any) => {
        instructions.push({
          text: step.maneuver.instruction,
          distance: step.distance,
          time: step.duration,
          sign: step.maneuver.type
        });
      });
    });

    return instructions;
  }

  displayRoute(route: NavigationRoute) {
    if (!this.map || !route) return;

    // Remove existing route
    if (this.map.getSource('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }

    // Add new route
    this.map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: route.geometry
      }
    });

    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3b82f6', // HOUSIE blue
        'line-width': 8,
        'line-opacity': 0.8
      }
    });
  }

  startNavigation(route: NavigationRoute) {
    if (!route) return;

    this.isNavigating = true;
    this.currentRoute = route;
    this.displayRoute(route);
    
    console.log('🧭 Navigation started with Mapbox (Privacy-First GPS)');
    
    // Start GPS tracking for arrival detection
    this.startGPSTracking();
  }

  private startGPSTracking() {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.updateUserLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('GPS tracking error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      }
    );

    // Store watchId for cleanup
    (this as any).gpsWatchId = watchId;
  }

  private updateUserLocation(lat: number, lng: number) {
    if (!this.map) return;

    // Update user location marker
    const userLocationSource = this.map.getSource('user-location');
    if (userLocationSource) {
      (userLocationSource as mapboxgl.GeoJSONSource).setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      });
    } else {
      this.map.addSource('user-location', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }
      });

      this.map.addLayer({
        id: 'user-location',
        type: 'circle',
        source: 'user-location',
        paint: {
          'circle-radius': 8,
          'circle-color': '#3b82f6',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });
    }
  }

  stopNavigation() {
    this.isNavigating = false;
    
    if ((this as any).gpsWatchId) {
      navigator.geolocation.clearWatch((this as any).gpsWatchId);
    }

    console.log('🛑 Navigation stopped');
  }

  setLanguage(language: 'en' | 'fr') {
    this.language = language;
  }

  setVoiceGuidance(enabled: boolean) {
    this.voiceEnabled = enabled;
  }

  getNavigationStatus() {
    return {
      isNavigating: this.isNavigating,
      currentRoute: this.currentRoute,
      voiceEnabled: this.voiceEnabled,
      language: this.language
    };
  }

  destroy() {
    this.stopNavigation();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}

export const mapboxNavigationService = new MapboxNavigationService();
