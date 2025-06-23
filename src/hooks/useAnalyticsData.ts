
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  totalRevenue: number;
  monthlyRevenue: number;
  totalBookings: number;
  monthlyBookings: number;
  averageBookingValue: number;
  completionRate: number;
  monthlyGrowth: number;
  revenueByCategory: any[];
  bookingsByMonth: any[];
  topServices: any[];
}

export const useAnalyticsData = (userId: string | undefined, userRole: string | undefined) => {
  const [data, setData] = useState<AnalyticsData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalBookings: 0,
    monthlyBookings: 0,
    averageBookingValue: 0,
    completionRate: 0,
    monthlyGrowth: 0,
    revenueByCategory: [],
    bookingsByMonth: [],
    topServices: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadAnalyticsData = async () => {
    if (!userId || !userRole) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading analytics data for user:', userId, 'role:', userRole);

      // Determine the filter field based on user role
      const filterField = userRole === 'provider' ? 'provider_id' : 'customer_id';
      
      // For providers, we need to get their provider profile ID first
      let filterId = userId;
      if (userRole === 'provider') {
        const { data: providerProfile, error: profileError } = await supabase
          .from('provider_profiles')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (profileError) throw profileError;
        if (!providerProfile) throw new Error('Provider profile not found');
        filterId = providerProfile.id;
      }

      // Get date ranges
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

      // Get all bookings for the user
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          service:services(
            id,
            title,
            category,
            subcategory
          )
        `)
        .eq(filterField, filterId)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      const allBookings = bookings || [];
      console.log('📊 Analytics bookings loaded:', allBookings.length);

      // Calculate basic stats
      const totalBookings = allBookings.length;
      const completedBookings = allBookings.filter(b => b.status === 'completed');
      const paidBookings = allBookings.filter(b => b.payment_status === 'succeeded');
      
      const totalRevenue = paidBookings.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);
      
      // Monthly calculations
      const currentMonthBookings = allBookings.filter(b => 
        new Date(b.created_at) >= currentMonth
      );
      const lastMonthBookings = allBookings.filter(b => 
        new Date(b.created_at) >= lastMonth && new Date(b.created_at) < currentMonth
      );
      
      const monthlyRevenue = currentMonthBookings
        .filter(b => b.payment_status === 'succeeded')
        .reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);
      
      const lastMonthRevenue = lastMonthBookings
        .filter(b => b.payment_status === 'succeeded')
        .reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);

      const monthlyBookings = currentMonthBookings.length;
      const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
      const completionRate = totalBookings > 0 ? (completedBookings.length / totalBookings) * 100 : 0;
      const monthlyGrowth = lastMonthRevenue > 0 ? 
        ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

      // Revenue by category
      const categoryRevenue = new Map();
      paidBookings.forEach(booking => {
        const category = booking.service?.category || 'Other';
        const amount = Number(booking.total_amount) || 0;
        categoryRevenue.set(category, (categoryRevenue.get(category) || 0) + amount);
      });

      const revenueByCategory = Array.from(categoryRevenue.entries())
        .map(([category, revenue]) => ({ category, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Bookings by month (last 6 months)
      const monthlyData = new Map();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        monthlyData.set(monthKey, { month: monthName, bookings: 0, revenue: 0 });
      }

      allBookings.forEach(booking => {
        const bookingDate = new Date(booking.created_at);
        if (bookingDate >= sixMonthsAgo) {
          const monthKey = bookingDate.toISOString().slice(0, 7);
          const monthData = monthlyData.get(monthKey);
          if (monthData) {
            monthData.bookings += 1;
            if (booking.payment_status === 'succeeded') {
              monthData.revenue += Number(booking.total_amount) || 0;
            }
          }
        }
      });

      const bookingsByMonth = Array.from(monthlyData.values());

      // Top services
      const serviceStats = new Map();
      allBookings.forEach(booking => {
        const serviceTitle = booking.service?.title || 'Unknown Service';
        const current = serviceStats.get(serviceTitle) || { count: 0, revenue: 0 };
        current.count += 1;
        if (booking.payment_status === 'succeeded') {
          current.revenue += Number(booking.total_amount) || 0;
        }
        serviceStats.set(serviceTitle, current);
      });

      const topServices = Array.from(serviceStats.entries())
        .map(([title, stats]) => ({ title, ...stats }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setData({
        totalRevenue,
        monthlyRevenue,
        totalBookings,
        monthlyBookings,
        averageBookingValue,
        completionRate,
        monthlyGrowth,
        revenueByCategory,
        bookingsByMonth,
        topServices
      });

      console.log('✅ Analytics data loaded successfully:', {
        totalRevenue,
        monthlyRevenue,
        totalBookings,
        monthlyBookings
      });

    } catch (error: any) {
      console.error('❌ Failed to load analytics data:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();

    // Set up real-time subscription for bookings
    if (userId && userRole) {
      const subscription = supabase
        .channel('analytics_updates')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'bookings' },
          () => {
            console.log('📡 Booking data changed, refreshing analytics...');
            loadAnalyticsData();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [userId, userRole]);

  return {
    data,
    loading,
    error,
    refreshData: loadAnalyticsData
  };
};
