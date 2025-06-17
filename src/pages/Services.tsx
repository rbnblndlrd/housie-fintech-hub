
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import BookingForm from "@/components/BookingForm";
import SampleDataSeeder from "@/components/SampleDataSeeder";
import ServiceCard from "@/components/ServiceCard";
import ServiceFilters from "@/components/ServiceFilters";
import ServiceCategories from "@/components/ServiceCategories";
import { GoogleMap } from "@/components/GoogleMap";

interface Service {
  id: string;
  title: string;
  description: string;
  base_price: number;
  pricing_type: string;
  category: string;
  subcategory: string;
  active: boolean;
  provider: {
    id: string;
    business_name: string;
    hourly_rate: number;
    service_radius_km: number;
    average_rating: number;
    total_bookings: number;
    verified: boolean;
    user: {
      full_name: string;
      city: string;
      province: string;
    };
  };
}

interface Provider {
  id: number;
  name: string;
  lat: number;
  lng: number;
  service: string;
  rating: number;
  availability: string;
}

const Services = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState("montreal");
  const [priceRange, setPriceRange] = useState<[number, number]>([10, 200]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Sample providers for the map
  const providers: Provider[] = [
    {
      id: 1,
      name: "Marie L.",
      service: "Ménage résidentiel",
      rating: 4.8,
      availability: "Available",
      lat: 45.5087,
      lng: -73.5540,
    },
    {
      id: 2,
      name: "Jean D.",
      service: "Nettoyage bureaux",
      rating: 4.9,
      availability: "Busy",
      lat: 45.4995,
      lng: -73.5848,
    },
    {
      id: 3,
      name: "Sophie M.",
      service: "Grand ménage",
      rating: 4.7,
      availability: "Available",
      lat: 45.5125,
      lng: -73.5440,
    }
  ];

  // Hardcoded fallback providers for immediate testing
  const fallbackServices: Service[] = [
    {
      id: 'fallback-1',
      title: "Nettoyage résidentiel complet",
      description: "Nettoyage en profondeur de votre domicile: cuisine, salle de bain, chambres, salon. Produits écologiques inclus.",
      base_price: 30,
      pricing_type: "hourly",
      category: "cleaning",
      subcategory: "residential",
      active: true,
      provider: {
        id: 'provider-1',
        business_name: "Marie Nettoyage",
        hourly_rate: 30,
        service_radius_km: 25,
        average_rating: 4.8,
        total_bookings: 127,
        verified: true,
        user: {
          full_name: "Marie Dubois",
          city: "Montréal",
          province: "QC"
        }
      }
    },
    {
      id: 'fallback-2',
      title: "Tonte de pelouse professionnelle",
      description: "Tonte, bordures et ramassage des résidus. Service hebdomadaire ou ponctuel disponible.",
      base_price: 75,
      pricing_type: "flat",
      category: "lawn_care",
      subcategory: "mowing",
      active: true,
      provider: {
        id: 'provider-2',
        business_name: "Jean Paysagiste",
        hourly_rate: 35,
        service_radius_km: 30,
        average_rating: 4.9,
        total_bookings: 89,
        verified: true,
        user: {
          full_name: "Jean-Pierre Lavoie",
          city: "Montréal",
          province: "QC"
        }
      }
    },
    {
      id: 'fallback-3',
      title: "Entretien ménager régulier",
      description: "Service d'entretien hebdomadaire ou bi-hebdomadaire. Aspirateur, serpillière, surfaces.",
      base_price: 28,
      pricing_type: "hourly",
      category: "cleaning",
      subcategory: "maintenance",
      active: true,
      provider: {
        id: 'provider-3',
        business_name: "Sophie Entretien",
        hourly_rate: 28,
        service_radius_km: 20,
        average_rating: 4.7,
        total_bookings: 94,
        verified: true,
        user: {
          full_name: "Sophie Martin",
          city: "Montréal",
          province: "QC"
        }
      }
    }
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          provider:provider_profiles(
            id,
            business_name,
            hourly_rate,
            service_radius_km,
            average_rating,
            total_bookings,
            verified,
            user:users(full_name, city, province)
          )
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
        setServices(fallbackServices);
      } else {
        const allServices = data && data.length > 0 ? data : fallbackServices;
        setServices(allServices);
      }
    } catch (error) {
      console.error('Services fetch error:', error);
      setServices(fallbackServices);
    } finally {
      setIsLoading(false);
    }
  };

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

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.provider.business_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    
    const servicePrice = service.pricing_type === 'hourly' ? service.provider.hourly_rate : service.base_price;
    const matchesPrice = servicePrice >= priceRange[0] && servicePrice <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (showBookingForm && selectedService) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
          <BookingForm
            service={selectedService}
            provider={selectedService.provider}
            onBookingComplete={handleBookingComplete}
            onCancel={() => {
              setShowBookingForm(false);
              setSelectedService(null);
            }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Find Home Services
            </h1>
            <p className="text-xl text-gray-800 dark:text-gray-700 max-w-2xl mx-auto">
              Connect with verified professionals in your area
            </p>
          </div>

          {/* Search and Filters */}
          <ServiceFilters
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            selectedLocation={selectedLocation}
            priceRange={priceRange}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onLocationChange={setSelectedLocation}
            onPriceRangeChange={setPriceRange}
          />

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Service Categories - Smaller sidebar */}
            <div className="lg:col-span-1">
              <ServiceCategories onCategorySelect={setSelectedCategory} />

              {/* Interactive Google Map */}
              <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100/50 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Service Area Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <GoogleMap
                    center={{ lat: 45.5017, lng: -73.5673 }}
                    zoom={12}
                    className="h-64 rounded-xl"
                    providers={providers}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Services Grid - Larger main content */}
            <div className="lg:col-span-3">
              {/* Sample Data Seeder - Show when no real services from DB */}
              {!isLoading && services.length === fallbackServices.length && (
                <SampleDataSeeder />
              )}

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-4 text-gray-800 dark:text-gray-700">Chargement des services...</p>
                </div>
              ) : filteredServices.length === 0 ? (
                <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100/50 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300">
                  <CardContent className="p-12 text-center">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 inline-block mb-6">
                      <svg className="h-16 w-16 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun service trouvé</h3>
                    <p className="text-gray-700 mt-2">Essayez de modifier vos critères de recherche</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onBookNow={handleBookNow}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
