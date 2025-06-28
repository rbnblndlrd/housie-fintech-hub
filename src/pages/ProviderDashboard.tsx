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
import { Switch } from "@/components/ui/switch";
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
  CheckCircle2,
  Bell,
  Phone,
  Navigation,
  CloudRain,
  Sun,
  Cloud,
  Zap,
  Eye,
  ToggleLeft,
  Snowflake,
  Heart,
  Maple
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
  const [selectedJob, setSelectedJob] = useState<Booking | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Quebec Holiday Detection
  const getHolidayTheme = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Saint-Jean-Baptiste (June 24)
    if (month === 6 && day === 24) {
      return {
        theme: 'quebec',
        colors: 'bg-blue-100 border-blue-300 text-blue-800',
        icon: '⚜️',
        name: 'Saint-Jean-Baptiste'
      };
    }
    
    // Canada Day (July 1)
    if (month === 7 && day === 1) {
      return {
        theme: 'canada',
        colors: 'bg-red-100 border-red-300 text-red-800',
        icon: '🍁',
        name: 'Canada Day'
      };
    }
    
    // Christmas (December 25)
    if (month === 12 && day === 25) {
      return {
        theme: 'christmas',
        colors: 'bg-green-100 border-red-300 text-green-800',
        icon: '🎄',
        name: 'Christmas'
      };
    }
    
    // Halloween (October 31)
    if (month === 10 && day === 31) {
      return {
        theme: 'halloween',
        colors: 'bg-orange-100 border-orange-300 text-orange-800',
        icon: '🎃',
        name: 'Halloween'
      };
    }
    
    // Valentine's Day (February 14)
    if (month === 2 && day === 14) {
      return {
        theme: 'valentine',
        colors: 'bg-pink-100 border-pink-300 text-pink-800',
        icon: '💝',
        name: 'Valentine\'s Day'
      };
    }
    
    // New Year's Day (January 1)
    if (month === 1 && day === 1) {
      return {
        theme: 'newyear',
        colors: 'bg-purple-100 border-purple-300 text-purple-800',
        icon: '🎊',
        name: 'New Year\'s Day'
      };
    }
    
    return null;
  };

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

  // Mobile-optimized Job Card with larger touch targets
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
            <GripVertical className="h-5 w-5 text-gray-400" />
            <div>
              <h3 className="font-semibold text-base text-gray-900">
                {booking.service?.title || 'Service Request'}
              </h3>
              <Badge variant={getStatusBadgeVariant(booking.status)} className="mt-1">
                {booking.status}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl text-gray-900">
              {formatCurrency(Number(booking.total_amount) || 0)}
            </p>
          </div>
        </div>
        
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-base">{booking.customer?.full_name || 'Customer'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-base">{new Date(booking.scheduled_date).toLocaleDateString()} at {booking.scheduled_time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate text-base">{booking.service_address}</span>
          </div>
        </div>
        
        {booking.status === 'pending' && (
          <div className="flex gap-3 mt-4 pt-4 border-t">
            <Button 
              size="lg"
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 h-12"
              onClick={() => handleAcceptJob(booking.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept
            </Button>
            <Button size="lg" variant="outline" className="flex-1 h-12">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        )}
        
        {booking.status === 'in_progress' && (
          <div className="flex gap-3 mt-4 pt-4 border-t">
            <Button size="lg" variant="outline" className="flex-1 h-12">
              <MapPinned className="h-4 w-4 mr-2" />
              On Site
            </Button>
            <Button size="lg" variant="outline" className="flex-1 h-12">
              <Pause className="h-4 w-4 mr-2" />
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
                <Icon className="h-5 w-5 text-white" />
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
              <p className="text-base">No jobs in this category</p>
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

  // Mobile-optimized Alert Banner with larger touch targets
  const AlertBanner = ({ type, count, message, onClick }: { 
    type: 'pending' | 'updates'; 
    count: number; 
    message: string; 
    onClick: () => void;
  }) => (
    <Card 
      className={cn(
        "fintech-card cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4",
        type === 'pending' ? "border-l-orange-500 bg-gradient-to-r from-orange-50 to-yellow-50" : "border-l-red-500 bg-gradient-to-r from-red-50 to-pink-50"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              type === 'pending' ? "bg-orange-500" : "bg-red-500"
            )}>
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-lg text-gray-900">{message}</p>
              <Badge variant="outline" className="mt-1 text-base px-3 py-1">
                {count} {type === 'pending' ? 'pending' : 'updates'}
              </Badge>
            </div>
          </div>
          <Button size="lg" variant="outline" className="h-12 px-6">
            {type === 'pending' ? 'Review' : 'View All'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Mobile-optimized Enhanced Calendar Widget
  const EnhancedCalendarWidget = () => {
    const nextJob = bookings
      .filter(b => ['confirmed', 'in_progress'].includes(b.status))
      .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())[0];

    return (
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Schedule Preview
            </div>
            <Button variant="ghost" size="lg" onClick={() => setActiveTab('calendar')} className="h-12">
              <Eye className="h-5 w-5 mr-2" />
              Full View
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {nextJob && (
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <p className="text-base text-gray-600 mb-2">Next Appointment</p>
              <p className="text-xl font-bold text-gray-900 mb-2">
                {nextJob.customer?.full_name?.split(' ')[0]} {nextJob.customer?.full_name?.split(' ')[1]?.[0]}. - {nextJob.scheduled_time}
              </p>
              <p className="text-base text-gray-600 mb-4">{nextJob.service?.title}</p>
              <Button 
                size="lg" 
                className="w-full h-12"
                onClick={() => setSelectedJob(nextJob)}
              >
                Quick Actions
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 p-3">
                {day}
              </div>
            ))}
            {Array.from({ length: 14 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i - 7);
              const dayBookings = getBookingsForDate(date);
              const holiday = getHolidayTheme(date);
              
              return (
                <div
                  key={i}
                  className={cn(
                    "p-3 text-center rounded cursor-pointer transition-colors relative min-h-[60px]",
                    isToday(date) ? "bg-blue-100 text-blue-900 font-bold" : "hover:bg-gray-50",
                    holiday && holiday.colors
                  )}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="text-base font-medium">{date.getDate()}</div>
                  {holiday && (
                    <div className="text-lg mt-1">{holiday.icon}</div>
                  )}
                  {dayBookings.length > 0 && (
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mt-1"></div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Mobile-optimized Weather Widget
  const WeatherWidget = () => (
    <Card className="fintech-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Weather</h3>
          <div className="flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-blue-500 animate-pulse" />
            <span className="text-base text-gray-600">Montreal</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold">15°C</div>
          <div className="text-base text-gray-600">
            <p className="mb-2">Light rain</p>
            <p className="text-orange-600 font-medium">⚠️ Outdoor job alert: Rain 2-4 PM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Mobile-optimized Traffic Widget
  const TrafficWidget = () => (
    <Card className="fintech-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Next Route</h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-base text-green-600">Light traffic</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-600">To Julie R.</span>
            <span className="font-bold text-lg text-green-600">8 min</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-green-500 h-3 rounded-full w-3/4 animate-pulse"></div>
          </div>
          <p className="text-sm text-gray-500">Route via Rue Sainte-Catherine</p>
        </div>
      </CardContent>
    </Card>
  );

  // Mobile-optimized Quick Actions
  const QuickActions = () => (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium">Available for Jobs</span>
          <Switch 
            checked={isAvailable} 
            onCheckedChange={setIsAvailable}
            className="scale-125"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-base font-medium">Emergency</span>
          <Switch 
            checked={emergencyMode} 
            onCheckedChange={setEmergencyMode}
            className="scale-125"
          />
        </div>

        <Button 
          variant="outline" 
          className="w-full h-12 text-base"
          onClick={() => navigate('/interactive-map')}
        >
          <MapPin className="h-5 w-5 mr-2" />
          View Map
        </Button>
      </CardContent>
    </Card>
  );

  // Mobile-optimized Job Overlay
  const JobOverlay = ({ job, onClose }: { job: Booking; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="fintech-card max-w-md w-full animate-scale-in">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Job Details</CardTitle>
            <Button variant="ghost" size="lg" onClick={onClose} className="h-12 w-12">
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-xl">{job.service?.title}</h3>
            <p className="text-lg text-gray-600">{job.customer?.full_name}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-base">{new Date(job.scheduled_date).toLocaleDateString()} at {job.scheduled_time}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span className="text-base">{job.service_address}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button size="lg" className="flex-1 h-12">
              <Phone className="h-4 w-4 mr-2" />
              Call Client
            </Button>
            <Button size="lg" variant="outline" className="flex-1 h-12">
              <Navigation className="h-4 w-4 mr-2" />
              Directions
            </Button>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 text-base"
            onClick={() => {
              toast({
                title: "Running Late Alert Sent",
                description: "Client has been notified you're running 10 minutes late.",
              });
              onClose();
            }}
          >
            <Clock className="h-5 w-5 mr-2" />
            Running Late (Notify Client)
          </Button>
        </CardContent>
      </Card>
    </div>
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
            <Button onClick={() => setCurrentDate(subMonths(currentDate, 1))} variant="outline" size="lg">
              Previous
            </Button>
            <Button onClick={() => setCurrentDate(addMonths(currentDate, 1))} variant="outline" size="lg">
              Next
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="p-4 text-center font-semibold text-gray-600 bg-gray-50 rounded text-base">
              {day}
            </div>
          ))}
          
          {days.map((day) => {
            const dayBookings = getBookingsForDate(day);
            const isTodayDate = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);
            const holiday = getHolidayTheme(day);
            
            return (
              <div
                key={day.toString()}
                className={cn(
                  "min-h-[120px] p-3 border rounded cursor-pointer transition-colors",
                  isTodayDate ? "bg-blue-50 border-blue-200" : "bg-white hover:bg-gray-50",
                  !isCurrentMonth && "text-gray-400 bg-gray-50",
                  holiday && holiday.colors
                )}
                onClick={() => setSelectedDate(day)}
              >
                <div className={cn(
                  "text-base font-medium mb-2 flex items-center justify-between",
                  isTodayDate && "text-blue-600 font-bold"
                )}>
                  <span>{format(day, 'd')}</span>
                  {holiday && <span className="text-lg">{holiday.icon}</span>}
                </div>
                
                <div className="space-y-1">
                  {dayBookings.slice(0, 2).map((booking) => (
                    <div
                      key={booking.id}
                      className={cn(
                        "text-xs p-2 rounded truncate",
                        booking.status === 'confirmed' 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      )}
                    >
                      {booking.scheduled_time} - {booking.service?.title}
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-sm text-gray-500">
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
                    size="lg"
                    onClick={refreshData}
                    className="ml-auto h-12"
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
  const pendingRequests = getJobsByColumn('pending');
  const unreadUpdates = 3; // Mock data

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Provider Dashboard
            </h1>
            <p className="text-lg text-gray-600">Manage your business, bookings, and schedule</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full h-14 text-base">
              <TabsTrigger value="overview" className="h-12">Overview</TabsTrigger>
              <TabsTrigger value="bookings" className="h-12">Bookings</TabsTrigger>
              <TabsTrigger value="calendar" className="h-12">Calendar</TabsTrigger>
              <TabsTrigger value="business" className="h-12">Business</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Alert Banners */}
              <div className="space-y-4">
                <AlertBanner
                  type="pending"
                  count={pendingRequests.length}
                  message="Pending Requests"
                  onClick={() => setActiveTab('bookings')}
                />
                <AlertBanner
                  type="updates"
                  count={unreadUpdates}
                  message="Client Status Updates"
                  onClick={() => setActiveTab('bookings')}
                />
              </div>

              {/* Mobile-First Grid Layout */}
              <div className="space-y-6">
                {/* Calendar Preview - Full Width on Mobile */}
                <EnhancedCalendarWidget />
                
                {/* Weather and Traffic - Stacked on Mobile */}
                <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                  <WeatherWidget />
                  <TrafficWidget />
                </div>
                
                {/* Quick Actions - Full Width */}
                <QuickActions />
                
                {/* Performance Summary - Full Width */}
                <Card className="fintech-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-lg">Performance</h3>
                      <Badge variant="outline" className="text-base px-3 py-1">
                        {stats.averageRating.toFixed(1)} ⭐
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-base">
                        <span className="text-gray-600">Completion Rate</span>
                        <span className="font-medium">{stats.completionRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-gray-600">Response Time</span>
                        <span className="font-medium">{stats.responseTime}h</span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-gray-600">Total Earnings</span>
                        <span className="font-medium">{formatCurrency(stats.totalEarnings)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="lg"
                    onClick={() => setActiveTab('overview')}
                    className="text-gray-600 hover:text-gray-900 h-12"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Dashboard
                  </Button>
                  <h2 className="text-xl md:text-2xl font-bold">Booking Management</h2>
                </div>
              </div>

              {/* Mobile-Optimized Four-Column Job Management */}
              <div className="space-y-6 lg:grid lg:grid-cols-4 lg:gap-6 lg:space-y-0">
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
                    size="lg"
                    onClick={() => setActiveTab('overview')}
                    className="text-gray-600 hover:text-gray-900 h-12"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Dashboard
                  </Button>
                  <h2 className="text-xl md:text-2xl font-bold">Schedule Calendar</h2>
                </div>
              </div>

              <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
                <div className="lg:col-span-2">
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="h-6 w-6" />
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
                      <CardTitle className="text-lg">Availability Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button 
                        variant="outline" 
                        className="w-full h-12 text-base"
                        onClick={() => navigate('/provider-settings')}
                      >
                        Working Hours
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full h-12 text-base"
                        onClick={() => setActiveTab('bookings')}
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
                    size="lg"
                    onClick={() => setActiveTab('overview')}
                    className="text-gray-600 hover:text-gray-900 h-12"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Dashboard
                  </Button>
                  <h2 className="text-xl md:text-2xl font-bold">Business Management</h2>
                </div>
              </div>

              <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Business Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-12 text-base"
                      onClick={() => navigate('/provider-profile')}
                    >
                      <User className="h-5 w-5 mr-2" />
                      Edit Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-12 text-base"
                      onClick={() => navigate('/provider-settings')}
                    >
                      <Settings className="h-5 w-5 mr-2" />
                      Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Business Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Active Since</span>
                      <span className="font-medium">January 2024</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Total Jobs</span>
                      <span className="font-medium">{stats.totalBookings}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Total Earnings</span>
                      <span className="font-medium">{formatCurrency(stats.totalEarnings)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Average Rating</span>
                      <span className="font-medium">{stats.averageRating.toFixed(1)} ⭐</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Job Overlay */}
          {selectedJob && (
            <JobOverlay 
              job={selectedJob} 
              onClose={() => setSelectedJob(null)} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
