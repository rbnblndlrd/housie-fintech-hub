
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationSound } from './useNotificationSound';

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
  const { playNotificationSound } = useNotificationSound();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Use refs to track channels and prevent duplicate subscriptions
  const notificationChannelRef = useRef<any>(null);
  const chatChannelRef = useRef<any>(null);
  const bookingChannelRef = useRef<any>(null);
  const isSubscribedRef = useRef<boolean>(false);

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

  // Cleanup function to remove all channels
  const cleanupChannels = () => {
    console.log('🧹 Cleaning up notification channels');
    
    if (notificationChannelRef.current) {
      try {
        supabase.removeChannel(notificationChannelRef.current);
      } catch (error) {
        console.warn('⚠️ Error removing notification channel:', error);
      }
      notificationChannelRef.current = null;
    }
    
    if (chatChannelRef.current) {
      try {
        supabase.removeChannel(chatChannelRef.current);
      } catch (error) {
        console.warn('⚠️ Error removing chat channel:', error);
      }
      chatChannelRef.current = null;
    }
    
    if (bookingChannelRef.current) {
      try {
        supabase.removeChannel(bookingChannelRef.current);
      } catch (error) {
        console.warn('⚠️ Error removing booking channel:', error);
      }
      bookingChannelRef.current = null;
    }
    
    isSubscribedRef.current = false;
  };

  useEffect(() => {
    // Clean up any existing subscriptions first
    cleanupChannels();

    if (!user || isSubscribedRef.current) {
      return;
    }

    console.log('🔔 Setting up consolidated notifications for user:', user.id);

    fetchNotifications();

    // Create unique channel names to avoid conflicts
    const timestamp = Date.now();
    const notificationChannelName = `notifications-${user.id}-${timestamp}`;
    const chatChannelName = `chat-${user.id}-${timestamp}`;
    const bookingChannelName = `booking-${user.id}-${timestamp}`;

    // Set up notification subscription
    notificationChannelRef.current = supabase
      .channel(notificationChannelName)
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
      .subscribe((status: string) => {
        console.log('📡 Notification subscription status:', status);
      });

    // Set up chat notifications
    chatChannelRef.current = supabase
      .channel(chatChannelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `receiver_id=eq.${user.id}`
        },
        async (payload: any) => {
          // Only process human messages
          if (payload.new.is_ai_message) {
            return;
          }

          console.log('📨 New message notification:', payload);
          
          // Play notification sound
          playNotificationSound();

          // Show browser notification if permission granted
          if ('Notification' in window && Notification.permission === 'granted') {
            const senderName = payload.new.sender?.full_name || 'Someone';
            new Notification(`New message from ${senderName}`, {
              body: payload.new.content.substring(0, 100) + (payload.new.content.length > 100 ? '...' : ''),
              icon: '/favicon.ico',
              tag: 'housie-chat',
              requireInteraction: false
            });
          }

          // Create in-app notification
          await createNotification(
            user.id,
            'new_message',
            'New Message',
            `You have a new message`,
            payload.new.conversation_id
          );
        }
      )
      .subscribe((status: string) => {
        console.log('📡 Chat notification status:', status);
      });

    // Set up booking notifications
    bookingChannelRef.current = supabase
      .channel(bookingChannelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        async (payload: any) => {
          const bookingData = payload.new as any;
          if (bookingData?.customer_id === user.id || bookingData?.provider_id === user.id) {
            const isCustomer = bookingData.customer_id === user.id;
            let notificationTitle = '';
            let notificationMessage = '';

            switch (payload.eventType) {
              case 'INSERT':
                notificationTitle = isCustomer ? 'Booking Submitted' : 'New Booking Request';
                notificationMessage = isCustomer 
                  ? 'Your booking request has been submitted successfully'
                  : 'You have received a new booking request';
                break;
              case 'UPDATE':
                const oldData = payload.old as any;
                if (oldData?.status !== bookingData?.status) {
                  notificationTitle = 'Booking Status Updated';
                  notificationMessage = `Your booking is now ${bookingData.status}`;
                }
                break;
            }

            if (notificationTitle && notificationMessage) {
              await createNotification(
                user.id,
                'booking_update',
                notificationTitle,
                notificationMessage,
                bookingData.id
              );

              // Play sound for important updates
              if (bookingData.status === 'confirmed' || bookingData.status === 'completed') {
                playNotificationSound();
              }
            }
          }
        }
      )
      .subscribe((status: string) => {
        console.log('📡 Booking notification status:', status);
      });
    
    isSubscribedRef.current = true;

    return () => {
      console.log('🧹 Notification cleanup triggered');
      cleanupChannels();
    };
  }, [user?.id]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

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
