interface Neighborhood {
  name: string;
  coordinates: { lat: number; lng: number };
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  type: 'residential' | 'commercial' | 'mixed' | 'industrial';
  population: number;
}

export const montrealNeighborhoods: Neighborhood[] = [
  {
    name: "Plateau Mont-Royal",
    coordinates: { lat: 45.5200, lng: -73.5800 },
    bounds: { north: 45.5300, south: 45.5100, east: -73.5700, west: -73.5900 },
    type: 'mixed',
    population: 101000
  },
  {
    name: "Mile End",
    coordinates: { lat: 45.5230, lng: -73.5950 },
    bounds: { north: 45.5300, south: 45.5160, east: -73.5850, west: -73.6050 },
    type: 'mixed',
    population: 35000
  },
  {
    name: "Outremont",
    coordinates: { lat: 45.5180, lng: -73.6100 },
    bounds: { north: 45.5250, south: 45.5110, east: -73.6000, west: -73.6200 },
    type: 'residential',
    population: 24000
  },
  {
    name: "Westmount",
    coordinates: { lat: 45.4840, lng: -73.5950 },
    bounds: { north: 45.4950, south: 45.4730, east: -73.5850, west: -73.6050 },
    type: 'residential',
    population: 20000
  },
  {
    name: "Downtown",
    coordinates: { lat: 45.5017, lng: -73.5673 },
    bounds: { north: 45.5100, south: 45.4934, east: -73.5500, west: -73.5846 },
    type: 'commercial',
    population: 15000
  },
  {
    name: "Old Montreal",
    coordinates: { lat: 45.5088, lng: -73.5540 },
    bounds: { north: 45.5150, south: 45.5026, east: -73.5450, west: -73.5630 },
    type: 'mixed',
    population: 4000
  },
  {
    name: "Rosemont",
    coordinates: { lat: 45.5390, lng: -73.5760 },
    bounds: { north: 45.5500, south: 45.5280, east: -73.5600, west: -73.5920 },
    type: 'residential',
    population: 134000
  },
  {
    name: "Hochelaga-Maisonneuve",
    coordinates: { lat: 45.5320, lng: -73.5400 },
    bounds: { north: 45.5450, south: 45.5190, east: -73.5200, west: -73.5600 },
    type: 'mixed',
    population: 132000
  },
  {
    name: "NDG (Notre-Dame-de-Grâce)",
    coordinates: { lat: 45.4730, lng: -73.6150 },
    bounds: { north: 45.4850, south: 45.4610, east: -73.6000, west: -73.6300 },
    type: 'residential',
    population: 102000
  },
  {
    name: "Côte-des-Neiges",
    coordinates: { lat: 45.4950, lng: -73.6300 },
    bounds: { north: 45.5100, south: 45.4800, east: -73.6150, west: -73.6450 },
    type: 'mixed',
    population: 162000
  },
  {
    name: "Villeray",
    coordinates: { lat: 45.5450, lng: -73.6100 },
    bounds: { north: 45.5550, south: 45.5350, east: -73.5950, west: -73.6250 },
    type: 'residential',
    population: 132000
  },
  {
    name: "Verdun",
    coordinates: { lat: 45.4580, lng: -73.5680 },
    bounds: { north: 45.4700, south: 45.4460, east: -73.5500, west: -73.5860 },
    type: 'mixed',
    population: 69000
  },
  {
    name: "Griffintown",
    coordinates: { lat: 45.4950, lng: -73.5600 },
    bounds: { north: 45.5020, south: 45.4880, east: -73.5500, west: -73.5700 },
    type: 'mixed',
    population: 12000
  },
  {
    name: "Saint-Henri",
    coordinates: { lat: 45.4760, lng: -73.5870 },
    bounds: { north: 45.4850, south: 45.4670, east: -73.5750, west: -73.5990 },
    type: 'mixed',
    population: 14000
  },
  {
    name: "Ahuntsic",
    coordinates: { lat: 45.5520, lng: -73.6450 },
    bounds: { north: 45.5650, south: 45.5390, east: -73.6250, west: -73.6650 },
    type: 'residential',
    population: 132000
  }
];

// Calculate neighborhood population based on job density, provider activity, and booking activity
export const calculateNeighborhoodPopulation = (
  neighborhood: Neighborhood,
  jobs: Array<{ coordinates: { lat: number; lng: number }; priority: string }> = [],
  providers: Array<{ lat: number; lng: number; availability: string }> = []
): number => {
  let populationScore = 0;

  // Base population score (neighborhood inherent population)
  populationScore += Math.min(neighborhood.population / 1000, 100); // Cap at 100 points

  // Job density score
  const jobsInArea = jobs.filter(job => 
    isCoordinateInBounds(job.coordinates, neighborhood.bounds)
  );
  
  jobsInArea.forEach(job => {
    switch (job.priority) {
      case 'emergency':
        populationScore += 15;
        break;
      case 'high':
        populationScore += 10;
        break;
      case 'medium':
        populationScore += 5;
        break;
      default:
        populationScore += 2;
    }
  });

  // Provider activity score
  const providersInArea = providers.filter(provider =>
    isCoordinateInBounds({ lat: provider.lat, lng: provider.lng }, neighborhood.bounds)
  );
  
  providersInArea.forEach(provider => {
    if (provider.availability === 'Available') {
      populationScore += 8;
    } else {
      populationScore += 3;
    }
  });

  // Bonus for commercial/mixed areas (higher service activity)
  if (neighborhood.type === 'commercial') {
    populationScore *= 1.5;
  } else if (neighborhood.type === 'mixed') {
    populationScore *= 1.2;
  }

  return Math.round(populationScore);
};

// Check if coordinates are within neighborhood bounds
const isCoordinateInBounds = (
  coordinates: { lat: number; lng: number },
  bounds: { north: number; south: number; east: number; west: number }
): boolean => {
  return (
    coordinates.lat <= bounds.north &&
    coordinates.lat >= bounds.south &&
    coordinates.lng <= bounds.east &&
    coordinates.lng >= bounds.west
  );
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Find closest populated neighborhood in a specific direction
export const findClosestNeighborhood = (
  currentCenter: { lat: number; lng: number },
  neighborhoods: Array<Neighborhood & { population: number }>,
  direction: 'north' | 'south' | 'east' | 'west'
): { name: string; coordinates: { lat: number; lng: number }; population: number; distance: number } | null => {
  
  // Filter neighborhoods by direction
  const filteredNeighborhoods = neighborhoods.filter(neighborhood => {
    const isCurrentLocation = calculateDistance(currentCenter, neighborhood.coordinates) < 1; // Within 1km
    if (isCurrentLocation) return false; // Exclude current location
    
    switch (direction) {
      case 'north':
        return neighborhood.coordinates.lat > currentCenter.lat;
      case 'south':
        return neighborhood.coordinates.lat < currentCenter.lat;
      case 'east':
        return neighborhood.coordinates.lng > currentCenter.lng;
      case 'west':
        return neighborhood.coordinates.lng < currentCenter.lng;
      default:
        return false;
    }
  });

  if (filteredNeighborhoods.length === 0) return null;

  // Find the closest neighborhood with highest population score
  const neighborhoodsWithDistance = filteredNeighborhoods.map(neighborhood => ({
    ...neighborhood,
    distance: calculateDistance(currentCenter, neighborhood.coordinates)
  }));

  // Sort by a combination of proximity and population (weighted score)
  neighborhoodsWithDistance.sort((a, b) => {
    const scoreA = a.population - (a.distance * 2); // Subtract distance penalty
    const scoreB = b.population - (b.distance * 2);
    return scoreB - scoreA; // Higher score first
  });

  return neighborhoodsWithDistance[0];
};