import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin, User, Phone, Mail, DollarSign } from 'lucide-react';
import Header from '@/components/Header';
import SearchFilter from '@/components/filters/SearchFilter';
import StatusFilter from '@/components/filters/StatusFilter';
import DateRangeFilter from '@/components/filters/DateRangeFilter';

interface Booking {
  id: string;
  service_title: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  total_amount: number;
  location: string;
  notes?: string;
}

const BookingManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  // Mock stats data
  const stats = {
    totalBookings: 15,
    pendingBookings: 3,
    completedBookings: 8,
    totalRevenue: 2450
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      // Mock data - replace with actual Supabase query
      const mockBookings: Booking[] = [
        {
          id: '1',
          service_title: 'Nettoyage résidentiel',
          customer_name: 'Marie Dubois',
          customer_phone: '514-555-0123',
          customer_email: 'marie@example.com',
          scheduled_date: '2024-01-25',
          scheduled_time: '10:00',
          status: 'confirmed',
          total_amount: 120,
          location: 'Montréal, QC',
          notes: 'Appartement 3 chambres'
        },
        {
          id: '2',  
          service_title: 'Réparation plomberie',
          customer_name: 'Jean Tremblay',
          customer_phone: '514-555-0456',
          customer_email: 'jean@example.com',
          scheduled_date: '2024-01-24',
          scheduled_time: '14:00',
          status: 'in_progress',
          total_amount: 250,
          location: 'Laval, QC',
          notes: 'Fuite sous évier'
        }
      ];

      setBookings(mockBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-500';
      case 'in_progress': return 'bg-orange-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'in_progress': return 'En Cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.service_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion des Réservations
            </h1>
            <p className="text-gray-600">Gérez et suivez toutes vos réservations</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="fintech-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Réservations</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">En Attente</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.pendingBookings}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Terminées</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completedBookings}</p>
                  </div>
                  <User className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenus Total</p>
                    <p className="text-2xl font-bold text-purple-600">${stats.totalRevenue}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="fintech-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔍 Filtres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
                  <SearchFilter
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Rechercher par service ou client..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <StatusFilter
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { value: 'all', label: 'Tous les statuts' },
                      { value: 'confirmed', label: 'Confirmé' },
                      { value: 'in_progress', label: 'En Cours' },
                      { value: 'completed', label: 'Terminé' },
                      { value: 'cancelled', label: 'Annulé' }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
                  <DateRangeFilter
                    value={dateRange}
                    onChange={(from, to) => setDateRange({ from, to })}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDateRange({ from: null, to: null });
                  }}
                  className="clean-button"
                >
                  Réinitialiser
                </Button>
                <Button className="clean-button-purple">
                  Réserver
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bookings List */}
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle>Réservations ({filteredBookings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{booking.service_title}</h4>
                          <p className="text-sm text-gray-600">{booking.customer_name}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(booking.scheduled_date).toLocaleDateString('fr-FR')} à {booking.scheduled_time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {booking.location}
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

                    {/* Customer Info */}
                    <div className="bg-white p-3 rounded-lg border">
                      <h5 className="font-medium text-gray-900 mb-2">Informations Client</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {booking.customer_name}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {booking.customer_phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {booking.customer_email}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {booking.location}
                        </div>
                      </div>
                      {booking.notes && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Notes:</strong> {booking.notes}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 justify-end mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`tel:${booking.customer_phone}`, '_self')}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Appeler
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`mailto:${booking.customer_email}`, '_blank')}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Gérer
                      </Button>
                    </div>
                  </div>
                ))}

                {filteredBookings.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucune réservation trouvée
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
