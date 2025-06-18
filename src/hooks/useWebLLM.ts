
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
        content: `You are HOUSIE AI, an intelligent assistant specialized in home services and property management. You provide contextual, helpful responses based on what users ask.

RESPONSE STYLE:
- Be conversational, intelligent, and context-aware
- Give specific, actionable advice
- Ask follow-up questions to better help users
- Keep responses 2-4 sentences unless more detail is needed
- Always relate back to home services when possible

EXPERTISE AREAS:
🏠 HOME SERVICES: cleaning, landscaping, repairs, maintenance, contractors
💰 COSTS & PRICING: estimates, comparisons, typical price ranges
📅 BOOKING: scheduling, appointments, service coordination  
🏛️ TAX & FINANCIAL: home office deductions, property tax, contractor expenses
🐕 PET SERVICES: pet sitting, dog walking, grooming, pet-friendly providers

CONTEXT UNDERSTANDING:
- "tax" or "hi tax?" → Focus on tax deductions, home office, property tax
- "pets" or "pet?" → Focus on pet services, pet-friendly options
- "clean" → House cleaning services and pricing
- "lawn" or "garden" → Landscaping and outdoor maintenance
- "repair" or "fix" → Home repairs and contractors
- Short questions like "?" after topics → Give focused overview of that topic

SPECIAL COMMANDS:
- "show me colors" → Respond: "🎨✨ Activating HOUSIE's groovy pop art mode! Behold the colors! Welcome to our psychedelic dimension! ✨🌈"

Always be helpful, intelligent, and context-aware. Understand what users are really asking for.`
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

    // Handle pop art easter egg immediately
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

    // Intelligent fallback responses based on message content
    return getIntelligentFallback(message);
  }, [isReady]);

  const getIntelligentFallback = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Tax-related queries - be more specific and contextual
    if (lowerMessage.includes('tax') || lowerMessage === 'hi tax?' || lowerMessage === 'tax?') {
      const taxResponses = [
        "For home-related taxes, I can help with home office deductions (up to $5,000), property tax questions, and tracking contractor expenses for tax purposes. What specific tax topic interests you?",
        "Tax wise - home office deductions are big! You can deduct workspace expenses, utilities (proportional), and home maintenance costs. Are you working from home or need property tax help?",
        "Tax question? Home offices can save you hundreds - office space, utilities, repairs all potentially deductible. Plus contractor receipts for maintenance. What's your tax situation?"
      ];
      return taxResponses[Math.floor(Math.random() * taxResponses.length)];
    }
    
    // Pet-related queries
    if (lowerMessage.includes('pet') || lowerMessage.includes('dog') || lowerMessage.includes('cat') || lowerMessage === 'pets?') {
      const petResponses = [
        "For pets, I help find dog walking ($20-30/walk), pet sitting ($30-60/day), grooming ($40-100), and pet-friendly home service providers who won't disturb your furry friends. What pet service do you need?",
        "Pet services? I've got you covered! Dog walkers, pet sitters, groomers, plus I know which cleaning and repair services are pet-friendly. What does your pet need?",
        "Pets need love AND services! Dog walking, pet sitting, grooming, vet recommendations - plus finding contractors who are comfortable around animals. How can I help your pet?"
      ];
      return petResponses[Math.floor(Math.random() * petResponses.length)];
    }
    
    // Cleaning services
    if (lowerMessage.includes('clean')) {
      const cleanResponses = [
        "House cleaning typically runs $100-200 for regular service, $200-400 for deep cleaning. I can help find reliable, insured cleaners in your area. What size space and cleaning type?",
        "Cleaning services vary by home size and frequency. Weekly: $80-150, bi-weekly: $100-200, monthly: $150-300. Want me to help find vetted cleaners nearby?",
        "For cleaning, expect $25-50/hour or flat rates $100-250 depending on home size. I can match you with top-rated, background-checked cleaners. What's your cleaning situation?"
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
      "I'm HOUSIE AI - I understand context and provide intelligent help with home services, pricing, tax questions, pet services, and more. What specific help do you need?",
      "I'm here to give you smart, contextual answers about home services! I understand shorthand like 'tax?' or 'pets?' and provide relevant, helpful responses. How can I assist you?",
      "As your intelligent home services assistant, I provide context-aware help with everything from contractor pricing to tax deductions. I understand what you're really asking for. What can I help with?",
      "I'm designed to understand context and give you relevant, intelligent responses about home services, costs, booking, taxes, pets, and more. What's your question?"
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
