
// Provider Business Intelligence Data Service - Separate data sources for each layer
export interface DemandDataPoint {
  id: string;
  lat: number;
  lng: number;
  area: string;
  serviceRequestsPerMonth: number;
  populationDensity: number;
  youngProfessionalRatio: number; // 0-1
  demandScore: number; // 0-100
}

export interface CompetitionDataPoint {
  id: string;
  lat: number;
  lng: number;
  area: string;
  activeProviders: number;
  businessDensity: number;
  marketSaturation: number; // 0-1
  competitionLevel: 'low' | 'medium' | 'high';
}

export interface TipDataPoint {
  id: string;
  lat: number;
  lng: number;
  area: string;
  avgHouseholdIncome: number;
  spendingIndex: number; // Consumer spending patterns
  tipPotential: 'low' | 'medium' | 'high';
  avgTipAmount: number;
}

export interface OpportunityDataPoint {
  id: string;
  lat: number;
  lng: number;
  area: string;
  marketGap: number; // Demand - Supply ratio
  growthTrend: number; // Economic growth indicator
  opportunityScore: number; // 0-100
  monthlyPotential: number; // Estimated monthly earnings
}

class ProviderDataService {
  
  // DEMAND DATA - Based on service request frequency and demographics
  async fetchDemandData(): Promise<DemandDataPoint[]> {
    // Simulate real Quebec service request data patterns
    const demandAreas = [
      {
        area: "Montreal Downtown",
        lat: 45.5088,
        lng: -73.5878,
        serviceRequestsPerMonth: 1250, // High urban demand
        populationDensity: 12500,
        youngProfessionalRatio: 0.85
      },
      {
        area: "Westmount",
        lat: 45.4848,
        lng: -73.5915,
        serviceRequestsPerMonth: 890, // Affluent residential
        populationDensity: 8200,
        youngProfessionalRatio: 0.45
      },
      {
        area: "Longueuil",
        lat: 45.4215,
        lng: -73.4597,
        serviceRequestsPerMonth: 420, // Suburban family area
        populationDensity: 3500,
        youngProfessionalRatio: 0.55
      },
      {
        area: "Laval",
        lat: 45.5731,
        lng: -73.7113,
        serviceRequestsPerMonth: 680, // Growing suburbs
        populationDensity: 4200,
        youngProfessionalRatio: 0.70
      },
      {
        area: "Quebec City Old Town",
        lat: 46.8139,
        lng: -71.2080,
        serviceRequestsPerMonth: 950, // Tourist + residential
        populationDensity: 6800,
        youngProfessionalRatio: 0.65
      },
      {
        area: "Sherbrooke Centre",
        lat: 45.4042,
        lng: -71.8929,
        serviceRequestsPerMonth: 340, // University town
        populationDensity: 2800,
        youngProfessionalRatio: 0.90
      },
      {
        area: "Gatineau",
        lat: 45.4765,
        lng: -75.7013,
        serviceRequestsPerMonth: 520, // Government workers
        populationDensity: 3100,
        youngProfessionalRatio: 0.60
      }
    ];

    return demandAreas.map(area => ({
      id: `demand-${area.area}`,
      ...area,
      // Calculate demand score based on service requests and demographics
      demandScore: Math.min(100, 
        (area.serviceRequestsPerMonth / 15) + 
        (area.youngProfessionalRatio * 30) +
        (area.populationDensity / 200)
      )
    }));
  }

  // COMPETITION DATA - Based on business registry and provider density
  async fetchCompetitionData(): Promise<CompetitionDataPoint[]> {
    const competitionAreas = [
      {
        area: "Montreal Downtown",
        lat: 45.5088,
        lng: -73.5878,
        activeProviders: 245,
        businessDensity: 850, // Businesses per km²
      },
      {
        area: "Westmount",
        lat: 45.4848,
        lng: -73.5915,
        activeProviders: 67,
        businessDensity: 320,
      },
      {
        area: "Longueuil",
        lat: 45.4215,
        lng: -73.4597,
        activeProviders: 89,
        businessDensity: 180,
      },
      {
        area: "Laval",
        lat: 45.5731,
        lng: -73.7113,
        activeProviders: 156,
        businessDensity: 280,
      },
      {
        area: "Quebec City Old Town",
        lat: 46.8139,
        lng: -71.2080,
        activeProviders: 125,
        businessDensity: 450,
      },
      {
        area: "Sherbrooke Centre",
        lat: 45.4042,
        lng: -71.8929,
        activeProviders: 45,
        businessDensity: 120,
      },
      {
        area: "Gatineau",
        lat: 45.4765,
        lng: -75.7013,
        activeProviders: 98,
        businessDensity: 200,
      }
    ];

    return competitionAreas.map(area => {
      // Market saturation = providers per business opportunity
      const marketSaturation = area.activeProviders / (area.businessDensity / 10);
      
      return {
        id: `competition-${area.area}`,
        ...area,
        marketSaturation,
        competitionLevel: marketSaturation > 0.8 ? 'high' : 
                         marketSaturation > 0.4 ? 'medium' : 'low'
      };
    });
  }

  // TIP DATA - Based on income and consumer spending patterns
  async fetchTipData(): Promise<TipDataPoint[]> {
    const tipAreas = [
      {
        area: "Montreal Downtown",
        lat: 45.5088,
        lng: -73.5878,
        avgHouseholdIncome: 52000,
        spendingIndex: 0.75, // Urban spending patterns
      },
      {
        area: "Westmount", 
        lat: 45.4848,
        lng: -73.5915,
        avgHouseholdIncome: 95000,
        spendingIndex: 1.2, // High-end spending
      },
      {
        area: "Longueuil",
        lat: 45.4215,
        lng: -73.4597,
        avgHouseholdIncome: 67000,
        spendingIndex: 0.85, // Family spending
      },
      {
        area: "Laval",
        lat: 45.5731,
        lng: -73.7113,
        avgHouseholdIncome: 71000,
        spendingIndex: 0.90, // Suburban spending
      },
      {
        area: "Quebec City Old Town",
        lat: 46.8139,
        lng: -71.2080,
        avgHouseholdIncome: 48000,
        spendingIndex: 0.70, // Tourist influence
      },
      {
        area: "Sherbrooke Centre",
        lat: 45.4042,
        lng: -71.8929,
        avgHouseholdIncome: 45000,
        spendingIndex: 0.60, // Student area
      },
      {
        area: "Gatineau",
        lat: 45.4765,
        lng: -75.7013,
        avgHouseholdIncome: 72000,
        spendingIndex: 0.95, // Government worker stability
      }
    ];

    return tipAreas.map(area => {
      // Calculate tip potential based on income and spending patterns
      const avgTipAmount = Math.round(
        (area.avgHouseholdIncome / 2000) * area.spendingIndex + 
        (area.spendingIndex * 15)
      );
      
      return {
        id: `tip-${area.area}`,
        ...area,
        avgTipAmount,
        tipPotential: area.avgHouseholdIncome > 80000 ? 'high' :
                     area.avgHouseholdIncome > 50000 ? 'medium' : 'low'
      };
    });
  }

  // OPPORTUNITY DATA - Market gap analysis (independent calculation)
  async fetchOpportunityData(): Promise<OpportunityDataPoint[]> {
    const opportunityAreas = [
      {
        area: "Montreal Downtown",
        lat: 45.5088,
        lng: -73.5878,
        marketGap: 0.65, // High demand but high competition
        growthTrend: 1.2, // Economic growth factor
      },
      {
        area: "Westmount",
        lat: 45.4848,
        lng: -73.5915,
        marketGap: 1.45, // Lower competition, good income
        growthTrend: 1.1,
      },
      {
        area: "Longueuil", 
        lat: 45.4215,
        lng: -73.4597,
        marketGap: 1.25, // Underserved suburban area
        growthTrend: 1.35, // Growing market
      },
      {
        area: "Laval",
        lat: 45.5731,
        lng: -73.7113,
        marketGap: 1.15, // Good balance
        growthTrend: 1.25,
      },
      {
        area: "Quebec City Old Town",
        lat: 46.8139,
        lng: -71.2080,
        marketGap: 0.85, // Moderate opportunity
        growthTrend: 1.05,
      },
      {
        area: "Sherbrooke Centre",
        lat: 45.4042,
        lng: -71.8929,
        marketGap: 1.55, // High opportunity, low competition
        growthTrend: 1.15,
      },
      {
        area: "Gatineau",
        lat: 45.4765,
        lng: -75.7013,
        marketGap: 1.35, // Good market opportunity
        growthTrend: 1.20,
      }
    ];

    return opportunityAreas.map(area => {
      // Independent opportunity calculation
      const opportunityScore = Math.min(100,
        (area.marketGap * 50) + (area.growthTrend * 25)
      );
      
      const monthlyPotential = Math.round(
        area.marketGap * area.growthTrend * 2800
      );

      return {
        id: `opportunity-${area.area}`,
        ...area,
        opportunityScore,
        monthlyPotential
      };
    });
  }

  // Generate heatmap data for map overlays - each with different patterns
  generateDemandHeatmapData(demandData: DemandDataPoint[]) {
    return demandData.map(point => ({
      lat: point.lat,
      lng: point.lng,
      weight: point.demandScore / 20 // Normalize for heatmap
    }));
  }

  generateCompetitionHeatmapData(competitionData: CompetitionDataPoint[]) {
    return competitionData.map(point => ({
      lat: point.lat,
      lng: point.lng,
      weight: point.marketSaturation * 5 // Different scaling
    }));
  }

  generateTipHeatmapData(tipData: TipDataPoint[]) {
    return tipData.map(point => ({
      lat: point.lat,
      lng: point.lng,
      weight: point.avgTipAmount / 10 // Income-based scaling
    }));
  }

  generateOpportunityHeatmapData(opportunityData: OpportunityDataPoint[]) {
    return opportunityData.map(point => ({
      lat: point.lat,
      lng: point.lng,
      weight: point.opportunityScore / 15 // Opportunity-specific scaling
    }));
  }
}

export const providerDataService = new ProviderDataService();
