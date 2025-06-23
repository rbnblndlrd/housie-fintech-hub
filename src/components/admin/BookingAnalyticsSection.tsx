
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Users, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';

const BookingAnalyticsSection = () => {
  const { analytics, loading, error, refreshAnalytics } = useAdminAnalytics();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="font-medium">Error loading booking analytics</p>
              <p className="text-sm text-red-500">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshAnalytics}
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Booking Analytics</h2>
          <p className="text-gray-600">Comprehensive booking insights and trends</p>
        </div>
        <Button variant="outline" onClick={refreshAnalytics} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="fintech-metric-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.monthlyBookings.reduce((sum, month) => sum + month.bookings, 0)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-metric-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(analytics.monthlyBookings.reduce((sum, month) => sum + month.revenue, 0))}
                  </p>
                )}
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
                <p className="text-sm font-medium text-gray-600">Completed</p>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.monthlyBookings.reduce((sum, month) => sum + month.completed, 0)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-metric-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Value</p>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      analytics.monthlyBookings.reduce((sum, month) => sum + month.revenue, 0) /
                      Math.max(analytics.monthlyBookings.reduce((sum, month) => sum + month.bookings, 0), 1)
                    )}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card className="fintech-chart-container">
          <CardHeader>
            <CardTitle>Monthly Booking Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : analytics.monthlyBookings.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={analytics.monthlyBookings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? 'Revenue' : name === 'bookings' ? 'Bookings' : 'Completed'
                    ]}
                  />
                  <Bar dataKey="bookings" fill="#3B82F6" name="bookings" />
                  <Bar dataKey="completed" fill="#10B981" name="completed" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No booking data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="fintech-chart-container">
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : analytics.bookingStatusDistribution.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={analytics.bookingStatusDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                    >
                      {analytics.bookingStatusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {analytics.bookingStatusDistribution.map((status, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium capitalize">{status.status}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold">{status.count}</span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({status.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No status data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="fintech-chart-container">
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : analytics.recentBookings.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h4 className="font-medium">{booking.service?.title || 'Service'}</h4>
                    <p className="text-sm text-gray-600">
                      Customer: {booking.customer?.full_name || 'Customer'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      booking.status === 'completed' ? 'default' : 
                      booking.status === 'confirmed' ? 'secondary' : 'outline'
                    }>
                      {booking.status}
                    </Badge>
                    <p className="text-sm font-medium mt-1">
                      {formatCurrency(Number(booking.total_amount) || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent bookings available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingAnalyticsSection;
