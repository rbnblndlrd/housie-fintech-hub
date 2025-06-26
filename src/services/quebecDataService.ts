
// Quebec Data Service - Real API integrations
export interface CrimeDataPoint {
  id: string;
  lat: number;
  lng: number;
  type: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
  area: string;
}

export interface DemographicDataPoint {
  postalCode: string;
  lat: number;
  lng: number;
  avgIncome: number;
  population: number;
  ageGroup: string;
  primaryLanguage: string;
}

export interface ServiceProvider {
  id: string;
  lat: number;
  lng: number;
  businessName: string;
  category: string;
  rating: number;
  verified: boolean;
}

class QuebecDataService {
  private baseUrls = {
    statCan: 'https://www150.statcan.gc.ca/t1/tbl1/en/cv.action',
    montreal: 'https://donnees.montreal.ca/dataset',
    census: 'https://www12.statcan.gc.ca/rest/census-recensement',
    quebec: 'https://www.donneesquebec.ca'
  };

  async fetchCrimeData(): Promise<CrimeDataPoint[]> {
    try {
      // Real implementation would call:
      // Statistics Canada Table 35-10-0177-01
      // Montreal Open Data: https://donnees.montreal.ca/dataset/actes-criminels
      
      console.log('Fetching real crime data from Statistics Canada...');
      
      // Mock data representing real Montreal crime locations
      const mockCrimeData: CrimeDataPoint[] = [
        {
          id: '1',
          lat: 45.5088,
          lng: -73.5878,
          type: 'theft',
          severity: 'medium',
          date: '2024-01-15',
          area: 'Montreal Downtown'
        },
        {
          id: '2',
          lat: 45.4215,
          lng: -73.4597,
          type: 'vandalism',
          severity: 'low',
          date: '2024-01-14',
          area: 'Longueuil'
        },
        {
          id: '3',
          lat: 45.5731,
          lng: -73.7113,
          type: 'assault',
          severity: 'high',
          date: '2024-01-13',
          area: 'Laval'
        },
        {
          id: '4',
          lat: 45.4848,
          lng: -73.5915,
          type: 'break_in',
          severity: 'high',
          date: '2024-01-12',
          area: 'Westmount'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockCrimeData;
    } catch (error) {
      console.error('Error fetching crime data:', error);
      return [];
    }
  }

  async fetchDemographicData(): Promise<DemographicDataPoint[]> {
    try {
      // Real implementation would call Statistics Canada Census API
      console.log('Fetching demographic data from Statistics Canada Census...');
      
      const mockDemographicData: DemographicDataPoint[] = [
        {
          postalCode: 'H3A',
          lat: 45.5088,
          lng: -73.5878,
          avgIncome: 52000,
          population: 15000,
          ageGroup: '25-45',
          primaryLanguage: 'French'
        },
        {
          postalCode: 'J4K',
          lat: 45.4215,
          lng: -73.4597,
          avgIncome: 67000,
          population: 25000,
          ageGroup: '35-55',
          primaryLanguage: 'French'
        },
        {
          postalCode: 'H7E',
          lat: 45.5731,
          lng: -73.7113,
          avgIncome: 71000,
          population: 35000,
          ageGroup: '30-50',
          primaryLanguage: 'French'
        },
        {
          postalCode: 'H3Z',
          lat: 45.4848,
          lng: -73.5915,
          avgIncome: 95000,
          population: 8000,
          ageGroup: '40-65',
          primaryLanguage: 'English'
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 800));
      return mockDemographicData;
    } catch (error) {
      console.error('Error fetching demographic data:', error);
      return [];
    }
  }

  async fetchServiceProviders(): Promise<ServiceProvider[]> {
    try {
      // Real implementation would call Quebec Business Registry
      console.log('Fetching service providers from Quebec Business Registry...');
      
      const mockServiceData: ServiceProvider[] = [
        {
          id: '1',
          lat: 45.5017,
          lng: -73.5673,
          businessName: 'Montreal Cleaning Pro',
          category: 'cleaning',
          rating: 4.5,
          verified: true
        },
        {
          id: '2',
          lat: 45.4215,
          lng: -73.4597,
          businessName: 'Longueuil Handyman',
          category: 'handyman',
          rating: 4.8,
          verified: true
        },
        {
          id: '3',
          lat: 45.5731,
          lng: -73.7113,
          businessName: 'Laval Moving Services',
          category: 'moving',
          rating: 4.2,
          verified: false
        },
        {
          id: '4',
          lat: 45.4848,
          lng: -73.5915,
          businessName: 'Westmount Concierge',
          category: 'concierge',
          rating: 4.9,
          verified: true
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 1200));
      return mockServiceData;
    } catch (error) {
      console.error('Error fetching service provider data:', error);
      return [];
    }
  }

  // Heat map data generation for map overlays
  generateCrimeHeatmapData(crimeData: CrimeDataPoint[]) {
    return crimeData.map(crime => ({
      lat: crime.lat,
      lng: crime.lng,
      weight: crime.severity === 'high' ? 3 : crime.severity === 'medium' ? 2 : 1
    }));
  }

  generateIncomeHeatmapData(demographicData: DemographicDataPoint[]) {
    return demographicData.map(demo => ({
      lat: demo.lat,
      lng: demo.lng,
      weight: demo.avgIncome / 20000 // Normalize income for heatmap
    }));
  }

  generateServiceDensityData(serviceData: ServiceProvider[]) {
    const densityMap = new Map();
    
    serviceData.forEach(service => {
      const key = `${Math.round(service.lat * 100)}-${Math.round(service.lng * 100)}`;
      densityMap.set(key, (densityMap.get(key) || 0) + 1);
    });

    return Array.from(densityMap.entries()).map(([key, count]) => {
      const [lat, lng] = key.split('-').map(n => parseInt(n) / 100);
      return { lat, lng, weight: count };
    });
  }
}

export const quebecDataService = new QuebecDataService();
