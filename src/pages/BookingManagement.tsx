
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
import { useUnifiedCalendarIntegration } from '@/hooks/useUnifiedCalendarIntegration';

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
  booking_type?: 'service' | 'appointment'; // New field to distinguish types
}

const BookingManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Get unified calendar data
  const { allEvents, updateEvent } = useUnifiedCalendarIntegration();

  // Stats calculation including both bookings and appointments
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

      let serviceBookings: Booking[] = [];

      if (providerProfile) {
        // Fetch service bookings with customer and service details
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
          console.error('Error fetching service bookings:', error);
        } else {
          serviceBookings = (data || []).map(booking => ({
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
            },
            booking_type: 'service' as const
          }));
        }
      }

      // Convert calendar appointments to booking format
      const appointmentBookings: Booking[] = allEvents
        .filter(event => !event.booking_id) // Only personal appointments, not service bookings
        .map(event => ({
          id: event.id,
          scheduled_date: event.date.toISOString().split('T')[0],
          scheduled_time: event.time,
          duration_hours: 1, // Default duration for appointments
          total_amount: event.amount,
          service_address: event.location,
          status: event.status as 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled',
          payment_status: 'paid' as const, // Appointments don't have payment status
          created_at: new Date().toISOString(), // Use current date as fallback
          customer: {
            full_name: event.client,
            phone: '',
            email: ''
          },
          service: {
            title: event.title,
            category: 'appointment'
          },
          booking_type: 'appointment' as const
        }));

      // Combine both types
      const allBookings = [...serviceBookings, ...appointmentBookings];
      setBookings(allBookings);
      setFilteredBookings(allBookings);

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      
      if (booking?.booking_type === 'appointment') {
        // Update appointment via unified calendar integration
        await updateEvent(bookingId, { status: newStatus as any });
      } else {
        // Update service booking via Supabase
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
  }, [user, allEvents]); // Re-fetch when calendar events change

  useEffect(() => {
    applyFilters();
  }, [statusFilter, dateFilter, bookings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-card rounded-2xl w-1/3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]"></div>
              <div className="grid md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-card rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Gestion des Réservations
            </h1>
            <p className="text-muted-foreground">Gérez vos réservations de services et rendez-vous personnels</p>
          </div>

          {/* Stats Cards - Updated to Fintech Style */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="fintech-metric-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Réservations</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-metric-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">En Attente</p>
                    <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-metric-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Confirmées</p>
                    <p className="text-2xl font-bold text-foreground">{stats.confirmed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-metric-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Revenus</p>
                    <p className="text-2xl font-bold text-foreground">${stats.totalRevenue.toFixed(0)}</p>
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
              <Card className="fintech-card">
                <CardContent className="p-12 text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 inline-block mb-6">
                    <Calendar className="h-16 w-16 text-white mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">
                    Aucune réservation trouvée
                  </h3>
                  <p className="text-muted-foreground">
                    {statusFilter !== 'all' || dateFilter !== 'all' 
                      ? 'Essayez de modifier vos filtres.' 
                      : 'Vos nouvelles réservations et rendez-vous apparaîtront ici.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredBookings.map((booking) => (
                <div key={booking.id} className="relative">
                  <BookingCard
                    booking={booking}
                    onUpdateStatus={updateBookingStatus}
                  />
                  {booking.booking_type === 'appointment' && (
                    <Badge 
                      variant="outline" 
                      className="absolute top-4 right-4 bg-purple-100 text-purple-700 border-purple-300"
                    >
                      Rendez-vous Personnel
                    </Badge>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
