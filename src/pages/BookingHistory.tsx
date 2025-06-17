
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Calendar, 
  DollarSign, 
  Clock,
  User,
  Repeat
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BookingHistory {
  id: string;
  service_name: string;
  provider_name: string;
  scheduled_date: string;
  scheduled_time: string;
  total_amount: number;
  status: string;
  service_address: string;
  provider_id: string;
  service_id: string;
}

const BookingHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingHistory[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | '3months' | 'year'>('all');

  // Mock data for demonstration
  const mockBookings: BookingHistory[] = [
    {
      id: '1',
      service_name: 'Nettoyage résidentiel complet',
      provider_name: 'Marie Dubois',
      scheduled_date: '2024-12-10',
      scheduled_time: '09:00',
      total_amount: 150,
      status: 'completed',
      service_address: '123 Rue Saint-Denis, Montréal',
      provider_id: 'provider-1',
      service_id: 'service-1'
    },
    {
      id: '2',
      service_name: 'Jardinage - Taille des haies',
      provider_name: 'Pierre Martin',
      scheduled_date: '2024-11-25',
      scheduled_time: '14:00',
      total_amount: 80,
      status: 'completed',
      service_address: '456 Avenue Mont-Royal, Montréal',
      provider_id: 'provider-2',
      service_id: 'service-2'
    },
    {
      id: '3',
      service_name: 'Réparation plomberie',
      provider_name: 'Jean Tremblay',
      scheduled_date: '2024-12-15',
      scheduled_time: '10:30',
      total_amount: 200,
      status: 'confirmed',
      service_address: '789 Boulevard Saint-Laurent, Montréal',
      provider_id: 'provider-3',
      service_id: 'service-3'
    },
    {
      id: '4',
      service_name: 'Peinture salon',
      provider_name: 'Sophie Lavoie',
      scheduled_date: '2024-10-15',
      scheduled_time: '08:00',
      total_amount: 350,
      status: 'completed',
      service_address: '321 Rue Sherbrooke, Montréal',
      provider_id: 'provider-4',
      service_id: 'service-4'
    },
    {
      id: '5',
      service_name: 'Nettoyage après rénovation',
      provider_name: 'Marie Dubois',
      scheduled_date: '2024-09-20',
      scheduled_time: '13:00',
      total_amount: 180,
      status: 'completed',
      service_address: '654 Rue Papineau, Montréal',
      provider_id: 'provider-1',
      service_id: 'service-5'
    }
  ];

  useEffect(() => {
    // Set mock data for now
    setBookings(mockBookings);
    setFilteredBookings(mockBookings);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    let filtered = bookings;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(booking => 
        booking.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.provider_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.service_address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (timeFilter) {
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(booking => 
        new Date(booking.scheduled_date) >= filterDate
      );
    }

    setFilteredBookings(filtered);
  }, [searchQuery, timeFilter, bookings]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Terminé', className: 'bg-green-100 text-green-800' },
      confirmed: { label: 'Confirmé', className: 'bg-blue-100 text-blue-800' },
      pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
      cancelled: { label: 'Annulé', className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleBookAgain = (booking: BookingHistory) => {
    toast({
      title: "Réservation en cours",
      description: `Redirection vers la réservation de "${booking.service_name}"`,
    });
    // Here you would redirect to the booking page with pre-filled data
    console.log('Book again:', booking);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5); // Remove seconds
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 fintech-card w-1/3"></div>
              <div className="h-64 fintech-card"></div>
            </div>
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
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Historique des Réservations
            </h1>
            <p className="text-gray-600">Consultez tous vos services passés et futurs</p>
          </div>

          {/* Search and Filters */}
          <Card className="fintech-card mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par service, prestataire ou adresse..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Time Filters */}
                <div className="flex gap-2">
                  {[
                    { key: 'all', label: 'Tout' },
                    { key: 'month', label: 'Dernier mois' },
                    { key: '3months', label: '3 derniers mois' },
                    { key: 'year', label: 'Cette année' }
                  ].map((filter) => (
                    <Button
                      key={filter.key}
                      variant={timeFilter === filter.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTimeFilter(filter.key as any)}
                      className="whitespace-nowrap"
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings Table */}
          <Card className="fintech-card">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                {filteredBookings.length} réservation{filteredBookings.length !== 1 ? 's' : ''}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredBookings.length === 0 ? (
                <div className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune réservation trouvée
                  </h3>
                  <p className="text-gray-600">
                    {searchQuery || timeFilter !== 'all' 
                      ? 'Essayez de modifier vos critères de recherche'
                      : 'Vous n\'avez pas encore effectué de réservation'
                    }
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Prestataire</TableHead>
                      <TableHead>Date & Heure</TableHead>
                      <TableHead>Adresse</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {booking.service_name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            {booking.provider_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{formatDate(booking.scheduled_date)}</div>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(booking.scheduled_time)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <span className="text-sm text-gray-600 truncate block">
                            {booking.service_address}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 font-medium">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            {booking.total_amount}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(booking.status)}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBookAgain(booking)}
                            className="flex items-center gap-1"
                          >
                            <Repeat className="h-3 w-3" />
                            Réserver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;
