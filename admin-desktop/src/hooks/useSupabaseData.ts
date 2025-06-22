
import { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabase';

export const useSupabaseData = () => {
  const [liveUsers, setLiveUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = getSupabase();
        
        // Load live users from user_sessions
        const { data: sessionsData } = await supabase
          .from('user_sessions')
          .select(`
            *,
            users!inner(id, full_name, email, city, province)
          `)
          .eq('is_active', true)
          .order('last_activity', { ascending: false })
          .limit(10);

        if (sessionsData) {
          const formattedLiveUsers = sessionsData.map(session => ({
            id: session.users.id,
            name: session.users.full_name,
            location: `${session.users.city || 'Unknown'}, ${session.users.province || 'Unknown'}`,
            status: 'active',
            lastSeen: new Date(session.last_activity).toLocaleString()
          }));
          setLiveUsers(formattedLiveUsers);
        }

        // Load users for management
        const { data: usersData } = await supabase
          .from('users')
          .select('id, full_name, email, user_role, created_at')
          .order('created_at', { ascending: false })
          .limit(20);

        if (usersData) {
          const formattedUsers = usersData.map(user => ({
            id: user.id,
            name: user.full_name,
            email: user.email,
            role: user.user_role === 'admin' ? 'admin' : user.user_role === 'provider' ? 'provider' : 'customer',
            status: 'active',
            verified: true
          }));
          setUsers(formattedUsers);
        }
      } catch (error) {
        console.error('Failed to load Supabase data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { liveUsers, users, loading };
};
