
import React, { useState } from 'react';
import Header from '@/components/Header';
import ServicesSearchBar from '@/components/ServicesSearchBar';
import CompactServiceCard from '@/components/CompactServiceCard';
import MapboxMap from '@/components/map/MapboxMap';
import { Card, CardContent } from '@/components/ui/card';
import { Service } from '@/types/service';
import { useNavigate } from 'react-router-dom';

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
  onSearch
}) => {
  const navigate = useNavigate();
  const [hoveredProvider, setHoveredProvider] = useState<string | null>(null);

  const handleViewProfile = (providerId: string) => {
    navigate(`/provider/${providerId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Home Services
            </h1>
            <p className="text-xl text-gray-600">
              Connect with verified professionals in your area
            </p>
          </div>

          {/* Search Bar */}
          <ServicesSearchBar
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

          {/* Results Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Results List */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              {isLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-6"></div>
                  <p className="text-xl text-gray-800 font-medium">Loading services...</p>
                </div>
              ) : filteredServices.length === 0 ? (
                <Card className="fintech-card text-center py-16">
                  <CardContent className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 inline-block mb-8">
                      <svg className="h-20 w-20 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-gray-800">No services found</h3>
                      <p className="text-gray-600 text-lg">Try adjusting your search criteria</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Available Services</h2>
                    <div className="text-sm text-gray-500">
                      {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
                    </div>
                  </div>
                  
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      onMouseEnter={() => setHoveredProvider(service.provider.id)}
                      onMouseLeave={() => setHoveredProvider(null)}
                    >
                      <CompactServiceCard
                        service={service}
                        onBookNow={onBookNow}
                        onViewProfile={handleViewProfile}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Map */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="sticky top-24">
                <Card className="fintech-card overflow-hidden">
                  <div className="h-96 lg:h-[600px]">
                    <MapboxMap
                      center={{ lat: 45.5017, lng: -73.5673 }}
                      zoom={11}
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPageLayout;
