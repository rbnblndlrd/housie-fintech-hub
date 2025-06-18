
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AIMessage {
  id: string;
  session_id: string;
  user_id: string;
  message_type: 'user' | 'assistant' | 'system';
  content: string;
  metadata: any;
  created_at: string;
}

export interface AIChatSession {
  id: string;
  user_id: string;
  session_title?: string;
  context_data: any;
  last_message_at: string;
  is_active: boolean;
  created_at: string;
}

export const useAIChat = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<AIChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Load AI chat sessions
  const loadSessions = useCallback(async () => {
    if (!user) return;

    try {
      console.log('🤖 Loading AI chat sessions for user:', user.id);
      
      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      
      console.log('✅ Loaded AI sessions:', data?.length || 0);
      setSessions(data || []);
    } catch (error) {
      console.error('❌ Error loading AI sessions:', error);
    }
  }, [user]);

  // Load messages for a session
  const loadMessages = useCallback(async (sessionId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('🤖 Loading AI messages for session:', sessionId);
      
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const typedMessages: AIMessage[] = (data || []).map(msg => ({
        ...msg,
        message_type: msg.message_type as 'user' | 'assistant' | 'system'
      }));

      console.log('✅ Loaded AI messages:', typedMessages.length);
      setMessages(typedMessages);
      setActiveSession(sessionId);
    } catch (error) {
      console.error('❌ Error loading AI messages:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create new AI session
  const createSession = useCallback(async (title?: string) => {
    if (!user) return null;

    try {
      console.log('🤖 Creating new AI session for user:', user.id);
      
      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .insert({
          user_id: user.id,
          session_title: title || `AI Chat ${new Date().toLocaleDateString()}`,
          context_data: {}
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Created AI session:', data.id);
      await loadSessions();
      return data;
    } catch (error) {
      console.error('❌ Error creating AI session:', error);
      return null;
    }
  }, [user, loadSessions]);

  // Send message to AI with proper separation
  const sendMessage = useCallback(async (content: string, sessionId?: string, onPopArtTrigger?: () => void) => {
    if (!user || !content.trim()) return null;

    console.log('🤖 Sending AI message:', content.substring(0, 50) + '...');

    // Check for pop art command
    if (content.toLowerCase().includes('show me colors')) {
      console.log('🎨 Pop art command detected!');
      onPopArtTrigger?.();
      // Return special pop art response without saving to DB
      return {
        id: 'pop-art-trigger',
        session_id: sessionId || '',
        user_id: user.id,
        message_type: 'assistant' as const,
        content: "🎨✨ Activating HOUSIE's groovy pop art mode! Behold the colors! Welcome to our psychedelic dimension! ✨🌈",
        metadata: {},
        created_at: new Date().toISOString()
      };
    }

    // Use provided sessionId or activeSession
    const currentSessionId = sessionId || activeSession;
    
    // Create a new session if none exists
    if (!currentSessionId) {
      const newSession = await createSession();
      if (!newSession) return null;
      await loadMessages(newSession.id);
      return sendMessage(content, newSession.id, onPopArtTrigger);
    }

    try {
      setIsTyping(true);

      // Save user message to AI messages table ONLY
      const { data: userMessage, error: userError } = await supabase
        .from('ai_messages')
        .insert({
          session_id: currentSessionId,
          user_id: user.id,
          message_type: 'user',
          content: content.trim(),
          metadata: { source: 'ai_chat', timestamp: new Date().toISOString() }
        })
        .select()
        .single();

      if (userError) throw userError;

      console.log('✅ Saved user AI message:', userMessage.id);

      // Update messages immediately with user message
      const typedUserMessage: AIMessage = {
        ...userMessage,
        message_type: userMessage.message_type as 'user' | 'assistant' | 'system'
      };
      setMessages(prev => [...prev, typedUserMessage]);

      // Generate AI response
      const aiResponse = await generateAIResponse(content);

      // Save AI response to AI messages table ONLY
      const { data: aiMessage, error: aiError } = await supabase
        .from('ai_messages')
        .insert({
          session_id: currentSessionId,
          user_id: user.id,
          message_type: 'assistant',
          content: aiResponse,
          metadata: { source: 'ai_chat', generated: true, timestamp: new Date().toISOString() }
        })
        .select()
        .single();

      if (aiError) throw aiError;

      console.log('✅ Saved AI response:', aiMessage.id);

      // Update messages with AI response
      const typedAIMessage: AIMessage = {
        ...aiMessage,
        message_type: aiMessage.message_type as 'user' | 'assistant' | 'system'
      };
      setMessages(prev => [...prev, typedAIMessage]);

      // Update session last message time
      await supabase
        .from('ai_chat_sessions')
        .update({
          last_message_at: new Date().toISOString()
        })
        .eq('id', currentSessionId);

      await loadSessions();

      return typedAIMessage;
    } catch (error) {
      console.error('❌ Error sending AI message:', error);
      return null;
    } finally {
      setIsTyping(false);
    }
  }, [user, activeSession, createSession, loadSessions, loadMessages]);

  // Generate AI response (with clear AI markers)
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Mark responses as clearly AI-generated to prevent confusion
    const responses = [
      "[AI Assistant] I'd be happy to help you with that! Can you provide more details about what specific service you're looking for?",
      "[HOUSIE AI] Based on your request, I can recommend several excellent service providers in your area. What's your location?",
      "[AI Assistant] That's a great question! For home services, I typically recommend getting quotes from 2-3 providers to compare. Would you like me to help you find some?",
      "[HOUSIE AI] I can help you estimate costs for that service. The average price in your area is typically between $50-150, depending on the specifics. Would you like me to connect you with providers?",
      "[AI Assistant] For that type of service, I recommend checking the provider's insurance and reviews first. Would you like me to show you some highly-rated options?",
      "[HOUSIE AI] Let me help you find the perfect service provider! What's most important to you - price, availability, or specific expertise?",
      "[AI Assistant] I can assist with booking that service. First, let me ask a few questions to match you with the right provider...",
      "[HOUSIE AI] That service typically takes 2-4 hours depending on the scope. Would you like me to help you schedule a consultation?"
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return {
    sessions,
    messages,
    activeSession,
    loading,
    isTyping,
    loadSessions,
    loadMessages,
    createSession,
    sendMessage,
    setActiveSession
  };
};
