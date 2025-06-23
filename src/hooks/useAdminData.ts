
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminStats {
  totalUsers: number;
  activeProviders: number;
  monthlyBookings: number;
  totalRevenue: number;
  userGrowth: number;
  providerGrowth: number;
  bookingGrowth: number;
  revenueGrowth: number;
  alertsCount: number;
  highRiskAlerts: number;
}

export const useAdminData = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeProviders: 0,
    monthlyBookings: 0,
    totalRevenue: 0,
    userGrowth: 0,
    providerGrowth: 0,
    bookingGrowth: 0,
    revenueGrowth: 0,
    alertsCount: 0,
    highRiskAlerts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadAdminStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get current month dates
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      // Total users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, created_at');
      
      if (usersError) throw usersError;
      
      const totalUsers = usersData?.length || 0;
      const currentMonthUsers = usersData?.filter(u => 
        new Date(u.created_at) >= currentMonth
      ).length || 0;
      const lastMonthUsers = usersData?.filter(u => 
        new Date(u.created_at) >= lastMonth && new Date(u.created_at) < currentMonth
      ).length || 0;
      
      // Active providers
      const { data: providersData, error: providersError } = await supabase
        .from('provider_profiles')
        .select('id, created_at, verified');
      
      if (providersError) throw providersError;
      
      const activeProviders = providersData?.filter(p => p.verified).length || 0;
      const currentMonthProviders = providersData?.filter(p => 
        new Date(p.created_at) >= currentMonth && p.verified
      ).length || 0;
      const lastMonthProviders = providersData?.filter(p => 
        new Date(p.created_at) >= lastMonth && 
        new Date(p.created_at) < currentMonth && 
        p.verified
      ).length || 0;
      
      // Monthly bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, created_at, total_amount, payment_status');
      
      if (bookingsError) throw bookingsError;
      
      const monthlyBookings = bookingsData?.filter(b => 
        new Date(b.created_at) >= currentMonth
      ).length || 0;
      const lastMonthBookings = bookingsData?.filter(b => 
        new Date(b.created_at) >= lastMonth && new Date(b.created_at) < currentMonth
      ).length || 0;
      
      // Total revenue (completed bookings only)
      const completedBookings = bookingsData?.filter(b => 
        b.payment_status === 'succeeded' || b.payment_status === 'completed'
      ) || [];
      
      const totalRevenue = completedBookings.reduce((sum, b) => 
        sum + (parseFloat(b.total_amount) || 0), 0
      );
      
      const currentMonthRevenue = completedBookings
        .filter(b => new Date(b.created_at) >= currentMonth)
        .reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0);
      
      const lastMonthRevenue = completedBookings
        .filter(b => 
          new Date(b.created_at) >= lastMonth && 
          new Date(b.created_at) < currentMonth
        )
        .reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0);
      
      // Fraud alerts
      const { data: fraudData, error: fraudError } = await supabase
        .from('fraud_logs')
        .select('id, risk_score, created_at');
      
      if (fraudError) throw fraudError;
      
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const alertsCount = fraudData?.filter(f => 
        new Date(f.created_at) >= oneDayAgo
      ).length || 0;
      
      const highRiskAlerts = fraudData?.filter(f => 
        new Date(f.created_at) >= oneDayAgo && f.risk_score >= 70
      ).length || 0;
      
      // Calculate growth percentages
      const userGrowth = lastMonthUsers > 0 ? 
        ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0;
      const providerGrowth = lastMonthProviders > 0 ? 
        ((currentMonthProviders - lastMonthProviders) / lastMonthProviders) * 100 : 0;
      const bookingGrowth = lastMonthBookings > 0 ? 
        ((monthlyBookings - lastMonthBookings) / lastMonthBookings) * 100 : 0;
      const revenueGrowth = lastMonthRevenue > 0 ? 
        ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
      
      setStats({
        totalUsers,
        activeProviders,
        monthlyBookings,
        totalRevenue,
        userGrowth,
        providerGrowth,
        bookingGrowth,
        revenueGrowth,
        alertsCount,
        highRiskAlerts,
      });
      
      console.log('✅ Admin stats loaded successfully');
    } catch (error: any) {
      console.error('Failed to load admin stats:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load admin statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTestData = async (type: 'users' | 'bookings' | 'providers') => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-generate-test-data', {
        body: { type, count: 10 }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Generated test ${type} successfully`,
      });

      await loadAdminStats(); // Refresh stats
      return { success: true };
    } catch (error: any) {
      console.error(`Failed to generate test ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to generate test ${type}: ${error.message}`,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const clearTestData = async (type: 'users' | 'bookings' | 'all') => {
    try {
      if (type === 'users' || type === 'all') {
        // Delete test users (those with email pattern testuser_*)
        const { error: usersError } = await supabase
          .from('users')
          .delete()
          .like('email', 'testuser_%');
        
        if (usersError) throw usersError;
      }

      if (type === 'bookings' || type === 'all') {
        // Delete test bookings (those with instructions containing "TEST")
        const { error: bookingsError } = await supabase
          .from('bookings')
          .delete()
          .ilike('instructions', '%test%');
        
        if (bookingsError) throw bookingsError;
      }

      toast({
        title: "Success",
        description: `Cleared test ${type} successfully`,
      });

      await loadAdminStats(); // Refresh stats
      return { success: true };
    } catch (error: any) {
      console.error(`Failed to clear test ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to clear test ${type}: ${error.message}`,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const resetAnalytics = async () => {
    try {
      // Clear fraud logs older than 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const { error: fraudError } = await supabase
        .from('fraud_logs')
        .delete()
        .lt('created_at', sevenDaysAgo.toISOString());
      
      if (fraudError) throw fraudError;

      // Clear old API usage logs
      const { error: apiError } = await supabase
        .from('api_usage_logs')
        .delete()
        .lt('created_at', sevenDaysAgo.toISOString());
      
      if (apiError) throw apiError;

      // Clear old user sessions
      const { error: sessionsError } = await supabase
        .from('user_sessions')
        .delete()
        .eq('is_active', false)
        .lt('created_at', sevenDaysAgo.toISOString());
      
      if (sessionsError) throw sessionsError;

      toast({
        title: "Success",
        description: "Analytics data reset successfully",
      });

      await loadAdminStats(); // Refresh stats
      return { success: true };
    } catch (error: any) {
      console.error('Failed to reset analytics:', error);
      toast({
        title: "Error",
        description: `Failed to reset analytics: ${error.message}`,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const clearFraudQueue = async () => {
    try {
      // Clear all resolved review queue items
      const { error: queueError } = await supabase
        .from('review_queue')
        .delete()
        .in('status', ['resolved', 'approved', 'rejected']);
      
      if (queueError) throw queueError;

      toast({
        title: "Success",
        description: "Fraud review queue cleared successfully",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Failed to clear fraud queue:', error);
      toast({
        title: "Error",
        description: `Failed to clear fraud queue: ${error.message}`,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const createBackup = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-create-backup', {
        body: { timestamp: new Date().toISOString() }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Database backup created successfully",
      });

      return { success: true, backupId: data?.backupId };
    } catch (error: any) {
      console.error('Failed to create backup:', error);
      toast({
        title: "Error",
        description: `Failed to create backup: ${error.message}`,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    loadAdminStats();

    // Set up real-time subscription for live updates
    const subscription = supabase
      .channel('admin_stats_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' },
        () => loadAdminStats()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' },
        () => loadAdminStats()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'fraud_logs' },
        () => loadAdminStats()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    stats,
    loading,
    error,
    loadAdminStats,
    generateTestData,
    clearTestData,
    resetAnalytics,
    clearFraudQueue,
    createBackup,
  };
};
