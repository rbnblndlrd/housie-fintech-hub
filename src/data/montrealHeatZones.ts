
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
      { lat: 45.5176, lng: -73.5894 },
      { lat: 45.5276, lng: -73.5894 },
      { lat: 45.5356, lng: -73.5844 },
      { lat: 45.5376, lng: -73.5794 },
      { lat: 45.5386, lng: -73.5724 },
      { lat: 45.5376, lng: -73.5664 },
      { lat: 45.5346, lng: -73.5614 },
      { lat: 45.5296, lng: -73.5584 },
      { lat: 45.5226, lng: -73.5594 },
      { lat: 45.5176, lng: -73.5634 },
      { lat: 45.5146, lng: -73.5694 },
      { lat: 45.5156, lng: -73.5794 },
      { lat: 45.5176, lng: -73.5844 }
    ],
    center: { lat: 45.5276, lng: -73.5754 },
    demandLevel: 'high',
    demandScore: 92,
    availableProviders: 8,
    avgRent: 1890,
    vacancyRate: 0.6,
    zoneType: 'residential',
    keyServices: {
      cleaning: { demand: 95, providers: 5, avgRate: 42, trending: 'up' },
      handyman: { demand: 88, providers: 3, avgRate: 65, trending: 'up' },
      moving: { demand: 90, providers: 2, avgRate: 140, trending: 'up' },
      lawncare: { demand: 25, providers: 1, avgRate: 35, trending: 'stable' },
      wellness: { demand: 85, providers: 4, avgRate: 95, trending: 'up' },
      pet: { demand: 80, providers: 3, avgRate: 40, trending: 'up' }
    },
    marketInsights: {
      opportunity: 'high',
      competition: 'medium',
      profitability: 87,
      description: 'Ultra-low vacancy rate (0.6%) creates high service demand. Young professionals willing to pay premium rates. High apartment turnover drives cleaning and moving services.'
    }
  },
  {
    id: "ville-marie-downtown",
    name: "Ville-Marie (Downtown)",
    coordinates: [
      { lat: 45.4917, lng: -73.5773 },
      { lat: 45.5017, lng: -73.5773 },
      { lat: 45.5067, lng: -73.5723 },
      { lat: 45.5117, lng: -73.5673 },
      { lat: 45.5127, lng: -73.5603 },
      { lat: 45.5117, lng: -73.5533 },
      { lat: 45.5077, lng: -73.5473 },
      { lat: 45.5017, lng: -73.5453 },
      { lat: 45.4957, lng: -73.5463 },
      { lat: 45.4917, lng: -73.5513 },
      { lat: 45.4897, lng: -73.5573 },
      { lat: 45.4907, lng: -73.5643 },
      { lat: 45.4917, lng: -73.5713 }
    ],
    center: { lat: 45.5017, lng: -73.5613 },
    demandLevel: 'high',
    demandScore: 89,
    availableProviders: 15,
    avgRent: 2308,
    vacancyRate: 1.2,
    zoneType: 'commercial',
    keyServices: {
      cleaning: { demand: 92, providers: 8, avgRate: 55, trending: 'up' },
      handyman: { demand: 85, providers: 6, avgRate: 75, trending: 'stable' },
      moving: { demand: 95, providers: 4, avgRate: 160, trending: 'up' },
      lawncare: { demand: 10, providers: 1, avgRate: 45, trending: 'down' },
      wellness: { demand: 90, providers: 7, avgRate: 120, trending: 'up' },
      pet: { demand: 40, providers: 2, avgRate: 45, trending: 'stable' }
    },
    marketInsights: {
      opportunity: 'high',
      competition: 'high',
      profitability: 84,
      description: 'High-rent commercial district ($2,308 avg). Corporate clients pay premium for reliable service. Focus on commercial cleaning and executive wellness services.'
    }
  },
  {
    id: "westmount",
    name: "Westmount",
    coordinates: [
      { lat: 45.4769, lng: -73.6089 },
      { lat: 45.4819, lng: -73.6129 },
      { lat: 45.4869, lng: -73.6099 },
      { lat: 45.4919, lng: -73.6049 },
      { lat: 45.4969, lng: -73.5989 },
      { lat: 45.4979, lng: -73.5929 },
      { lat: 45.4969, lng: -73.5869 },
      { lat: 45.4939, lng: -73.5819 },
      { lat: 45.4889, lng: -73.5789 },
      { lat: 45.4839, lng: -73.5799 },
      { lat: 45.4789, lng: -73.5829 },
      { lat: 45.4749, lng: -73.5879 },
      { lat: 45.4739, lng: -73.5939 },
      { lat: 45.4749, lng: -73.5999 },
      { lat: 45.4769, lng: -73.6049 }
    ],
    center: { lat: 45.4859, lng: -73.5939 },
    demandLevel: 'high',
    demandScore: 94,
    availableProviders: 4,
    avgRent: 3200,
    vacancyRate: 0.8,
    zoneType: 'premium',
    keyServices: {
      cleaning: { demand: 98, providers: 3, avgRate: 75, trending: 'up' },
      handyman: { demand: 92, providers: 2, avgRate: 95, trending: 'up' },
      lawncare: { demand: 95, providers: 2, avgRate: 65, trending: 'stable' },
      wellness: { demand: 95, providers: 3, avgRate: 150, trending: 'up' },
      pet: { demand: 85, providers: 2, avgRate: 55, trending: 'up' },
      moving: { demand: 70, providers: 1, avgRate: 180, trending: 'stable' }
    },
    marketInsights: {
      opportunity: 'high',
      competition: 'low',
      profitability: 96,
      description: 'Luxury market with highest rates. Affluent residents prioritize quality over price. Low competition, premium service expectations. Excellent for high-end wellness and concierge services.'
    }
  },
  {
    id: "verdun",
    name: "Verdun",
    coordinates: [
      { lat: 45.4489, lng: -73.5673 },
      { lat: 45.4529, lng: -73.5703 },
      { lat: 45.4589, lng: -73.5673 },
      { lat: 45.4639, lng: -73.5623 },
      { lat: 45.4689, lng: -73.5573 },
      { lat: 45.4699, lng: -73.5513 },
      { lat: 45.4689, lng: -73.5453 },
      { lat: 45.4659, lng: -73.5403 },
      { lat: 45.4619, lng: -73.5373 },
      { lat: 45.4569, lng: -73.5363 },
      { lat: 45.4519, lng: -73.5383 },
      { lat: 45.4479, lng: -73.5423 },
      { lat: 45.4449, lng: -73.5483 },
      { lat: 45.4459, lng: -73.5543 },
      { lat: 45.4479, lng: -73.5603 }
    ],
    center: { lat: 45.4579, lng: -73.5523 },
    demandLevel: 'medium',
    demandScore: 72,
    availableProviders: 9,
    avgRent: 1650,
    vacancyRate: 2.1,
    zoneType: 'residential',
    keyServices: {
      cleaning: { demand: 78, providers: 5, avgRate: 38, trending: 'up' },
      handyman: { demand: 82, providers: 4, avgRate: 55, trending: 'up' },
      lawncare: { demand: 70, providers: 3, avgRate: 32, trending: 'stable' },
      wellness: { demand: 45, providers: 2, avgRate: 65, trending: 'stable' },
      pet: { demand: 85, providers: 4, avgRate: 35, trending: 'up' },
      moving: { demand: 65, providers: 3, avgRate: 110, trending: 'stable' }
    },
    marketInsights: {
      opportunity: 'medium',
      competition: 'medium',
      profitability: 68,
      description: 'Growing family neighborhood with strong pet services demand. Residential focus with good lawn care opportunities. Moderate competition and steady demand.'
    }
  },
  {
    id: "outremont",
    name: "Outremont",
    coordinates: [
      { lat: 45.5152, lng: -73.6089 },
      { lat: 45.5202, lng: -73.6119 },
      { lat: 45.5252, lng: -73.6089 },
      { lat: 45.5302, lng: -73.6039 },
      { lat: 45.5352, lng: -73.5989 },
      { lat: 45.5362, lng: -73.5929 },
      { lat: 45.5352, lng: -73.5869 },
      { lat: 45.5322, lng: -73.5819 },
      { lat: 45.5282, lng: -73.5789 },
      { lat: 45.5232, lng: -73.5799 },
      { lat: 45.5182, lng: -73.5829 },
      { lat: 45.5142, lng: -73.5879 },
      { lat: 45.5132, lng: -73.5939 },
      { lat: 45.5142, lng: -73.5999 },
      { lat: 45.5152, lng: -73.6049 }
    ],
    center: { lat: 45.5247, lng: -73.5954 },
    demandLevel: 'medium',
    demandScore: 76,
    availableProviders: 6,
    avgRent: 2650,
    vacancyRate: 1.8,
    zoneType: 'premium',
    keyServices: {
      cleaning: { demand: 82, providers: 4, avgRate: 60, trending: 'stable' },
      handyman: { demand: 74, providers: 3, avgRate: 78, trending: 'stable' },
      lawncare: { demand: 88, providers: 2, avgRate: 55, trending: 'up' },
      wellness: { demand: 85, providers: 3, avgRate: 110, trending: 'up' },
      pet: { demand: 75, providers: 2, avgRate: 45, trending: 'stable' },
      moving: { demand: 60, providers: 2, avgRate: 130, trending: 'stable' }
    },
    marketInsights: {
      opportunity: 'medium',
      competition: 'medium',
      profitability: 78,
      description: 'Upscale family neighborhood. High demand for lawn care and wellness services. Premium rates but moderate competition.'
    }
  },
  {
    id: "lasalle",
    name: "LaSalle",
    coordinates: [
      { lat: 45.4089, lng: -73.6273 },
      { lat: 45.4139, lng: -73.6303 },
      { lat: 45.4189, lng: -73.6273 },
      { lat: 45.4239, lng: -73.6223 },
      { lat: 45.4289, lng: -73.6173 },
      { lat: 45.4309, lng: -73.6103 },
      { lat: 45.4299, lng: -73.6033 },
      { lat: 45.4289, lng: -73.5973 },
      { lat: 45.4269, lng: -73.5913 },
      { lat: 45.4239, lng: -73.5873 },
      { lat: 45.4189, lng: -73.5863 },
      { lat: 45.4139, lng: -73.5883 },
      { lat: 45.4099, lng: -73.5933 },
      { lat: 45.4079, lng: -73.5993 },
      { lat: 45.4089, lng: -73.6053 },
      { lat: 45.4099, lng: -73.6113 },
      { lat: 45.4089, lng: -73.6173 },
      { lat: 45.4089, lng: -73.6233 }
    ],
    center: { lat: 45.4189, lng: -73.6068 },
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
      wellness: { demand: 25, providers: 1, avgRate: 50, trending: 'down' },
      pet: { demand: 50, providers: 4, avgRate: 30, trending: 'stable' },
      moving: { demand: 38, providers: 4, avgRate: 85, trending: 'down' }
    },
    marketInsights: {
      opportunity: 'low',
      competition: 'high',
      profitability: 42,
      description: 'Oversaturated market with high vacancy (3.2%). Lower rates and high competition. Consider focusing on niche services or avoid.'
    }
  }
];
