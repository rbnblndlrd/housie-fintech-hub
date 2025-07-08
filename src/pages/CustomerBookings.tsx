import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  ArrowLeft,
  Star,
  MessageSquare,
  RotateCcw
} from 'lucide-react';

interface Booking {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_hours: number;
  total_amount: number;
  service_address: string;
  status: string; // Changed from union type to string to match database
  payment_status: string; // Changed from union type to string to match database
  provider: {
    business_name: string;
    user: {
      full_name: string;
    };
  };
  service: {
    title: string;
    category: string;
  };
}

const CustomerBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Redirect if role changes to provider
  useEffect(() => {
    if (currentRole === 'provider') {
      navigate('/provider-bookings');
    }
  }, [currentRole, navigate]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          provider:provider_id (
            business_name,
            user:user_id (full_name)
          ),
          service:service_id (
            title,
            category
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos réservations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

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
      case 'cancelled': return 'bg-red-600 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  const filterBookings = (status: string) => {
    const now = new Date();
    
    switch (status) {
      case 'upcoming':
        return bookings.filter(booking => 
          ['pending', 'confirmed'].includes(booking.status) &&
          new Date(booking.scheduled_date) >= now
        );
      case 'active':
        return bookings.filter(booking => booking.status === 'in_progress');
      case 'completed':
        return bookings.filter(booking => booking.status === 'completed');
      default:
        return bookings;
    }
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
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
                <span>{booking.provider?.business_name || booking.provider?.user?.full_name || 'Provider'}</span>
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
        
        <div className="flex gap-2 pt-4 border-t">
          {booking.status === 'completed' && (
            <Button size="sm" className="flex-1">
              <Star className="h-4 w-4 mr-1" />
              Leave Review
            </Button>
          )}
          {['pending', 'confirmed'].includes(booking.status) && (
            <>
              <Button size="sm" variant="outline" className="flex-1">
                <RotateCcw className="h-4 w-4 mr-1" />
                Reschedule
              </Button>
              <Button size="sm" variant="destructive" className="flex-1">
                Cancel
              </Button>
            </>
          )}
          <Button size="sm" variant="outline" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </Button>
        </div>
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
              const hasBooking = [8, 15, 22, 29].includes(date);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
        <div className="pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-white rounded w-1/3"></div>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full" />
                  ))}
                </div>
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const upcomingBookings = filterBookings('upcoming');
  const activeBookings = filterBookings('active');
  const completedBookings = filterBookings('completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={() => navigate('/customer-dashboard')}
              variant="outline"
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
            </div>
            <p className="text-gray-600">Manage your service bookings and appointments</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Bookings */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full mb-6">
                  <TabsTrigger value="upcoming">
                    Upcoming ({upcomingBookings.length})
                  </TabsTrigger>
                  <TabsTrigger value="active">
                    Active ({activeBookings.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed ({completedBookings.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  <div className="space-y-4">
                    {upcomingBookings.length > 0 ? (
                      upcomingBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming bookings</h3>
                        <p className="text-gray-600">Your confirmed bookings will appear here</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="active">
                  <div className="space-y-4">
                    {activeBookings.length > 0 ? (
                      activeBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No active services</h3>
                        <p className="text-gray-600">Services currently in progress will appear here</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="completed">
                  <div className="space-y-4">
                    {completedBookings.length > 0 ? (
                      completedBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No completed services</h3>
                        <p className="text-gray-600">Completed services will appear here</p>
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

export default CustomerBookings;
