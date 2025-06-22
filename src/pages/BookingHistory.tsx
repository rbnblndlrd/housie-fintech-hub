
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
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
import { useUnifiedFilters } from '@/hooks/useUnifiedFilters';
import { fetchFilteredBookings } from '@/services/filterService';
import { BookingFilters } from '@/types/filters';
import SearchFilter from '@/components/filters/SearchFilter';
import DateRangeFilter from '@/components/filters/DateRangeFilter';
import StatusFilter from '@/components/filters/StatusFilter';

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

  const initialFilters: BookingFilters = {
    searchTerm: '',
    dateRange: { from: null, to: null },
    status: 'all',
    priceRange: { min: 0, max: 1000 },
    paymentStatus: 'all'
  };

  const {
    data: bookings,
    filters,
    isLoading,
    error,
    resultCount,
    setSearchTerm,
    setDateRange,
    setStatus,
    updateFilters,
    resetFilters
  } = useUnifiedFilters({
    initialFilters,
    fetchFunction: fetchFilteredBookings,
    debounceMs: 300
  });

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmé' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' }
  ];

  const paymentStatusOptions = [
    { value: 'all', label: 'Tous les paiements' },
    { value: 'pending', label: 'En attente' },
    { value: 'paid', label: 'Payé' },
    { value: 'failed', label: 'Échec' }
  ];

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

  const handleBookAgain = (booking: any) => {
    toast({
      title: "Réservation en cours",
      description: `Redirection vers la réservation de "${booking.service?.title || booking.service_name}"`,
    });
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
    return time?.slice(0, 5) || ''; // Remove seconds
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
        <Header />
        <div className="pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-8">
              <p className="text-red-600">Erreur: {error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Réessayer
              </Button>
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

          {/* Unified Filters */}
          <Card className="fintech-card mb-8">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <SearchFilter
                  value={filters.searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Rechercher par service, prestataire ou adresse..."
                  className="md:col-span-2"
                />

                <StatusFilter
                  value={filters.status}
                  onChange={setStatus}
                  options={statusOptions}
                  placeholder="Statut"
                />

                <StatusFilter
                  value={filters.paymentStatus}
                  onChange={(value) => updateFilters({ paymentStatus: value })}
                  options={paymentStatusOptions}
                  placeholder="Paiement"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6 items-end">
                <DateRangeFilter
                  value={filters.dateRange}
                  onChange={setDateRange}
                  className="md:col-span-2"
                />

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="flex-1 rounded-2xl border-gray-200"
                  >
                    Réinitialiser
                  </Button>
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
                {isLoading ? 'Chargement...' : `${resultCount} réservation${resultCount !== 1 ? 's' : ''}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-16 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Chargement des réservations...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Calendar className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Aucune réservation trouvée
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {filters.searchTerm || filters.status !== 'all' || filters.dateRange.from 
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
                      {bookings.map((booking) => (
                        <TableRow key={booking.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <TableCell className="font-semibold text-gray-900 py-6 px-8">
                            {booking.service?.title || booking.service_name || 'Service non spécifié'}
                          </TableCell>
                          <TableCell className="py-6 px-8">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-medium text-gray-700">
                                {booking.provider?.business_name || booking.provider?.user?.full_name || booking.provider_name || 'Prestataire non spécifié'}
                              </span>
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
                              {booking.service_address || 'Adresse non spécifiée'}
                            </span>
                          </TableCell>
                          <TableCell className="py-6 px-8">
                            <div className="flex items-center gap-2 font-bold text-lg">
                              <DollarSign className="h-5 w-5 text-green-600" />
                              <span className="text-gray-900">{booking.total_amount || 0}</span>
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
