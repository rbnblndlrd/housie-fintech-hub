
// Convert PostGIS POINT to coordinates
export const parsePoint = (pointString: string): { lat: number; lng: number } | null => {
  if (!pointString) return null;
  const match = pointString.match(/\(([^,]+),([^)]+)\)/);
  if (!match) return null;
  return {
    lng: parseFloat(match[1]),
    lat: parseFloat(match[2])
  };
};

// Generate privacy-safe fuzzy location
export const generateFuzzyLocation = (
  originalLat: number,
  originalLng: number,
  radiusMeters: number = 10000
) => {
  const randomAngle = Math.random() * 2 * Math.PI;
  const randomDistance = Math.random() * radiusMeters;
  
  // Convert to lat/lng offsets (rough approximation for Montreal)
  const latOffset = (randomDistance * Math.cos(randomAngle)) / 111320.0;
  const lngOffset = (randomDistance * Math.sin(randomAngle)) / (111320.0 * Math.cos(originalLat * Math.PI / 180));
  
  return {
    lat: originalLat + latOffset,
    lng: originalLng + lngOffset,
    radius: radiusMeters,
    lastUpdated: new Date().toISOString()
  };
};

// Default Montreal zones (static fallback)
const getDefaultZones = () => [
  {
    id: '1',
    zone_name: 'Plateau-Mont-Royal',
    zone_code: 'PLATEAU',
    zone_type: 'residential' as const,
    demand_level: 'high' as const,
    pricing_multiplier: 1.20,
    center_coordinates: { lat: 45.5276, lng: -73.5794 },
    zone_radius: 3000
  },
  {
    id: '2',
    zone_name: 'Downtown Montreal',
    zone_code: 'DOWNTOWN',
    zone_type: 'commercial' as const,
    demand_level: 'high' as const,
    pricing_multiplier: 1.30,
    center_coordinates: { lat: 45.5017, lng: -73.5673 },
    zone_radius: 4000
  },
  {
    id: '3',
    zone_name: 'Westmount',
    zone_code: 'WESTMOUNT',
    zone_type: 'premium' as const,
    demand_level: 'medium' as const,
    pricing_multiplier: 1.50,
    center_coordinates: { lat: 45.4869, lng: -73.5989 },
    zone_radius: 2500
  }
];

// Get Montreal zones (simplified to use static data)
export const getMontrealZones = async () => {
  console.log('🗺️ Using default Montreal zones (simplified privacy system)');
  return getDefaultZones();
};

// Calculate distance between two points
export const calculateDistance = (
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Find closest zone to coordinates
export const findClosestZone = async (lat: number, lng: number): Promise<string> => {
  const zones = await getMontrealZones();
  let closestZone = 'UNKNOWN';
  let minDistance = Infinity;

  zones.forEach(zone => {
    const distance = calculateDistance(
      lat, lng,
      zone.center_coordinates.lat, zone.center_coordinates.lng
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestZone = zone.zone_code;
    }
  });

  return closestZone;
};

// Privacy-safe provider location (fuzzy)
export const getProviderFuzzyLocation = (provider: any): { lat: number; lng: number } => {
  // Use fuzzy_location if available, otherwise generate from coordinates
  if (provider.fuzzy_location) {
    const parsed = parsePoint(provider.fuzzy_location);
    if (parsed) return parsed;
  }
  
  // Fallback: generate fuzzy location from coordinates
  if (provider.coordinates || (provider.lat && provider.lng)) {
    const lat = provider.coordinates ? parsePoint(provider.coordinates)?.lat : provider.lat;
    const lng = provider.coordinates ? parsePoint(provider.coordinates)?.lng : provider.lng;
    
    if (lat && lng) {
      const fuzzy = generateFuzzyLocation(lat, lng, provider.confidentiality_radius || 10000);
      return { lat: fuzzy.lat, lng: fuzzy.lng };
    }
  }
  
  // Final fallback: random Montreal location
  const fallback = generateFuzzyLocation(45.5017, -73.5673, 15000);
  return { lat: fallback.lat, lng: fallback.lng };
};

// Get provider with service radius
export const getProviderWithServiceRadius = (provider: any) => {
  return {
    ...provider,
    serviceRadius: Math.round((provider.service_radius || 15000) / 1000), // Convert to km
    fuzzyLocation: getProviderFuzzyLocation(provider),
    hourlyRate: provider.hourly_rate || 85,
    service: provider.service_type || 'House Cleaning',
    reviewCount: provider.review_count || Math.floor(Math.random() * 50) + 10
  };
};

// Privacy-safe job location (service circle)
export const getJobServiceCircle = (job: any): { lat: number; lng: number; radius: number; zone: string } => {
  let lat = 45.5017;
  let lng = -73.5673;
  
  // Use service_address for basic location (if available)
  if (job.service_address) {
    // For privacy, just use Montreal center with some randomness
    lat = 45.5017 + (Math.random() - 0.5) * 0.1;
    lng = -73.5673 + (Math.random() - 0.5) * 0.1;
  }
  
  return {
    lat,
    lng,
    radius: 2000, // Default 2km service radius
    zone: 'Montreal Area' // Simplified zone
  };
};
