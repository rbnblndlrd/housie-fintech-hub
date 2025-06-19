
import React, { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useServices } from "@/hooks/useServices";
import { useServiceFilters } from "@/hooks/useServiceFilters";
import { Service } from "@/types/service";
import ServicesLayout from "@/components/ServicesLayout";
import ServiceBookingWrapper from "@/components/ServiceBookingWrapper";

const ServicesPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { services: allServices, isLoading: servicesLoading } = useServices();
  
  // Use the unified service filters hook
  const {
    services: filteredServices,
    filters,
    isLoading: filtersLoading,
    setSearchTerm,
    setCategory,
    setLocation,
    setPriceRange
  } = useServiceFilters();

  const [selectedLocation, setSelectedLocation] = useState("montreal");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

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
      services={allServices}
      filteredServices={filteredServices}
      isLoading={servicesLoading || filtersLoading}
      searchTerm={filters.searchTerm}
      selectedCategory={filters.category}
      selectedLocation={selectedLocation}
      priceRange={[filters.priceRange.min, filters.priceRange.max]}
      onSearchChange={setSearchTerm}
      onCategoryChange={setCategory}
      onLocationChange={setSelectedLocation}
      onPriceRangeChange={(range) => setPriceRange(range[0], range[1])}
      onBookNow={handleBookNow}
    />
  );
};

export default ServicesPage;
