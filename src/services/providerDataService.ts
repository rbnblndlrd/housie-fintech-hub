
// Provider Business Intelligence Data Service - Truly Independent Data Sources
export interface DemandDataPoint {
  id: string;
  lat: number;
  lng: number;
  area: string;
  serviceRequestsPerMonth: number;
  populationDensity: number;  
  youngProfessionalRatio: number; // 0-1
  demandScore: number; // 0-100
  zoneType: 'residential' | 'student' | 'business' | 'mixed';
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
  corridorType: 'commercial' | 'industrial' | 'mixed';
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
  wealthCluster: 'luxury' | 'affluent' | 'middle' | 'budget';
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
  developmentType: 'emerging' | 'underserved' | 'growing' | 'untapped';
}

class ProviderDataService {
  
  // DEMAND DATA - Residential & Student Areas (Service Request Hotspots)
  async fetchDemandData(): Promise<DemandDataPoint[]> {
    const demandHotspots = [
      {
        area: "NDG Residential",
        lat: 45.4758,
        lng: -73.6152,
        serviceRequestsPerMonth: 890,
        populationDensity: 8500,
        youngProfessionalRatio: 0.75,
        zoneType: 'residential' as const
      },
      {
        area: "McGill University Area",
        lat: 45.5048,
        lng: -73.5772,
        serviceRequestsPerMonth: 1200,
        populationDensity: 15000,
        youngProfessionalRatio: 0.95,
        zoneType: 'student' as const
      },
      {
        area: "Concordia Campus Zone",
        lat: 45.4969,
        lng: -73.5787,
        serviceRequestsPerMonth: 950,
        populationDensity: 12000,
        youngProfessionalRatio: 0.90,
        zoneType: 'student' as const
      },
      {
        area: "Plateau Residential",
        lat: 45.5247,
        lng: -73.5773,
        serviceRequestsPerMonth: 1450,
        populationDensity: 11000,
        youngProfessionalRatio: 0.80,
        zoneType: 'residential' as const
      },
      {
        area: "Rosemont Family District",
        lat: 45.5516,
        lng: -73.5794,
        serviceRequestsPerMonth: 680,
        populationDensity: 6800,
        youngProfessionalRatio: 0.45,
        zoneType: 'residential' as const
      },
      {
        area: "Brossard Suburbs",
        lat: 45.4584,
        lng: -73.4684,
        serviceRequestsPerMonth: 520,
        populationDensity: 4200,
        youngProfessionalRatio: 0.60,
        zoneType: 'residential' as const
      },
      {
        area: "Laval University Hub",
        lat: 46.7787,
        lng: -71.2758,
        serviceRequestsPerMonth: 1100,
        populationDensity: 9500,
        youngProfessionalRatio: 0.85,
        zoneType: 'student' as const
      },
      {
        area: "Dollard-des-Ormeaux",
        lat: 45.4942,
        lng: -73.8242,
        serviceRequestsPerMonth: 340,
        populationDensity: 3800,
        youngProfessionalRatio: 0.35,
        zoneType: 'residential' as const
      }
    ];

    return demandHotspots.map(area => ({
      id: `demand-${area.area}`,
      ...area,
      demandScore: Math.min(100, 
        (area.serviceRequestsPerMonth / 20) + 
        (area.youngProfessionalRatio * 35) +
        (area.populationDensity / 300)
      )
    }));
  }

  // COMPETITION DATA - Commercial Corridors & Business Parks
  async fetchCompetitionData(): Promise<CompetitionDataPoint[]> {
    const competitionCorridors = [
      {
        area: "St-Laurent Business Strip",
        lat: 45.5308,
        lng: -73.6192,
        activeProviders: 180,
        businessDensity: 620,
        corridorType: 'commercial' as const
      },
      {
        area: "Cavendish Mall Corridor",
        lat: 45.4599,
        lng: -73.6294,
        activeProviders: 95,
        businessDensity: 340,
        corridorType: 'commercial' as const
      },
      {
        area: "Technoparc Montreal",
        lat: 45.5056,
        lng: -73.6504,
        activeProviders: 220,
        businessDensity: 480,
        corridorType: 'industrial' as const
      },
      {
        area: "Marché Central",
        lat: 45.5447,
        lng: -73.6486,
        activeProviders: 150,
        businessDensity: 290,
        corridorType: 'commercial' as const
      },
      {
        area: "Quartier DIX30",
        lat: 45.5036,
        lng: -73.4656,
        activeProviders: 130,
        businessDensity: 410,
        corridorType: 'mixed' as const
      },
      {
        area: "Anjou Industrial Park",
        lat: 45.6056,
        lng: -73.5456,
        activeProviders: 85,
        businessDensity: 180,
        corridorType: 'industrial' as const
      },
      {
        area: "Galeries d'Anjou Area",
        lat: 45.6085,
        lng: -73.5597,
        activeProviders: 110,
        businessDensity: 250,
        corridorType: 'commercial' as const
      }
    ];

    return competitionCorridors.map(area => {
      const marketSaturation = area.activeProviders / (area.businessDensity / 8);
      
      return {
        id: `competition-${area.area}`,
        ...area,
        marketSaturation,
        competitionLevel: marketSaturation > 0.9 ? 'high' : 
                         marketSaturation > 0.5 ? 'medium' : 'low'
      };
    });
  }

  // TIP DATA - Wealth Clusters & High-Spending Areas
  async fetchTipData(): Promise<TipDataPoint[]> {
    const wealthClusters = [
      {
        area: "Westmount Luxury",
        lat: 45.4848,
        lng: -73.5915,
        avgHouseholdIncome: 145000,
        spendingIndex: 1.8,
        wealthCluster: 'luxury' as const
      },
      {
        area: "Outremont Affluent",
        lat: 45.5188,
        lng: -73.6058,
        avgHouseholdIncome: 125000,
        spendingIndex: 1.6,
        wealthCluster: 'luxury' as const
      },
      {
        area: "Town of Mount Royal",
        lat: 45.5128,
        lng: -73.6298,
        avgHouseholdIncome: 135000,
        spendingIndex: 1.7,
        wealthCluster: 'luxury' as const
      },
      {
        area: "Beaconsfield Waterfront",
        lat: 45.4265,
        lng: -73.8617,
        avgHouseholdIncome: 115000,
        spendingIndex: 1.4,
        wealthCluster: 'affluent' as const
      },
      {
        area: "Kirkland Executive",
        lat: 45.4467,
        lng: -73.8450,
        avgHouseholdIncome: 105000,
        spendingIndex: 1.3,
        wealthCluster: 'affluent' as const
      },
      {
        area: "Brossard Professionals",
        lat: 45.4504,
        lng: -73.4420,
        avgHouseholdIncome: 88000,
        spendingIndex: 1.1,
        wealthCluster: 'middle' as const
      },
      {
        area: "Laval Executive District",
        lat: 45.5645,
        lng: -73.7236,
        avgHouseholdIncome: 92000,
        spendingIndex: 1.15,
        wealthCluster: 'middle' as const
      },
      {
        area: "Dollard Professionals",
        lat: 45.4921,
        lng: -73.8401,
        avgHouseholdIncome: 78000,
        spendingIndex: 0.95,
        wealthCluster: 'middle' as const
      }
    ];

    return wealthClusters.map(area => {
      const avgTipAmount = Math.round(
        (area.avgHouseholdIncome / 1500) * area.spendingIndex + 
        (area.spendingIndex * 18)
      );
      
      return {
        id: `tip-${area.area}`,
        ...area,
        avgTipAmount,
        tipPotential: area.avgHouseholdIncome > 120000 ? 'high' :
                     area.avgHouseholdIncome > 80000 ? 'medium' : 'low'
      };
    });
  }

  // OPPORTUNITY DATA - Growth Areas & Market Gaps
  async fetchOpportunityData(): Promise<OpportunityDataPoint[]> {
    const opportunityZones = [
      {
        area: "Pierrefonds Growth Zone",
        lat: 45.4947,
        lng: -73.8597,
        marketGap: 1.85,
        growthTrend: 1.45,
        developmentType: 'growing' as const
      },
      {
        area: "Ste-Dorothée Emerging",
        lat: 45.5654,
        lng: -73.8012,
        marketGap: 2.1,
        growthTrend: 1.6,
        developmentType: 'emerging' as const
      },
      {
        area: "Rivière-des-Prairies",
        lat: 45.6456,
        lng: -73.4987,
        marketGap: 1.95,
        growthTrend: 1.5,
        developmentType: 'underserved' as const
      },
      {
        area: "Pointe-aux-Trembles",
        lat: 45.6875,
        lng: -73.4956,
        marketGap: 2.3,
        growthTrend: 1.35,
        developmentType: 'untapped' as const
      },
      {
        area: "Candiac New Development",
        lat: 45.3856,
        lng: -73.5156,
        marketGap: 1.75,
        growthTrend: 1.7,
        developmentType: 'growing' as const
      },
      {
        area: "Mirabel Airport Region", 
        lat: 45.6789,
        lng: -74.0365,
        marketGap: 2.4,
        growthTrend: 1.8,
        developmentType: 'emerging' as const
      },
      {
        area: "Vaudreuil-Dorion",
        lat: 45.4015,
        lng: -74.0289,
        marketGap: 1.9,
        growthTrend: 1.55,
        developmentType: 'growing' as const
      },
      {
        area: "Terrebonne Expansion",
        lat: 45.7006,
        lng: -73.6456,
        marketGap: 1.8,
        growthTrend: 1.4,
        developmentType: 'underserved' as const
      }
    ];

    return opportunityZones.map(area => {
      const opportunityScore = Math.min(100,
        (area.marketGap * 35) + (area.growthTrend * 30)
      );
      
      const monthlyPotential = Math.round(
        area.marketGap * area.growthTrend * 3200
      );

      return {
        id: `opportunity-${area.area}`,
        ...area,
        opportunityScore,
        monthlyPotential
      };
    });
  }

  // Generate independent heatmap data for each layer
  generateDemandHeatmapData(demandData: DemandDataPoint[]) {
    return demandData.map(point => ({
      lat: point.lat,
      lng: point.lng,
      weight: Math.min(8, point.demandScore / 12) // Different scaling for demand
    }));
  }

  generateCompetitionHeatmapData(competitionData: CompetitionDataPoint[]) {
    return competitionData.map(point => ({
      lat: point.lat,
      lng: point.lng,
      weight: Math.min(10, point.marketSaturation * 8) // Competition-specific scaling
    }));
  }

  generateTipHeatmapData(tipData: TipDataPoint[]) {
    return tipData.map(point => ({
      lat: point.lat,
      lng: point.lng,
      weight: Math.min(9, point.spendingIndex * 4) // Wealth-based scaling
    }));
  }

  generateOpportunityHeatmapData(opportunityData: OpportunityDataPoint[]) {
    return opportunityData.map(point => ({
      lat: point.lat,
      lng: point.lng,
      weight: Math.min(7, point.marketGap * 2.5) // Opportunity-specific scaling
    }));
  }
}

export const providerDataService = new ProviderDataService();
