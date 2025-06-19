
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import ServicesLayout from './ServicesLayout';
import { useServices } from '@/hooks/useServices';
import { Service } from '@/types/service';

const ServicesPage = () => {
  const { services, isLoading } = useServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('montreal');
  const [priceRange, setPriceRange] = useState<[number, number]>([10, 200]);

  const filteredServicesList = useMemo(() => {
    return services.filter((service: Service) => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.provider?.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesSubcategory = selectedSubcategory === 'all' || service.subcategory === selectedSubcategory;
      const matchesLocation = selectedLocation === 'montreal' || 
                             service.provider?.user?.city?.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesPrice = service.price >= priceRange[0] && service.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesSubcategory && matchesLocation && matchesPrice;
    });
  }, [services, searchTerm, selectedCategory, selectedSubcategory, selectedLocation, priceRange]);

  const handleBookNow = (service: Service) => {
    toast.success(`Booking request sent for ${service.title}`);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Reset subcategory when category changes
    setSelectedSubcategory('all');
  };

  return (
    <ServicesLayout
      services={services}
      filteredServices={filteredServicesList}
      isLoading={isLoading}
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      selectedSubcategory={selectedSubcategory}
      selectedLocation={selectedLocation}
      priceRange={priceRange}
      onSearchChange={setSearchTerm}
      onCategoryChange={handleCategoryChange}
      onSubcategoryChange={setSelectedSubcategory}
      onLocationChange={setSelectedLocation}
      onPriceRangeChange={setPriceRange}
      onBookNow={handleBookNow}
    />
  );
};

export default ServicesPage;
