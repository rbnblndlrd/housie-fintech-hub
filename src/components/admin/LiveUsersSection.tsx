
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SessionTracker } from './SessionTracker';
import LiveUsersStats from './live-users/LiveUsersStats';
import LiveUsersMapCard from './live-users/LiveUsersMapCard';
import LiveUsersTable from './live-users/LiveUsersTable';

interface UserSession {
  id: string;
  user_id: string | null;
  session_token: string;
  ip_address: string | null;
  user_agent: string | null;
  current_page: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  login_time: string | null;
  last_activity: string | null;
  is_active: boolean | null;
  user?: {
    full_name: string;
    email: string;
  };
}

const LiveUsersSection = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load active sessions
  const loadActiveSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select(`
          *,
          users:user_id (
            full_name,
            email
          )
        `)
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (error) throw error;

      // Type the data properly
      const typedSessions = (data || []).map(session => ({
        ...session,
        ip_address: session.ip_address ? String(session.ip_address) : null,
        user: Array.isArray(session.users) ? session.users[0] : session.users
      })) as UserSession[];

      setSessions(typedSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    loadActiveSessions();

    const channel = supabase
      .channel('user-sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_sessions'
        },
        (payload) => {
          console.log('Session change:', payload);
          loadActiveSessions(); // Reload data on any change
        }
      )
      .subscribe();

    // Set up periodic cleanup
    const cleanupInterval = setInterval(async () => {
      try {
        await supabase.rpc('cleanup_inactive_sessions');
        loadActiveSessions();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }, 60000); // Every minute

    return () => {
      supabase.removeChannel(channel);
      clearInterval(cleanupInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="fintech-card animate-pulse">
              <div className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Session Tracker Component */}
      <SessionTracker />

      {/* Live Stats Cards */}
      <LiveUsersStats sessions={sessions} />

      {/* Simplified Live Users Map */}
      <LiveUsersMapCard sessions={sessions} />

      {/* Live Users Table */}
      <LiveUsersTable sessions={sessions} />
    </div>
  );
};

export default LiveUsersSection;
