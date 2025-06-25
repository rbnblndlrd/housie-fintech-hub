
declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element | null, opts?: google.maps.MapOptions);
    getCenter(): google.maps.LatLng;
    getZoom(): number;
    setCenter(latlng: google.maps.LatLng | google.maps.LatLngLiteral): void;
    setZoom(zoom: number): void;
  }

  class Marker {
    constructor(opts?: google.maps.MarkerOptions);
    addListener(eventName: string, handler: Function): google.maps.MapsEventListener;
  }

  class InfoWindow {
    constructor(opts?: google.maps.InfoWindowOptions);
    open(map?: google.maps.Map | google.maps.StreetViewPanorama, anchor?: google.maps.MVCObject): void;
  }

  class Size {
    constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
  }

  enum ControlPosition {
    BOTTOM_CENTER = 0,
    BOTTOM_LEFT = 1,
    BOTTOM_RIGHT = 2,
    LEFT_BOTTOM = 3,
    LEFT_CENTER = 4,
    LEFT_TOP = 5,
    RIGHT_BOTTOM = 6,
    RIGHT_CENTER = 7,
    RIGHT_TOP = 8,
    TOP_CENTER = 9,
    TOP_LEFT = 10,
    TOP_RIGHT = 11
  }

  interface MapOptions {
    center?: google.maps.LatLng | google.maps.LatLngLiteral;
    zoom?: number;
    styles?: google.maps.MapTypeStyle[];
    zoomControl?: boolean;
    zoomControlOptions?: {
      position?: google.maps.ControlPosition;
    };
    mapTypeControl?: boolean;
    scaleControl?: boolean;
    streetViewControl?: boolean;
    rotateControl?: boolean;
    fullscreenControl?: boolean;
    disableDefaultUI?: boolean;
    restriction?: {
      latLngBounds: {
        north: number;
        south: number;
        east: number;
        west: number;
      };
      strictBounds: boolean;
    };
  }

  interface MarkerOptions {
    position?: google.maps.LatLng | google.maps.LatLngLiteral;
    map?: google.maps.Map;
    title?: string;
    icon?: string | google.maps.Icon | google.maps.Symbol;
  }

  interface InfoWindowOptions {
    content?: string | Element;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface MapTypeStyle {
    featureType?: string;
    elementType?: string;
    stylers?: Array<{ [key: string]: any }>;
  }

  interface Icon {
    url: string;
    scaledSize?: google.maps.Size;
  }

  interface MapsEventListener {}
  interface LatLng {}
  interface MVCObject {}
  interface StreetViewPanorama {}
  interface Symbol {}
}

export {};
