
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import BookingCard from "@/components/BookingCard";
import BookingFilters from "@/components/BookingFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react';

interface Booking {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_hours: number;
  total_amount: number;
  service_address: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  customer: {
    full_name: string;
    phone: string;
    email: string;
  };
  service: {
    title: string;
    category: string;
  };
}

const BookingManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Stats calculation
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    totalRevenue: bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + Number(b.total_amount), 0)
  };

  const fetchBookings = async () => {
    if (!user) return;

    try {
      // First get the provider profile
      const { data: providerProfile } = await supabase
        .from('provider_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!providerProfile) {
        setLoading(false);
        return;
      }

      // Then fetch bookings with customer and service details
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customer_id (
            full_name,
            phone,
            email
          ),
          service:service_id (
            title,
            category
          )
        `)
        .eq('provider_id', providerProfile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les réservations.",
          variant: "destructive",
        });
      } else {
        setBookings(data || []);
        setFilteredBookings(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le statut.",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus as any }
            : booking
        )
      );

      toast({
        title: "Succès",
        description: "Statut de réservation mis à jour.",
      });

      // Refresh the list
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Date filter
    const now = new Date();
    if (dateFilter === 'today') {
      const today = now.toISOString().split('T')[0];
      filtered = filtered.filter(booking => booking.scheduled_date === today);
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(booking => 
        new Date(booking.scheduled_date) >= weekAgo
      );
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(booking => 
        new Date(booking.scheduled_date) >= monthAgo
      );
    }

    setFilteredBookings(filtered);
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, dateFilter, bookings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Header />
        <div className="pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="grid md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Gestion des Réservations
            </h1>
            <p className="text-gray-600">Gérez vos réservations et suivez vos performances</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Réservations</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">En Attente</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Confirmées</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Revenus</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <BookingFilters
            statusFilter={statusFilter}
            dateFilter={dateFilter}
            onStatusChange={setStatusFilter}
            onDateChange={setDateFilter}
          />

          {/* Bookings List */}
          <div className="space-y-6">
            {filteredBookings.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Aucune réservation trouvée
                  </h3>
                  <p className="text-gray-500">
                    {statusFilter !== 'all' || dateFilter !== 'all' 
                      ? 'Essayez de modifier vos filtres.' 
                      : 'Vos nouvelles réservations apparaîtront ici.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onUpdateStatus={updateBookingStatus}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
