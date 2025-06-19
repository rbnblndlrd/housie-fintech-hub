
import { useState, useEffect, useCallback, useRef } from 'react';
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

  // Send message to AI - now uses WebLLM properly
  const sendMessage = useCallback(async (
    content: string, 
    sessionId?: string, 
    onPopArtTrigger?: () => void,
    webLLMSendMessage?: (message: string) => Promise<string>
  ) => {
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
      return sendMessage(content, newSession.id, onPopArtTrigger, webLLMSendMessage);
    }

    try {
      setIsTyping(true);

      // Save user message to AI messages table
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

      // Generate AI response using WebLLM if available, otherwise intelligent fallback
      let aiResponse: string;
      if (webLLMSendMessage) {
        console.log('🧠 Using WebLLM for AI response...');
        aiResponse = await webLLMSendMessage(content);
      } else {
        console.log('⚡ Using intelligent fallback for AI response...');
        aiResponse = getIntelligentFallback(content);
      }

      // Save AI response to AI messages table
      const { data: aiMessage, error: aiError } = await supabase
        .from('ai_messages')
        .insert({
          session_id: currentSessionId,
          user_id: user.id,
          message_type: 'assistant',
          content: aiResponse,
          metadata: { 
            source: 'ai_chat', 
            generated: true, 
            engine: webLLMSendMessage ? 'webllm' : 'fallback',
            timestamp: new Date().toISOString() 
          }
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

  // Intelligent fallback responses (moved from useWebLLM)
  const getIntelligentFallback = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Tax-related queries
    if (lowerMessage.includes('tax') || lowerMessage === 'hi tax?' || lowerMessage === 'tax?') {
      const taxResponses = [
        "📋 Tax Help: Home office deductions (up to $5,000), property tax questions, and contractor expense tracking. What specific tax topic interests you?",
        "💰 Tax-wise: Home offices save money! Workspace, utilities, repairs - all potentially deductible. Are you working from home?",
        "🏠 Tax question? Home office deductions can save hundreds - office space, utilities, maintenance costs. What's your tax situation?"
      ];
      return taxResponses[Math.floor(Math.random() * taxResponses.length)];
    }
    
    // Pet-related queries
    if (lowerMessage.includes('pet') || lowerMessage.includes('dog') || lowerMessage.includes('cat') || lowerMessage === 'pets?') {
      const petResponses = [
        "🐕 Pet Services: Dog walking ($20-30/walk), pet sitting ($30-60/day), grooming ($40-100), plus pet-friendly home service providers. What does your furry friend need?",
        "🐾 Pet care covered! Dog walkers, sitters, groomers, plus contractors who love animals. How can I help your pet?",
        "🦴 Pets need love AND services! Walking, sitting, grooming, vet recommendations - plus animal-friendly contractors. What pet service interests you?"
      ];
      return petResponses[Math.floor(Math.random() * petResponses.length)];
    }
    
    // Cleaning services
    if (lowerMessage.includes('clean')) {
      const cleanResponses = [
        "🧹 House cleaning: $100-200 regular, $200-400 deep clean. I can help find reliable, insured cleaners nearby. What size space?",
        "✨ Cleaning costs: Weekly $80-150, bi-weekly $100-200, monthly $150-300. Want vetted cleaners in your area?",
        "🏠 Cleaning services: $25-50/hour or $100-250 flat rate by home size. I'll match you with top-rated, background-checked cleaners!"
      ];
      return cleanResponses[Math.floor(Math.random() * cleanResponses.length)];
    }
    
    // Landscaping/lawn care
    if (lowerMessage.includes('lawn') || lowerMessage.includes('garden') || lowerMessage.includes('landscape')) {
      return "Lawn care runs $30-80 per visit for mowing, $150-400 for full landscaping service. Seasonal cleanups $200-600. I can help find licensed landscapers. What outdoor work do you need?";
    }
    
    // Home repairs
    if (lowerMessage.includes('repair') || lowerMessage.includes('fix') || lowerMessage.includes('broken')) {
      return "Home repairs range from $150-500 for simple fixes to $1,000+ for major work. I help find licensed contractors, get multiple quotes, and avoid scams. What needs fixing?";
    }
    
    // Price/cost inquiries
    if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('how much')) {
      return "Pricing varies by service and location! Cleaning $100-300, lawn care $30-80/visit, repairs $150-1,500+. I provide accurate local estimates based on your specific needs. What service interests you?";
    }
    
    // Greeting responses
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      return "Hi! I'm HOUSIE AI, your intelligent home services assistant. I understand context and can help with everything from tax deductions to pet services. What can I help you with?";
    }
    
    // Default intelligent response
    return "🤖 HOUSIE AI here! I'm your intelligent home services assistant. I help with cleaning, repairs, costs, tax questions, pet services, and more. How can I assist you today?";
  };

  // Cleanup subscription helper
  const cleanupSubscription = useCallback(() => {
    if (subscriptionRef.current.channel) {
      console.log('🧹 Cleaning up AI chat subscription');
      try {
        supabase.removeChannel(subscriptionRef.current.channel);
      } catch (error) {
        console.warn('⚠️ Error removing AI chat channel:', error);
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
      console.log('🔄 AI Chat subscription already in progress or active, skipping');
      return;
    }

    // Mark as subscribing to prevent race conditions
    subscriptionRef.current.isSubscribing = true;

    console.log('🔗 Setting up AI chat real-time subscription for user:', user.id);
    
    const channelName = `ai-chat-updates-${user.id}-${Date.now()}`; // Add timestamp for uniqueness
    const channel = supabase.channel(channelName);

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_chat_sessions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadSessions();
        }
      )
      .subscribe((status) => {
        console.log('📡 AI chat subscription status:', status);
        
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
      console.log('🧹 useAIChat cleanup triggered');
      cleanupSubscription();
    };
  }, [user, loadSessions, cleanupSubscription]);

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
