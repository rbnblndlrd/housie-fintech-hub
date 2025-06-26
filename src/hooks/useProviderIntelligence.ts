
import { useState, useEffect } from 'react';
import { 
  providerDataService, 
  DemandDataPoint, 
  CompetitionDataPoint, 
  TipDataPoint, 
  OpportunityDataPoint 
} from '@/services/providerDataService';

export const useProviderIntelligence = () => {
  const [demandData, setDemandData] = useState<DemandDataPoint[]>([]);
  const [competitionData, setCompetitionData] = useState<CompetitionDataPoint[]>([]);
  const [tipData, setTipData] = useState<TipDataPoint[]>([]);
  const [opportunityData, setOpportunityData] = useState<OpportunityDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchProviderData = async () => {
    // Don't fetch if we've fetched in the last 30 minutes (cache for performance)
    if (lastFetch && (Date.now() - lastFetch.getTime()) < 1800000) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('🏢 Fetching provider business intelligence data...');
      
      // Fetch all data sources independently
      const [demand, competition, tips, opportunities] = await Promise.all([
        providerDataService.fetchDemandData(),
        providerDataService.fetchCompetitionData(),
        providerDataService.fetchTipData(),
        providerDataService.fetchOpportunityData()
      ]);

      setDemandData(demand);
      setCompetitionData(competition);
      setTipData(tips);
      setOpportunityData(opportunities);
      setLastFetch(new Date());

      console.log('✅ Provider intelligence loaded:', {
        demandPoints: demand.length,
        competitionAreas: competition.length,
        tipZones: tips.length,
        opportunityAreas: opportunities.length
      });
    } catch (error) {
      console.error('❌ Error fetching provider intelligence:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderData();
  }, []);

  // Generate heatmap data for each layer independently
  const getDemandHeatmapData = () => {
    return providerDataService.generateDemandHeatmapData(demandData);
  };

  const getCompetitionHeatmapData = () => {
    return providerDataService.generateCompetitionHeatmapData(competitionData);
  };

  const getTipHeatmapData = () => {
    return providerDataService.generateTipHeatmapData(tipData);
  };

  const getOpportunityHeatmapData = () => {
    return providerDataService.generateOpportunityHeatmapData(opportunityData);
  };

  return {
    demandData,
    competitionData,
    tipData,
    opportunityData,
    isLoading,
    lastFetch,
    fetchProviderData,
    getDemandHeatmapData,
    getCompetitionHeatmapData,
    getTipHeatmapData,
    getOpportunityHeatmapData
  };
};
