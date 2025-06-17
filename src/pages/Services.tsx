
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Clock, DollarSign, Filter } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import BookingForm from "@/components/BookingForm";
import SampleDataSeeder from "@/components/SampleDataSeeder";
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
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'cleaning', label: 'Nettoyage' },
    { value: 'lawn_care', label: 'Entretien paysager' },
    { value: 'construction', label: 'Construction' },
    { value: 'wellness', label: 'Bien-être' },
    { value: 'care_pets', label: 'Soins aux animaux' },
  ];

  const serviceCategories = [
    { id: "cleaning", name: "Cleaning", count: 234, color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" },
    { id: "lawn_care", name: "Lawn/Snow", count: 156, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
    { id: "construction", name: "Construction", count: 89, color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
    { id: "wellness", name: "Wellness", count: 67, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
    { id: "care_pets", name: "Care/Pets", count: 123, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" }
  ];

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
        // Use fallback services if database fetch fails
        setServices(fallbackServices);
      } else {
        // Combine database services with fallback if needed
        const allServices = data && data.length > 0 ? data : fallbackServices;
        setServices(allServices);
      }
    } catch (error) {
      console.error('Services fetch error:', error);
      // Use fallback services on error
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
    
    return matchesSearch && matchesCategory;
  });

  if (showBookingForm && selectedService) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
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
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-dark-primary dark:via-dark-secondary dark:to-darker">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Find Home Services
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with verified professionals in your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-dark-secondary rounded-xl p-6 shadow-lg mb-8 border dark:border-gray-700">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="montreal">Montreal, QC</SelectItem>
                <SelectItem value="toronto">Toronto, ON</SelectItem>
                <SelectItem value="vancouver">Vancouver, BC</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Service Categories - Smaller sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white dark:bg-dark-secondary shadow-lg border dark:border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black dark:text-white text-lg">
                  Service Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {serviceCategories.map(category => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={category.color}>
                        {category.name}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{category.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Interactive Google Map */}
            <Card className="bg-white dark:bg-dark-secondary shadow-lg border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-dark-text text-lg">Service Area Map</CardTitle>
              </CardHeader>
              <CardContent>
                <GoogleMap
                  center={{ lat: 45.5017, lng: -73.5673 }}
                  zoom={12}
                  className="h-64"
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
                <p className="mt-4 text-gray-600 dark:text-gray-300">Chargement des services...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300 text-lg">Aucun service trouvé</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredServices.map((service) => (
                  <Card key={service.id} className="bg-white dark:bg-dark-secondary shadow-lg hover:shadow-xl transition-shadow border dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                          {service.provider.business_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-black dark:text-white mb-1">{service.title}</h3>
                              <p className="text-gray-600 dark:text-gray-400 font-medium">{service.provider.business_name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={service.provider.verified ? 'default' : 'secondary'}
                                className={service.provider.verified ? 'bg-green-500' : 'bg-gray-500'}
                              >
                                {service.provider.verified ? 'Vérifié' : 'Non vérifié'}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium text-black dark:text-white">{service.provider.average_rating.toFixed(1)}</span>
                              <span className="text-gray-500 dark:text-gray-400 text-sm">({service.provider.total_bookings} avis)</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-black dark:text-white">
                                {service.pricing_type === 'hourly' 
                                  ? `${service.provider.hourly_rate || service.base_price}$/heure`
                                  : `${service.base_price}$`
                                }
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-gray-500 dark:text-gray-400 text-sm">
                                {service.provider.user.city}, {service.provider.user.province}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {service.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-medium">Tarification réelle + 6% frais HOUSIE</span>
                            </div>
                            <Button 
                              className="bg-purple-600 hover:bg-purple-700 px-6"
                              onClick={() => handleBookNow(service)}
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
