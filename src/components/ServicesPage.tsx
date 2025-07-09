
import React, { useState, useCallback, useMemo } from 'react';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import ModernServicesHeader from '@/components/ModernServicesHeader';
import ModernServiceFilters from '@/components/ModernServiceFilters';
import ModernServicesGrid from '@/components/ModernServicesGrid';
import { useServices } from '@/hooks/useServices';
import { Service } from '@/types/service';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { AnnetteButton } from '@/components/chat/AnnetteButton';

const ServicesPage = () => {
  const { services, isLoading } = useServices();
  
  // Local filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedTime, setSelectedTime] = useState('Any time');
  const [priceRange, setPriceRange] = useState<[number, number]>([10, 200]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Filter services based on current filters
  const filteredServices = useMemo(() => {
    if (!services || services.length === 0) return [];

    return services.filter((service: Service) => {
      // Filter out services with null providers
      if (!service.provider) return false;

      // Search term filter
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          service.title.toLowerCase().includes(searchLower) ||
          service.description.toLowerCase().includes(searchLower) ||
          service.provider.business_name?.toLowerCase().includes(searchLower) ||
          service.provider.user?.full_name?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && service.category !== selectedCategory) {
        return false;
      }

      // Subcategory filter
      if (selectedSubcategory !== 'all' && service.subcategory !== selectedSubcategory) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'all') {
        const serviceLocation = service.provider.user?.city?.toLowerCase();
        if (!serviceLocation || !serviceLocation.includes(selectedLocation.toLowerCase())) {
          return false;
        }
      }

      // Verified only filter
      if (verifiedOnly && !service.provider.verified) {
        return false;
      }

      // Price range filter
      const servicePrice = service.provider.hourly_rate || service.base_price || 0;
      if (servicePrice < priceRange[0] || servicePrice > priceRange[1]) {
        return false;
      }

      return true;
    });
  }, [services, searchTerm, selectedCategory, selectedSubcategory, selectedLocation, verifiedOnly, priceRange]);

  const handleBookNow = useCallback((service: Service) => {
    console.log('Booking service:', service);
    // TODO: Implement booking logic
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
    // Reset subcategory when category changes
    setSelectedSubcategory('all');
  }, []);

  const handleSubcategoryChange = useCallback((value: string) => {
    setSelectedSubcategory(value);
  }, []);

  const handleLocationChange = useCallback((value: string) => {
    setSelectedLocation(value);
  }, []);

  const handleTimeChange = useCallback((value: string) => {
    setSelectedTime(value);
  }, []);

  const handlePriceRangeChange = useCallback((value: [number, number]) => {
    setPriceRange(value);
  }, []);

  const handleVerifiedToggle = useCallback((value: boolean) => {
    setVerifiedOnly(value);
  }, []);

  return (
    <div className="relative min-h-screen">
      <VideoBackground />
      <div className="relative z-10">
        <Header />
        <div className="pt-16 pl-[188px] pr-8 pb-8">
          <div className="max-w-6xl">
            <ModernServicesHeader />
            <div className="mb-8">
              <ModernServiceFilters
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                selectedLocation={selectedLocation}
                selectedTime={selectedTime}
                priceRange={priceRange}
                verifiedOnly={verifiedOnly}
                onSearchChange={handleSearchChange}
                onCategoryChange={handleCategoryChange}
                onSubcategoryChange={handleSubcategoryChange}
                onLocationChange={handleLocationChange}
                onTimeChange={handleTimeChange}
                onPriceRangeChange={handlePriceRangeChange}
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
        
        <ChatBubble defaultTab="ai" />
      </div>
    </div>
  );
};

export default ServicesPage;
