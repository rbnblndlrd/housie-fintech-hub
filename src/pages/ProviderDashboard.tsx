
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  User, 
  MapPin, 
  Star,
  CheckCircle,
  AlertTriangle,
  Settings
} from 'lucide-react';
import Header from '@/components/Header';

interface ProviderStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalEarnings: number;
  averageRating: number;
  activeServices: number;
}

const ProviderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<ProviderStats>({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalEarnings: 0,
    averageRating: 0,
    activeServices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProviderData();
    }
  }, [user]);

  const loadProviderData = async () => {
    try {
      // Mock data for demo
      const mockStats: ProviderStats = {
        totalBookings: 24,
        pendingBookings: 3,
        completedBookings: 18,
        totalEarnings: 2850,
        averageRating: 4.8,
        activeServices: 5
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading provider data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
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
              Tableau de Bord Prestataire
            </h1>
            <p className="text-gray-600">Gérez vos services et suivez vos performances</p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button 
              onClick={() => navigate('/provider-profile')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              Gérer le Profil
            </Button>
            <Button 
              onClick={() => navigate('/booking-management')}
              variant="outline"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Réservations
            </Button>
            <Button 
              onClick={() => navigate('/analytics')}
              variant="outline"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Analyses
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <Card className="fintech-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Réservations</p>
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
                    <p className="text-sm font-medium text-gray-600">En Attente</p>
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
                    <p className="text-sm font-medium text-gray-600">Terminées</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completedBookings}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Gains Totaux</p>
                    <p className="text-2xl font-bold text-purple-600">${stats.totalEarnings}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Note Moyenne</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.averageRating}★</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Services Actifs</p>
                    <p className="text-2xl font-bold text-indigo-600">{stats.activeServices}</p>
                  </div>
                  <User className="h-8 w-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Bookings */}
            <div className="lg:col-span-2">
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Réservations Récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: '1',
                        service: 'Nettoyage résidentiel',
                        customer: 'Marie Dubois',
                        date: '2024-01-25',
                        time: '10:00',
                        status: 'confirmed',
                        amount: 120
                      },
                      {
                        id: '2',
                        service: 'Réparation plomberie',
                        customer: 'Jean Tremblay',
                        date: '2024-01-24',
                        time: '14:00',
                        status: 'in_progress',
                        amount: 250
                      }
                    ].map((booking) => (
                      <div key={booking.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{booking.service}</h4>
                            <p className="text-sm text-gray-600">{booking.customer}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${booking.amount}</p>
                            <Badge className={
                              booking.status === 'confirmed' 
                                ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                                : 'bg-orange-100 text-orange-800 border border-orange-300'
                            }>
                              {booking.status === 'confirmed' ? 'Confirmé' : 'En Cours'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(booking.date).toLocaleDateString('fr-FR')} à {booking.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Info */}
            <div className="space-y-6">
              {/* Verification Status */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle className="text-lg">Statut de Vérification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vérification d'identité</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vérification antécédents</span>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Assurance responsabilité</span>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              {/* Performance */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle className="text-lg">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taux de réponse</span>
                    <span className="text-sm font-medium text-green-600">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taux d'achèvement</span>
                    <span className="text-sm font-medium text-green-600">98%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Satisfaction client</span>
                    <span className="text-sm font-medium text-green-600">4.8/5</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
