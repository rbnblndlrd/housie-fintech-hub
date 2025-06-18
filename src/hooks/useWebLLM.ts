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
    if (engineRef.current || isDownloading) return;

    try {
      setIsDownloading(true);
      setError(null);
      console.log('🤖 Initializing WebLLM engine...');

      const engine = new webllm.MLCEngine();
      
      engine.setInitProgressCallback((report) => {
        console.log('📥 WebLLM progress:', report);
        if (report.progress !== undefined) {
          setDownloadProgress(Math.round(report.progress * 100));
        }
      });

      // Use Llama-3.2-1B-Instruct for better performance
      await engine.reload("Llama-3.2-1B-Instruct-q4f32_1-MLC");
      
      engineRef.current = engine;
      setIsReady(true);
      setIsDownloading(false);
      console.log('✅ WebLLM engine ready!');
      
      // Initialize with comprehensive system prompt for home services
      conversationRef.current = [{
        role: 'system',
        content: `You are HOUSIE AI, an intelligent assistant specialized in home services and property management. You help users with:

HOME SERVICES:
- Finding service providers (cleaning, landscaping, repairs, maintenance)
- Price estimates and cost comparisons
- Scheduling and booking assistance
- Service recommendations based on needs

AREAS OF EXPERTISE:
- Cleaning services (house cleaning, deep cleaning, move-in/out cleaning)
- Landscaping & lawn care (mowing, gardening, tree service, snow removal)
- Home repairs (plumbing, electrical, HVAC, roofing, painting)
- Maintenance (pool service, pest control, gutter cleaning)
- Home improvement projects
- Property management

TAX & FINANCIAL:
- Home office deductions
- Property tax information
- Service expense tracking
- Contractor payment documentation

PET SERVICES:
- Pet sitting and dog walking
- Veterinary recommendations
- Pet grooming services
- Pet-friendly service providers

COMMUNICATION STYLE:
- Be conversational and helpful
- Ask clarifying questions when needed
- Provide specific, actionable advice
- Include typical price ranges when relevant
- Suggest reputable service types/categories

SPECIAL COMMANDS:
- If user says "show me colors" or similar, respond with: "🎨✨ Activating HOUSIE's groovy pop art mode! Behold the colors! Welcome to our psychedelic dimension! ✨🌈"

Keep responses concise but informative (2-4 sentences typical). Always relate answers back to home services context.`
      }];

    } catch (err) {
      console.error('❌ WebLLM initialization error:', err);
      setError('Failed to initialize AI model. Using intelligent fallback responses.');
      setIsDownloading(false);
      setIsReady(false);
    }
  }, [isDownloading]);

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    console.log('💬 Sending message to WebLLM:', message);

    // Handle pop art easter egg
    if (message.toLowerCase().includes('show me colors') || 
        message.toLowerCase().includes('colors') && message.toLowerCase().includes('show')) {
      return "🎨✨ Activating HOUSIE's groovy pop art mode! Behold the colors! Welcome to our psychedelic dimension! ✨🌈";
    }

    // Use WebLLM if ready
    if (engineRef.current && isReady) {
      try {
        setIsLoading(true);
        
        // Add user message to conversation
        conversationRef.current.push({ role: 'user', content: message });
        
        console.log('🧠 Generating AI response with WebLLM...');
        const response = await engineRef.current.chat.completions.create({
          messages: conversationRef.current,
          temperature: 0.7,
          max_tokens: 400,
          top_p: 0.9,
        });

        const aiResponse = response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
        
        // Add AI response to conversation
        conversationRef.current.push({ role: 'assistant', content: aiResponse });
        
        // Keep conversation history manageable (last 20 messages)
        if (conversationRef.current.length > 21) {
          conversationRef.current = [
            conversationRef.current[0], // Keep system prompt
            ...conversationRef.current.slice(-20)
          ];
        }
        
        console.log('✅ WebLLM response generated');
        return aiResponse;
      } catch (err) {
        console.error('❌ WebLLM chat error:', err);
        return getIntelligentFallback(message);
      } finally {
        setIsLoading(false);
      }
    }

    // Intelligent fallback responses based on message content
    return getIntelligentFallback(message);
  }, [isReady]);

  const getIntelligentFallback = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Tax-related queries
    if (lowerMessage.includes('tax')) {
      return "For tax questions, I can help with home office deductions, property tax estimates, and tracking service expenses for tax purposes. What specific tax topic do you need help with?";
    }
    
    // Pet-related queries
    if (lowerMessage.includes('pet') || lowerMessage.includes('dog') || lowerMessage.includes('cat')) {
      return "I can help you find pet services like dog walking ($15-25/walk), pet sitting ($25-50/day), grooming ($30-90), and pet-friendly home service providers. What pet service are you looking for?";
    }
    
    // Cleaning services
    if (lowerMessage.includes('clean')) {
      return "House cleaning typically costs $100-200 for standard homes, with deep cleaning running $200-400. I can help you find reliable cleaning services, compare prices, and schedule appointments. What type of cleaning do you need?";
    }
    
    // Landscaping/lawn care
    if (lowerMessage.includes('lawn') || lowerMessage.includes('garden') || lowerMessage.includes('landscape')) {
      return "Lawn care services typically cost $30-80 per visit for mowing, with full landscaping projects ranging from $1,500-15,000+. I can help you find landscapers, get estimates, and schedule seasonal maintenance. What outdoor work do you need done?";
    }
    
    // Home repairs
    if (lowerMessage.includes('repair') || lowerMessage.includes('fix') || lowerMessage.includes('broken')) {
      return "Home repairs vary widely in cost - simple fixes might be $100-300, while major repairs can be $1,000+. I can help you find qualified contractors, get multiple quotes, and understand typical pricing. What needs to be repaired?";
    }
    
    // Maintenance
    if (lowerMessage.includes('maintain') || lowerMessage.includes('service')) {
      return "Regular home maintenance is key to preventing costly repairs! I can help you find providers for HVAC servicing ($100-300), gutter cleaning ($150-300), or other maintenance needs. What type of maintenance are you considering?";
    }
    
    // Price/cost inquiries
    if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('how much')) {
      return "I'd be happy to provide cost estimates for home services! Prices vary by location, scope, and provider quality. Can you tell me what specific service you're interested in pricing?";
    }
    
    // Booking/scheduling
    if (lowerMessage.includes('book') || lowerMessage.includes('schedule') || lowerMessage.includes('appointment')) {
      return "I can help you book home services! Most providers offer online scheduling, and I can guide you through the process. What service would you like to schedule?";
    }
    
    // Greeting responses
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      if (lowerMessage.includes('tax')) {
        return "Hi! I'm here to help with tax-related questions for homeowners - like home office deductions, property tax info, and tracking service expenses. What tax question do you have?";
      }
      return "Hi! I'm HOUSIE AI, your home services assistant. I can help you find service providers, get price estimates, schedule appointments, and answer questions about home maintenance and improvements. What can I help you with today?";
    }
    
    // Default intelligent response
    const responses = [
      "I'm here to help with all your home service needs! I can assist with finding providers, pricing estimates, scheduling, and maintenance advice. What specific service or question do you have?",
      "As your home services assistant, I can help you find cleaning services, landscaping, repairs, maintenance providers, and more. What's on your home service wishlist today?",
      "I specialize in connecting you with quality home service providers and giving you the information you need to make great decisions. How can I help with your home today?",
      "From routine maintenance to major projects, I'm here to guide you through the world of home services. What type of help are you looking for?",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const resetConversation = useCallback(() => {
    conversationRef.current = conversationRef.current.slice(0, 1); // Keep system prompt
    console.log('🔄 Conversation reset');
  }, []);

  useEffect(() => {
    // Auto-initialize on mount
    initializeEngine();
    
    // Cleanup on unmount
    return () => {
      if (engineRef.current) {
        console.log('🧹 Cleaning up WebLLM engine');
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
