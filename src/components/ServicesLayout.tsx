
import React from 'react';
import Header from '@/components/Header';
import ServicesHeader from '@/components/ServicesHeader';
import ServiceFilters from '@/components/ServiceFilters';
import ServicesGrid from '@/components/ServicesGrid';
import { Service } from '@/types/service';

interface ServicesLayoutProps {
  services: Service[];
  filteredServices: Service[];
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: string;
  selectedSubcategory: string;
  selectedLocation: string;
  priceRange: [number, number];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onPriceRangeChange: (value: [number, number]) => void;
  onBookNow: (service: Service) => void;
}

const ServicesLayout: React.FC<ServicesLayoutProps> = ({
  services,
  filteredServices,
  isLoading,
  searchTerm,
  selectedCategory,
  selectedSubcategory,
  selectedLocation,
  priceRange,
  onSearchChange,
  onCategoryChange,
  onSubcategoryChange,
  onLocationChange,
  onPriceRangeChange,
  onBookNow
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <ServicesHeader />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <ServiceFilters
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                selectedLocation={selectedLocation}
                priceRange={priceRange}
                onSearchChange={onSearchChange}
                onCategoryChange={onCategoryChange}
                onSubcategoryChange={onSubcategoryChange}
                onLocationChange={onLocationChange}
                onPriceRangeChange={onPriceRangeChange}
              />
            </div>

            {/* Services Grid */}
            <div className="lg:col-span-3">
              <ServicesGrid
                services={services}
                filteredServices={filteredServices}
                isLoading={isLoading}
                fallbackServices={[]}
                onBookNow={onBookNow}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesLayout;
