
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Star, User, Search, History } from 'lucide-react';

// Mock data for recent bookings
const mockRecentBookings = [
  {
    id: '1',
    service_title: 'Nettoyage résidentiel',
    provider_name: 'Marie Dubois',
    scheduled_date: '2024-01-25',
    status: 'confirmed',
    total_amount: 120
  },
  {
    id: '2',
    service_title: 'Jardinage',
    provider_name: 'Pierre Martin',
    scheduled_date: '2024-01-22',
    status: 'completed',
    total_amount: 180
  },
  {
    id: '3',
    service_title: 'Réparations plomberie',
    provider_name: 'Sophie Bernard',
    scheduled_date: '2024-01-20',
    status: 'completed',
    total_amount: 250
  }
];

// Mock data for favorite providers
const mockFavoriteProviders = [
  {
    id: '1',
    business_name: 'Marie Nettoyage',
    provider_name: 'Marie Dubois',
    category: 'Nettoyage',
    rating: 4.8,
    total_bookings: 15,
    city: 'Montréal'
  },
  {
    id: '2',
    business_name: 'Jean Paysagiste',
    provider_name: 'Jean-Pierre Lavoie',
    category: 'Jardinage',
    rating: 4.9,
    total_bookings: 8,
    city: 'Montréal'
  },
  {
    id: '3',
    business_name: 'Sophie Entretien',
    provider_name: 'Sophie Martin',
    category: 'Entretien',
    rating: 4.7,
    total_bookings: 12,
    city: 'Montréal'
  }
];

const CustomerDashboard = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'completed': return 'Terminée';
      case 'pending': return 'En Attente';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tableau de Bord Client
            </h1>
            <p className="text-gray-600">Gérez vos réservations et trouvez des services</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Bookings */}
            <div className="lg:col-span-2">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Mes Réservations Récentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockRecentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{booking.service_title}</h4>
                          <p className="text-sm text-gray-600">{booking.provider_name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.scheduled_date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${booking.total_amount}</p>
                        <Badge className={`${getStatusColor(booking.status)} text-white text-xs`}>
                          {getStatusText(booking.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Link to="/booking-history">
                      <Button variant="outline" className="w-full">
                        Voir Toutes les Réservations
                      </Button>
                    </Link>
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
                  <Link to="/booking-history" className="block">
                    <Button variant="outline" className="w-full">
                      <History className="h-4 w-4 mr-2" />
                      Voir Toutes les Réservations
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Favorite Providers */}
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          {provider.city}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {provider.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {provider.total_bookings} réservations avec vous
                      </p>
                    </div>
                  ))}
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
