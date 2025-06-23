
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ServiceCategoryData {
  category: string;
  revenue: number;
  count: number;
  percentage: number;
}

interface MonthlyBookingData {
  month: string;
  bookings: number;
  revenue: number;
  completed: number;
}

interface RegionalData {
  region: string;
  bookings: number;
  revenue: number;
  users: number;
}

interface AdminAnalytics {
  serviceCategories: ServiceCategoryData[];
  monthlyBookings: MonthlyBookingData[];
  regionalData: RegionalData[];
  bookingStatusDistribution: { status: string; count: number; percentage: number }[];
  recentBookings: any[];
  totalApiCalls: number;
  errorRate: number;
  avgResponseTime: number;
  activeWebhooks: number;
  systemUptime: number;
}

export const useAdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics>({
    serviceCategories: [],
    monthlyBookings: [],
    regionalData: [],
    bookingStatusDistribution: [],
    recentBookings: [],
    totalApiCalls: 0,
    errorRate: 0,
    avgResponseTime: 0,
    activeWebhooks: 0,
    systemUptime: 99.8,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading admin analytics...');

      // Get service categories with revenue and booking counts
      const { data: servicesData, error: servicesError } = await supabase
        .from('bookings')
        .select(`
          total_amount,
          payment_status,
          service:services!inner(
            category,
            title
          )
        `)
        .eq('payment_status', 'succeeded');

      if (servicesError) throw servicesError;

      // Process service categories
      const categoryMap = new Map<string, { revenue: number; count: number }>();
      const totalRevenue = servicesData?.reduce((sum, booking) => {
        const category = booking.service?.category || 'Other';
        const amount = Number(booking.total_amount) || 0;
        
        if (!categoryMap.has(category)) {
          categoryMap.set(category, { revenue: 0, count: 0 });
        }
        
        const current = categoryMap.get(category)!;
        current.revenue += amount;
        current.count += 1;
        categoryMap.set(category, current);
        
        return sum + amount;
      }, 0) || 0;

      const serviceCategories = Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        revenue: data.revenue,
        count: data.count,
        percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
      }));

      // Get monthly booking data for the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: monthlyData, error: monthlyError } = await supabase
        .from('bookings')
        .select('created_at, total_amount, status, payment_status')
        .gte('created_at', sixMonthsAgo.toISOString());

      if (monthlyError) throw monthlyError;

      // Process monthly data
      const monthlyMap = new Map<string, { bookings: number; revenue: number; completed: number }>();
      
      monthlyData?.forEach(booking => {
        const date = new Date(booking.created_at);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, { bookings: 0, revenue: 0, completed: 0 });
        }
        
        const current = monthlyMap.get(monthKey)!;
        current.bookings += 1;
        
        if (booking.payment_status === 'succeeded') {
          current.revenue += Number(booking.total_amount) || 0;
        }
        
        if (booking.status === 'completed') {
          current.completed += 1;
        }
        
        monthlyMap.set(monthKey, current);
      });

      const monthlyBookings = Array.from(monthlyMap.entries())
        .map(([month, data]) => ({ month, ...data }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

      // Get booking status distribution
      const statusMap = new Map<string, number>();
      const totalBookings = monthlyData?.length || 0;
      
      monthlyData?.forEach(booking => {
        const status = booking.status || 'unknown';
        statusMap.set(status, (statusMap.get(status) || 0) + 1);
      });

      const bookingStatusDistribution = Array.from(statusMap.entries()).map(([status, count]) => ({
        status,
        count,
        percentage: totalBookings > 0 ? (count / totalBookings) * 100 : 0,
      }));

      // Get regional data (based on user locations)
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('province, city')
        .not('province', 'is', null);

      if (usersError) throw usersError;

      const regionMap = new Map<string, { users: number; bookings: number; revenue: number }>();
      
      usersData?.forEach(user => {
        const region = user.province || 'Unknown';
        if (!regionMap.has(region)) {
          regionMap.set(region, { users: 0, bookings: 0, revenue: 0 });
        }
        regionMap.get(region)!.users += 1;
      });

      const regionalData = Array.from(regionMap.entries()).map(([region, data]) => ({
        region,
        ...data,
      }));

      // Get API usage statistics
      const { data: apiData, error: apiError } = await supabase
        .from('api_usage_logs')
        .select('created_at, status, estimated_cost')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (apiError) throw apiError;

      const totalApiCalls = apiData?.length || 0;
      const errorCount = apiData?.filter(log => log.status === 'error').length || 0;
      const errorRate = totalApiCalls > 0 ? (errorCount / totalApiCalls) * 100 : 0;

      // Get recent bookings
      const { data: recentBookings, error: recentError } = await supabase
        .from('bookings')
        .select(`
          id,
          created_at,
          status,
          total_amount,
          customer:users!customer_id(full_name, email),
          service:services!inner(title, category)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentError) throw recentError;

      setAnalytics({
        serviceCategories,
        monthlyBookings,
        regionalData,
        bookingStatusDistribution,
        recentBookings: recentBookings || [],
        totalApiCalls,
        errorRate,
        avgResponseTime: 245, // This would need actual monitoring data
        activeWebhooks: 12, // This would need webhook monitoring
        systemUptime: 99.8, // This would need system monitoring
      });

      console.log('✅ Admin analytics loaded successfully');
    } catch (error: any) {
      console.error('❌ Failed to load admin analytics:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load admin analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();

    // Set up real-time subscription
    const subscription = supabase
      .channel('admin_analytics_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' },
        () => loadAnalytics()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'services' },
        () => loadAnalytics()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    analytics,
    loading,
    error,
    refreshAnalytics: loadAnalytics
  };
};
