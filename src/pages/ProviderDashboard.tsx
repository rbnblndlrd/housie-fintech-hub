import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProviderData } from '@/hooks/useProviderData';
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  DollarSign, 
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  BarChart3,
  MapPin,
  Settings
} from 'lucide-react';

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, loading, error, refreshData } = useProviderData(user?.id);

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
      case 'in_progress': return 'default';
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
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
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
              Provider Dashboard
            </h1>
            <p className="text-gray-600">Manage your business and track your performance</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Bookings"
              value={loading ? "..." : stats.totalBookings.toString()}
              subtitle={`${stats.completedJobs} completed`}
              icon={Calendar}
              loading={loading}
            />
            <StatCard
              title="Active Jobs"
              value={loading ? "..." : stats.activeJobs.toString()}
              subtitle="Currently in progress"
              icon={Clock}
              loading={loading}
            />
            <StatCard
              title="Total Earnings"
              value={loading ? "..." : formatCurrency(stats.totalEarnings)}
              subtitle={`${formatCurrency(stats.monthlyEarnings)} this month`}
              icon={DollarSign}
              loading={loading}
            />
            <StatCard
              title="Average Rating"
              value={loading ? "..." : stats.averageRating.toFixed(1)}
              subtitle="From customer reviews"
              icon={Star}
              loading={loading}
            />
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="fintech-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Completion Rate</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <p className="text-2xl font-bold text-green-600">{stats.completionRate.toFixed(1)}%</p>
                    )}
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Response Time</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <p className="text-2xl font-bold text-blue-600">{stats.responseTime}h</p>
                    )}
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Weekly Bookings</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <p className="text-2xl font-bold text-purple-600">{stats.weeklyBookings}</p>
                    )}
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Upcoming Jobs */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : stats.upcomingJobs.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No upcoming jobs</p>
                ) : (
                  <div className="space-y-3">
                    {stats.upcomingJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{job.service?.title || 'Service'}</h4>
                          <p className="text-sm text-gray-600">
                            Customer: {job.customer?.full_name || 'Customer'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(job.scheduled_date).toLocaleDateString()} at {job.scheduled_time}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusBadgeVariant(job.status)}>
                            {job.status}
                          </Badge>
                          <p className="text-sm font-medium mt-1">
                            {formatCurrency(Number(job.total_amount) || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => navigate('/provider-bookings')}
                >
                  View All Jobs
                </Button>
              </CardContent>
            </Card>

            {/* Recent Completed Jobs */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Recent Completed Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : stats.recentJobs.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No completed jobs yet</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentJobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{job.service?.title || 'Service'}</h4>
                          <p className="text-sm text-gray-600">
                            Customer: {job.customer?.full_name || 'Customer'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Completed on {new Date(job.scheduled_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="default">completed</Badge>
                          <p className="text-sm font-medium mt-1">
                            {formatCurrency(Number(job.total_amount) || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => navigate('/provider-history')}
                >
                  View History
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Button 
              className="h-20 text-lg"
              onClick={() => navigate('/provider-bookings')}
            >
              <Calendar className="h-6 w-6 mr-2" />
              Manage Bookings
            </Button>
            <Button 
              variant="outline" 
              className="h-20 text-lg"
              onClick={() => navigate('/provider-bookings')}
            >
              <Calendar className="h-6 w-6 mr-2" />
              Calendar
            </Button>
            <Button 
              variant="outline" 
              className="h-20 text-lg"
              onClick={() => navigate('/services')}
            >
              <MapPin className="h-6 w-6 mr-2" />
              Map
            </Button>
            <Button 
              variant="outline" 
              className="h-20 text-lg"
              onClick={() => navigate('/provider-settings')}
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

export default ProviderDashboard;
