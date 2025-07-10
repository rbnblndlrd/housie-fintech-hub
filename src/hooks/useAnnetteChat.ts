
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from './useCredits';
import { toast } from 'sonner';

export interface AnnetteMessage {
  id: string;
  session_id: string;
  message_type: 'user' | 'assistant';
  content: string;
  created_at: string;
  credits_used?: number;
  feature_used?: string;
}

interface RateLimitResult {
  allowed: boolean;
  reason?: string;
  retry_after?: string;
  cooldown_until?: string;
  daily_used?: number;
  daily_limit?: number;
}

interface CreditConsumptionResult {
  success: boolean;
  reason?: string;
  required?: number;
  available?: number;
  credits_spent?: number;
  remaining?: number;
  is_free?: boolean;
}

export const useAnnetteChat = () => {
  const { user } = useAuth();
  const { checkRateLimit, consumeCredits, features } = useCredits();
  const [messages, setMessages] = useState<AnnetteMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const classifyMessage = (content: string): string => {
    const lowerContent = content.toLowerCase();
    
    // Free tier messages (basic support)
    const freeKeywords = [
      'how do i', 'what are', 'where is', 'when does', 'password', 'login',
      'sign up', 'book', 'cancel', 'refund', 'contact', 'help', 'support',
      'verification', 'payment', 'fees', 'schedule'
    ];
    
    // Premium features requiring credits
    const premiumKeywords = [
      'analyze', 'optimize', 'recommend', 'strategy', 'business', 'insights',
      'route', 'schedule', 'plan', 'efficient', 'best way', 'improve',
      'competitive', 'marketing', 'pricing', 'growth', 'profit'
    ];

    // Check for premium features first
    if (premiumKeywords.some(keyword => lowerContent.includes(keyword))) {
      if (lowerContent.includes('route') || lowerContent.includes('optimize') || lowerContent.includes('efficient')) {
        return 'route_optimization';
      } else if (lowerContent.includes('schedule') || lowerContent.includes('plan') || lowerContent.includes('time')) {
        return 'advanced_scheduling';
      } else if (lowerContent.includes('business') || lowerContent.includes('insight') || lowerContent.includes('analysis')) {
        return 'business_insights';
      }
    }

    // Default to basic support for most queries
    return 'basic_customer_support';
  };

  const checkEmergencyControls = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_annette_api_enabled');
      
      if (error) {
        console.error('Error checking emergency controls:', error);
        return false;
      }
      
      return data === true;
    } catch (error) {
      console.error('Error checking emergency controls:', error);
      return false;
    }
  };

  const sendMessage = useCallback(async (
    content: string, 
    sessionId: string,
    context?: {
      type?: 'route' | 'bid' | 'profile' | 'cluster' | 'booking' | 'opportunities';
      data?: any;
    },
    pageContext?: {
      pageType: string;
      context: string;
      annettePersonality: string;
    }
  ) => {
    if (!user || !content.trim()) return;

    try {
      setIsTyping(true);

      // Check emergency controls first
      const isEnabled = await checkEmergencyControls();
      
      if (!isEnabled) {
        const systemMessage: AnnetteMessage = {
          id: `system-${Date.now()}`,
          session_id: sessionId,
          message_type: 'assistant',
          content: "🚫 **Annette AI is temporarily unavailable**\n\nOur AI assistant is currently disabled for maintenance or due to usage limits. Please try again later or contact our support team if you need immediate assistance.\n\n*This is an automated safety measure to ensure optimal service quality.*",
          created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, systemMessage]);
        toast.error('Annette AI is temporarily unavailable');
        return;
      }

      // Classify the message to determine feature type
      const featureType = classifyMessage(content);
      const messageLength = content.trim().length;

      // Check rate limits
      const rateLimitResult = await checkRateLimit(featureType, messageLength);
      
      if (!rateLimitResult.allowed) {
        let errorMessage = "Rate limit exceeded. ";
        
        switch (rateLimitResult.reason) {
          case 'Daily limit exceeded':
            errorMessage += "You've reached your daily limit for free messages. Purchase credits to continue with enhanced limits.";
            break;
          case 'Cooldown period active':
            const retryTime = rateLimitResult.retry_after ? new Date(rateLimitResult.retry_after).toLocaleTimeString() : 'soon';
            errorMessage += `Please wait until ${retryTime} before sending another message.`;
            break;
          case 'Message too long for free tier':
            errorMessage += "Your message is too long for the free tier. Upgrade to credits for longer messages (up to 300 characters).";
            break;
          case 'User is in cooldown':
            const cooldownTime = rateLimitResult.cooldown_until ? new Date(rateLimitResult.cooldown_until).toLocaleTimeString() : 'later';
            errorMessage += `You're in cooldown until ${cooldownTime} due to rapid messaging.`;
            break;
          default:
            errorMessage += rateLimitResult.reason;
        }

        const rateLimitMessage: AnnetteMessage = {
          id: `rate-limit-${Date.now()}`,
          session_id: sessionId,
          message_type: 'assistant',
          content: `⚠️ **${errorMessage}**\n\nTo unlock unlimited access:\n• Purchase credits for premium features\n• Get 4x higher daily limits\n• Remove cooldown restrictions\n• Access advanced AI capabilities`,
          created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, rateLimitMessage]);
        toast.error(errorMessage.split('.')[0]);
        return;
      }

      // Add user message to local state immediately
      const userMessage: AnnetteMessage = {
        id: `temp-${Date.now()}`,
        session_id: sessionId,
        message_type: 'user',
        content: content.trim(),
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);

      // Note: Credit consumption is now handled by the backend annette-chat function
      let creditsConsumed = 0;

      // Get conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.message_type as 'user' | 'assistant',
        content: msg.content
      }));

      // Determine response token limit based on user tier
      const maxTokens = rateLimitResult.daily_used !== undefined && featureType === 'basic_customer_support' ? 100 : 200;

      // Call Annette API via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('annette-chat', {
        body: {
          message: content.trim(),
          sessionId,
          userId: user.id,
          conversationHistory,
          context,
          pageContext,
          featureType,
          maxTokens,
          creditsUsed: creditsConsumed
        }
      });

      if (error) throw error;

      // Add Annette's response to local state
      const assistantMessage: AnnetteMessage = {
        id: `annette-${Date.now()}`,
        session_id: sessionId,
        message_type: 'assistant',
        content: data.response,
        created_at: new Date().toISOString(),
        credits_used: creditsConsumed,
        feature_used: featureType
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message to Annette:', error);
      
      const errorMessage: AnnetteMessage = {
        id: `error-${Date.now()}`,
        session_id: sessionId,
        message_type: 'assistant',
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to send message to Annette AI');
    } finally {
      setIsTyping(false);
    }
  }, [user, messages, checkRateLimit, consumeCredits, features]);

  return {
    messages,
    sendMessage,
    isTyping,
    setMessages
  };
};
