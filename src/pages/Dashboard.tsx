
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, TrendingUp, Clock, Users, Star, MapPin } from 'lucide-react';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  averageRating: number;
  activeServices: number;
}

interface RecentBooking {
  id: string;
  service_title: string;
  customer_name: string;
  scheduled_date: string;
  status: string;
  total_amount: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    activeServices: 0
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);

  // Mock data for demonstration
  const mockStats: DashboardStats = {
    totalBookings: 45,
    pendingBookings: 8,
    completedBookings: 32,
    totalRevenue: 12500,
    averageRating: 4.8,
    activeServices: 6
  };

  const mockRecentBookings: RecentBooking[] = [
    {
      id: '1',
      service_title: 'Nettoyage résidentiel',
      customer_name: 'Marie Dubois',
      scheduled_date: '2024-01-20',
      status: 'confirmed',
      total_amount: 120
    },
    {
      id: '2',
      service_title: 'Jardinage',
      customer_name: 'Pierre Martin',
      scheduled_date: '2024-01-21',
      status: 'pending',
      total_amount: 180
    },
    {
      id: '3',
      service_title: 'Réparations',
      customer_name: 'Sophie Bernard',
      scheduled_date: '2024-01-22',
      status: 'in_progress',
      total_amount: 250
    }
  ];

  useEffect(() => {
    // Set mock data for now
    setStats(mockStats);
    setRecentBookings(mockRecentBookings);
    setLoading(false);
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'confirmed': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'in_progress': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 'completed': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En Attente';
      case 'confirmed': return 'Confirmée';
      case 'in_progress': return 'En Cours';
      case 'completed': return 'Terminée';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:bg-gray-900 fintech-grid-pattern">
        <Header />
        <div className="pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-white/60 dark:bg-gray-800/60 rounded-2xl w-1/3 fintech-card"></div>
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-white/60 dark:bg-gray-800/60 rounded-2xl fintech-card"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:bg-gray-900 fintech-grid-pattern">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Tableau de Bord
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Bienvenue sur votre espace professionnel HOUSIE</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="fintech-gradient-card bg-gradient-to-br from-blue-500 to-blue-600 border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-100 font-medium">Total Réservations</p>
                    <p className="text-2xl font-bold text-white">{stats.totalBookings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-gradient-card bg-gradient-to-br from-orange-500 to-orange-600 border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-100 font-medium">En Attente</p>
                    <p className="text-2xl font-bold text-white">{stats.pendingBookings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-gradient-card bg-gradient-to-br from-green-500 to-emerald-500 border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-100 font-medium">Terminées</p>
                    <p className="text-2xl font-bold text-white">{stats.completedBookings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-gradient-card bg-gradient-to-br from-purple-500 to-purple-600 border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-100 font-medium">Revenus</p>
                    <p className="text-2xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-gradient-card bg-gradient-to-br from-yellow-500 to-yellow-600 border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-yellow-100 font-medium">Note Moyenne</p>
                    <p className="text-2xl font-bold text-white">{stats.averageRating}/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-gradient-card bg-gradient-to-br from-indigo-500 to-indigo-600 border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Services Actifs</p>
                    <p className="text-2xl font-bold text-white">{stats.activeServices}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card className="fintech-chart-container">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Réservations Récentes</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 fintech-metric-card hover-lift">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold">
                        {booking.customer_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{booking.service_title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{booking.customer_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{new Date(booking.scheduled_date).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">${booking.total_amount}</p>
                      <Badge className={`${getStatusColor(booking.status)} text-white border-0 shadow-sm`}>
                        {getStatusText(booking.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button className="fintech-button-primary">
                  Voir Toutes les Réservations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
