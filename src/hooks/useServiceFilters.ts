
import { useState, useCallback } from 'react';
import { ServiceFilters } from '@/types/filters';
import { useUnifiedFilters } from './useUnifiedFilters';
import { fetchFilteredServices } from '@/services/filterService';

const initialServiceFilters: ServiceFilters = {
  searchTerm: '',
  category: 'all',
  subcategory: 'all',
  location: 'all',
  verified: null,
  backgroundCheckRequired: null,
  ccqRbqRequired: null,
  riskCategory: 'all',
  priceRange: { min: 0, max: 1000 },
  dateRange: { from: null, to: null },
  status: 'all'
};

export const useServiceFilters = () => {
  const {
    data: services,
    filters,
    isLoading,
    error,
    resultCount,
    updateFilters,
    resetFilters,
    setSearchTerm,
    setStatus,
    setDateRange
  } = useUnifiedFilters({
    initialFilters: initialServiceFilters,
    fetchFunction: fetchFilteredServices
  });

  const setCategory = useCallback((category: string) => {
    // Reset subcategory when category changes
    updateFilters({ category, subcategory: 'all' });
  }, [updateFilters]);

  const setSubcategory = useCallback((subcategory: string) => {
    updateFilters({ subcategory });
  }, [updateFilters]);

  const setLocation = useCallback((location: string) => {
    updateFilters({ location });
  }, [updateFilters]);

  const setVerified = useCallback((verified: boolean | null) => {
    updateFilters({ verified });
  }, [updateFilters]);

  const setBackgroundCheckRequired = useCallback((backgroundCheckRequired: boolean | null) => {
    updateFilters({ backgroundCheckRequired });
  }, [updateFilters]);

  const setCcqRbqRequired = useCallback((ccqRbqRequired: boolean | null) => {
    updateFilters({ ccqRbqRequired });
  }, [updateFilters]);

  const setRiskCategory = useCallback((riskCategory: string) => {
    updateFilters({ riskCategory });
  }, [updateFilters]);

  const setPriceRange = useCallback((min: number, max: number) => {
    updateFilters({ priceRange: { min, max } });
  }, [updateFilters]);

  return {
    services,
    filters,
    isLoading,
    error,
    resultCount,
    updateFilters,
    resetFilters,
    setSearchTerm,
    setStatus,
    setDateRange,
    setCategory,
    setSubcategory,
    setLocation,
    setVerified,
    setBackgroundCheckRequired,
    setCcqRbqRequired,
    setRiskCategory,
    setPriceRange
  };
};
