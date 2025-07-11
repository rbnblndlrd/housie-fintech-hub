
import React, { useState, useCallback, useMemo } from 'react';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import ModernServicesHeader from '@/components/ModernServicesHeader';
import { useServices } from '@/hooks/useServices';
import { Service } from '@/types/service';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { AnnetteButton } from '@/components/chat/AnnetteButton';
import MiniMapContainer from '@/components/services/MiniMapContainer';
import BrowseFilterPanel from '@/components/services/BrowseFilterPanel';
import ProviderCard from '@/components/services/ProviderCard';
import AnnetteMapInsights from '@/components/services/AnnetteMapInsights';

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
  const [minCredScore, setMinCredScore] = useState(0);
  const [hoveredProviderId, setHoveredProviderId] = useState<string | null>(null);

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

      // Minimum cred score filter (mock calculation)
      if (minCredScore > 0) {
        const credScore = calculateCredScore(service.provider);
        if (credScore < minCredScore) {
          return false;
        }
      }

      return true;
    });
  }, [services, searchTerm, selectedCategory, selectedSubcategory, selectedLocation, verifiedOnly, priceRange, minCredScore]);

  // Calculate cred score based on provider data
  const calculateCredScore = useCallback((provider: any) => {
    let score = 50; // Base score
    if (provider.verified) score += 20;
    if (provider.background_check_verified) score += 15;
    if (provider.average_rating) score += (provider.average_rating - 3) * 10;
    if (provider.total_bookings && provider.total_bookings > 10) score += 10;
    if (provider.ccq_verified || provider.rbq_verified) score += 5;
    return Math.min(Math.max(score, 0), 100);
  }, []);

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

  const handleMinCredScoreChange = useCallback((value: number) => {
    setMinCredScore(value);
  }, []);

  const handleTriggerAnnette = useCallback((filterContext: string) => {
    console.log('Annette triggered with context:', filterContext);
    // This would trigger Annette's contextual response
  }, []);

  const activeFiltersCount = [
    searchTerm !== '',
    selectedCategory !== 'all',
    selectedSubcategory !== 'all',
    selectedLocation !== 'all',
    selectedTime !== 'Any time',
    priceRange[0] !== 10 || priceRange[1] !== 200,
    verifiedOnly,
    minCredScore > 0
  ].filter(Boolean).length;

  return (
    <div className="relative min-h-screen">
      <VideoBackground />
      <div className="relative z-10">
        <Header />
        <div className="pt-16 pl-[188px] pr-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <ModernServicesHeader />
            
            {/* Annette's Map Insights */}
            <AnnetteMapInsights
              services={filteredServices}
              selectedLocation={selectedLocation}
              activeFilters={activeFiltersCount}
              onInsightClick={handleTriggerAnnette}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Column: Mini Map */}
              <div className="lg:col-span-1">
                <MiniMapContainer
                  services={filteredServices}
                  hoveredProviderId={hoveredProviderId}
                  onProviderClick={handleBookNow}
                />
              </div>

              {/* Right Column: Filters & Services */}
              <div className="lg:col-span-3 space-y-6">
                <BrowseFilterPanel
                  searchTerm={searchTerm}
                  selectedCategory={selectedCategory}
                  selectedSubcategory={selectedSubcategory}
                  selectedLocation={selectedLocation}
                  selectedTime={selectedTime}
                  priceRange={priceRange}
                  verifiedOnly={verifiedOnly}
                  minCredScore={minCredScore}
                  onSearchChange={handleSearchChange}
                  onCategoryChange={handleCategoryChange}
                  onSubcategoryChange={handleSubcategoryChange}
                  onLocationChange={handleLocationChange}
                  onTimeChange={handleTimeChange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onVerifiedToggle={handleVerifiedToggle}
                  onMinCredScoreChange={handleMinCredScoreChange}
                  onTriggerAnnette={handleTriggerAnnette}
                />

                {/* Services Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Service Providers</h2>
                    <div className="text-sm text-gray-500">
                      {filteredServices.length} provider{filteredServices.length !== 1 ? 's' : ''} found
                      {verifiedOnly && ' (verified only)'}
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-16">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-6"></div>
                      <p className="text-xl text-gray-800 font-medium">Loading services...</p>
                    </div>
                  ) : filteredServices.length === 0 ? (
                    <div className="text-center py-16 fintech-card">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 inline-block mb-8">
                        <svg className="h-20 w-20 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-gray-800">No services found</h3>
                        <p className="text-gray-600 text-lg">Try adjusting your search criteria or location</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredServices.map((service) => (
                        <ProviderCard
                          key={service.id}
                          service={service}
                          onBookNow={handleBookNow}
                          onHoverProvider={setHoveredProviderId}
                          credScore={calculateCredScore(service.provider)}
                          distance={`${Math.floor(Math.random() * 15) + 1} km`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Annette Button */}
        <div className="fixed top-20 right-8 z-50">
          <AnnetteButton onClick={() => console.log('Annette clicked')} />
        </div>
        
        <ChatBubble defaultTab="ai" />
      </div>
    </div>
  );
};

export default ServicesPage;
