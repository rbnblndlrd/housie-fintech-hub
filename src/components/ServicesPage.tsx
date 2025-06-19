
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
    console.log('Filtering services:', {
      totalServices: services.length,
      selectedCategory,
      searchTerm
    });

    return services.filter((service: Service) => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.provider?.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Handle both lawn_care and lawn_snow categories
      const matchesCategory = selectedCategory === 'all' || 
                             service.category === selectedCategory ||
                             (selectedCategory === 'lawn_snow' && service.category === 'lawn_care') ||
                             (selectedCategory === 'lawn_care' && service.category === 'lawn_snow');
      
      const matchesSubcategory = selectedSubcategory === 'all' || service.subcategory === selectedSubcategory;
      const matchesLocation = selectedLocation === 'montreal' || 
                             service.provider?.user?.city?.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesPrice = service.base_price >= priceRange[0] && service.base_price <= priceRange[1];

      const result = matchesSearch && matchesCategory && matchesSubcategory && matchesLocation && matchesPrice;
      
      if (selectedCategory !== 'all') {
        console.log(`Service "${service.title}" (category: ${service.category}):`, {
          matchesSearch,
          matchesCategory,
          matchesSubcategory,
          matchesLocation,
          matchesPrice,
          finalResult: result
        });
      }

      return result;
    });
  }, [services, searchTerm, selectedCategory, selectedSubcategory, selectedLocation, priceRange]);

  const handleBookNow = (service: Service) => {
    toast.success(`Booking request sent for ${service.title}`);
  };

  const handleCategoryChange = (category: string) => {
    console.log('Category changed to:', category);
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
