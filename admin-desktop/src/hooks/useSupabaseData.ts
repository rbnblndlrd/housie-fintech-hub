
import { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabase';

interface LiveUser {
  id: string;
  name: string;
  location: string;
  status: string;
  lastSeen: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  verified: boolean;
}

export const useSupabaseData = () => {
  const [liveUsers, setLiveUsers] = useState<LiveUser[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const supabase = getSupabase();
        
        // Load live users from user_sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('user_sessions')
          .select(`
            *,
            users!inner(id, full_name, email, city, province)
          `)
          .eq('is_active', true)
          .order('last_activity', { ascending: false })
          .limit(10);

        if (sessionsError) {
          console.error('Error loading live users:', sessionsError);
        } else if (sessionsData && Array.isArray(sessionsData)) {
          const formattedLiveUsers: LiveUser[] = sessionsData
            .filter(session => session.users) // Filter out null users
            .map(session => ({
              id: session.users.id,
              name: session.users.full_name || 'Unknown User',
              location: `${session.users.city || 'Unknown'}, ${session.users.province || 'Unknown'}`,
              status: 'active',
              lastSeen: new Date(session.last_activity).toLocaleString()
            }));
          setLiveUsers(formattedLiveUsers);
        }

        // Load users for management
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, full_name, email, user_role, created_at')
          .order('created_at', { ascending: false })
          .limit(20);

        if (usersError) {
          console.error('Error loading users:', usersError);
        } else if (usersData && Array.isArray(usersData)) {
          const formattedUsers: User[] = usersData.map(user => ({
            id: user.id,
            name: user.full_name || 'Unknown User',
            email: user.email || 'No email',
            role: user.user_role === 'admin' ? 'admin' : user.user_role === 'provider' ? 'provider' : 'customer',
            status: 'active',
            verified: true
          }));
          setUsers(formattedUsers);
        }
      } catch (error) {
        console.error('Failed to load Supabase data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { liveUsers, users, loading, error };
};
