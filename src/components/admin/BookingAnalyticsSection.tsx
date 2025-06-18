
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreamBadge } from '@/components/ui/cream-badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';

const bookingData = [
  { month: 'Jan', bookings: 45, revenue: 4500 },
  { month: 'Fév', bookings: 52, revenue: 5200 },
  { month: 'Mar', bookings: 48, revenue: 4800 },
  { month: 'Avr', bookings: 61, revenue: 6100 },
  { month: 'Mai', bookings: 55, revenue: 5500 },
  { month: 'Jun', bookings: 67, revenue: 6700 },
];

const statusData = [
  { name: 'Terminées', value: 320, color: '#10b981' },
  { name: 'En cours', value: 45, color: '#3b82f6' },
  { name: 'En attente', value: 28, color: '#f59e0b' },
  { name: 'Annulées', value: 15, color: '#ef4444' },
];

const BookingAnalyticsSection = () => {
  const totalBookings = statusData.reduce((sum, item) => sum + item.value, 0);
  const totalRevenue = 67500;
  const avgBookingValue = totalRevenue / totalBookings;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="fintech-metric-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Réservations</p>
                <p className="text-2xl font-bold text-gray-900">{totalBookings.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-metric-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenus Totaux</p>
                <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()}$</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-metric-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valeur Moyenne</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(avgBookingValue)}$</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-metric-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Croissance</p>
                <p className="text-2xl font-bold text-gray-900">+12.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends */}
        <Card className="fintech-chart-container">
          <CardHeader>
            <CardTitle>Évolution des Réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#3b82f6" name="Réservations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="fintech-chart-container">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Statut des Réservations
              <div className="flex flex-wrap gap-2">
                <CreamBadge variant="success">320 Terminées</CreamBadge>
                <CreamBadge variant="info">45 En cours</CreamBadge>
                <CreamBadge variant="warning">28 En attente</CreamBadge>
                <CreamBadge variant="error">15 Annulées</CreamBadge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingAnalyticsSection;
