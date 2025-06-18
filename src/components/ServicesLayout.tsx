
import React from 'react';
import Header from "@/components/Header";
import ServicesHeader from "@/components/ServicesHeader";
import ServiceFilters from "@/components/ServiceFilters";
import MapSection from "@/components/MapSection";
import ServicesGrid from "@/components/ServicesGrid";
import { Service } from "@/types/service";
import { sampleProviders } from "@/data/sampleServices";

interface ServicesLayoutProps {
  services: Service[];
  filteredServices: Service[];
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: string;
  selectedLocation: string;
  priceRange: [number, number];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
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
  selectedLocation,
  priceRange,
  onSearchChange,
  onCategoryChange,
  onLocationChange,
  onPriceRangeChange,
  onBookNow
}) => {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-32 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
        <div className="container mx-auto px-4 py-8">
          <ServicesHeader />

          <ServiceFilters
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            selectedLocation={selectedLocation}
            priceRange={priceRange}
            onSearchChange={onSearchChange}
            onCategoryChange={onCategoryChange}
            onLocationChange={onLocationChange}
            onPriceRangeChange={onPriceRangeChange}
          />

          <div className="grid lg:grid-cols-4 gap-8">
            <MapSection
              onCategorySelect={onCategoryChange}
              providers={sampleProviders}
            />

            <ServicesGrid
              services={services}
              filteredServices={filteredServices}
              isLoading={isLoading}
              fallbackServices={services}
              onBookNow={onBookNow}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesLayout;
