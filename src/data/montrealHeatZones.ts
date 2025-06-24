
export interface MontrealHeatZone {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number }[];
  center: { lat: number; lng: number };
  demandLevel: 'high' | 'medium' | 'low';
  demandScore: number;
  availableProviders: number;
  avgRent: number;
  vacancyRate: number;
  zoneType: 'residential' | 'commercial' | 'mixed' | 'premium';
  keyServices: {
    [key: string]: {
      demand: number;
      providers: number;
      avgRate: number;
      trending: 'up' | 'down' | 'stable';
    };
  };
  marketInsights: {
    opportunity: 'high' | 'medium' | 'low';
    competition: 'low' | 'medium' | 'high';
    profitability: number;
    description: string;
  };
}

export const montrealHeatZones: MontrealHeatZone[] = [
  {
    id: "plateau-mont-royal",
    name: "Plateau-Mont-Royal",
    coordinates: [
      { lat: 45.5276, lng: -73.5894 },
      { lat: 45.5376, lng: -73.5794 },
      { lat: 45.5376, lng: -73.5694 },
      { lat: 45.5176, lng: -73.5694 },
      { lat: 45.5176, lng: -73.5894 }
    ],
    center: { lat: 45.5276, lng: -73.5794 },
    demandLevel: 'high',
    demandScore: 92,
    availableProviders: 8,
    avgRent: 1890,
    vacancyRate: 0.6,
    zoneType: 'residential',
    keyServices: {
      cleaning: { demand: 95, providers: 5, avgRate: 42, trending: 'up' },
      handyman: { demand: 88, providers: 3, avgRate: 65, trending: 'up' },
      moving: { demand: 78, providers: 2, avgRate: 120, trending: 'stable' },
      lawncare: { demand: 45, providers: 1, avgRate: 35, trending: 'stable' }
    },
    marketInsights: {
      opportunity: 'high',
      competition: 'medium',
      profitability: 87,
      description: 'Ultra-low vacancy rate (0.6%) creates high service demand. Young professionals willing to pay premium rates.'
    }
  },
  {
    id: "ville-marie-downtown",
    name: "Ville-Marie (Downtown)",
    coordinates: [
      { lat: 45.5017, lng: -73.5773 },
      { lat: 45.5117, lng: -73.5673 },
      { lat: 45.5117, lng: -73.5473 },
      { lat: 45.4917, lng: -73.5473 },
      { lat: 45.4917, lng: -73.5773 }
    ],
    center: { lat: 45.5017, lng: -73.5673 },
    demandLevel: 'high',
    demandScore: 89,
    availableProviders: 15,
    avgRent: 2308,
    vacancyRate: 1.2,
    zoneType: 'commercial',
    keyServices: {
      cleaning: { demand: 92, providers: 8, avgRate: 48, trending: 'up' },
      handyman: { demand: 85, providers: 6, avgRate: 75, trending: 'stable' },
      moving: { demand: 95, providers: 4, avgRate: 140, trending: 'up' },
      security: { demand: 88, providers: 3, avgRate: 85, trending: 'up' }
    },
    marketInsights: {
      opportunity: 'high',
      competition: 'high',
      profitability: 84,
      description: 'High-rent commercial district ($2,308 avg). Corporate clients pay premium for reliable service.'
    }
  },
  {
    id: "westmount",
    name: "Westmount",
    coordinates: [
      { lat: 45.4869, lng: -73.6089 },
      { lat: 45.4969, lng: -73.5989 },
      { lat: 45.4969, lng: -73.5789 },
      { lat: 45.4769, lng: -73.5789 },
      { lat: 45.4769, lng: -73.6089 }
    ],
    center: { lat: 45.4869, lng: -73.5989 },
    demandLevel: 'high',
    demandScore: 94,
    availableProviders: 4,
    avgRent: 3200,
    vacancyRate: 0.8,
    zoneType: 'premium',
    keyServices: {
      cleaning: { demand: 98, providers: 3, avgRate: 65, trending: 'up' },
      handyman: { demand: 92, providers: 2, avgRate: 95, trending: 'up' },
      lawncare: { demand: 95, providers: 2, avgRate: 55, trending: 'stable' },
      concierge: { demand: 88, providers: 1, avgRate: 125, trending: 'up' }
    },
    marketInsights: {
      opportunity: 'high',
      competition: 'low',
      profitability: 96,
      description: 'Luxury market with highest rates. Affluent residents prioritize quality over price. Low competition.'
    }
  },
  {
    id: "outremont",
    name: "Outremont",
    coordinates: [
      { lat: 45.5252, lng: -73.6089 },
      { lat: 45.5352, lng: -73.5989 },
      { lat: 45.5352, lng: -73.5789 },
      { lat: 45.5152, lng: -73.5789 },
      { lat: 45.5152, lng: -73.6089 }
    ],
    center: { lat: 45.5252, lng: -73.5989 },
    demandLevel: 'medium',
    demandScore: 76,
    availableProviders: 6,
    avgRent: 2650,
    vacancyRate: 1.8,
    zoneType: 'premium',
    keyServices: {
      cleaning: { demand: 82, providers: 4, avgRate: 55, trending: 'stable' },
      handyman: { demand: 74, providers: 3, avgRate: 78, trending: 'stable' },
      lawncare: { demand: 88, providers: 2, avgRate: 48, trending: 'up' },
      tutoring: { demand: 92, providers: 1, avgRate: 65, trending: 'up' }
    },
    marketInsights: {
      opportunity: 'medium',
      competition: 'medium',
      profitability: 78,
      description: 'Upscale family neighborhood. High demand for educational services and premium home care.'
    }
  },
  {
    id: "anjou",
    name: "Anjou",
    coordinates: [
      { lat: 45.6089, lng: -73.5573 },
      { lat: 45.6189, lng: -73.5473 },
      { lat: 45.6189, lng: -73.5173 },
      { lat: 45.5989, lng: -73.5173 },
      { lat: 45.5989, lng: -73.5573 }
    ],
    center: { lat: 45.6089, lng: -73.5373 },
    demandLevel: 'medium',
    demandScore: 68,
    availableProviders: 12,
    avgRent: 1450,
    vacancyRate: 2.4,
    zoneType: 'residential',
    keyServices: {
      cleaning: { demand: 65, providers: 6, avgRate: 32, trending: 'stable' },
      handyman: { demand: 72, providers: 4, avgRate: 48, trending: 'up' },
      lawncare: { demand: 85, providers: 5, avgRate: 28, trending: 'up' },
      moving: { demand: 58, providers: 3, avgRate: 95, trending: 'stable' }
    },
    marketInsights: {
      opportunity: 'medium',
      competition: 'high',
      profitability: 62,
      description: 'Growing suburban area. Good volume potential but lower rates. Focus on efficiency and scale.'
    }
  },
  {
    id: "lasalle",
    name: "LaSalle",
    coordinates: [
      { lat: 45.4189, lng: -73.6273 },
      { lat: 45.4289, lng: -73.6173 },
      { lat: 45.4289, lng: -73.5873 },
      { lat: 45.4089, lng: -73.5873 },
      { lat: 45.4089, lng: -73.6273 }
    ],
    center: { lat: 45.4189, lng: -73.6073 },
    demandLevel: 'low',
    demandScore: 45,
    availableProviders: 18,
    avgRent: 1280,
    vacancyRate: 3.2,
    zoneType: 'mixed',
    keyServices: {
      cleaning: { demand: 42, providers: 8, avgRate: 28, trending: 'down' },
      handyman: { demand: 48, providers: 6, avgRate: 42, trending: 'stable' },
      lawncare: { demand: 55, providers: 7, avgRate: 25, trending: 'stable' },
      moving: { demand: 38, providers: 4, avgRate: 85, trending: 'down' }
    },
    marketInsights: {
      opportunity: 'low',
      competition: 'high',
      profitability: 42,
      description: 'Oversaturated market with high vacancy (3.2%). Focus on niche services or avoid.'
    }
  }
];
