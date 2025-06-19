
import React, { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useServices } from "@/hooks/useServices";
import { useServiceFilters } from "@/hooks/useServiceFilters";
import { Service } from "@/types/service";
import { fallbackServices } from "@/data/sampleServices";
import ServicesLayout from "@/components/ServicesLayout";
import ServiceBookingWrapper from "@/components/ServiceBookingWrapper";

const ServicesPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { services, isLoading } = useServices();
  
  // Use the new unified service filters hook
  const serviceFiltersResult = useServiceFilters();

  const [selectedLocation, setSelectedLocation] = useState("montreal");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Create a custom filtering function for backward compatibility
  const filterServicesLocally = (options: {
    services: Service[];
    searchTerm: string;
    selectedCategory: string;
    priceRange: [number, number];
  }) => {
    let filtered = options.services;
    
    if (options.searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(options.searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(options.searchTerm.toLowerCase())
      );
    }
    
    if (options.selectedCategory && options.selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === options.selectedCategory);
    }
    
    if (options.priceRange) {
      const [min, max] = options.priceRange;
      filtered = filtered.filter(service => {
        const price = service.provider.hourly_rate || service.base_price || 0;
        return price >= min && price <= max;
      });
    }
    
    return filtered;
  };

  // Use the legacy filtering for now to maintain compatibility
  const legacyFilteredServices = filterServicesLocally({
    services,
    searchTerm: serviceFiltersResult.filters.searchTerm,
    selectedCategory: serviceFiltersResult.filters.category,
    priceRange: [serviceFiltersResult.filters.priceRange.min, serviceFiltersResult.filters.priceRange.max]
  });

  const handleBookNow = (service: Service) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour réserver ce service.",
        variant: "destructive",
      });
      return;
    }

    setSelectedService(service);
    setShowBookingForm(true);
  };

  const handleBookingComplete = (bookingId: string) => {
    console.log('Booking completed:', bookingId);
    setShowBookingForm(false);
    setSelectedService(null);
    toast({
      title: "🎉 Réservation confirmée!",
      description: "Votre réservation a été créée avec succès.",
    });
  };

  const handleBookingCancel = () => {
    setShowBookingForm(false);
    setSelectedService(null);
  };

  if (showBookingForm && selectedService) {
    return (
      <ServiceBookingWrapper
        service={selectedService}
        onBookingComplete={handleBookingComplete}
        onCancel={handleBookingCancel}
      />
    );
  }

  return (
    <ServicesLayout
      services={services}
      filteredServices={legacyFilteredServices}
      isLoading={isLoading}
      searchTerm={serviceFiltersResult.filters.searchTerm}
      selectedCategory={serviceFiltersResult.filters.category}
      selectedLocation={selectedLocation}
      priceRange={[serviceFiltersResult.filters.priceRange.min, serviceFiltersResult.filters.priceRange.max]}
      onSearchChange={serviceFiltersResult.setSearchTerm}
      onCategoryChange={serviceFiltersResult.setCategory}
      onLocationChange={setSelectedLocation}
      onPriceRangeChange={(range) => serviceFiltersResult.setPriceRange(range[0], range[1])}
      onBookNow={handleBookNow}
    />
  );
};

export default ServicesPage;
