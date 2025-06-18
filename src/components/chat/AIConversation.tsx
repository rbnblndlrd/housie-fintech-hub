
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
    const userMessage = newMessage.trim();
    setNewMessage('');

    try {
      console.log('📤 Sending user message:', userMessage);
      
      // First, save the user message to database
      await sendMessage(userMessage, sessionId);

      // ALWAYS try WebLLM first if available
      if (webLLMSendMessage) {
        console.log('🤖 Getting WebLLM AI response...');
        const aiResponse = await webLLMSendMessage(userMessage);
        
        console.log('🤖 WebLLM AI Response:', aiResponse);
        
        // Check for pop art trigger in the response
        if (aiResponse.includes('pop art') || aiResponse.includes('groovy') || aiResponse.includes('psychedelic')) {
          console.log('🎨 Pop art trigger detected!');
          onPopArtTrigger?.();
        }
        
        // Save AI response to database (unless it's the pop art activation message)
        if (!aiResponse.includes('Activating HOUSIE\'s groovy pop art mode')) {
          await sendMessage(aiResponse, sessionId);
        }
      } else {
        console.log('⚠️ WebLLM not available, using fallback');
        // Fallback to original AI chat system
        await sendMessage(userMessage, sessionId, onPopArtTrigger);
      }
      
    } catch (error) {
      console.error('❌ Error sending message:', error);
      // Try fallback system on error
      try {
        await sendMessage(userMessage, sessionId, onPopArtTrigger);
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
      }
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
        isTyping={isTyping || sending}
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

        {(isTyping || sending) && <TypingIndicator />}

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
