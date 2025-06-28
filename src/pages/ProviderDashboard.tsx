import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  Star, 
  Settings, 
  MapPin, 
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

interface Booking {
  id: string;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  amount: number;
  status: string;
  priority: string;
  address: string;
  customerEmail: string;
  instructions: string;
  createdAt: string;
}

interface DashboardData {
  pendingBookings: Booking[];
  recentBookings: Booking[];
  stats: {
    totalBookings: number;
    completedBookings: number;
    totalEarnings: number;
    averageRating: number;
    activeServices: number;
    responseTime: number;
  };
}

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    pendingBookings: [],
    recentBookings: [],
    stats: {
      totalBookings: 0,
      completedBookings: 0,
      totalEarnings: 0,
      averageRating: 0,
      activeServices: 0,
      responseTime: 0
    }
  });

  // Redirect if role changes to customer
  useEffect(() => {
    if (currentRole === 'customer') {
      navigate('/customer-dashboard');
    }
  }, [currentRole, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      console.log('🔄 Fetching provider dashboard data for:', user?.id);
      
      // Get provider profile
      const { data: providerProfile, error: profileError } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError) {
        console.error('Provider profile error:', profileError);
        if (profileError.code === 'PGRST116') {
          toast({
            title: "Profil incomplet",
            description: "Veuillez compléter votre profil fournisseur",
            variant: "destructive",
          });
          navigate('/provider-settings');
          return;
        }
      }

      // Get bookings data
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          services!inner(title, category, base_price),
          users!bookings_customer_id_fkey!inner(full_name, email)
        `)
        .eq('provider_id', providerProfile?.id)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Process bookings
      const pendingBookings = bookings?.filter(b => b.status === 'pending') || [];
      const recentBookings = bookings?.slice(0, 10) || [];
      const completedBookings = bookings?.filter(b => b.status === 'completed') || [];

      // Calculate stats
      const totalEarnings = completedBookings.reduce((sum, booking) => 
        sum + (Number(booking.total_amount) || 0), 0
      );

      // Get services count
      const { count: servicesCount } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', providerProfile?.id)
        .eq('active', true);

      setDashboardData({
        pendingBookings: pendingBookings.map(formatBooking),
        recentBookings: recentBookings.map(formatBooking),
        stats: {
          totalBookings: bookings?.length || 0,
          completedBookings: completedBookings.length,
          totalEarnings,
          averageRating: providerProfile?.average_rating || 0,
          activeServices: servicesCount || 0,
          responseTime: providerProfile?.response_time_hours || 0
        }
      });

      console.log('✅ Dashboard data loaded successfully');
      
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatBooking = (booking: any): Booking => ({
    id: booking.id,
    customerName: booking.users?.full_name || 'Client inconnu',
    serviceName: booking.services?.title || 'Service inconnu',
    date: booking.scheduled_date,
    time: booking.scheduled_time,
    amount: Number(booking.total_amount) || 0,
    status: booking.status,
    priority: booking.priority || 'normal',
    address: booking.service_address || '',
    customerEmail: booking.users?.email || '',
    instructions: booking.instructions || '',
    createdAt: booking.created_at
  });

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      console.log('✅ Accepting booking:', bookingId);
      
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'confirmed', 
          accepted_at: new Date().toISOString() 
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Award points for accepting booking
      await supabase.rpc('award_community_rating_points', {
        p_user_id: user?.id,
        p_points: 1,
        p_reason: 'Booking accepted'
      });

      toast({
        title: "Réservation acceptée",
        description: "La réservation a été confirmée avec succès",
      });

      fetchDashboardData();
      
    } catch (error) {
      console.error('❌ Error accepting booking:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la réservation",
        variant: "destructive",
      });
    }
  };

  const handleDeclineBooking = async (bookingId: string) => {
    try {
      console.log('❌ Declining booking:', bookingId);
      
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Réservation refusée",
        description: "La réservation a été annulée",
      });

      fetchDashboardData();
      
    } catch (error) {
      console.error('❌ Error declining booking:', error);
      toast({
        title: "Erreur",
        description: "Impossible de refuser la réservation",
        variant: "destructive",
      });
    }
  };

  const handleMarkCompleted = async (bookingId: string) => {
    try {
      console.log('✅ Marking booking as completed:', bookingId);
      
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Service terminé",
        description: "La réservation a été marquée comme terminée",
      });

      fetchDashboardData();
      
    } catch (error) {
      console.error('❌ Error marking booking completed:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer le service comme terminé",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'En attente' },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Confirmé' },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Terminé' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Annulé' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'emergency') {
      return (
        <Badge className="bg-red-100 text-red-800">
          <Zap className="h-3 w-3 mr-1" />
          Urgence
        </Badge>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du tableau de bord...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-600">Utilisateur non connecté</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Tableau de bord Fournisseur</h1>
              <p className="text-gray-600 mt-2">Gérez vos réservations et votre activité</p>
            </div>
            <Button
              onClick={() => navigate('/provider-settings')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="fintech-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Réservations totales</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalBookings}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Services terminés</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.completedBookings}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenus totaux</p>
                    <p className="text-3xl font-bold text-gray-900">${dashboardData.stats.totalEarnings.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.averageRating.toFixed(1)}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pending Bookings */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Réservations en attente ({dashboardData.pendingBookings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.pendingBookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucune réservation en attente</p>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.pendingBookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{booking.serviceName}</h4>
                              {getPriorityBadge(booking.priority)}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">Client: {booking.customerName}</p>
                            <p className="text-sm text-gray-600 mb-1">
                              📅 {new Date(booking.date).toLocaleDateString('fr-CA')} à {booking.time}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">💰 ${booking.amount}</p>
                            {booking.address && (
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {booking.address}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                        
                        {booking.instructions && (
                          <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
                            <strong>Instructions:</strong> {booking.instructions}
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAcceptBooking(booking.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accepter
                          </Button>
                          <Button
                            onClick={() => handleDeclineBooking(booking.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Refuser
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Réservations récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.recentBookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucune réservation récente</p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900">{booking.serviceName}</p>
                            {getPriorityBadge(booking.priority)}
                          </div>
                          <p className="text-sm text-gray-600">{booking.customerName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.date).toLocaleDateString('fr-CA')} • ${booking.amount}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(booking.status)}
                          {booking.status === 'confirmed' && (
                            <Button
                              onClick={() => handleMarkCompleted(booking.id)}
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-300 hover:bg-green-50"
                            >
                              Terminer
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
