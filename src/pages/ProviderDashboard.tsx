import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProviderData } from '@/hooks/useProviderData';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import GoogleCalendarIntegration from "@/components/GoogleCalendarIntegration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  DollarSign, 
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  Settings,
  User,
  MessageSquare,
  ArrowLeft,
  GripVertical,
  Timer,
  MapPinned,
  Play,
  Pause,
  CheckCircle2
} from 'lucide-react';
import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, subMonths, addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, isToday } from "date-fns";

interface Booking {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_hours: number;
  total_amount: number;
  service_address: string;
  status: string;
  payment_status: string;
  customer: {
    full_name: string;
  };
  service: {
    title: string;
    category: string;
  };
}

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, loading, error, refreshData } = useProviderData(user?.id);
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customer_id (full_name),
          service:service_id (
            title,
            category
          )
        `)
        .eq('provider_id', user.id)
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

  // New job management functions
  const getJobsByColumn = (columnType: 'pending' | 'today' | 'pool' | 'completed') => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (columnType) {
      case 'pending':
        return bookings.filter(booking => booking.status === 'pending');
      case 'today':
        return bookings.filter(booking => {
          const bookingDate = new Date(booking.scheduled_date);
          return (booking.status === 'confirmed' || booking.status === 'in_progress') && 
                 bookingDate.toDateString() === today.toDateString();
        });
      case 'pool':
        return bookings.filter(booking => {
          const bookingDate = new Date(booking.scheduled_date);
          return booking.status === 'confirmed' && bookingDate > today;
        });
      case 'completed':
        return bookings.filter(booking => booking.status === 'completed');
      default:
        return [];
    }
  };

  const handleDragStart = (e: React.DragEvent, bookingId: string) => {
    setDraggedItem(bookingId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', bookingId);
  };

  const handleDragOver = (e: React.DragEvent, columnType: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnType);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetColumn: 'pending' | 'today' | 'pool' | 'completed') => {
    e.preventDefault();
    const bookingId = draggedItem;
    if (!bookingId) return;

    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    let newStatus = booking.status;
    
    // Determine new status based on target column
    switch (targetColumn) {
      case 'pending':
        newStatus = 'pending';
        break;
      case 'today':
        newStatus = 'in_progress';
        break;
      case 'pool':
        newStatus = 'confirmed';
        break;
      case 'completed':
        newStatus = 'completed';
        break;
    }

    // Show confirmation for critical moves
    if (targetColumn === 'completed' && booking.status !== 'completed') {
      const confirmed = window.confirm('Mark this job as completed? This will trigger payment processing.');
      if (!confirmed) {
        setDraggedItem(null);
        setDragOverColumn(null);
        return;
      }
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      // Update local state
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: newStatus } : b
      ));

      toast({
        title: "Job Updated",
        description: `Job moved to ${targetColumn} column successfully.`,
      });

    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update job status.",
        variant: "destructive",
      });
    }

    setDraggedItem(null);
    setDragOverColumn(null);
  };

  const handleAcceptJob = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'confirmed',
          accepted_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'confirmed', accepted_at: new Date().toISOString() } : b
      ));

      toast({
        title: "Job Accepted!",
        description: "You've successfully accepted this job.",
      });

    } catch (error) {
      console.error('Error accepting job:', error);
      toast({
        title: "Error",
        description: "Failed to accept job. It may have been taken by another provider.",
        variant: "destructive",
      });
    }
  };

  const JobCard = ({ booking, isDragging = false }: { booking: Booking; isDragging?: boolean }) => (
    <Card 
      className={cn(
        "fintech-card mb-4 cursor-move transition-all duration-200 hover:shadow-lg",
        isDragging && "opacity-50 rotate-3 scale-105"
      )}
      draggable
      onDragStart={(e) => handleDragStart(e, booking.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-gray-400" />
            <div>
              <h3 className="font-semibold text-sm text-gray-900">
                {booking.service?.title || 'Service Request'}
              </h3>
              <Badge variant={getStatusBadgeVariant(booking.status)} className="mt-1">
                {booking.status}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-gray-900">
              {formatCurrency(Number(booking.total_amount) || 0)}
            </p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3" />
            <span>{booking.customer?.full_name || 'Customer'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>{new Date(booking.scheduled_date).toLocaleDateString()} at {booking.scheduled_time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{booking.service_address}</span>
          </div>
        </div>
        
        {booking.status === 'pending' && (
          <div className="flex gap-2 mt-3 pt-3 border-t">
            <Button 
              size="sm" 
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
              onClick={() => handleAcceptJob(booking.id)}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Accept
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <MessageSquare className="h-3 w-3 mr-1" />
              Message
            </Button>
          </div>
        )}
        
        {booking.status === 'in_progress' && (
          <div className="flex gap-2 mt-3 pt-3 border-t">
            <Button size="sm" variant="outline" className="flex-1">
              <MapPinned className="h-3 w-3 mr-1" />
              On Site
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Pause className="h-3 w-3 mr-1" />
              Break
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const JobColumn = ({ 
    title, 
    columnType, 
    jobs, 
    icon: Icon, 
    color 
  }: { 
    title: string; 
    columnType: 'pending' | 'today' | 'pool' | 'completed'; 
    jobs: Booking[]; 
    icon: any; 
    color: string;
  }) => (
    <div className="flex-1 min-h-[600px]">
      <Card className="fintech-card h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <p className="text-sm text-gray-500">({jobs.length})</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent 
          className={cn(
            "p-4 min-h-[500px] transition-all duration-200",
            dragOverColumn === columnType && "bg-blue-50 border-2 border-dashed border-blue-300"
          )}
          onDragOver={(e) => handleDragOver(e, columnType)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, columnType)}
        >
          {jobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No jobs in this category</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  booking={job} 
                  isDragging={draggedItem === job.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

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

  const renderCalendarView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h3>
          <div className="flex gap-2">
            <Button onClick={() => setCurrentDate(subMonths(currentDate, 1))} variant="outline" size="sm">
              Previous
            </Button>
            <Button onClick={() => setCurrentDate(addMonths(currentDate, 1))} variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="p-3 text-center font-semibold text-gray-600 bg-gray-50 rounded">
              {day}
            </div>
          ))}
          
          {days.map((day) => {
            const dayBookings = getBookingsForDate(day);
            const isTodayDate = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div
                key={day.toString()}
                className={cn(
                  "min-h-[100px] p-2 border rounded cursor-pointer transition-colors",
                  isTodayDate ? "bg-blue-50 border-blue-200" : "bg-white hover:bg-gray-50",
                  !isCurrentMonth && "text-gray-400 bg-gray-50"
                )}
                onClick={() => setSelectedDate(day)}
              >
                <div className={cn(
                  "text-sm font-medium mb-2",
                  isTodayDate && "text-blue-600 font-bold"
                )}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayBookings.slice(0, 2).map((booking) => (
                    <div
                      key={booking.id}
                      className={cn(
                        "text-xs p-1 rounded truncate",
                        booking.status === 'confirmed' 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      )}
                    >
                      {booking.scheduled_time} - {booking.service?.title}
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-xs text-gray-500">
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

  const upcomingJobs = filterBookings('upcoming');
  const activeJobs = filterBookings('active');
  const completedJobs = filterBookings('completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Provider Dashboard
            </h1>
            <p className="text-gray-600">Manage your business, bookings, and schedule</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </TabsContent>

            <TabsContent value="jobs" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab('overview')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <h2 className="text-2xl font-bold">Job Management</h2>
                </div>
              </div>

              {/* Four-Column Job Management */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <JobColumn
                  title="Pending"
                  columnType="pending"
                  jobs={getJobsByColumn('pending')}
                  icon={Timer}
                  color="bg-gradient-to-r from-yellow-500 to-orange-500"
                />
                <JobColumn
                  title="Today"
                  columnType="today"
                  jobs={getJobsByColumn('today')}
                  icon={Play}
                  color="bg-gradient-to-r from-blue-500 to-blue-600"
                />
                <JobColumn
                  title="Pool"
                  columnType="pool"
                  jobs={getJobsByColumn('pool')}
                  icon={Clock}
                  color="bg-gradient-to-r from-purple-500 to-purple-600"
                />
                <JobColumn
                  title="Completed"
                  columnType="completed"
                  jobs={getJobsByColumn('completed')}
                  icon={CheckCircle2}
                  color="bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab('overview')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <h2 className="text-2xl font-bold">Schedule Calendar</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Schedule Calendar
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

                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle>Availability Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate('/provider-settings')}
                      >
                        Working Hours
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setActiveTab('jobs')}
                      >
                        View All Jobs
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="business" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab('overview')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <h2 className="text-2xl font-bold">Business Management</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle>Business Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/provider-profile')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/provider-settings')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle>Business Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Since</span>
                      <span className="font-medium">January 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Jobs</span>
                      <span className="font-medium">{stats.totalBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Earnings</span>
                      <span className="font-medium">{formatCurrency(stats.totalEarnings)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Rating</span>
                      <span className="font-medium">{stats.averageRating.toFixed(1)} ⭐</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
