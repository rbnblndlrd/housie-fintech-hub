
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCustomerData } from '@/hooks/useCustomerData';
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star,
  User,
  CheckCircle,
  AlertCircle,
  Users,
  Settings,
  History
} from 'lucide-react';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, loading, error, refreshData } = useCustomerData(user?.id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'confirmed': return 'secondary';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, loading: cardLoading }) => (
    <Card className="fintech-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            {cardLoading ? (
              <Skeleton className="h-8 w-24 mb-2" />
            ) : (
              <p className="text-3xl font-black text-gray-900">{value}</p>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <Card className="border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Error loading dashboard data</p>
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshData}
                    className="ml-auto"
                  >
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back!
            </h1>
            <p className="text-gray-600">Here's what's happening with your bookings</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Bookings"
              value={loading ? "..." : stats.totalBookings.toString()}
              subtitle={`${stats.completedBookings} completed`}
              icon={Calendar}
              loading={loading}
            />
            <StatCard
              title="Active Bookings"
              value={loading ? "..." : stats.activeBookings.toString()}
              subtitle="Currently in progress"
              icon={Clock}
              loading={loading}
            />
            <StatCard
              title="Total Spent"
              value={loading ? "..." : formatCurrency(stats.totalSpent)}
              subtitle="All time spending"
              icon={DollarSign}
              loading={loading}
            />
            <StatCard
              title="Average Rating"
              value={loading ? "..." : stats.averageRating.toFixed(1)}
              subtitle="Your rating given"
              icon={Star}
              loading={loading}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Upcoming Bookings */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : stats.upcomingBookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No upcoming bookings</p>
                ) : (
                  <div className="space-y-3">
                    {stats.upcomingBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{booking.service?.title || 'Service'}</h4>
                          <p className="text-sm text-gray-600">
                            {booking.provider?.business_name || booking.provider?.users?.full_name || 'Provider'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.scheduled_date).toLocaleDateString()} at {booking.scheduled_time}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusBadgeVariant(booking.status)}>
                            {booking.status}
                          </Badge>
                          <p className="text-sm font-medium mt-1">
                            {formatCurrency(Number(booking.total_amount) || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => navigate('/customer-bookings')}
                >
                  View All Bookings
                </Button>
              </CardContent>
            </Card>

            {/* Favorite Providers */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Favorite Providers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : stats.favoriteProviders.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No favorite providers yet</p>
                ) : (
                  <div className="space-y-3">
                    {stats.favoriteProviders.map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{provider.business_name || provider.users?.full_name}</p>
                            <p className="text-sm text-gray-600">
                              {provider.bookingCount} booking{provider.bookingCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">
                            {Number(provider.average_rating || 0).toFixed(1)}
                          </span>
                          {provider.verified && (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => navigate('/services')}
                >
                  Find More Providers
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions - Updated navigation */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Button 
              className="h-20 text-lg"
              onClick={() => navigate('/calendar')}
            >
              <Calendar className="h-6 w-6 mr-2" />
              Calendar
            </Button>
            <Button 
              variant="outline" 
              className="h-20 text-lg"
              onClick={() => navigate('/booking-history')}
            >
              <History className="h-6 w-6 mr-2" />
              View History
            </Button>
            <Button 
              variant="outline" 
              className="h-20 text-lg"
              onClick={() => navigate('/heat-zone-map')}
            >
              <MapPin className="h-6 w-6 mr-2" />
              Map
            </Button>
            <Button 
              variant="outline" 
              className="h-20 text-lg"
              onClick={() => navigate('/customer-settings')}
            >
              <Settings className="h-6 w-6 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
