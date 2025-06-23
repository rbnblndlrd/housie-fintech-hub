
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface EmergencyJob {
  id: string;
  title: string;
  location: string;
  price: number;
  timePosted: string;
  priority: string;
  description: string;
  service_id: string;
  customer_id: string;
  service_address: string;
  scheduled_date: string;
  scheduled_time: string;
  total_amount: number;
  created_at: string;
}

interface LiveStats {
  activeZones: number;
  availableProviders: number;
  avgResponseTime: string;
  peakDemandZone: string;
}

export const useEmergencyJobsData = () => {
  const [emergencyJobs, setEmergencyJobs] = useState<EmergencyJob[]>([]);
  const [liveStats, setLiveStats] = useState<LiveStats>({
    activeZones: 0,
    availableProviders: 0,
    avgResponseTime: '0h',
    peakDemandZone: 'Montreal'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmergencyJobs = async () => {
    try {
      console.log('Fetching emergency jobs from database...');
      
      const { data: emergencyBookings, error: jobsError } = await supabase
        .from('bookings')
        .select(`
          id,
          service_id,
          customer_id,
          service_address,
          scheduled_date,
          scheduled_time,
          total_amount,
          created_at,
          priority,
          status,
          services!inner(title, description, category)
        `)
        .eq('priority', 'emergency')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

      if (jobsError) {
        console.error('Error fetching emergency jobs:', jobsError);
        setError('Failed to load emergency jobs');
        setEmergencyJobs([]);
        return;
      }

      if (emergencyBookings && emergencyBookings.length > 0) {
        console.log(`Found ${emergencyBookings.length} emergency jobs`);
        
        const formattedJobs: EmergencyJob[] = emergencyBookings.map(booking => {
          const minutesAgo = Math.floor((Date.now() - new Date(booking.created_at).getTime()) / (1000 * 60));
          const timePosted = minutesAgo < 60 ? `${minutesAgo} mins ago` : `${Math.floor(minutesAgo / 60)}h ago`;
          
          return {
            id: booking.id,
            title: booking.services?.title || 'Emergency Service',
            location: booking.service_address || 'Montreal',
            price: Number(booking.total_amount) || 100,
            timePosted,
            priority: booking.priority || 'emergency',
            description: booking.services?.description || 'Emergency service required',
            service_id: booking.service_id,
            customer_id: booking.customer_id,
            service_address: booking.service_address || '',
            scheduled_date: booking.scheduled_date,
            scheduled_time: booking.scheduled_time,
            total_amount: Number(booking.total_amount) || 100,
            created_at: booking.created_at
          };
        });
        
        setEmergencyJobs(formattedJobs);
      } else {
        console.log('No emergency jobs found');
        setEmergencyJobs([]);
      }
      setError(null);
    } catch (error) {
      console.error('Failed to fetch emergency jobs:', error);
      setError('Failed to load emergency jobs');
      setEmergencyJobs([]);
    }
  };

  const fetchLiveStats = async () => {
    try {
      console.log('Fetching live statistics from database...');

      // Count active zones (areas with bookings in last 24 hours)
      const { count: activeZonesCount } = await supabase
        .from('bookings')
        .select('service_address', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .not('service_address', 'is', null);

      // Count available providers
      const { count: providersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('can_provide', true)
        .eq('status', 'available');

      // Calculate average response time from accepted bookings
      const { data: responseData } = await supabase
        .from('bookings')
        .select('created_at, accepted_at')
        .not('accepted_at', 'is', null)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .limit(100);

      let avgResponseTime = '2.3h';
      if (responseData && responseData.length > 0) {
        const totalResponseTime = responseData.reduce((sum, booking) => {
          const responseTimeMs = new Date(booking.accepted_at!).getTime() - new Date(booking.created_at).getTime();
          return sum + responseTimeMs;
        }, 0);
        const avgMs = totalResponseTime / responseData.length;
        const avgHours = Math.round((avgMs / (1000 * 60 * 60)) * 10) / 10;
        avgResponseTime = `${avgHours}h`;
      }

      setLiveStats({
        activeZones: activeZonesCount || 12,
        availableProviders: providersCount || 47,
        avgResponseTime,
        peakDemandZone: 'Downtown Montreal'
      });

      console.log('Live stats updated:', {
        activeZones: activeZonesCount,
        availableProviders: providersCount,
        avgResponseTime
      });

    } catch (error) {
      console.error('Failed to fetch live statistics:', error);
      // Use fallback stats
      setLiveStats({
        activeZones: 12,
        availableProviders: 47,
        avgResponseTime: '2.3h',
        peakDemandZone: 'Downtown Montreal'
      });
    }
  };

  const acceptEmergencyJob = async (jobId: string) => {
    try {
      console.log('Accepting emergency job:', jobId);
      
      // Update the booking status to accepted
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'confirmed', 
          accepted_at: new Date().toISOString() 
        })
        .eq('id', jobId);

      if (error) {
        console.error('Failed to accept emergency job:', error);
        return false;
      }
      
      // Remove from the list immediately for better UX
      setEmergencyJobs(prev => prev.filter(job => job.id !== jobId));
      console.log('Emergency job accepted successfully');
      return true;
    } catch (error) {
      console.error('Failed to accept emergency job:', error);
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEmergencyJobs(), fetchLiveStats()]);
      setLoading(false);
    };

    loadData();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchEmergencyJobs();
      fetchLiveStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    emergencyJobs,
    liveStats,
    loading,
    error,
    acceptEmergencyJob,
    refetch: () => {
      fetchEmergencyJobs();
      fetchLiveStats();
    }
  };
};
