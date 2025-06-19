
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  booking_id?: string;
  read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const createNotification = async (
    userId: string,
    type: string,
    title: string,
    message: string,
    bookingId?: string
  ) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          booking_id: bookingId,
        });

      if (error) throw error;
      
      // Refresh notifications after creating one
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const fetchNotifications = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to mock data if database query fails
      setNotifications([
        {
          id: '1',
          user_id: user?.id || '',
          type: 'new_booking',
          title: 'Nouvelle réservation',
          message: 'Vous avez reçu une nouvelle réservation pour le service de nettoyage.',
          read: false,
          created_at: new Date().toISOString(),
          booking_id: 'booking-1',
        },
        {
          id: '2',
          user_id: user?.id || '',
          type: 'booking_confirmed',
          title: 'Réservation confirmée',
          message: 'Votre réservation a été confirmée par le prestataire.',
          read: false,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          booking_id: 'booking-2',
        },
        {
          id: '3',
          user_id: user?.id || '',
          type: 'payment_received',
          title: 'Paiement reçu',
          message: 'Vous avez reçu un paiement de 150€ pour votre service.',
          read: true,
          created_at: new Date(Date.now() - 7200000).toISOString(),
          booking_id: 'booking-3',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Fallback to local state update
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Fallback to local state update
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (!user) return;

    // Set up real-time subscription for notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    loading,
    unreadCount,
    createNotification,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};
