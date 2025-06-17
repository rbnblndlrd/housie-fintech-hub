
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const SessionTracker: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    let sessionToken: string;
    
    const initializeSession = async () => {
      try {
        // Generate unique session token
        sessionToken = `${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Get user's IP and location info
        let locationData = {};
        try {
          const ipResponse = await fetch('https://ipapi.co/json/');
          if (ipResponse.ok) {
            const ipData = await ipResponse.json();
            locationData = {
              ip_address: ipData.ip,
              city: ipData.city,
              region: ipData.region,
              country: ipData.country_name,
              latitude: parseFloat(ipData.latitude),
              longitude: parseFloat(ipData.longitude)
            };
          }
        } catch (error) {
          console.warn('Could not get location data:', error);
        }

        // Create or update session
        const { error } = await supabase
          .from('user_sessions')
          .upsert({
            user_id: user.id,
            session_token: sessionToken,
            current_page: window.location.pathname,
            user_agent: navigator.userAgent,
            login_time: new Date().toISOString(),
            last_activity: new Date().toISOString(),
            is_active: true,
            ...locationData
          }, {
            onConflict: 'session_token'
          });

        if (error) {
          console.error('Error creating session:', error);
        }
      } catch (error) {
        console.error('Error initializing session:', error);
      }
    };

    const updateActivity = async () => {
      if (!sessionToken) return;
      
      try {
        await supabase
          .from('user_sessions')
          .update({
            current_page: window.location.pathname,
            last_activity: new Date().toISOString()
          })
          .eq('session_token', sessionToken);
      } catch (error) {
        console.error('Error updating activity:', error);
      }
    };

    const handlePageChange = () => {
      updateActivity();
    };

    const handleActivity = () => {
      updateActivity();
    };

    // Initialize session
    initializeSession();

    // Set up activity tracking
    const activityInterval = setInterval(updateActivity, 30000); // Every 30 seconds

    // Track page changes
    window.addEventListener('popstate', handlePageChange);
    
    // Track user activity
    document.addEventListener('click', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('scroll', handleActivity);

    // Cleanup on unmount
    return () => {
      clearInterval(activityInterval);
      window.removeEventListener('popstate', handlePageChange);
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('scroll', handleActivity);

      // Mark session as inactive
      if (sessionToken) {
        supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('session_token', sessionToken)
          .then(() => {
            console.log('Session marked as inactive');
          });
      }
    };
  }, [user]);

  // This component doesn't render anything
  return null;
};
