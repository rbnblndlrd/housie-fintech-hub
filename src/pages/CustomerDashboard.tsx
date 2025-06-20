
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Star, User, Search, Clock, Phone, MessageCircle, RotateCcw, X, Filter } from 'lucide-react';

// Mock data for comprehensive booking management
const mockAllBookings = [
  {
    id: '1',
    service_title: 'Nettoyage résidentiel',
    provider_name: 'Marie Dubois',
    provider_phone: '514-555-0101',
    scheduled_date: '2024-01-25',
    scheduled_time: '10:00',
    status: 'confirmed',
    total_amount: 120,
    provider_id: '1',
    can_reschedule: true,
    can_cancel: true
  },
  {
    id: '2',
    service_title: 'Jardinage',
    provider_name: 'Pierre Martin',
    provider_phone: '514-555-0102',
    scheduled_date: '2024-01-22',
    scheduled_time: '14:00',
    status: 'completed',
    total_amount: 180,
    provider_id: '2',
    can_reschedule: false,
    can_cancel: false
  },
  {
    id: '3',
    service_title: 'Réparations plomberie',
    provider_name: 'Sophie Bernard',
    provider_phone: '514-555-0103',
    scheduled_date: '2024-01-20',
    scheduled_time: '09:30',
    status: 'completed',
    total_amount: 250,
    provider_id: '3',
    can_reschedule: false,
    can_cancel: false
  },
  {
    id: '4',
    service_title: 'Ménage hebdomadaire',
    provider_name: 'Marie Dubois',
    provider_phone: '514-555-0101',
    scheduled_date: '2024-01-30',
    scheduled_time: '10:00',
    status: 'pending',
    total_amount: 120,
    provider_id: '1',
    can_reschedule: true,
    can_cancel: true
  },
  {
    id: '5',
    service_title: 'Installation électrique',
    provider_name: 'Jean Électrique',
    provider_phone: '514-555-0104',
    scheduled_date: '2024-02-05',
    scheduled_time: '13:00',
    status: 'confirmed',
    total_amount: 320,
    provider_id: '4',
    can_reschedule: true,
    can_cancel: true
  }
];

// Enhanced favorite providers with quick booking
const mockFavoriteProviders = [
  {
    id: '1',
    business_name: 'Marie Nettoyage',
    provider_name: 'Marie Dubois',
    category: 'Nettoyage',
    rating: 4.8,
    total_bookings: 15,
    city: 'Montréal',
    available: true,
    last_booking: '2024-01-25'
  },
  {
    id: '2',
    business_name: 'Jean Paysagiste',
    provider_name: 'Jean-Pierre Lavoie',
    category: 'Jardinage',
    rating: 4.9,
    total_bookings: 8,
    city: 'Montréal',
    available: true,
    last_booking: '2024-01-22'
  },
  {
    id: '3',
    business_name: 'Sophie Entretien',
    provider_name: 'Sophie Martin',
    category: 'Entretien',
    rating: 4.7,
    total_bookings: 12,
    city: 'Montréal',
    available: false,
    last_booking: '2024-01-20'
  }
];

// Recently viewed services
const mockRecentlyViewed = [
  { id: '1', title: 'Plomberie d\'urgence', category: 'Plomberie', price: 150 },
  { id: '2', title: 'Électricien résidentiel', category: 'Électricité', price: 200 },
  { id: '3', title: 'Peinture intérieure', category: 'Peinture', price: 300 }
];

const CustomerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'completed': return 'Terminée';
      case 'pending': return 'En Attente';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const filteredBookings = mockAllBookings.filter(booking => {
    const matchesSearch = booking.service_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.provider_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleQuickContact = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleReschedule = (bookingId: string) => {
    console.log('Reschedule booking:', bookingId);
    // TODO: Implement reschedule functionality
  };

  const handleCancel = (bookingId: string) => {
    console.log('Cancel booking:', bookingId);
    // TODO: Implement cancel functionality
  };

  const handleRebook = (providerId: string, serviceTitle: string) => {
    console.log('Rebook service:', serviceTitle, 'with provider:', providerId);
    // TODO: Implement rebook functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tableau de Bord Client
            </h1>
            <p className="text-gray-600">Gérez vos réservations et découvrez de nouveaux services</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Content - Comprehensive Booking Management */}
            <div className="lg:col-span-3 space-y-6">
              {/* Booking Management Section */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Gestion des Réservations
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filtres
                    </Button>
                  </div>
                  
                  {/* Search and Filters */}
                  <div className={`space-y-4 ${showFilters ? 'block' : 'hidden'}`}>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Rechercher par service ou prestataire..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="pending">En Attente</SelectItem>
                          <SelectItem value="confirmed">Confirmée</SelectItem>
                          <SelectItem value="completed">Terminée</SelectItem>
                          <SelectItem value="cancelled">Annulée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{booking.service_title}</h4>
                            <p className="text-sm text-gray-600">{booking.provider_name}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(booking.scheduled_date).toLocaleDateString('fr-FR')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {booking.scheduled_time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${booking.total_amount}</p>
                          <Badge className={`${getStatusColor(booking.status)} text-white text-xs`}>
                            {getStatusText(booking.status)}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickContact(booking.provider_phone)}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Appeler
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRebook(booking.provider_id, booking.service_title)}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Réserver à nouveau
                        </Button>
                        {booking.can_reschedule && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReschedule(booking.id)}
                          >
                            <Calendar className="h-4 w-4 mr-1" />
                            Reprogrammer
                          </Button>
                        )}
                        {booking.can_cancel && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancel(booking.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Annuler
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {filteredBookings.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Aucune réservation trouvée
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recently Viewed Services */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-purple-600" />
                    Services Récemment Consultés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockRecentlyViewed.map((service) => (
                      <div key={service.id} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-1">{service.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{service.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-green-600">À partir de ${service.price}</span>
                          <Button size="sm" variant="outline">
                            Voir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-green-600" />
                    Actions Rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/services" className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Search className="h-4 w-4 mr-2" />
                      Trouver des Services
                    </Button>
                  </Link>
                  <Link to="/customer-profile" className="block">
                    <Button variant="outline" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Mon Profil
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Enhanced Favorite Providers */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Prestataires Favoris
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockFavoriteProviders.map((provider) => (
                    <div key={provider.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{provider.business_name}</h4>
                          <p className="text-xs text-gray-600">{provider.provider_name}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{provider.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          {provider.city}
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${provider.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {provider.available ? 'Disponible' : 'Occupé'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">
                        {provider.total_bookings} réservations • Dernière: {new Date(provider.last_booking).toLocaleDateString('fr-FR')}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 text-xs" disabled={!provider.available}>
                          Réserver
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          Voir Profil
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Categories */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm">Catégories Populaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {['Nettoyage', 'Jardinage', 'Plomberie', 'Électricité'].map((category) => (
                      <Button key={category} variant="outline" size="sm" className="text-xs">
                        {category}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
