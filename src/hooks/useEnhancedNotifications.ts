
import { useEffect, useRef } from 'react';
import { useNotifications } from './useNotifications';
import { useNotificationSound } from './useNotificationSound';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useEnhancedNotifications = () => {
  const { user } = useAuth();
  const { createNotification } = useNotifications();
  const { playNotificationSound } = useNotificationSound();
  
  // Use refs to track channels and prevent duplicate subscriptions
  const chatChannelRef = useRef<any>(null);
  const bookingChannelRef = useRef<any>(null);
  const isSubscribedRef = useRef<boolean>(false);

  // Cleanup function to remove channels
  const cleanupChannels = () => {
    console.log('🧹 Cleaning up enhanced notification channels');
    
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

    console.log('🔔 Setting up enhanced notifications for user:', user.id);

    // Create unique channel names to avoid conflicts
    const chatChannelName = `enhanced-chat-${user.id}-${Date.now()}`;
    const bookingChannelName = `enhanced-booking-${user.id}-${Date.now()}`;

    // Set up chat notifications
    const setupChatNotifications = () => {
      chatChannelRef.current = supabase.channel(chatChannelName);

      chatChannelRef.current
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
          console.log('📡 Enhanced chat notification status:', status);
        });
    };

    // Set up booking notifications
    const setupBookingNotifications = () => {
      bookingChannelRef.current = supabase.channel(bookingChannelName);

      bookingChannelRef.current
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
          console.log('📡 Enhanced booking notification status:', status);
        });
    };

    // Set up both notification types
    setupChatNotifications();
    setupBookingNotifications();
    
    isSubscribedRef.current = true;

    return () => {
      console.log('🧹 Enhanced notifications cleanup triggered');
      cleanupChannels();
    };
  }, [user?.id, createNotification, playNotificationSound]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {};
};
