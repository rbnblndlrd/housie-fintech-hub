
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
  const channelsRef = useRef<any[]>([]);
  const isSubscribedRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  console.log('🔔 useNotifications hook:', { userId: user?.id, loading });

  const createNotification = async (
    userId: string,
    type: string,
    title: string,
    message: string,
    bookingId?: string
  ) => {
    try {
      console.log('🔔 Creating notification:', { userId, type, title });
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          booking_id: bookingId,
        });

      if (error) {
        console.error('Error creating notification:', error);
      } else {
        // Refresh notifications after creating one
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const fetchNotifications = async () => {
    if (!user) {
      console.log('🔔 No user, setting loading to false');
      setLoading(false);
      return;
    }

    try {
      console.log('🔔 Fetching notifications for user:', user.id);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      } else {
        console.log('🔔 Fetched notifications:', data?.length || 0);
        setNotifications(data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      console.log('🔔 Marking notification as read:', notificationId);
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
      }

      // Update local state immediately
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      console.log('🔔 Marking all notifications as read for user:', user.id);
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
      }

      // Update local state immediately
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const cleanupSubscriptions = () => {
    console.log('🧹 Cleaning up notification subscriptions');
    channelsRef.current.forEach(channel => {
      supabase.removeChannel(channel);
    });
    channelsRef.current = [];
    isSubscribedRef.current = false;
  };

  useEffect(() => {
    // Cleanup if user changes
    if (userIdRef.current && userIdRef.current !== user?.id) {
      cleanupSubscriptions();
      setNotifications([]);
      setLoading(true);
    }

    userIdRef.current = user?.id || null;

    if (!user || isSubscribedRef.current) {
      if (!user) {
        console.log('🔔 No user in useEffect, resetting state');
        setNotifications([]);
        setLoading(false);
      }
      return;
    }

    console.log('🔔 Setting up notifications for user:', user.id);
    fetchNotifications();

    // Clean up existing channels before creating new ones
    cleanupSubscriptions();

    // Set up real-time subscriptions with unique channel names
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substr(2, 9);
    
    const notificationChannelName = `notifications-${user.id}-${timestamp}-${randomSuffix}`;
    const notificationChannel = supabase
      .channel(notificationChannelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('📨 Notification change:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
            playNotificationSound();
            
            // Show browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(newNotification.title, {
                body: newNotification.message,
                icon: '/favicon.ico',
                tag: 'housie-notification'
              });
            }
          } else {
            // For updates/deletes, refresh the list
            fetchNotifications();
          }
        }
      )
      .subscribe();

    // Set up chat subscription for new messages with unique channel name
    const chatChannelName = `chat-${user.id}-${timestamp}-${randomSuffix}`;
    const chatChannel = supabase
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
          const messageData = payload.new;
          console.log('📨 New chat message received:', messageData);

          // Skip AI messages
          if (messageData.is_ai_message) {
            return;
          }

          // Create notification for human messages
          await createNotification(
            user.id,
            'new_message',
            'New Message',
            `You have a new message`,
            messageData.booking_id
          );

          playNotificationSound();
        }
      )
      .subscribe();

    channelsRef.current = [notificationChannel, chatChannel];
    isSubscribedRef.current = true;

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return cleanupSubscriptions;
  }, [user?.id]); // Only depend on user.id

  const unreadCount = notifications.filter(n => !n.read).length;

  console.log('🔔 useNotifications returning:', { 
    notificationsCount: notifications.length, 
    unreadCount, 
    loading 
  });

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
