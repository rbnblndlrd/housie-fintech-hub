
import React, { useState, useRef, useEffect } from 'react';
import { useAIChat } from '@/hooks/useAIChat';
import { useAuth } from '@/contexts/AuthContext';
import AIConversationHeader from './AIConversationHeader';
import WelcomeMessage from './WelcomeMessage';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import MessageInput from './MessageInput';

interface AIConversationProps {
  sessionId: string;
  onBack: () => void;
  webLLMSendMessage?: (message: string) => Promise<string>;
  webLLMLoading?: boolean;
  webLLMReady?: boolean;
  onPopArtTrigger?: () => void;
}

const AIConversation: React.FC<AIConversationProps> = ({ 
  sessionId, 
  onBack, 
  webLLMSendMessage,
  webLLMLoading = false,
  webLLMReady = false,
  onPopArtTrigger
}) => {
  const { user } = useAuth();
  const { messages, sendMessage, isTyping } = useAIChat();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending || webLLMLoading) return;

    setSending(true);
    try {
      // Check for pop art easter egg
      if (newMessage.toLowerCase().includes('show me colors')) {
        onPopArtTrigger?.();
      }

      if (webLLMSendMessage && webLLMReady) {
        // Use WebLLM for AI responses
        const aiResponse = await webLLMSendMessage(newMessage);
        
        // Save both user message and AI response to database
        await sendMessage(newMessage, sessionId);
        if (aiResponse && !newMessage.toLowerCase().includes('show me colors')) {
          // Don't save the pop art response to database
          await sendMessage(aiResponse, sessionId);
        }
      } else {
        // Fallback to original AI chat system
        await sendMessage(newMessage, sessionId, onPopArtTrigger);
      }
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setNewMessage(prompt);
  };

  return (
    <div className="h-full flex flex-col">
      <AIConversationHeader
        onBack={onBack}
        webLLMReady={webLLMReady}
        webLLMLoading={webLLMLoading}
        isTyping={isTyping}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50/20 to-blue-50/20 dark:from-gray-800 dark:to-gray-900">
        {messages.length === 0 && (
          <WelcomeMessage
            webLLMReady={webLLMReady}
            onSuggestedPrompt={handleSuggestedPrompt}
          />
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        disabled={sending || isTyping || webLLMLoading}
        webLLMReady={webLLMReady}
      />
    </div>
  );
};

export default AIConversation;
