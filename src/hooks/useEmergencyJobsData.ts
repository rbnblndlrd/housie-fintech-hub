
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useEmergencyJobsData = () => {
  const { user } = useAuth();
  const [emergencyJobs, setEmergencyJobs] = useState([]);
  const [liveStats, setLiveStats] = useState({
    availableProviders: 0,
    activeZones: 0,
    avgResponseTime: '0 min',
    peakDemandZone: 'Downtown'
  });
  const [loading, setLoading] = useState(false);

  const acceptEmergencyJob = async (jobId: string) => {
    if (!user) {
      console.error('❌ No user found for job acceptance');
      return null;
    }

    try {
      console.log('🎯 Starting job acceptance for job:', jobId, 'user:', user.id);
      
      // Get provider profile
      const { data: providerProfile, error: profileError } = await supabase
        .from('provider_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError || !providerProfile) {
        console.error('❌ No provider profile found:', profileError);
        return null;
      }

      console.log('🔍 Provider profile ID:', providerProfile.id);

      // Create or update booking record
      const bookingData = {
        id: jobId,
        customer_id: user.id, // For demo purposes, using current user
        provider_id: providerProfile.id,
        status: 'confirmed',
        priority: 'high',
        service_address: 'Emergency Location',
        scheduled_date: new Date().toISOString().split('T')[0],
        scheduled_time: '12:00:00',
        accepted_at: new Date().toISOString(),
        service_title: 'Emergency Service',
        subcategory: 'emergency'
      };

      console.log('💾 Inserting booking data:', bookingData);

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .upsert(bookingData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (bookingError) {
        console.error('❌ Error creating booking:', bookingError);
        return null;
      }

      console.log('✅ Booking created successfully:', booking);

      // Store in localStorage for immediate UI update
      const jobData = {
        id: jobId,
        title: 'Emergency Service',
        status: 'confirmed',
        priority: 'high',
        address: 'Emergency Location',
        scheduledTime: 'ASAP',
        acceptedAt: new Date().toISOString()
      };

      localStorage.setItem('lastAcceptedJob', JSON.stringify(jobData));
      console.log('💾 Stored job in localStorage');

      // Dispatch custom event
      const event = new CustomEvent('jobAccepted', { 
        detail: { ...jobData, bookingId: booking.id }
      });
      window.dispatchEvent(event);
      console.log('📡 Dispatched jobAccepted event');

      return booking;
    } catch (error) {
      console.error('❌ Error in acceptEmergencyJob:', error);
      return null;
    }
  };

  // Mock emergency jobs data
  useEffect(() => {
    const mockJobs = [
      {
        id: `emergency-${Date.now()}-1`,
        title: 'Plumbing Emergency',
        location: 'Downtown Montreal',
        priority: 'high',
        price: '$150',
        customerName: 'Emergency Customer',
        scheduledTime: 'ASAP'
      },
      {
        id: `emergency-${Date.now()}-2`, 
        title: 'Electrical Issue',
        location: 'Plateau Mont-Royal',
        priority: 'medium',
        price: '$85',
        customerName: 'Emergency Customer 2',
        scheduledTime: 'Within 2hrs'
      }
    ];

    setEmergencyJobs(mockJobs);
    setLiveStats({
      availableProviders: 25,
      activeZones: 3,
      avgResponseTime: '15 min',
      peakDemandZone: 'Downtown Montreal'
    });
  }, []);

  return {
    emergencyJobs,
    liveStats,
    loading,
    acceptEmergencyJob
  };
};
