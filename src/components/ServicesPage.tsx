
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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState("montreal");
  const [priceRange, setPriceRange] = useState<[number, number]>([10, 200]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const filteredServices = useServiceFilters({
    services,
    searchTerm,
    selectedCategory,
    priceRange
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
      filteredServices={filteredServices}
      isLoading={isLoading}
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      selectedLocation={selectedLocation}
      priceRange={priceRange}
      onSearchChange={setSearchTerm}
      onCategoryChange={setSelectedCategory}
      onLocationChange={setSelectedLocation}
      onPriceRangeChange={setPriceRange}
      onBookNow={handleBookNow}
    />
  );
};

export default ServicesPage;
