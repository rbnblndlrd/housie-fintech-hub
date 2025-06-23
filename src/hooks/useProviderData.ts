
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProviderStats {
  totalBookings: number;
  activeJobs: number;
  completedJobs: number;
  totalEarnings: number;
  averageRating: number;
  responseTime: number;
  completionRate: number;
  recentJobs: any[];
  upcomingJobs: any[];
  monthlyEarnings: number;
  weeklyBookings: number;
}

export const useProviderData = (userId: string | undefined) => {
  const [stats, setStats] = useState<ProviderStats>({
    totalBookings: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalEarnings: 0,
    averageRating: 0,
    responseTime: 0,
    completionRate: 0,
    recentJobs: [],
    upcomingJobs: [],
    monthlyEarnings: 0,
    weeklyBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadProviderData = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading provider data for user:', userId);

      // Get provider profile first
      const { data: providerProfile, error: profileError } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;
      if (!providerProfile) throw new Error('Provider profile not found');

      console.log('👤 Provider profile loaded:', providerProfile.business_name);

      // Get all provider bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:users!customer_id(
            id,
            full_name,
            email,
            phone
          ),
          service:services!inner(
            id,
            title,
            category,
            subcategory
          )
        `)
        .eq('provider_id', providerProfile.id)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      const allBookings = bookings || [];
      console.log('📊 Provider bookings loaded:', allBookings.length);

      // Calculate date ranges
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const today = new Date();

      // Calculate stats
      const totalBookings = allBookings.length;
      const activeJobs = allBookings.filter(b => 
        ['pending', 'confirmed', 'in_progress'].includes(b.status)
      ).length;
      const completedJobs = allBookings.filter(b => b.status === 'completed').length;
      
      const totalEarnings = allBookings
        .filter(b => b.payment_status === 'succeeded')
        .reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);

      const monthlyEarnings = allBookings
        .filter(b => 
          b.payment_status === 'succeeded' && 
          new Date(b.created_at) >= currentMonth
        )
        .reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);

      const weeklyBookings = allBookings.filter(b => 
        new Date(b.created_at) >= oneWeekAgo
      ).length;

      // Get upcoming jobs (future scheduled dates)
      const upcomingJobs = allBookings
        .filter(b => {
          const bookingDate = new Date(b.scheduled_date);
          return bookingDate >= today && ['confirmed', 'pending'].includes(b.status);
        })
        .slice(0, 5);

      // Get recent completed jobs
      const recentJobs = allBookings
        .filter(b => b.status === 'completed')
        .slice(0, 10);

      // Calculate completion rate
      const completionRate = totalBookings > 0 
        ? (completedJobs / totalBookings) * 100 
        : 0;

      // Get provider rating and response time from profile
      const averageRating = Number(providerProfile.average_rating) || 0;
      const responseTime = Number(providerProfile.response_time_hours) || 0;

      setStats({
        totalBookings,
        activeJobs,
        completedJobs,
        totalEarnings,
        averageRating,
        responseTime,
        completionRate,
        recentJobs,
        upcomingJobs,
        monthlyEarnings,
        weeklyBookings
      });

      console.log('✅ Provider data loaded successfully:', {
        totalBookings,
        activeJobs,
        completedJobs,
        totalEarnings,
        monthlyEarnings,
        weeklyBookings
      });

    } catch (error: any) {
      console.error('❌ Failed to load provider data:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load provider data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviderData();

    // Set up real-time subscription for provider bookings
    if (userId) {
      const subscription = supabase
        .channel('provider_data_updates')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'bookings' },
          (payload) => {
            // Only refresh if this booking involves our provider
            if (payload.new?.provider_id || payload.old?.provider_id) {
              console.log('📡 Provider booking data changed, refreshing...');
              loadProviderData();
            }
          }
        )
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'provider_profiles', filter: `user_id=eq.${userId}` },
          () => {
            console.log('📡 Provider profile changed, refreshing...');
            loadProviderData();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [userId]);

  return {
    stats,
    loading,
    error,
    refreshData: loadProviderData
  };
};
