
import React from 'react';
import Header from '@/components/Header';
import ServicesHeader from '@/components/ServicesHeader';
import ServiceFilters from '@/components/ServiceFilters';
import ServicesGrid from '@/components/ServicesGrid';
import InteractiveServicesMap from '@/components/InteractiveServicesMap';
import { Service } from '@/types/service';

interface ServicesPageLayoutProps {
  services: Service[];
  filteredServices: Service[];
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: string;
  selectedSubcategory: string;
  selectedLocation: string;
  priceRange: [number, number];
  distance: number;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onPriceRangeChange: (value: [number, number]) => void;
  onDistanceChange: (value: number) => void;
  onBookNow: (service: Service) => void;
  onSearch: () => void;
  hoveredProviderId?: string | null;
  onHoverProvider?: (providerId: string | null) => void;
}

const ServicesPageLayout: React.FC<ServicesPageLayoutProps> = ({
  services,
  filteredServices,
  isLoading,
  searchTerm,
  selectedCategory,
  selectedSubcategory,
  selectedLocation,
  priceRange,
  distance,
  onSearchChange,
  onCategoryChange,
  onSubcategoryChange,
  onLocationChange,
  onPriceRangeChange,
  onDistanceChange,
  onBookNow,
  onSearch,
  hoveredProviderId,
  onHoverProvider
}) => {
  // Convert services to provider format for the map
  const mapProviders = filteredServices.map(service => ({
    id: parseInt(service.provider.id),
    name: service.provider.business_name || service.provider.user.full_name,
    lat: 45.5017 + (Math.random() - 0.5) * 0.1, // Add some variation around Montreal
    lng: -73.5673 + (Math.random() - 0.5) * 0.1,
    service: service.title,
    rating: service.provider.average_rating,
    availability: "Available",
    serviceRadius: service.provider.service_radius_km,
    verified: service.provider.verified,
    hourlyRate: service.provider.hourly_rate,
    distance: "2.5 km away"
  }));

  const handleProviderSelect = (provider: any) => {
    // Find the corresponding service and trigger booking
    const correspondingService = filteredServices.find(
      service => service.provider.id === provider.id.toString()
    );
    if (correspondingService) {
      onBookNow(correspondingService);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      {/* Full-width container with minimal padding */}
      <div className="pt-20 w-full px-2 pb-8">
        <ServicesHeader />
        
        {/* Filters */}
        <div className="mb-8">
          <ServiceFilters
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            selectedLocation={selectedLocation}
            priceRange={priceRange}
            distance={distance}
            onSearchChange={onSearchChange}
            onCategoryChange={onCategoryChange}
            onSubcategoryChange={onSubcategoryChange}
            onLocationChange={onLocationChange}
            onPriceRangeChange={onPriceRangeChange}
            onDistanceChange={onDistanceChange}
            onSearch={onSearch}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Services List */}
          <div className="lg:col-span-1">
            <ServicesGrid
              services={services}
              filteredServices={filteredServices}
              isLoading={isLoading}
              fallbackServices={[]}
              onBookNow={onBookNow}
              onHoverProvider={onHoverProvider}
            />
          </div>

          {/* Interactive Map */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="fintech-card p-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Service Providers Near You
                </h3>
                <InteractiveServicesMap
                  providers={mapProviders}
                  hoveredProviderId={hoveredProviderId}
                  onProviderSelect={handleProviderSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPageLayout;
