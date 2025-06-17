
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, Clock, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const BookingAnalyticsSection = () => {
  // Mock booking data
  const bookingTrends = [
    { month: 'Jan', completed: 420, cancelled: 28, pending: 15 },
    { month: 'Fév', completed: 520, cancelled: 35, pending: 22 },
    { month: 'Mar', completed: 580, cancelled: 42, pending: 18 },
    { month: 'Avr', completed: 650, cancelled: 38, pending: 25 },
    { month: 'Mai', completed: 720, cancelled: 45, pending: 30 },
    { month: 'Jun', completed: 820, cancelled: 52, pending: 28 },
  ];

  const peakHours = [
    { hour: '6h', bookings: 12 },
    { hour: '8h', bookings: 45 },
    { hour: '10h', bookings: 89 },
    { hour: '12h', bookings: 76 },
    { hour: '14h', bookings: 125 },
    { hour: '16h', bookings: 98 },
    { hour: '18h', bookings: 67 },
    { hour: '20h', bookings: 34 },
  ];

  const recentBookings = [
    {
      id: 'BK-2024-001',
      customer: 'Marie Dubois',
      provider: 'Jean Nettoyage',
      service: 'Nettoyage résidentiel',
      date: '2024-06-17',
      time: '14:00',
      status: 'confirmed',
      amount: 120
    },
    {
      id: 'BK-2024-002',
      customer: 'Pierre Martin',
      provider: 'Sophie Jardinage',
      service: 'Entretien paysager',
      date: '2024-06-17',
      time: '09:00',
      status: 'in_progress',
      amount: 85
    },
    {
      id: 'BK-2024-003',
      customer: 'Claude Tremblay',
      provider: 'Marc Construction',
      service: 'Rénovation salle de bain',
      date: '2024-06-16',
      time: '08:00',
      status: 'completed',
      amount: 450
    },
    {
      id: 'BK-2024-004',
      customer: 'Sylvie Gagnon',
      provider: 'Anne Bien-être',
      service: 'Massage thérapeutique',
      date: '2024-06-16',
      time: '16:30',
      status: 'cancelled',
      amount: 90
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Terminée</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Confirmée</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">En cours</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Annulée</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">En attente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Réservations Totales</p>
                <p className="text-3xl font-black text-gray-900">4,892</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Taux de Completion</p>
                <p className="text-3xl font-black text-gray-900">94.2%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Temps Moyen</p>
                <p className="text-3xl font-black text-gray-900">2.4h</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Litiges Actifs</p>
                <p className="text-3xl font-black text-gray-900">23</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Trends */}
        <Card className="fintech-chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Tendances des Réservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelled" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card className="fintech-chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
              </div>
              Heures de Pointe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="hour" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#F97316" 
                  strokeWidth={3}
                  dot={{ fill: '#F97316', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            Réservations Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">ID Réservation</TableHead>
                  <TableHead className="font-semibold text-gray-700">Client</TableHead>
                  <TableHead className="font-semibold text-gray-700">Prestataire</TableHead>
                  <TableHead className="font-semibold text-gray-700">Service</TableHead>
                  <TableHead className="font-semibold text-gray-700">Date & Heure</TableHead>
                  <TableHead className="font-semibold text-gray-700">Statut</TableHead>
                  <TableHead className="font-semibold text-gray-700">Montant</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="font-mono text-sm font-semibold text-blue-600">
                        {booking.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-900">{booking.customer}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-700">{booking.provider}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-600">{booking.service}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">{booking.date}</div>
                        <div className="text-sm text-gray-500">{booking.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(booking.status)}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-900">{booking.amount} $</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="rounded-lg">
                          Voir
                        </Button>
                        {booking.status === 'pending' && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-lg">
                            Gérer
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingAnalyticsSection;
