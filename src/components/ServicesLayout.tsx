
import React, { useState } from 'react';
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
  const [hoveredProviderId, setHoveredProviderId] = useState<string | null>(null);

  // Convert services to providers for map display
  const providersWithRadius = sampleProviders.map(provider => ({
    ...provider,
    serviceRadius: 10 // Default 10km radius, you can get this from the service data
  }));

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 bg-gray-50/50">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <ServicesHeader />

          <div className="mb-8">
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
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <MapSection
                onCategorySelect={onCategoryChange}
                providers={providersWithRadius}
                hoveredProviderId={hoveredProviderId}
              />
            </div>

            <ServicesGrid
              services={services}
              filteredServices={filteredServices}
              isLoading={isLoading}
              fallbackServices={services}
              onBookNow={onBookNow}
              onHoverProvider={setHoveredProviderId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesLayout;
