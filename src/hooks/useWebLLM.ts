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
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  const engineRef = useRef<webllm.MLCEngineInterface | null>(null);
  const conversationRef = useRef<WebLLMMessage[]>([]);

  const initializeEngine = useCallback(async () => {
    if (engineRef.current || isDownloading) return;

    try {
      setIsDownloading(true);
      setError(null);
      setDebugInfo('🤖 Starting WebLLM initialization...');
      console.log('🤖 Initializing WebLLM engine...');

      // Check if WebLLM is supported
      if (typeof window !== 'undefined' && !window.WebAssembly) {
        throw new Error('WebAssembly not supported in this browser');
      }

      const engine = new webllm.MLCEngine();
      
      engine.setInitProgressCallback((report) => {
        console.log('📥 WebLLM progress:', report);
        setDebugInfo(`📥 ${report.text || 'Loading model...'}`);
        if (report.progress !== undefined) {
          setDownloadProgress(Math.round(report.progress * 100));
        }
      });

      setDebugInfo('📦 Downloading Llama-3.2-1B model...');
      
      // Use a smaller, faster model for better performance
      await engine.reload("Llama-3.2-1B-Instruct-q4f32_1-MLC");
      
      engineRef.current = engine;
      setIsReady(true);
      setIsDownloading(false);
      setDebugInfo('✅ WebLLM ready and operational!');
      console.log('✅ WebLLM engine ready and operational!');
      
      // Initialize with system prompt
      conversationRef.current = [{
        role: 'system',
        content: `You are HOUSIE AI, an intelligent assistant for home services. You understand context and provide helpful responses.

TESTING COMMANDS:
- "test webllm" → Respond: "✅ WebLLM is working perfectly! Local AI is operational."
- "webllm status" → Report your operational status

CORE FUNCTIONALITY:
🏠 HOME SERVICES: cleaning, landscaping, repairs, maintenance
💰 PRICING: cost estimates and comparisons  
📅 BOOKING: scheduling assistance
🐕 PET SERVICES: pet care, pet-friendly providers
🏛️ TAX HELP: home office deductions, property tax

RESPONSE STYLE:
- Be conversational and context-aware
- Provide specific, actionable advice
- Keep responses 2-4 sentences unless more detail needed
- Always relate back to home services when possible

SPECIAL COMMANDS:
- "show me colors" → Activate pop art mode response`
      }];

    } catch (err) {
      console.error('❌ WebLLM initialization error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown WebLLM error';
      setError(`WebLLM failed: ${errorMsg}`);
      setDebugInfo(`❌ WebLLM Error: ${errorMsg}`);
      setIsDownloading(false);
      setIsReady(false);
    }
  }, [isDownloading]);

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase().trim();
    
    console.log('💬 Sending message to WebLLM:', message);
    console.log('🔍 WebLLM Status - Ready:', isReady, 'Engine:', !!engineRef.current);

    // Handle test commands immediately
    if (lowerMessage === 'test webllm') {
      if (engineRef.current && isReady) {
        console.log('✅ WebLLM test command - engine is ready!');
        return "✅ WebLLM is working perfectly! Local AI is operational. 🤖🚀";
      } else {
        console.log('❌ WebLLM test command - engine not ready');
        return "❌ WebLLM is not ready yet. Status: " + (isDownloading ? "downloading..." : "not initialized");
      }
    }

    if (lowerMessage === 'webllm status') {
      return `🤖 WebLLM Status Report:
- Ready: ${isReady ? '✅' : '❌'}
- Engine: ${engineRef.current ? '✅' : '❌'}
- Downloading: ${isDownloading ? '📥' : '✅'}
- Progress: ${downloadProgress}%
- Debug: ${debugInfo}`;
    }

    // Handle pop art easter egg
    if (lowerMessage.includes('show me colors')) {
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
          max_tokens: 300,
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
        
        console.log('✅ WebLLM response generated:', aiResponse);
        return aiResponse;
      } catch (err) {
        console.error('❌ WebLLM chat error:', err);
        return getIntelligentFallback(message);
      } finally {
        setIsLoading(false);
      }
    }

    // Intelligent fallback responses
    console.log('⚠️ Using fallback - WebLLM not ready');
    return getIntelligentFallback(message);
  }, [isReady, isDownloading, downloadProgress, debugInfo]);

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
      const lawnResponses = [
        "Lawn care runs $30-80 per visit for mowing, $150-400 for full landscaping service. Seasonal cleanups $200-600. I can help find licensed landscapers. What outdoor work do you need?",
        "Landscaping costs vary widely - basic mowing $40-70, full service $200-500/month, major projects $2,000-20,000+. Tell me about your yard and I'll help estimate costs and find pros.",
        "Yard work pricing: mowing $35-65, leaf cleanup $150-350, garden maintenance $50-150/visit. I know reliable landscapers who do quality work. What's your outdoor priority?"
      ];
      return lawnResponses[Math.floor(Math.random() * lawnResponses.length)];
    }
    
    // Home repairs
    if (lowerMessage.includes('repair') || lowerMessage.includes('fix') || lowerMessage.includes('broken')) {
      const repairResponses = [
        "Home repairs range from $150-500 for simple fixes to $1,000+ for major work. I help find licensed contractors, get multiple quotes, and avoid scams. What needs fixing?",
        "Repair costs depend on complexity - plumbing $200-800, electrical $150-500, HVAC $300-1,500. I can connect you with vetted, insured contractors. What's broken?",
        "For repairs, always get 2-3 quotes! Simple fixes $100-400, complex work $500-3,000+. I help find reliable contractors with good reviews and proper licensing. What repair do you need?"
      ];
      return repairResponses[Math.floor(Math.random() * repairResponses.length)];
    }
    
    // Price/cost inquiries
    if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('how much')) {
      const priceResponses = [
        "Pricing varies by service and location! Cleaning $100-300, lawn care $30-80/visit, repairs $150-1,500+. I provide accurate local estimates based on your specific needs. What service interests you?",
        "Happy to help with pricing! I track local rates and can give you realistic cost ranges plus connect you with providers who offer competitive rates. What service pricing do you need?",
        "Cost estimates are my specialty! I know current market rates, seasonal pricing, and can help you budget effectively. Tell me what service you're considering and I'll break down the costs."
      ];
      return priceResponses[Math.floor(Math.random() * priceResponses.length)];
    }
    
    // Greeting responses
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      const greetingResponses = [
        "Hi! I'm HOUSIE AI, your intelligent home services assistant. I understand context and can help with everything from tax deductions to pet services. What can I help you with?",
        "Hello! I'm here to help with home services, pricing, bookings, and more. I'm context-aware, so feel free to ask things like 'tax?' or 'pets?' and I'll know what you mean. How can I assist?",
        "Hey there! I'm HOUSIE AI - I understand what you're really asking for and provide intelligent responses about home services, costs, contractors, and more. What's on your mind?"
      ];
      return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
    }
    
    // Default intelligent response
    const responses = [
      `🤖 HOUSIE AI here! I'm your intelligent home services assistant. ${isReady ? '(WebLLM Ready)' : '(Fallback Mode)'} I help with cleaning, repairs, costs, tax questions, pet services, and more. What can I help with?`,
      `👋 Hi! I understand context and provide smart answers about home services, pricing, bookings, and more. ${isReady ? '✅ Local AI Active' : '⚠️ Using Fallback'} How can I assist you today?`,
      `🏠 Welcome! I'm context-aware and ready to help with home services, cost estimates, tax deductions, pet care, and booking assistance. ${isReady ? '(Powered by WebLLM)' : '(Intelligent Fallback)'} What's your question?`
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
    debugInfo,
    sendMessage,
    resetConversation,
    initializeEngine
  };
};
