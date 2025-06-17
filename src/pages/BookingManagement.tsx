
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

interface BookingCustomer {
  full_name: string;
  phone: string;
  email: string;
}

interface BookingService {
  title: string;
  category: string;
}

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
  customer: BookingCustomer;
  service: BookingService;
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
        // Transform the data to match our Booking interface
        const typedBookings: Booking[] = (data || []).map(booking => ({
          id: booking.id,
          scheduled_date: booking.scheduled_date,
          scheduled_time: booking.scheduled_time,
          duration_hours: booking.duration_hours || 0,
          total_amount: booking.total_amount || 0,
          service_address: booking.service_address || '',
          status: booking.status as 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled',
          payment_status: booking.payment_status as 'pending' | 'paid' | 'refunded',
          created_at: booking.created_at,
          customer: {
            full_name: booking.customer?.full_name || '',
            phone: booking.customer?.phone || '',
            email: booking.customer?.email || ''
          },
          service: {
            title: booking.service?.title || '',
            category: booking.service?.category || ''
          }
        }));
        
        setBookings(typedBookings);
        setFilteredBookings(typedBookings);
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
            ? { ...booking, status: newStatus as 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' }
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
        <Header />
        <div className="pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-white/60 rounded-2xl w-1/3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]"></div>
              <div className="grid md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-white/60 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
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
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border-0 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-100">Total Réservations</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border-0 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-100">En Attente</p>
                    <p className="text-2xl font-bold text-white">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border-0 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-100">Confirmées</p>
                    <p className="text-2xl font-bold text-white">{stats.confirmed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border-0 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-100">Revenus</p>
                    <p className="text-2xl font-bold text-white">${stats.totalRevenue.toFixed(0)}</p>
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
              <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100/50 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300">
                <CardContent className="p-12 text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 inline-block mb-6">
                    <Calendar className="h-16 w-16 text-white mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Aucune réservation trouvée
                  </h3>
                  <p className="text-gray-600">
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
