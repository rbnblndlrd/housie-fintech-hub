
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  content: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  booking_id?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender?: {
    full_name: string;
    profile_image?: string;
  };
}

export interface Conversation {
  id: string;
  participant_one_id: string;
  participant_two_id: string;
  booking_id?: string;
  last_message_id?: string;
  last_message_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  other_participant?: {
    id: string;
    full_name: string;
    profile_image?: string;
  };
  unread_count?: number;
  last_message?: string;
}

export const useChat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  
  // Use ref to track subscription state and prevent double subscriptions
  const subscriptionRef = useRef<{
    channel: any | null;
    isSubscribed: boolean;
    isSubscribing: boolean;
  }>({
    channel: null,
    isSubscribed: false,
    isSubscribing: false
  });

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!user) return;

    try {
      console.log('🔍 Loading conversations for user:', user.id);
      
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_one:users!conversations_participant_one_id_fkey(id, full_name, profile_image),
          participant_two:users!conversations_participant_two_id_fkey(id, full_name, profile_image)
        `)
        .or(`participant_one_id.eq.${user.id},participant_two_id.eq.${user.id}`)
        .eq('is_active', true)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      const processedConversations = data?.map(conv => {
        const otherParticipant = conv.participant_one_id === user.id 
          ? conv.participant_two 
          : conv.participant_one;
        
        return {
          ...conv,
          other_participant: otherParticipant,
          last_message: 'Start a conversation'
        };
      }) || [];

      console.log('💬 Processed conversations:', processedConversations.length);
      setConversations(processedConversations);
      
      // Calculate total unread count
      const unreadCount = await getUnreadCount();
      setTotalUnreadCount(unreadCount);

    } catch (error) {
      console.error('❌ Error loading conversations:', error);
    }
  }, [user]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('📨 Loading messages for conversation:', conversationId);
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:users!chat_messages_sender_id_fkey(full_name, profile_image)
        `)
        .eq('conversation_id', conversationId)
        .eq('is_ai_message', false) // Only load human messages
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Type cast the data
      const typedMessages: ChatMessage[] = (data || []).map(msg => ({
        ...msg,
        message_type: msg.message_type as 'text' | 'image' | 'file' | 'system'
      }));

      console.log('✅ Loaded messages:', typedMessages.length);
      setMessages(typedMessages);
      setActiveConversation(conversationId);

      // Mark messages as read
      await markMessagesAsRead(conversationId);

    } catch (error) {
      console.error('❌ Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Send a message
  const sendMessage = useCallback(async (
    receiverId: string,
    content: string,
    messageType: 'text' | 'image' | 'file' = 'text',
    bookingId?: string,
    fileData?: { url: string; name: string; size: number }
  ) => {
    if (!user || !content.trim()) return null;

    try {
      console.log('📤 Sending message to:', receiverId);
      
      // Get or create conversation
      const { data: conversationData, error: convError } = await supabase
        .rpc('get_or_create_conversation', {
          p_participant_one_id: user.id,
          p_participant_two_id: receiverId,
          p_booking_id: bookingId || null
        });

      if (convError) throw convError;

      const conversationId = conversationData;

      // Send message
      const { data: messageData, error: msgError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          receiver_id: receiverId,
          message_type: messageType,
          content: content.trim(),
          file_url: fileData?.url,
          file_name: fileData?.name,
          file_size: fileData?.size,
          booking_id: bookingId,
          is_ai_message: false // Explicitly mark as human message
        })
        .select()
        .single();

      if (msgError) throw msgError;

      // Update conversation last message
      await supabase
        .from('conversations')
        .update({
          last_message_id: messageData.id,
          last_message_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      console.log('✅ Message sent successfully');
      return messageData;

    } catch (error) {
      console.error('❌ Error sending message:', error);
      return null;
    }
  }, [user]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      await supabase.rpc('mark_messages_as_read', {
        p_conversation_id: conversationId,
        p_user_id: user.id
      });
    } catch (error) {
      console.error('❌ Error marking messages as read:', error);
    }
  }, [user]);

  // Get unread count
  const getUnreadCount = useCallback(async () => {
    if (!user) return 0;

    try {
      const { count, error } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false)
        .eq('is_ai_message', false); // Only count human messages

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('❌ Error getting unread count:', error);
      return 0;
    }
  }, [user]);

  // Cleanup subscription helper
  const cleanupSubscription = useCallback(() => {
    if (subscriptionRef.current.channel) {
      console.log('🧹 Cleaning up chat subscription');
      try {
        supabase.removeChannel(subscriptionRef.current.channel);
      } catch (error) {
        console.warn('⚠️ Error removing channel:', error);
      }
      subscriptionRef.current = {
        channel: null,
        isSubscribed: false,
        isSubscribing: false
      };
    }
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) {
      cleanupSubscription();
      return;
    }

    // Prevent multiple subscriptions
    if (subscriptionRef.current.isSubscribing || subscriptionRef.current.isSubscribed) {
      console.log('🔄 Subscription already in progress or active, skipping');
      return;
    }

    subscriptionRef.current.isSubscribing = true;

    console.log('🔗 Setting up chat real-time subscription for user:', user.id);
    
    const channelName = `chat-updates-${user.id}-${Date.now()}`;
    const channel = supabase.channel(channelName);

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `receiver_id=eq.${user.id}`
        },
        (payload) => {
          console.log('📨 New message received:', payload);
          
          // Filter out AI messages from real-time updates
          if (payload.new.is_ai_message) {
            console.log('🚫 Filtered out AI message from real-time update');
            return;
          }
          
          loadConversations();
          
          // If it's for the active conversation, reload messages
          if (activeConversation && payload.new.conversation_id === activeConversation) {
            loadMessages(activeConversation);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `sender_id=eq.${user.id}`
        },
        () => {
          loadConversations();
        }
      )
      .subscribe((status) => {
        console.log('📡 Chat subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          subscriptionRef.current.isSubscribed = true;
          subscriptionRef.current.isSubscribing = false;
          subscriptionRef.current.channel = channel;
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          subscriptionRef.current.isSubscribed = false;
          subscriptionRef.current.isSubscribing = false;
          subscriptionRef.current.channel = null;
        }
      });

    return () => {
      console.log('🧹 useChat cleanup triggered');
      cleanupSubscription();
    };
  }, [user, activeConversation, loadConversations, loadMessages, cleanupSubscription]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    messages,
    activeConversation,
    loading,
    totalUnreadCount,
    loadConversations,
    loadMessages,
    sendMessage,
    markMessagesAsRead,
    setActiveConversation
  };
};
