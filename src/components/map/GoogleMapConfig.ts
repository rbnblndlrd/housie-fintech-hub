
// Montreal-specific map styling and configuration
export const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '300px'
};

export const mapOptions = {
  styles: [
    {
      featureType: "all",
      elementType: "geometry.fill",
      stylers: [{ color: "#f8fafc" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#3b82f6" }]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#e2e8f0" }]
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#1f2937" }]
    }
  ],
  restriction: {
    latLngBounds: {
      north: 46.0,
      south: 45.0,
      east: -73.0,
      west: -74.5,
    },
    strictBounds: false,
  }
};

// Fix the libraries type to match @react-google-maps/api expectations
export const libraries: ("places" | "geometry")[] = ["places", "geometry"];

// Use your Web API key directly
export const GOOGLE_MAPS_API_KEY = "AIzaSyAJXkmufaWRLR5t4iFFp4qupryDKNZZO9o";
