
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

const Services = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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
        toast({
          title: "Erreur",
          description: "Impossible de charger les services.",
          variant: "destructive",
        });
        return;
      }

      setServices(data || []);
    } catch (error) {
      console.error('Services fetch error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement.",
        variant: "destructive",
      });
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
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.provider.business_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selecte
dCategory === 'all' || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (showBookingForm && selectedService) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
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
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Services disponibles
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trouvez le prestataire parfait pour tous vos besoins
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un service ou prestataire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Aucun service trouvé</p>
            <p className="text-gray-500 mt-2">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {service.provider.business_name}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {categories.find(cat => cat.value === service.category)?.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Provider Info */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {service.provider.user.city}, {service.provider.user.province}
                    </span>
                    {service.provider.verified && (
                      <Badge variant="outline" className="text-xs">
                        ✓ Vérifié
                      </Badge>
                    )}
                  </div>

                  {/* Rating and Bookings */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{service.provider.average_rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{service.provider.total_bookings} réservations</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        {service.pricing_type === 'hourly' 
                          ? `${service.provider.hourly_rate || service.base_price}$/h`
                          : `${service.base_price}$`
                        }
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {service.pricing_type === 'hourly' ? 'par heure' : 'prix fixe'}
                    </span>
                  </div>

                  {/* Book Now Button */}
                  <Button 
                    onClick={() => handleBookNow(service)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Réserver maintenant
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
