
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

// Enhanced environment variable handling with build-time validation
const getGoogleMapsApiKey = (): string | undefined => {
  // Vite embeds VITE_ variables at build time
  const viteKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // Fallback for Next.js environments (if needed)
  const nextKey = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY : undefined;
  
  return viteKey || nextKey;
};

// Get the API key using enhanced detection
export const GOOGLE_MAPS_API_KEY = getGoogleMapsApiKey();

// Enhanced debugging with environment detection
export const debugApiKeyStatus = () => {
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  const buildTime = import.meta.env.MODE;
  
  console.log('🔍 Environment Detection:', {
    isDevelopment,
    isProduction,
    buildMode: buildTime,
    viteEnvKeys: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
  });

  if (GOOGLE_MAPS_API_KEY) {
    const keyPreview = GOOGLE_MAPS_API_KEY.substring(0, 10) + '...';
    console.log('✅ Google Maps API key loaded successfully');
    console.log('🔑 Key preview:', keyPreview);
    console.log('📏 Key length:', GOOGLE_MAPS_API_KEY.length);
    
    if (isDevelopment) {
      console.log('🏠 Development mode: Key loaded from local .env file');
    } else if (isProduction) {
      console.log('🚀 Production mode: Key loaded from GitHub Actions environment');
    }
    
    return true;
  } else {
    console.error('❌ Google Maps API key not found');
    console.error('🔧 Environment variables available:', Object.keys(import.meta.env));
    
    if (isDevelopment) {
      console.error('💡 Development fix: Check your .env file contains VITE_GOOGLE_MAPS_API_KEY');
    } else {
      console.error('💡 Production fix: Ensure GitHub secret VITE_GOOGLE_MAPS_API_KEY is set and workflow injects it');
    }
    
    console.error('🔗 Available environment keys:', Object.keys(import.meta.env).join(', '));
    return false;
  }
};

// Build-time validation (runs during compilation)
export const validateApiKeyAtBuildTime = () => {
  const buildTimeKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!buildTimeKey) {
    console.warn('⚠️ BUILD WARNING: VITE_GOOGLE_MAPS_API_KEY not found at build time');
    console.warn('🔧 This may cause maps to fail in production');
  } else {
    console.log('✅ BUILD SUCCESS: Google Maps API key embedded at build time');
  }
  
  return !!buildTimeKey;
};

// Run build-time validation
validateApiKeyAtBuildTime();
