
import { BaseFilters, PriceRange } from '@/types/filters';

export const matchesSearch = (text: string, searchTerm: string): boolean => {
  if (!searchTerm.trim()) return true;
  return text.toLowerCase().includes(searchTerm.toLowerCase());
};

export const matchesPriceRange = (price: number, range: PriceRange): boolean => {
  return price >= range.min && price <= range.max;
};

export const matchesStatus = (itemStatus: string, filterStatus: string): boolean => {
  if (filterStatus === 'all' || !filterStatus) return true;
  return itemStatus === filterStatus;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const buildSupabaseFilters = (tableName: string, filters: BaseFilters) => {
  const conditions: string[] = [];
  const params: Record<string, any> = {};

  if (filters.searchTerm) {
    // This will be customized per table in the service layer
    conditions.push('search_condition');
    params.searchTerm = `%${filters.searchTerm}%`;
  }

  if (filters.status && filters.status !== 'all') {
    conditions.push(`${tableName}.status = @status`);
    params.status = filters.status;
  }

  if (filters.dateRange.from) {
    conditions.push(`${tableName}.created_at >= @dateFrom`);
    params.dateFrom = filters.dateRange.from.toISOString();
  }

  if (filters.dateRange.to) {
    conditions.push(`${tableName}.created_at <= @dateTo`);
    params.dateTo = filters.dateRange.to.toISOString();
  }

  return { conditions, params };
};
