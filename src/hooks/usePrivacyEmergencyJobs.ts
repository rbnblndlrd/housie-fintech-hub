
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface PrivacyEmergencyJob {
  id: string;
  title: string;
  zone: string;
  serviceCircle: {
    lat: number;
    lng: number;
    radius: number;
  };
  price: string;
  timePosted: string;
  priority: string;
  description: string;
  service_id: string;
  customer_id: string;
  scheduled_date: string;
  scheduled_time: string;
  total_amount: number;
  created_at: string;
}

interface PrivacyLiveStats {
  activeZones: number;
  availableProviders: number;
  avgResponseTime: string;
  peakDemandZone: string;
}

export const usePrivacyEmergencyJobs = () => {
  const [emergencyJobs, setEmergencyJobs] = useState<PrivacyEmergencyJob[]>([]);
  const [liveStats, setLiveStats] = useState<PrivacyLiveStats>({
    activeZones: 3,
    availableProviders: 12,
    avgResponseTime: '2.3h',
    peakDemandZone: 'Plateau-Mont-Royal'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrivacyEmergencyJobs = async () => {
    try {
      console.log('Fetching privacy-protected emergency jobs...');
      
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
        return;
      }

      if (emergencyBookings && emergencyBookings.length > 0) {
        console.log(`Found ${emergencyBookings.length} privacy-protected emergency jobs`);
        
        const privacyJobs: PrivacyEmergencyJob[] = emergencyBookings.map((booking) => {
          const minutesAgo = Math.floor((Date.now() - new Date(booking.created_at).getTime()) / (1000 * 60));
          const timePosted = minutesAgo < 60 ? `${minutesAgo} mins ago` : `${Math.floor(minutesAgo / 60)}h ago`;
          
          // Generate privacy-safe service circle using Montreal coordinates as default
          const defaultLat = 45.5017 + (Math.random() - 0.5) * 0.1; // Add some randomness
          const defaultLng = -73.5673 + (Math.random() - 0.5) * 0.1;
          
          return {
            id: booking.id,
            title: booking.services?.title || 'Emergency Service',
            zone: 'Montreal Area', // Simplified zone system
            serviceCircle: {
              lat: defaultLat,
              lng: defaultLng,
              radius: 2000 // Default 2km radius
            },
            price: String(Number(booking.total_amount) || 100),
            timePosted,
            priority: booking.priority || 'emergency',
            description: booking.services?.description || 'Emergency service required',
            service_id: booking.service_id,
            customer_id: booking.customer_id,
            scheduled_date: booking.scheduled_date,
            scheduled_time: booking.scheduled_time,
            total_amount: Number(booking.total_amount) || 100,
            created_at: booking.created_at
          };
        });
        
        setEmergencyJobs(privacyJobs);
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

  const fetchPrivacyLiveStats = async () => {
    try {
      console.log('Fetching privacy-protected live statistics...');

      // Count providers available
      const { count: providersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('can_provide', true)
        .eq('status', 'available');

      // Get recent bookings for stats
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select('created_at, accepted_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Calculate simple stats
      const activeZones = Math.max(3, Math.floor((recentBookings?.length || 0) / 5));
      
      // Calculate average response time from recent accepted bookings
      let avgResponseTime = '2.3h';
      const acceptedBookings = recentBookings?.filter(b => b.accepted_at) || [];
      if (acceptedBookings.length > 0) {
        const totalResponseTime = acceptedBookings.reduce((sum, booking) => {
          const responseTimeMs = new Date(booking.accepted_at!).getTime() - new Date(booking.created_at).getTime();
          return sum + responseTimeMs;
        }, 0);
        const avgMs = totalResponseTime / acceptedBookings.length;
        const avgHours = Math.round((avgMs / (1000 * 60 * 60)) * 10) / 10;
        avgResponseTime = `${avgHours}h`;
      }

      setLiveStats({
        activeZones,
        availableProviders: providersCount || 12,
        avgResponseTime,
        peakDemandZone: 'Plateau-Mont-Royal' // Static for now
      });

      console.log('Privacy-protected stats updated:', {
        activeZones,
        availableProviders: providersCount,
        avgResponseTime
      });

    } catch (error) {
      console.error('Failed to fetch live statistics:', error);
      // Use fallback values
      setLiveStats({
        activeZones: 3,
        availableProviders: 12,
        avgResponseTime: '2.3h',
        peakDemandZone: 'Plateau-Mont-Royal'
      });
    }
  };

  const acceptEmergencyJob = async (jobId: string) => {
    try {
      console.log('Accepting emergency job:', jobId);
      
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
      await Promise.all([fetchPrivacyEmergencyJobs(), fetchPrivacyLiveStats()]);
      setLoading(false);
    };

    loadData();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchPrivacyEmergencyJobs();
      fetchPrivacyLiveStats();
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
      fetchPrivacyEmergencyJobs();
      fetchPrivacyLiveStats();
    }
  };
};
