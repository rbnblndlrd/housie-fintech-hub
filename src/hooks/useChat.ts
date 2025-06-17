
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  message_type: 'text' | 'image' | 'file' | 'system' | 'ai_response';
  content: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  booking_id?: string;
  is_read: boolean;
  is_ai_message: boolean;
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

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!user) return;

    try {
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

      setConversations(processedConversations);
      
      // Calculate total unread count
      const unreadCount = await getUnreadCount();
      setTotalUnreadCount(unreadCount);

    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  }, [user]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:users!chat_messages_sender_id_fkey(full_name, profile_image)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Type cast the data to ensure message_type is properly typed
      const typedMessages: ChatMessage[] = (data || []).map(msg => ({
        ...msg,
        message_type: msg.message_type as 'text' | 'image' | 'file' | 'system' | 'ai_response'
      }));

      setMessages(typedMessages);
      setActiveConversation(conversationId);

      // Mark messages as read
      await markMessagesAsRead(conversationId);

    } catch (error) {
      console.error('Error loading messages:', error);
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
          booking_id: bookingId
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

      return messageData;

    } catch (error) {
      console.error('Error sending message:', error);
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
      console.error('Error marking messages as read:', error);
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
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `receiver_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New message received:', payload);
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeConversation, loadConversations, loadMessages]);

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
