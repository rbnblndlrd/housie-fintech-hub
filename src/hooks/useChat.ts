
import { useState, useEffect, useCallback, useRef } from 'react';
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

  // AI response patterns for validation
  const aiResponsePatterns = [
    "I'd be happy to help you with that!",
    "Can you provide more details about what specific service you're looking for?",
    "Based on your request, I can recommend several excellent service providers",
    "That's a great question! For home services, I typically recommend",
    "I can help you estimate costs for that service",
    "For that type of service, I recommend checking the provider's insurance",
    "Let me help you find the perfect service provider!",
    "I can assist with booking that service",
    "That service typically takes",
    "Hello! How can I help you find the perfect service today?",
    "HOUSIE AI",
    "AI Assistant"
  ];

  // Validate if content looks like AI response
  const isAIContent = useCallback((content: string) => {
    if (!content) return false;
    const lowerContent = content.toLowerCase();
    return aiResponsePatterns.some(pattern => 
      lowerContent.includes(pattern.toLowerCase())
    );
  }, []);

  // Load conversations with enhanced filtering
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
        
        // Additional validation for AI participants
        if (otherParticipant && (
          otherParticipant.id === 'ai-assistant' ||
          otherParticipant.full_name?.toLowerCase().includes('ai') ||
          otherParticipant.full_name?.toLowerCase().includes('assistant') ||
          otherParticipant.full_name?.toLowerCase().includes('bot')
        )) {
          console.log('🚫 Filtering out AI participant:', otherParticipant.full_name);
          return null;
        }
        
        return {
          ...conv,
          other_participant: otherParticipant,
          last_message: 'Start a conversation'
        };
      }).filter(Boolean) || [];

      console.log('💬 Processed conversations:', processedConversations.length);
      setConversations(processedConversations);
      
      // Calculate total unread count
      const unreadCount = await getUnreadCount();
      setTotalUnreadCount(unreadCount);

    } catch (error) {
      console.error('❌ Error loading conversations:', error);
    }
  }, [user]);

  // Load messages with AI content filtering
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
        .neq('message_type', 'ai_response') // Exclude AI responses
        .neq('is_ai_message', true) // Exclude AI messages
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Additional filtering for AI content
      const humanMessages = (data || []).filter(msg => {
        // Filter out messages that look like AI responses
        if (isAIContent(msg.content)) {
          console.log('🚫 Filtered out AI content:', msg.content.substring(0, 50) + '...');
          return false;
        }
        return true;
      });

      // Type cast the filtered data
      const typedMessages: ChatMessage[] = humanMessages.map(msg => ({
        ...msg,
        message_type: msg.message_type as 'text' | 'image' | 'file' | 'system' | 'ai_response'
      }));

      console.log('✅ Loaded human messages:', typedMessages.length);
      setMessages(typedMessages);
      setActiveConversation(conversationId);

      // Mark messages as read
      await markMessagesAsRead(conversationId);

    } catch (error) {
      console.error('❌ Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  }, [user, isAIContent]);

  // Send a message with AI content validation
  const sendMessage = useCallback(async (
    receiverId: string,
    content: string,
    messageType: 'text' | 'image' | 'file' = 'text',
    bookingId?: string,
    fileData?: { url: string; name: string; size: number }
  ) => {
    if (!user || !content.trim()) return null;

    // Validate that we're not sending AI-like content
    if (isAIContent(content)) {
      console.warn('⚠️ Blocking potential AI content from being sent:', content.substring(0, 50));
      return null;
    }

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

      // Send message with explicit human flags
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
  }, [user, isAIContent]);

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
        .neq('is_ai_message', true); // Exclude AI messages from unread count

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

  // Set up real-time subscriptions with bulletproof cleanup
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

    // Mark as subscribing to prevent race conditions
    subscriptionRef.current.isSubscribing = true;

    console.log('🔗 Setting up chat real-time subscription for user:', user.id);
    
    const channelName = `chat-updates-${user.id}-${Date.now()}`; // Add timestamp for uniqueness
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
          if (payload.new.is_ai_message || payload.new.message_type === 'ai_response') {
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
