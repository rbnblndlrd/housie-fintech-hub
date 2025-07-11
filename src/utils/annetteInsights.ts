import { Service } from '@/types/service';

export interface ClusterData {
  location: string;
  providers: Service[];
  avgDistance: number;
  savings: number;
}

export interface AnnetteInsight {
  type: 'cluster' | 'hidden_gem' | 'price_tip' | 'availability' | 'trending' | 'category_specific';
  title: string;
  description: string;
  action: string;
  icon: React.ReactNode;
  priority: number;
  category?: string;
}

export interface FilterContext {
  category: string;
  subcategory: string;
  location: string;
  availability: string;
  priceRange: [number, number];
  verifiedOnly: boolean;
  minCredScore: number;
  searchTerm: string;
}

// Calculate geographic distance between two points (simplified)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Detect service clusters by proximity and category
export const detectServiceClusters = (services: Service[]): ClusterData[] => {
  const clusters: ClusterData[] = [];
  const processed = new Set<string>();
  
  // Group by category first
  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  // For each category, find geographic clusters
  Object.entries(servicesByCategory).forEach(([category, categoryServices]) => {
    if (categoryServices.length < 3) return; // Need at least 3 for a cluster

    categoryServices.forEach((service, index) => {
      if (processed.has(service.id)) return;
      
      const nearby: Service[] = [service];
      const baseCity = service.provider?.user?.city || 'Unknown';
      
      // Find other services in same city/category within radius
      categoryServices.slice(index + 1).forEach(otherService => {
        if (processed.has(otherService.id)) return;
        
        const otherCity = otherService.provider?.user?.city || 'Unknown';
        
        // Mock proximity check (in real app, use actual coordinates)
        if (baseCity === otherCity && !processed.has(otherService.id)) {
          nearby.push(otherService);
          processed.add(otherService.id);
        }
      });

      if (nearby.length >= 3) {
        processed.add(service.id);
        
        // Calculate potential savings
        const avgPrice = nearby.reduce((sum, s) => sum + (s.provider?.hourly_rate || s.base_price || 0), 0) / nearby.length;
        const savings = Math.round(avgPrice * 0.15); // 15% group booking discount
        
        clusters.push({
          location: baseCity,
          providers: nearby,
          avgDistance: 0.5, // Mock average distance in km
          savings
        });
      }
    });
  });

  return clusters;
};

// Get category-specific Annette insights
export const getCategorySpecificInsights = (category: string, services: Service[]): string[] => {
  const insights: Record<string, string[]> = {
    'cleaning': [
      "Clustered pros in your area. Consider split-cost deals with neighbors.",
      "Peak cleaning hours are 10am-2pm. Book off-peak for 20% savings.",
      "Monthly recurring cleaners offer 30% better rates than one-time bookings."
    ],
    'petcare': [
      "Fastest availability today: 🐾 pet sitters ready within 2 hours.",
      "Weekend pet care books up fast. Reserve Friday for best selection.",
      "Bundle dog walking + pet sitting for combo discounts."
    ],
    'tech_support': [
      "Top-rated IT provider charges 30% less than regional avg.",
      "Remote support available for 50% less than on-site visits.",
      "Emergency tech support surcharge applies after 6pm."
    ],
    'events': [
      "Found 3 top-rated decorators nearby with open slots this weekend.",
      "Wedding season books 3-6 months ahead. Planning early saves 40%.",
      "Package deals available: decorator + catering + photography."
    ],
    'handyman': [
      "Multiple handymen in area specialize in home repairs under $500.",
      "Bundle multiple small jobs for better hourly rates.",
      "Winter booking discounts available for indoor projects."
    ],
    'moving': [
      "Peak moving season: May-September. Book early for best rates.",
      "Local moves under 50km cost 40% less than long distance.",
      "Pack yourself and save 25% on moving service costs."
    ]
  };

  return insights[category] || [
    "Quality providers available in your area with competitive rates.",
    "Compare multiple options to find the best value and timing.",
    "Verified providers offer guaranteed service quality and support."
  ];
};

// Main function to generate Annette suggestions based on filters and context
export const getAnnetteSuggestionsForFilters = (
  services: Service[],
  filters: FilterContext,
  clusters: ClusterData[]
): AnnetteInsight[] => {
  const insights: AnnetteInsight[] = [];
  
  // Priority 1: Cluster-based insights
  if (clusters.length > 0) {
    const topCluster = clusters[0];
    insights.push({
      type: 'cluster',
      title: `${topCluster.providers.length} providers clustered in ${topCluster.location}`,
      description: `Group booking could save you $${topCluster.savings}+ per service!`,
      action: "Explore Cluster Deals",
      icon: null, // Will be set in component
      priority: 1,
      category: filters.category
    });
  }

  // Priority 2: Filter-specific insights
  if (filters.availability === 'Today') {
    const availableToday = services.filter(s => s.provider?.verified);
    if (availableToday.length > 0) {
      insights.push({
        type: 'availability',
        title: `${availableToday.length} providers available today`,
        description: "Need it done fast? These verified providers can start immediately.",
        action: "Book for Today",
        icon: null,
        priority: 2
      });
    }
  }

  if (filters.minCredScore > 50) {
    const highCredProviders = services.filter(s => {
      const score = calculateCredScore(s.provider);
      return score >= filters.minCredScore;
    });
    
    if (highCredProviders.length > 0) {
      insights.push({
        type: 'hidden_gem',
        title: `${highCredProviders.length} elite providers match your standards`,
        description: "High cred score providers deliver premium quality and reliability.",
        action: "View Elite Options",
        icon: null,
        priority: 2
      });
    }
  }

  if (filters.priceRange[1] < 100) {
    const budgetServices = services.filter(s => 
      (s.provider?.hourly_rate || s.base_price || 0) <= filters.priceRange[1]
    );
    
    if (budgetServices.length > 0) {
      insights.push({
        type: 'price_tip',
        title: `${budgetServices.length} budget-friendly options`,
        description: "Quality service doesn't have to break the bank.",
        action: "See Budget Options",
        icon: null,
        priority: 3
      });
    }
  }

  // Priority 3: Category-specific insights
  if (filters.category !== 'all') {
    const categoryInsights = getCategorySpecificInsights(filters.category, services);
    const randomInsight = categoryInsights[Math.floor(Math.random() * categoryInsights.length)];
    
    insights.push({
      type: 'category_specific',
      title: `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} Insight`,
      description: randomInsight,
      action: "Learn More",
      icon: null,
      priority: 4,
      category: filters.category
    });
  }

  // Priority 4: Location-based insights
  if (filters.location !== 'all') {
    const locationServices = services.filter(s => 
      s.provider?.user?.city?.toLowerCase().includes(filters.location.toLowerCase())
    );
    
    if (locationServices.length > 0) {
      insights.push({
        type: 'trending',
        title: `Trending in ${filters.location}`,
        description: "Most popular services this week: Cleaning, Handyman, Pet Care",
        action: "See Trending",
        icon: null,
        priority: 5
      });
    }
  }

  return insights.sort((a, b) => a.priority - b.priority);
};

// Helper function to calculate cred score
const calculateCredScore = (provider: any): number => {
  let score = 50; // Base score
  if (provider?.verified) score += 20;
  if (provider?.background_check_verified) score += 15;
  if (provider?.average_rating) score += (provider.average_rating - 3) * 10;
  if (provider?.total_bookings && provider.total_bookings > 10) score += 10;
  if (provider?.ccq_verified || provider?.rbq_verified) score += 5;
  return Math.min(Math.max(score, 0), 100);
};