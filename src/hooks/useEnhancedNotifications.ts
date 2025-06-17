
import { useEffect } from 'react';
import { useNotifications } from './useNotifications';
import { useNotificationSound } from './useNotificationSound';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useEnhancedNotifications = () => {
  const { user } = useAuth();
  const { createNotification } = useNotifications();
  const { playNotificationSound } = useNotificationSound();

  useEffect(() => {
    if (!user) return;

    // Listen for new chat messages
    const chatChannel = supabase
      .channel('chat-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `receiver_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('New message notification:', payload);
          
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
      .subscribe();

    // Listen for booking updates that should trigger notifications
    const bookingChannel = supabase
      .channel('booking-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        async (payload) => {
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
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
      supabase.removeChannel(bookingChannel);
    };
  }, [user, createNotification, playNotificationSound]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {};
};
