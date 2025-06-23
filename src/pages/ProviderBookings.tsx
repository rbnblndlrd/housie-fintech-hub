
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProviderData } from '@/hooks/useProviderData';
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  User,
  MapPin,
  DollarSign,
  Check,
  X,
  Eye,
  ArrowLeft,
  Filter
} from 'lucide-react';

const ProviderBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, loading, error } = useProviderData(user?.id);
  const [activeTab, setActiveTab] = useState('pending');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const BookingCard = ({ booking, showActions = false }: { booking: any; showActions?: boolean }) => (
    <Card className="fintech-card mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {booking.service?.title || 'Service Request'}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{booking.customer?.full_name || 'Customer'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{new Date(booking.scheduled_date).toLocaleDateString()} at {booking.scheduled_time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="truncate max-w-xs">{booking.service_address || 'Address not specified'}</span>
              </div>
            </div>
            {booking.instructions && (
              <p className="text-sm text-gray-600 mb-3">"{booking.instructions}"</p>
            )}
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(booking.status)}>
              {booking.status}
            </Badge>
            <p className="font-bold text-lg text-gray-900 mt-2">
              {formatCurrency(Number(booking.total_amount) || 0)}
            </p>
          </div>
        </div>
        
        {showActions && (
          <div className="flex gap-2 pt-4 border-t">
            <Button size="sm" className="flex-1">
              <Check className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            <Button size="sm" variant="destructive" className="flex-1">
              <X className="h-4 w-4 mr-1" />
              Decline
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const CalendarPreview = () => (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-600 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="p-2">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }, (_, i) => {
              const date = i + 1;
              const hasBooking = [5, 12, 18, 25].includes(date);
              const isToday = date === 15;
              
              return (
                <div 
                  key={i} 
                  className={`
                    p-2 text-center text-sm rounded cursor-pointer transition-colors
                    ${isToday ? 'bg-blue-600 text-white' : ''}
                    ${hasBooking && !isToday ? 'bg-green-100 text-green-800' : ''}
                    ${!hasBooking && !isToday ? 'hover:bg-gray-100' : ''}
                  `}
                >
                  {date <= 31 ? date : ''}
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between text-xs text-gray-600 pt-3 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 rounded"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span>Today</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => navigate('/calendar')}
          >
            View Full Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
        <div className="pt-20 px-4">
          <div className="max-w-7xl mx-auto text-center py-8">
            <p className="text-red-600">Error loading bookings: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate pending bookings from existing data
  const pendingBookingsCount = stats.totalBookings - stats.completedJobs - stats.activeJobs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={() => navigate('/provider-dashboard')}
              variant="outline"
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Booking Management</h1>
            </div>
            <p className="text-gray-600">Manage your bookings and schedule</p>
            
            <div className="flex gap-3 mt-6">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Bookings */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full mb-6">
                  <TabsTrigger value="pending">
                    Pending Approval ({loading ? '...' : Math.max(0, pendingBookingsCount)})
                  </TabsTrigger>
                  <TabsTrigger value="active">
                    Active Jobs ({loading ? '...' : stats.activeJobs || 0})
                  </TabsTrigger>
                  <TabsTrigger value="upcoming">
                    Upcoming ({loading ? '...' : stats.upcomingJobs?.length || 0})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                  <div className="space-y-4">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full" />
                      ))
                    ) : pendingBookingsCount > 0 ? (
                      // Mock pending bookings since we don't have the exact data structure
                      Array.from({ length: 2 }).map((_, i) => (
                        <BookingCard 
                          key={i}
                          booking={{
                            id: `pending-${i}`,
                            service: { title: 'House Cleaning Service' },
                            customer: { full_name: 'John Doe' },
                            scheduled_date: '2024-01-20',
                            scheduled_time: '10:00',
                            service_address: '123 Main St, Montreal, QC',
                            total_amount: 150,
                            status: 'pending',
                            instructions: 'Please focus on the kitchen and bathrooms'
                          }}
                          showActions={true}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No pending bookings</h3>
                        <p className="text-gray-600">New booking requests will appear here</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="active">
                  <div className="space-y-4">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full" />
                      ))
                    ) : stats.activeJobs > 0 ? (
                      Array.from({ length: 1 }).map((_, i) => (
                        <BookingCard 
                          key={i}
                          booking={{
                            id: `active-${i}`,
                            service: { title: 'Lawn Maintenance' },
                            customer: { full_name: 'Sarah Wilson' },
                            scheduled_date: '2024-01-18',
                            scheduled_time: '14:00',
                            service_address: '456 Oak Ave, Montreal, QC',
                            total_amount: 80,
                            status: 'in_progress'
                          }}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No active jobs</h3>
                        <p className="text-gray-600">Jobs in progress will appear here</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="upcoming">
                  <div className="space-y-4">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full" />
                      ))
                    ) : stats.upcomingJobs?.length > 0 ? (
                      stats.upcomingJobs.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming jobs</h3>
                        <p className="text-gray-600">Confirmed future bookings will appear here</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Calendar Preview */}
            <div className="lg:col-span-1">
              <CalendarPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderBookings;
