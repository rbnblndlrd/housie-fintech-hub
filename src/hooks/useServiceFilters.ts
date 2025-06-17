
import { useMemo } from 'react';
import { Service } from "@/types/service";

interface UseServiceFiltersProps {
  services: Service[];
  searchTerm: string;
  selectedCategory: string;
  priceRange: [number, number];
}

export const useServiceFilters = ({
  services,
  searchTerm,
  selectedCategory,
  priceRange
}: UseServiceFiltersProps) => {
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.provider.business_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      
      const servicePrice = service.pricing_type === 'hourly' ? service.provider.hourly_rate : service.base_price;
      const matchesPrice = servicePrice >= priceRange[0] && servicePrice <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [services, searchTerm, selectedCategory, priceRange]);

  return filteredServices;
};
