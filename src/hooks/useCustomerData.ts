
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CustomerStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalSpent: number;
  averageRating: number;
  favoriteProviders: any[];
  recentBookings: any[];
  upcomingBookings: any[];
}

export const useCustomerData = (userId: string | undefined) => {
  const [stats, setStats] = useState<CustomerStats>({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
    averageRating: 0,
    favoriteProviders: [],
    recentBookings: [],
    upcomingBookings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadCustomerData = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading customer data for user:', userId);

      // Get all customer bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          provider:provider_profiles!inner(
            id,
            business_name,
            user_id,
            average_rating,
            verified,
            users!inner(full_name, email)
          ),
          service:services!inner(
            id,
            title,
            category,
            subcategory
          )
        `)
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      const allBookings = bookings || [];
      console.log('📊 Customer bookings loaded:', allBookings.length);

      // Calculate stats
      const totalBookings = allBookings.length;
      const activeBookings = allBookings.filter(b => 
        ['pending', 'confirmed', 'in_progress'].includes(b.status)
      ).length;
      const completedBookings = allBookings.filter(b => b.status === 'completed').length;
      
      const totalSpent = allBookings
        .filter(b => b.payment_status === 'succeeded')
        .reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);

      // Get upcoming bookings (future scheduled dates)
      const today = new Date();
      const upcomingBookings = allBookings
        .filter(b => {
          const bookingDate = new Date(b.scheduled_date);
          return bookingDate >= today && ['confirmed', 'pending'].includes(b.status);
        })
        .slice(0, 5);

      // Get recent bookings (last 10)
      const recentBookings = allBookings.slice(0, 10);

      // Get favorite providers (providers with most bookings)
      const providerBookingCounts = new Map();
      allBookings.forEach(booking => {
        if (booking.provider) {
          const providerId = booking.provider.id;
          providerBookingCounts.set(providerId, {
            count: (providerBookingCounts.get(providerId)?.count || 0) + 1,
            provider: booking.provider
          });
        }
      });

      const favoriteProviders = Array.from(providerBookingCounts.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(item => ({
          ...item.provider,
          bookingCount: item.count
        }));

      // Get average rating given by customer
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewer_id', userId);

      if (reviewsError) console.error('Error loading customer reviews:', reviewsError);

      const averageRating = reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      setStats({
        totalBookings,
        activeBookings,
        completedBookings,
        totalSpent,
        averageRating,
        favoriteProviders,
        recentBookings,
        upcomingBookings
      });

      console.log('✅ Customer data loaded successfully:', {
        totalBookings,
        activeBookings,
        completedBookings,
        totalSpent,
        favoriteProviders: favoriteProviders.length
      });

    } catch (error: any) {
      console.error('❌ Failed to load customer data:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load customer data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerData();

    // Set up real-time subscription for customer bookings
    if (userId) {
      const subscription = supabase
        .channel('customer_data_updates')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'bookings', filter: `customer_id=eq.${userId}` },
          () => {
            console.log('📡 Customer booking data changed, refreshing...');
            loadCustomerData();
          }
        )
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'reviews', filter: `reviewer_id=eq.${userId}` },
          () => {
            console.log('📡 Customer review data changed, refreshing...');
            loadCustomerData();
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
    refreshData: loadCustomerData
  };
};
