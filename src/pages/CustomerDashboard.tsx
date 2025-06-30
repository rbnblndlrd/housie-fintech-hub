import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { useCustomerData } from '@/hooks/useCustomerData';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import VideoBackground from "@/components/common/VideoBackground";
import GoogleCalendarIntegration from "@/components/GoogleCalendarIntegration";
import DashboardRoleToggle from "@/components/dashboard/DashboardRoleToggle";
import RoleToggleSwitch from "@/components/dashboard/RoleToggleSwitch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  History,
  MessageSquare,
  RotateCcw
} from 'lucide-react';
import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addDays, format, subMonths, addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";

interface Booking {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_hours: number;
  total_amount: number;
  service_address: string;
  status: string;
  payment_status: string;
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

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { availableRoles } = useRoleSwitch();
  const { stats, loading, error, refreshData } = useCustomerData(user?.id);
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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
        title: "Error",
        description: "Unable to load your bookings.",
        variant: "destructive",
      });
    } finally {
      setBookingsLoading(false);
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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => 
      isSameDay(new Date(booking.scheduled_date), date)
    );
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, loading: cardLoading }) => (
    <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-white/90 mb-1">{title}</p>
            {cardLoading ? (
              <Skeleton className="h-8 w-24 mb-2" />
            ) : (
              <p className="text-3xl font-black text-white text-shadow-lg">{value}</p>
            )}
            {subtitle && (
              <p className="text-sm text-white/70 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-white text-shadow mb-2">
              {booking.service?.title || 'Service Request'}
            </h3>
            <div className="flex items-center gap-4 text-sm text-white/70 mb-3">
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
            <p className="font-bold text-lg text-white text-shadow-lg mt-2">
              {formatCurrency(Number(booking.total_amount) || 0)}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 pt-4 border-t border-white/20">
          {booking.status === 'completed' && (
            <Button size="sm" className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20">
              <Star className="h-4 w-4 mr-1" />
              Leave Review
            </Button>
          )}
          {['pending', 'confirmed'].includes(booking.status) && (
            <>
              <Button size="sm" variant="outline" className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20">
                <RotateCcw className="h-4 w-4 mr-1" />
                Reschedule
              </Button>
              <Button size="sm" variant="destructive" className="flex-1">
                Cancel
              </Button>
            </>
          )}
          <Button size="sm" variant="outline" className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20">
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCalendarView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white text-shadow">{format(currentDate, 'MMMM yyyy')}</h3>
          <div className="flex gap-2">
            <Button onClick={() => setCurrentDate(subMonths(currentDate, 1))} variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Previous
            </Button>
            <Button onClick={() => setCurrentDate(addMonths(currentDate, 1))} variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Next
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="p-3 text-center font-semibold text-white/90 bg-white/10 rounded backdrop-blur-sm">
              {day}
            </div>
          ))}
          
          {days.map((day) => {
            const dayBookings = getBookingsForDate(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div
                key={day.toString()}
                className={cn(
                  "min-h-[100px] p-2 border rounded cursor-pointer transition-colors backdrop-blur-sm",
                  isToday ? "bg-blue-500/20 border-blue-300/30" : "bg-white/10 hover:bg-white/20 border-white/20",
                  !isCurrentMonth && "text-white/40 bg-white/5"
                )}
                onClick={() => setSelectedDate(day)}
              >
                <div className={cn(
                  "text-sm font-medium mb-2 text-white text-shadow",
                  isToday && "text-blue-300 font-bold"
                )}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayBookings.slice(0, 2).map((booking) => (
                    <div
                      key={booking.id}
                      className="text-xs p-1 rounded truncate bg-blue-500/20 text-blue-200 backdrop-blur-sm"
                    >
                      {booking.scheduled_time} - {booking.service?.title}
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-xs text-white/70">
                      +{dayBookings.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <>
        <VideoBackground />
        <div className="relative z-10 min-h-screen">
          <Header />
          <div className="pt-20 px-4 pb-8">
            <div className="max-w-7xl mx-auto">
              <Card className="bg-slate-800/60 border-red-400/30 backdrop-blur-md shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Error loading dashboard data</p>
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refreshData}
                      className="ml-auto bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Retry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  const upcomingBookings = filterBookings('upcoming');
  const activeBookings = filterBookings('active');
  const completedBookings = filterBookings('completed');

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white text-shadow-lg mb-2">
                Welcome back!
              </h1>
              <p className="text-white/90 text-shadow">Manage your bookings, calendar, and account</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-white/10 backdrop-blur-md">
                <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">Overview</TabsTrigger>
                <TabsTrigger value="bookings" className="text-white data-[state=active]:bg-white/20">Bookings</TabsTrigger>
                <TabsTrigger value="calendar" className="text-white data-[state=active]:bg-white/20">Calendar</TabsTrigger>
                <TabsTrigger value="account" className="text-white data-[state=active]:bg-white/20">Account</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Button 
                    className="h-20 text-lg bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
                    onClick={() => setActiveTab('bookings')}
                  >
                    <Calendar className="h-6 w-6 mr-2" />
                    View Bookings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 text-lg bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
                    onClick={() => setActiveTab('calendar')}
                  >
                    <History className="h-6 w-6 mr-2" />
                    Calendar
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 text-lg bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/30 text-blue-200 backdrop-blur-sm"
                    onClick={() => navigate('/services')}
                  >
                    <MapPin className="h-6 w-6 mr-2" />
                    <div className="text-left">
                      <div>Find Services</div>
                      <div className="text-xs opacity-80">Book New Service</div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 text-lg bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
                    onClick={() => setActiveTab('account')}
                  >
                    <Settings className="h-6 w-6 mr-2" />
                    Settings
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white text-shadow">My Bookings</h2>
                  <Button onClick={() => navigate('/services')} className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm">
                    Book New Service
                  </Button>
                </div>

                <Tabs defaultValue="upcoming" className="space-y-4">
                  <TabsList className="grid grid-cols-3 w-full max-w-md bg-white/10 backdrop-blur-md">
                    <TabsTrigger value="upcoming" className="text-white data-[state=active]:bg-white/20">
                      Upcoming ({upcomingBookings.length})
                    </TabsTrigger>
                    <TabsTrigger value="active" className="text-white data-[state=active]:bg-white/20">
                      Active ({activeBookings.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="text-white data-[state=active]:bg-white/20">
                      Completed ({completedBookings.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming">
                    <div className="space-y-4">
                      {bookingsLoading ? (
                        <div className="space-y-3">
                          {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-48 w-full bg-white/20" />
                          ))}
                        </div>
                      ) : upcomingBookings.length > 0 ? (
                        upcomingBookings.map((booking) => (
                          <BookingCard key={booking.id} booking={booking} />
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 text-white/60 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-white text-shadow mb-2">No upcoming bookings</h3>
                          <p className="text-white/70">Your confirmed bookings will appear here</p>
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
                          <Clock className="h-12 w-12 text-white/60 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-white text-shadow mb-2">No active services</h3>
                          <p className="text-white/70">Services currently in progress will appear here</p>
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
                          <Star className="h-12 w-12 text-white/60 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-white text-shadow mb-2">No completed services</h3>
                          <p className="text-white/70">Completed services will appear here</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="calendar" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white text-shadow">
                          <Calendar className="h-5 w-5" />
                          My Calendar
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {renderCalendarView()}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <GoogleCalendarIntegration 
                      onSync={() => console.log('Syncing calendar...')}
                      onImport={() => console.log('Importing events...')}
                      onExport={() => console.log('Exporting events...')}
                    />

                    <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                      <CardHeader>
                        <CardTitle className="text-white text-shadow">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button 
                          className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm" 
                          onClick={() => navigate('/services')}
                        >
                          Book New Service
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
                          onClick={() => setActiveTab('bookings')}
                        >
                          View All Bookings
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="account" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-white text-shadow">Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
                        onClick={() => navigate('/profile-settings')}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Edit Profile & Settings
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
                        onClick={() => navigate('/subscription-management')}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Subscription
                      </Button>
                      
                      {/* Role Toggle Switch */}
                      <div className="pt-4 border-t border-white/20">
                        <h4 className="text-sm font-medium text-white/90 mb-3">Switch Role</h4>
                        <RoleToggleSwitch />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-white text-shadow">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-white/70">Member Since</span>
                        <span className="font-medium text-white">January 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Services Used</span>
                        <span className="font-medium text-white">{stats.totalBookings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Total Spent</span>
                        <span className="font-medium text-white">{formatCurrency(stats.totalSpent)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDashboard;
