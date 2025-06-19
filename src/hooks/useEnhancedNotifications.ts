
import { useEffect, useRef } from 'react';
import { useNotifications } from './useNotifications';
import { useNotificationSound } from './useNotificationSound';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useEnhancedNotifications = () => {
  const { user } = useAuth();
  const { createNotification } = useNotifications();
  const { playNotificationSound } = useNotificationSound();
  
  // Use refs to track subscription state and prevent double subscriptions
  const subscriptionRefs = useRef<{
    chatChannel: {
      channel: any | null;
      isSubscribed: boolean;
      isSubscribing: boolean;
    };
    bookingChannel: {
      channel: any | null;
      isSubscribed: boolean;
      isSubscribing: boolean;
    };
  }>({
    chatChannel: {
      channel: null,
      isSubscribed: false,
      isSubscribing: false
    },
    bookingChannel: {
      channel: null,
      isSubscribed: false,
      isSubscribing: false
    }
  });

  // Cleanup subscription helper
  const cleanupSubscriptions = () => {
    // Clean up chat channel
    if (subscriptionRefs.current.chatChannel.channel) {
      console.log('🧹 Cleaning up enhanced chat notification channel');
      try {
        supabase.removeChannel(subscriptionRefs.current.chatChannel.channel);
      } catch (error) {
        console.warn('⚠️ Error removing chat channel:', error);
      }
      subscriptionRefs.current.chatChannel = {
        channel: null,
        isSubscribed: false,
        isSubscribing: false
      };
    }
    
    // Clean up booking channel
    if (subscriptionRefs.current.bookingChannel.channel) {
      console.log('🧹 Cleaning up enhanced booking notification channel');
      try {
        supabase.removeChannel(subscriptionRefs.current.bookingChannel.channel);
      } catch (error) {
        console.warn('⚠️ Error removing booking channel:', error);
      }
      subscriptionRefs.current.bookingChannel = {
        channel: null,
        isSubscribed: false,
        isSubscribing: false
      };
    }
  };

  useEffect(() => {
    if (!user) {
      cleanupSubscriptions();
      return;
    }

    console.log('🔔 Setting up enhanced notifications for user:', user.id);

    // Set up chat notifications only if not already subscribing or subscribed
    if (!subscriptionRefs.current.chatChannel.isSubscribing && !subscriptionRefs.current.chatChannel.isSubscribed) {
      subscriptionRefs.current.chatChannel.isSubscribing = true;

      const chatChannelName = `chat-notifications-${user.id}-${Date.now()}`;
      const chatChannel = supabase.channel(chatChannelName);

      chatChannel
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
        .subscribe((status) => {
          console.log('📡 Enhanced chat notification subscription status:', status);
          
          if (status === 'SUBSCRIBED') {
            subscriptionRefs.current.chatChannel.isSubscribed = true;
            subscriptionRefs.current.chatChannel.isSubscribing = false;
            subscriptionRefs.current.chatChannel.channel = chatChannel;
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            subscriptionRefs.current.chatChannel.isSubscribed = false;
            subscriptionRefs.current.chatChannel.isSubscribing = false;
            subscriptionRefs.current.chatChannel.channel = null;
          }
        });
    }

    // Set up booking notifications only if not already subscribing or subscribed
    if (!subscriptionRefs.current.bookingChannel.isSubscribing && !subscriptionRefs.current.bookingChannel.isSubscribed) {
      subscriptionRefs.current.bookingChannel.isSubscribing = true;

      const bookingChannelName = `booking-notifications-${user.id}-${Date.now()}`;
      const bookingChannel = supabase.channel(bookingChannelName);

      bookingChannel
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
        .subscribe((status) => {
          console.log('📡 Enhanced booking notification subscription status:', status);
          
          if (status === 'SUBSCRIBED') {
            subscriptionRefs.current.bookingChannel.isSubscribed = true;
            subscriptionRefs.current.bookingChannel.isSubscribing = false;
            subscriptionRefs.current.bookingChannel.channel = bookingChannel;
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            subscriptionRefs.current.bookingChannel.isSubscribed = false;
            subscriptionRefs.current.bookingChannel.isSubscribing = false;
            subscriptionRefs.current.bookingChannel.channel = null;
          }
        });
    }

    return () => {
      console.log('🧹 Enhanced notifications cleanup triggered');
      cleanupSubscriptions();
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
