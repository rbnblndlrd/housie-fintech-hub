import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from './useCredits';
import { useCanonThreads } from './useCanonThreads';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnnetteMessage {
  id: string;
  session_id: string;
  message_type: 'user' | 'assistant';
  content: string;
  created_at: string;
  credits_used?: number;
  feature_used?: string;
}

export const useEnhancedAnnetteChat = () => {
  const { user } = useAuth();
  const { checkRateLimit, consumeCredits } = useCredits();
  const { createThread, searchThreads } = useCanonThreads();
  const [messages, setMessages] = useState<AnnetteMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);

  const handleThreadCommands = async (content: string): Promise<string | null> => {
    if (content.toLowerCase().includes('what did i ask about')) {
      const searchMatch = content.match(/what did i ask about (.+)/i);
      if (searchMatch) {
        const query = searchMatch[1];
        const threads = await searchThreads(query);
        if (threads.length > 0) {
          const thread = threads[0];
          return `I found a thread about "${thread.title}" from ${new Date(thread.created_at).toLocaleDateString()}. You asked: "${thread.root_message}".`;
        }
        return `I couldn't find any threads matching "${query}".`;
      }
    }
    return null;
  };

  const sendMessage = useCallback(async (content: string, sessionId: string): Promise<void> => {
    if (!user) return;

    const userMessage: AnnetteMessage = {
      id: `user-${Date.now()}`,
      session_id: sessionId,
      message_type: 'user',
      content,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Handle thread commands
      const threadResponse = await handleThreadCommands(content);
      if (threadResponse) {
        const response: AnnetteMessage = {
          id: `annette-${Date.now()}`,
          session_id: sessionId,
          message_type: 'assistant',
          content: threadResponse,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, response]);
        return;
      }

      // Regular Annette response
      const response: AnnetteMessage = {
        id: `annette-${Date.now()}`,
        session_id: sessionId,
        message_type: 'assistant',
        content: "I understand your message. This is now enhanced with Canon Thread memory capabilities!",
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, response]);

    } catch (error) {
      console.error('Enhanced chat error:', error);
    } finally {
      setIsTyping(false);
    }
  }, [user, searchThreads]);

  return {
    messages,
    sendMessage,
    isTyping,
    setMessages,
    currentThreadId
  };
};