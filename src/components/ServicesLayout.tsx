
import React, { useState } from 'react';
import Header from "@/components/Header";
import ModernServicesHeader from "@/components/ModernServicesHeader";
import ModernServiceFilters from "@/components/ModernServiceFilters";
import InteractiveServicesMap from "@/components/InteractiveServicesMap";
import ModernServicesGrid from "@/components/ModernServicesGrid";
import { Service } from "@/types/service";
import { sampleProviders } from "@/data/sampleServices";

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
  const [hoveredProviderId, setHoveredProviderId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Convert services to providers for map display
  const providersWithRadius = sampleProviders.map(provider => ({
    ...provider,
    serviceRadius: 10,
    verified: Math.random() > 0.3 // Random verification status for demo
  }));

  // Filter providers based on verified toggle
  const filteredProviders = verifiedOnly 
    ? providersWithRadius.filter(provider => provider.verified)
    : providersWithRadius;

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          <ModernServicesHeader />

          {/* Sticky Filter Bar */}
          <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 pb-4">
            <ModernServiceFilters
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              selectedLocation={selectedLocation}
              selectedTime={selectedTime}
              priceRange={priceRange}
              verifiedOnly={verifiedOnly}
              onSearchChange={onSearchChange}
              onCategoryChange={onCategoryChange}
              onSubcategoryChange={onSubcategoryChange}
              onLocationChange={onLocationChange}
              onTimeChange={setSelectedTime}
              onPriceRangeChange={onPriceRangeChange}
              onVerifiedToggle={setVerifiedOnly}
            />
          </div>

          {/* Interactive Map Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <InteractiveServicesMap
              providers={filteredProviders}
              hoveredProviderId={hoveredProviderId}
              onProviderSelect={(provider) => {
                const service = filteredServices.find(s => s.provider?.business_name === provider.name);
                if (service) onBookNow(service);
              }}
            />
          </div>

          {/* Service Cards Grid */}
          <ModernServicesGrid
            services={services}
            filteredServices={filteredServices}
            isLoading={isLoading}
            onBookNow={onBookNow}
            onHoverProvider={setHoveredProviderId}
            verifiedOnly={verifiedOnly}
          />
        </div>
      </div>
    </>
  );
};

export default ServicesLayout;
