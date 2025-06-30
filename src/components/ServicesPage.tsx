
import React, { useState, useCallback } from 'react';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import ModernServicesHeader from '@/components/ModernServicesHeader';
import ModernServiceFilters from '@/components/ModernServiceFilters';
import ModernServicesGrid from '@/components/ModernServicesGrid';
import { useServiceFilters } from '@/hooks/useServiceFilters';
import { Service } from '@/types/service';

const ServicesPage = () => {
  const {
    services,
    filters,
    isLoading,
    error,
    resultCount,
    setSearchTerm,
    setCategory,
    setSubcategory,
    setLocation,
    setVerified
  } = useServiceFilters();

  const [selectedTime, setSelectedTime] = useState('Any time');
  const [priceRange, setPriceRange] = useState<[number, number]>([10, 200]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Filter services based on current filters
  const filteredServices = services?.filter((service: Service) => {
    if (verifiedOnly && !service.provider?.verified) return false;
    if (filters.category !== 'all' && service.category !== filters.category) return false;
    if (filters.subcategory !== 'all' && service.subcategory !== filters.subcategory) return false;
    if (filters.location !== 'all' && service.provider?.user?.city?.toLowerCase() !== filters.location) return false;
    if (service.provider?.hourly_rate && (service.provider.hourly_rate < priceRange[0] || service.provider.hourly_rate > priceRange[1])) return false;
    return true;
  }) || [];

  const handleBookNow = useCallback((service: Service) => {
    console.log('Booking service:', service);
    // TODO: Implement booking logic
  }, []);

  const handleVerifiedToggle = useCallback((value: boolean) => {
    setVerifiedOnly(value);
    setVerified(value);
  }, [setVerified]);

  return (
    <div className="relative min-h-screen">
      <VideoBackground />
      <div className="relative z-10">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <ModernServicesHeader />
            <div className="mb-8">
              <ModernServiceFilters
                searchTerm={filters.searchTerm}
                selectedCategory={filters.category}
                selectedSubcategory={filters.subcategory}
                selectedLocation={filters.location}
                selectedTime={selectedTime}
                priceRange={priceRange}
                verifiedOnly={verifiedOnly}
                onSearchChange={setSearchTerm}
                onCategoryChange={setCategory}
                onSubcategoryChange={setSubcategory}
                onLocationChange={setLocation}
                onTimeChange={setSelectedTime}
                onPriceRangeChange={setPriceRange}
                onVerifiedToggle={handleVerifiedToggle}
              />
            </div>
            <ModernServicesGrid
              services={services || []}
              filteredServices={filteredServices}
              isLoading={isLoading}
              onBookNow={handleBookNow}
              verifiedOnly={verifiedOnly}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
