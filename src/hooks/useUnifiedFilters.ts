
import { useState, useEffect, useCallback } from 'react';
import { BaseFilters, FilterState } from '@/types/filters';
import { debounce } from '@/utils/filterUtils';

interface UseUnifiedFiltersProps<T extends BaseFilters> {
  initialFilters: T;
  fetchFunction: (filters: T) => Promise<any[]>;
  debounceMs?: number;
}

export const useUnifiedFilters = <T extends BaseFilters>({
  initialFilters,
  fetchFunction,
  debounceMs = 300
}: UseUnifiedFiltersProps<T>) => {
  const [state, setState] = useState<FilterState<T>>({
    filters: initialFilters,
    isLoading: false,
    error: null,
    resultCount: 0
  });

  const [data, setData] = useState<any[]>([]);

  const debouncedFetch = useCallback(
    debounce(async (filters: T) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const results = await fetchFunction(filters);
        setData(results);
        setState(prev => ({
          ...prev,
          isLoading: false,
          resultCount: results.length
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'An error occurred'
        }));
      }
    }, debounceMs),
    [fetchFunction, debounceMs]
  );

  useEffect(() => {
    debouncedFetch(state.filters);
  }, [state.filters, debouncedFetch]);

  const updateFilters = useCallback((updates: Partial<T>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...updates }
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: initialFilters
    }));
  }, [initialFilters]);

  const setDateRange = useCallback((from: Date | null, to: Date | null) => {
    updateFilters({ dateRange: { from, to } } as Partial<T>);
  }, [updateFilters]);

  const setSearchTerm = useCallback((searchTerm: string) => {
    updateFilters({ searchTerm } as Partial<T>);
  }, [updateFilters]);

  const setStatus = useCallback((status: string) => {
    updateFilters({ status } as Partial<T>);
  }, [updateFilters]);

  return {
    data,
    filters: state.filters,
    isLoading: state.isLoading,
    error: state.error,
    resultCount: state.resultCount,
    updateFilters,
    resetFilters,
    setDateRange,
    setSearchTerm,
    setStatus
  };
};
