
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ClaudeMessage {
  id: string;
  session_id: string;
  message_type: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export const useClaudeChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ClaudeMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const checkEmergencyControls = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_claude_api_enabled');
      
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
    onPopArtTrigger?: () => void
  ) => {
    if (!user || !content.trim()) return;

    try {
      setIsTyping(true);

      // Check emergency controls first
      const isEnabled = await checkEmergencyControls();
      
      if (!isEnabled) {
        // Add system message about API being disabled
        const systemMessage: ClaudeMessage = {
          id: `system-${Date.now()}`,
          session_id: sessionId,
          message_type: 'assistant',
          content: "🚫 **Claude AI is temporarily unavailable**\n\nOur AI assistant is currently disabled for maintenance or due to usage limits. Please try again later or contact our support team if you need immediate assistance.\n\n*This is an automated safety measure to ensure optimal service quality.*",
          created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, systemMessage]);
        toast.error('Claude AI is temporarily unavailable');
        return;
      }

      // Add user message to local state immediately
      const userMessage: ClaudeMessage = {
        id: `temp-${Date.now()}`,
        session_id: sessionId,
        message_type: 'user',
        content: content.trim(),
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);

      // Get conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.message_type as 'user' | 'assistant',
        content: msg.content
      }));

      // Call Claude API via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('claude-chat', {
        body: {
          message: content.trim(),
          sessionId,
          userId: user.id,
          conversationHistory
        }
      });

      if (error) throw error;

      // Add Claude's response to local state
      const assistantMessage: ClaudeMessage = {
        id: `claude-${Date.now()}`,
        session_id: sessionId,
        message_type: 'assistant',
        content: data.response,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Trigger pop art easter egg if needed
      if (data.response.toLowerCase().includes('color') || 
          data.response.toLowerCase().includes('art') ||
          content.toLowerCase().includes('show me colors')) {
        onPopArtTrigger?.();
      }

    } catch (error) {
      console.error('Error sending message to Claude:', error);
      
      // Add error message to chat
      const errorMessage: ClaudeMessage = {
        id: `error-${Date.now()}`,
        session_id: sessionId,
        message_type: 'assistant',
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to send message to Claude AI');
    } finally {
      setIsTyping(false);
    }
  }, [user, messages]);

  return {
    messages,
    sendMessage,
    isTyping,
    setMessages
  };
};
