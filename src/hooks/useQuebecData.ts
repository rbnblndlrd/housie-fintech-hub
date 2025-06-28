
import { useState, useEffect } from 'react';
import { quebecDataService, CrimeDataPoint, DemographicDataPoint, ServiceProvider } from '@/services/quebecDataService';

export const useQuebecData = () => {
  const [crimeData, setCrimeData] = useState<CrimeDataPoint[]>([]);
  const [demographicData, setDemographicData] = useState<DemographicDataPoint[]>([]);
  const [serviceData, setServiceData] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchAllData = async () => {
    // Don't fetch if we've fetched in the last hour (cache for performance)
    if (lastFetch && (Date.now() - lastFetch.getTime()) < 3600000) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('🍁 Fetching real Quebec government data...');
      
      const [crime, demographics, services] = await Promise.all([
        quebecDataService.fetchCrimeData(),
        quebecDataService.fetchDemographicData(),
        quebecDataService.fetchServiceProviders()
      ]);

      setCrimeData(crime);
      setDemographicData(demographics);
      setServiceData(services);
      setLastFetch(new Date());

      console.log('✅ Quebec data loaded:', {
        crimePoints: crime.length,
        demographicAreas: demographics.length,
        serviceProviders: services.length
      });
    } catch (error) {
      console.error('❌ Error fetching Quebec data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Generate heatmap data for map overlays
  const getCrimeHeatmapData = () => {
    return quebecDataService.generateCrimeHeatmapData(crimeData);
  };

  const getIncomeHeatmapData = () => {
    return quebecDataService.generateIncomeHeatmapData(demographicData);
  };

  const getServiceDensityData = () => {
    return quebecDataService.generateServiceDensityData(serviceData);
  };

  return {
    crimeData,
    demographicData,
    serviceData,
    isLoading,
    lastFetch,
    fetchAllData,
    getCrimeHeatmapData,
    getIncomeHeatmapData,
    getServiceDensityData
  };
};
