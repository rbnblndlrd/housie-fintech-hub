
import React, { useState, useMemo } from 'react';
import ServicesPageLayout from './ServicesPageLayout';
import ServiceBookingWrapper from './ServiceBookingWrapper';
import { useServices } from '@/hooks/useServices';
import { Service } from '@/types/service';
import { useNavigate } from 'react-router-dom';

const ServicesPage = () => {
  const { services, isLoading } = useServices();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('montreal');
  const [priceRange, setPriceRange] = useState<[number, number]>([10, 200]);
  const [distance, setDistance] = useState(25);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [hoveredProviderId, setHoveredProviderId] = useState<string | null>(null);

  const filteredServicesList = useMemo(() => {
    return services.filter((service: Service) => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.provider?.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.provider?.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesSubcategory = selectedSubcategory === 'all' || service.subcategory === selectedSubcategory;
      const matchesLocation = selectedLocation === 'montreal' || 
                             service.provider?.user?.city?.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesPrice = service.base_price >= priceRange[0] && service.base_price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesSubcategory && matchesLocation && matchesPrice;
    });
  }, [services, searchTerm, selectedCategory, selectedSubcategory, selectedLocation, priceRange, distance]);

  const handleBookNow = (service: Service) => {
    setSelectedService(service);
  };

  const handleBookingComplete = (bookingId: string) => {
    navigate('/booking-success');
  };

  const handleCancelBooking = () => {
    setSelectedService(null);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory('all');
  };

  const handleSearch = () => {
    console.log('Search triggered with filters:', {
      searchTerm,
      selectedCategory,
      selectedSubcategory,
      selectedLocation,
      priceRange,
      distance
    });
  };

  const handleHoverProvider = (providerId: string | null) => {
    setHoveredProviderId(providerId);
  };

  if (selectedService) {
    return (
      <ServiceBookingWrapper
        service={selectedService}
        onBookingComplete={handleBookingComplete}
        onCancel={handleCancelBooking}
      />
    );
  }

  return (
    <ServicesPageLayout
      services={services}
      filteredServices={filteredServicesList}
      isLoading={isLoading}
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      selectedSubcategory={selectedSubcategory}
      selectedLocation={selectedLocation}
      priceRange={priceRange}
      distance={distance}
      onSearchChange={setSearchTerm}
      onCategoryChange={handleCategoryChange}
      onSubcategoryChange={setSelectedSubcategory}
      onLocationChange={setSelectedLocation}
      onPriceRangeChange={setPriceRange}
      onDistanceChange={setDistance}
      onBookNow={handleBookNow}
      onSearch={handleSearch}
      hoveredProviderId={hoveredProviderId}
      onHoverProvider={handleHoverProvider}
    />
  );
};

export default ServicesPage;
