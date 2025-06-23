
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { getMontrealZones, findClosestZone, getJobServiceCircle, parsePoint } from '@/utils/locationPrivacy';
import type { MontrealZone } from '@/utils/locationPrivacy';

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
  montrealZones: MontrealZone[];
}

export const usePrivacyEmergencyJobs = () => {
  const [emergencyJobs, setEmergencyJobs] = useState<PrivacyEmergencyJob[]>([]);
  const [liveStats, setLiveStats] = useState<PrivacyLiveStats>({
    activeZones: 0,
    availableProviders: 0,
    avgResponseTime: '0h',
    peakDemandZone: 'Plateau-Mont-Royal',
    montrealZones: []
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
          service_coordinates,
          public_location,
          service_zone,
          service_radius,
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
        
        const privacyJobs: PrivacyEmergencyJob[] = await Promise.all(
          emergencyBookings.map(async (booking) => {
            const minutesAgo = Math.floor((Date.now() - new Date(booking.created_at).getTime()) / (1000 * 60));
            const timePosted = minutesAgo < 60 ? `${minutesAgo} mins ago` : `${Math.floor(minutesAgo / 60)}h ago`;
            
            // Get privacy-safe service circle
            const serviceCircle = getJobServiceCircle(booking);
            
            // Assign zone if not already set
            let zone = booking.service_zone;
            if (!zone && serviceCircle.lat && serviceCircle.lng) {
              zone = await findClosestZone(serviceCircle.lat, serviceCircle.lng);
            }
            
            return {
              id: booking.id,
              title: booking.services?.title || 'Emergency Service',
              zone: zone || 'Montreal Area',
              serviceCircle: {
                lat: serviceCircle.lat,
                lng: serviceCircle.lng,
                radius: serviceCircle.radius
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
          })
        );
        
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

      // Get Montreal zones
      const zones = await getMontrealZones();

      // Count providers with fuzzy locations (privacy-protected)
      const { count: providersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('can_provide', true)
        .eq('status', 'available');

      // Count active zones from bookings
      const { data: zoneData } = await supabase
        .from('bookings')
        .select('service_zone')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .not('service_zone', 'is', null);

      const activeZones = new Set(zoneData?.map(b => b.service_zone)).size;

      // Calculate average response time
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

      // Find peak demand zone
      const zoneCounts = zoneData?.reduce((acc: any, booking) => {
        if (booking.service_zone) {
          acc[booking.service_zone] = (acc[booking.service_zone] || 0) + 1;
        }
        return acc;
      }, {}) || {};

      const peakZoneCode = Object.entries(zoneCounts).reduce((a: any, b: any) => 
        zoneCounts[a[0]] > zoneCounts[b[0]] ? a : b, ['PLATEAU', 0]
      )[0];

      const peakZone = zones.find(z => z.zone_code === peakZoneCode);

      setLiveStats({
        activeZones: activeZones || 3,
        availableProviders: providersCount || 12,
        avgResponseTime,
        peakDemandZone: peakZone?.zone_name || 'Plateau-Mont-Royal',
        montrealZones: zones
      });

      console.log('Privacy-protected stats updated:', {
        activeZones,
        availableProviders: providersCount,
        avgResponseTime,
        peakDemandZone: peakZone?.zone_name
      });

    } catch (error) {
      console.error('Failed to fetch live statistics:', error);
      setLiveStats({
        activeZones: 3,
        availableProviders: 12,
        avgResponseTime: '2.3h',
        peakDemandZone: 'Plateau-Mont-Royal',
        montrealZones: await getMontrealZones()
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
