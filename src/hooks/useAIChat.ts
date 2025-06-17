
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
      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading AI sessions:', error);
    }
  }, [user]);

  // Load messages for a session
  const loadMessages = useCallback(async (sessionId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
      setActiveSession(sessionId);
    } catch (error) {
      console.error('Error loading AI messages:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create new AI session
  const createSession = useCallback(async (title?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .insert({
          user_id: user.id,
          session_title: title || `Chat ${new Date().toLocaleDateString()}`,
          context_data: {}
        })
        .select()
        .single();

      if (error) throw error;

      await loadSessions();
      return data;
    } catch (error) {
      console.error('Error creating AI session:', error);
      return null;
    }
  }, [user, loadSessions]);

  // Send message to AI
  const sendMessage = useCallback(async (content: string, sessionId?: string) => {
    if (!user || !content.trim()) return null;

    let currentSessionId = sessionId;

    // Create new session if none provided
    if (!currentSessionId) {
      const newSession = await createSession();
      if (!newSession) return null;
      currentSessionId = newSession.id;
      setActiveSession(currentSessionId);
    }

    try {
      setIsTyping(true);

      // Save user message
      const { data: userMessage, error: userError } = await supabase
        .from('ai_messages')
        .insert({
          session_id: currentSessionId,
          user_id: user.id,
          message_type: 'user',
          content: content.trim()
        })
        .select()
        .single();

      if (userError) throw userError;

      // Update messages immediately with user message
      setMessages(prev => [...prev, userMessage]);

      // Simulate AI response (replace with actual AI integration)
      const aiResponse = await generateAIResponse(content);

      // Save AI response
      const { data: aiMessage, error: aiError } = await supabase
        .from('ai_messages')
        .insert({
          session_id: currentSessionId,
          user_id: user.id,
          message_type: 'assistant',
          content: aiResponse
        })
        .select()
        .single();

      if (aiError) throw aiError;

      // Update messages with AI response
      setMessages(prev => [...prev, aiMessage]);

      // Update session last message time
      await supabase
        .from('ai_chat_sessions')
        .update({
          last_message_at: new Date().toISOString()
        })
        .eq('id', currentSessionId);

      await loadSessions();

      return aiMessage;
    } catch (error) {
      console.error('Error sending AI message:', error);
      return null;
    } finally {
      setIsTyping(false);
    }
  }, [user, createSession, loadSessions]);

  // Simulate AI response (replace with actual AI service)
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const responses = [
      "I'd be happy to help you with that! Can you provide more details about what specific service you're looking for?",
      "Based on your request, I can recommend several excellent service providers in your area. What's your location?",
      "That's a great question! For home services, I typically recommend getting quotes from 2-3 providers to compare. Would you like me to help you find some?",
      "I can help you estimate costs for that service. The average price in your area is typically between $50-150, depending on the specifics. Would you like me to connect you with providers?",
      "For that type of service, I recommend checking the provider's insurance and reviews first. Would you like me to show you some highly-rated options?",
      "Let me help you find the perfect service provider! What's most important to you - price, availability, or specific expertise?",
      "I can assist with booking that service. First, let me ask a few questions to match you with the right provider...",
      "That service typically takes 2-4 hours depending on the scope. Would you like me to help you schedule a consultation?"
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
