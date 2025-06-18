
import { useState, useCallback, useRef, useEffect } from 'react';
import * as webllm from "@mlc-ai/web-llm";

export interface WebLLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const useWebLLM = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const engineRef = useRef<webllm.MLCEngineInterface | null>(null);
  const conversationRef = useRef<WebLLMMessage[]>([]);

  const initializeEngine = useCallback(async () => {
    if (engineRef.current) return;

    try {
      setIsDownloading(true);
      setError(null);

      const engine = new webllm.MLCEngine();
      
      engine.setInitProgressCallback((report) => {
        if (report.progress) {
          setDownloadProgress(Math.round(report.progress * 100));
        }
      });

      await engine.reload("Llama-3.2-1B-Instruct-q4f32_1-MLC");
      
      engineRef.current = engine;
      setIsReady(true);
      setIsDownloading(false);
      
      // Initialize with system prompt for home services
      conversationRef.current = [{
        role: 'system',
        content: `You are HOUSIE AI, a helpful assistant for home services. You help users find service providers, get pricing estimates, schedule appointments, and answer questions about home maintenance, cleaning, repairs, and improvements. 

Key guidelines:
- Be friendly, helpful, and professional
- Provide accurate information about typical service costs and timeframes
- Ask clarifying questions when needed
- Suggest reputable service providers when appropriate
- Give practical home maintenance tips
- Be concise but thorough in your responses

If a user says "show me colors", respond with: "Activating pop art mode... Behold colors! 🎨 Welcome to HOUSIE's groovy dimension! ✨"`
      }];

    } catch (err) {
      console.error('WebLLM initialization error:', err);
      setError('Failed to initialize AI model. Using fallback responses.');
      setIsDownloading(false);
    }
  }, []);

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    // Check for pop art easter egg
    if (message.toLowerCase().includes('show me colors')) {
      return "Activating pop art mode... Behold colors! 🎨 Welcome to HOUSIE's groovy dimension! ✨";
    }

    if (!engineRef.current || !isReady) {
      // Fallback responses for home services
      const fallbackResponses = [
        "I'd be happy to help you with that! Can you provide more details about what specific service you're looking for?",
        "Based on your request, I can recommend several excellent service providers in your area. What's your location?",
        "That's a great question! For home services, I typically recommend getting quotes from 2-3 providers to compare. Would you like me to help you find some?",
        "I can help you estimate costs for that service. The average price in most areas is typically between $50-150, depending on the specifics. Would you like me to connect you with providers?",
        "For that type of service, I recommend checking the provider's insurance and reviews first. Would you like me to show you some highly-rated options?",
        "Let me help you find the perfect service provider! What's most important to you - price, availability, or specific expertise?",
        "I can assist with booking that service. First, let me ask a few questions to match you with the right provider...",
        "That service typically takes 2-4 hours depending on the scope. Would you like me to help you schedule a consultation?"
      ];
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    try {
      setIsLoading(true);
      
      // Add user message to conversation
      conversationRef.current.push({ role: 'user', content: message });
      
      // Generate response
      const response = await engineRef.current.chat.completions.create({
        messages: conversationRef.current,
        temperature: 0.7,
        max_tokens: 300,
      });

      const aiResponse = response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
      
      // Add AI response to conversation
      conversationRef.current.push({ role: 'assistant', content: aiResponse });
      
      return aiResponse;
    } catch (err) {
      console.error('WebLLM chat error:', err);
      return "I'm having trouble processing your request right now. Please try again in a moment.";
    } finally {
      setIsLoading(false);
    }
  }, [isReady]);

  const resetConversation = useCallback(() => {
    conversationRef.current = conversationRef.current.slice(0, 1); // Keep system prompt
  }, []);

  useEffect(() => {
    // Auto-initialize on mount
    initializeEngine();
    
    // Cleanup on unmount
    return () => {
      if (engineRef.current) {
        engineRef.current.unload();
      }
    };
  }, [initializeEngine]);

  return {
    isLoading,
    isDownloading,
    downloadProgress,
    isReady,
    error,
    sendMessage,
    resetConversation,
    initializeEngine
  };
};
