import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
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
  const { currentRole } = useRole();
  const { stats, loading, error } = useProviderData(user?.id);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Redirect if role changes to customer
  useEffect(() => {
    if (currentRole === 'customer') {
      navigate('/customer-bookings');
    }
  }, [currentRole, navigate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-600 text-white';
      case 'confirmed': return 'bg-blue-600 text-white';
      case 'in_progress': return 'bg-green-600 text-white';
      case 'completed': return 'bg-slate-600 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  // Enhanced function to get bookings for selected date with more variety
  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const dayAfterTomorrow = new Date(Date.now() + 172800000).toISOString().split('T')[0];
    
    // Enhanced mock bookings with more dates
    const mockBookings: { [key: string]: any[] } = {
      [today]: [
        {
          id: 'today-1',
          service: { title: 'House Cleaning Service' },
          customer: { full_name: 'John Doe' },
          scheduled_date: dateStr,
          scheduled_time: '10:00',
          service_address: '123 Main St, Montreal, QC',
          total_amount: 150,
          status: 'confirmed',
          instructions: 'Please focus on the kitchen and bathrooms'
        },
        {
          id: 'today-2',
          service: { title: 'Window Cleaning' },
          customer: { full_name: 'Marie Dupuis' },
          scheduled_date: dateStr,
          scheduled_time: '14:00',
          service_address: '789 Pine Ave, Montreal, QC',
          total_amount: 75,
          status: 'pending'
        }
      ],
      [tomorrow]: [
        {
          id: 'tomorrow-1',
          service: { title: 'Lawn Maintenance' },
          customer: { full_name: 'Sarah Wilson' },
          scheduled_date: dateStr,
          scheduled_time: '09:00',
          service_address: '456 Oak Ave, Montreal, QC',
          total_amount: 80,
          status: 'confirmed'
        }
      ],
      [dayAfterTomorrow]: [
        {
          id: 'dayafter-1',
          service: { title: 'Deep House Cleaning' },
          customer: { full_name: 'Robert Smith' },
          scheduled_date: dateStr,
          scheduled_time: '11:00',
          service_address: '321 Elm St, Montreal, QC',
          total_amount: 200,
          status: 'pending',
          instructions: 'Full house deep clean, includes all rooms'
        }
      ]
    };
    
    return mockBookings[dateStr] || [];
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

  const CalendarPreview = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const handleDateClick = (day: number) => {
      const clickedDate = new Date(currentYear, currentMonth, day);
      setSelectedDate(clickedDate);
    };

    // Check which days have bookings for visual indicators
    const getDayBookingCount = (day: number) => {
      const date = new Date(currentYear, currentMonth, day);
      return getBookingsForDate(date).length;
    };

    return (
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar Preview
          </CardTitle>
          <p className="text-sm text-gray-600">
            Selected: {selectedDate.toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-600 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2">{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }, (_, i) => (
                <div key={`empty-${i}`} className="p-2"></div>
              ))}
              
              {/* Days of the month */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const currentDate = new Date(currentYear, currentMonth, day);
                const bookingCount = getDayBookingCount(day);
                const hasBooking = bookingCount > 0;
                const isToday = currentDate.toDateString() === today.toDateString();
                const isSelected = currentDate.toDateString() === selectedDate.toDateString();
                
                return (
                  <div 
                    key={day} 
                    onClick={() => handleDateClick(day)}
                    className={`
                      p-2 text-center text-sm rounded cursor-pointer transition-colors relative
                      ${isSelected ? 'bg-purple-600 text-white' : ''}
                      ${isToday && !isSelected ? 'bg-blue-600 text-white' : ''}
                      ${hasBooking && !isSelected && !isToday ? 'bg-green-100 text-green-800' : ''}
                      ${!hasBooking && !isSelected && !isToday ? 'hover:bg-gray-100' : ''}
                    `}
                  >
                    {day}
                    {hasBooking && bookingCount > 1 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {bookingCount}
                      </div>
                    )}
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
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-600 rounded"></div>
                <span>Selected</span>
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
  };

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
  const selectedDateBookings = getBookingsForDate(selectedDate);

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
              {/* Show bookings for selected date */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Bookings for {selectedDate.toLocaleDateString()}
                </h2>
                <div className="space-y-4">
                  {loading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-48 w-full" />
                    ))
                  ) : selectedDateBookings.length > 0 ? (
                    selectedDateBookings.map((booking) => (
                      <BookingCard 
                        key={booking.id}
                        booking={booking}
                        showActions={true}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings for this date</h3>
                      <p className="text-gray-600">Select another date to view bookings</p>
                    </div>
                  )}
                </div>
              </div>

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
