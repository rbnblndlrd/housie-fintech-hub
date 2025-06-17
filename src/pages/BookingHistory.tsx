
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
      completed: { label: 'Terminé', className: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-[0_2px_10px_-2px_rgba(16,185,129,0.3)]' },
      confirmed: { label: 'Confirmé', className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-[0_2px_10px_-2px_rgba(59,130,246,0.3)]' },
      pending: { label: 'En attente', className: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-[0_2px_10px_-2px_rgba(245,158,11,0.3)]' },
      cancelled: { label: 'Annulé', className: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-[0_2px_10px_-2px_rgba(239,68,68,0.3)]' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={`${config.className} px-3 py-1 rounded-xl font-medium`}>{config.label}</Badge>;
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Historique des Réservations
            </h1>
            <p className="text-xl text-gray-600">Consultez tous vos services passés et futurs</p>
          </div>

          {/* Search and Filters */}
          <Card className="fintech-card mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Rechercher par service, prestataire ou adresse..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Time Filters */}
                <div className="flex gap-3">
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
                      className={`whitespace-nowrap rounded-2xl px-4 py-2 font-medium transition-all duration-200 ${
                        timeFilter === filter.key 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_4px_15px_-2px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_-2px_rgba(0,0,0,0.3)]' 
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
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
            <CardHeader className="p-8 pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                {filteredBookings.length} réservation{filteredBookings.length !== 1 ? 's' : ''}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredBookings.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Calendar className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Aucune réservation trouvée
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {searchQuery || timeFilter !== 'all' 
                      ? 'Essayez de modifier vos critères de recherche'
                      : 'Vous n\'avez pas encore effectué de réservation'
                    }
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-100">
                        <TableHead className="text-gray-700 font-semibold py-4 px-8">Service</TableHead>
                        <TableHead className="text-gray-700 font-semibold py-4 px-8">Prestataire</TableHead>
                        <TableHead className="text-gray-700 font-semibold py-4 px-8">Date & Heure</TableHead>
                        <TableHead className="text-gray-700 font-semibold py-4 px-8">Adresse</TableHead>
                        <TableHead className="text-gray-700 font-semibold py-4 px-8">Montant</TableHead>
                        <TableHead className="text-gray-700 font-semibold py-4 px-8">Statut</TableHead>
                        <TableHead className="text-gray-700 font-semibold py-4 px-8">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow key={booking.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <TableCell className="font-semibold text-gray-900 py-6 px-8">
                            {booking.service_name}
                          </TableCell>
                          <TableCell className="py-6 px-8">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-medium text-gray-700">{booking.provider_name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-6 px-8">
                            <div>
                              <div className="font-semibold text-gray-900">{formatDate(booking.scheduled_date)}</div>
                              <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(booking.scheduled_time)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs py-6 px-8">
                            <span className="text-sm text-gray-600 truncate block">
                              {booking.service_address}
                            </span>
                          </TableCell>
                          <TableCell className="py-6 px-8">
                            <div className="flex items-center gap-2 font-bold text-lg">
                              <DollarSign className="h-5 w-5 text-green-600" />
                              <span className="text-gray-900">{booking.total_amount}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-6 px-8">
                            {getStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell className="py-6 px-8">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBookAgain(booking)}
                              className="flex items-center gap-2 rounded-2xl border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-200 transition-all duration-200"
                            >
                              <Repeat className="h-4 w-4" />
                              Réserver
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;
