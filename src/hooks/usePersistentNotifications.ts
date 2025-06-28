
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PersistentNotification {
  id: string;
  user_id: string;
  type: string;
  booking_id?: string;
  message: string;
  is_persistent: boolean;
  dismissed_at?: string;
  created_at: string;
}

export const usePersistentNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<PersistentNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('persistent_notifications')
        .select('*')
        .eq('user_id', user.id)
        .is('dismissed_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching persistent notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const dismissNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('persistent_notifications')
        .update({ dismissed_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const createPendingReviewNotification = async (bookingId: string, customerId: string) => {
    try {
      const { error } = await supabase
        .from('persistent_notifications')
        .insert({
          user_id: customerId,
          type: 'pending_review',
          booking_id: bookingId,
          message: 'Awaiting Review (1)',
          is_persistent: true
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating pending review notification:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (user) {
      const channel = supabase
        .channel(`persistent_notifications_${user.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'persistent_notifications',
          filter: `user_id=eq.${user.id}`
        }, () => {
          fetchNotifications();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    notifications,
    loading,
    dismissNotification,
    createPendingReviewNotification,
    refetch: fetchNotifications
  };
};
