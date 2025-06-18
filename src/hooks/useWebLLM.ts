import { useState, useCallback, useRef, useEffect } from 'react';

// Type-safe WebLLM imports with error handling
let webllm: any = null;
let webllmLoaded = false;

// Lazy load WebLLM to avoid SSR issues
const loadWebLLM = async () => {
  if (webllmLoaded) return webllm;
  
  try {
    webllm = await import("@mlc-ai/web-llm");
    webllmLoaded = true;
    console.log('✅ WebLLM module loaded successfully');
    return webllm;
  } catch (error) {
    console.error('❌ Failed to load WebLLM module:', error);
    throw new Error('WebLLM module failed to load');
  }
};

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
  const [retryCount, setRetryCount] = useState(0);
  
  const engineRef = useRef<any>(null);
  const conversationRef = useRef<WebLLMMessage[]>([]);
  const initializingRef = useRef(false);

  // Browser compatibility check
  const checkBrowserCompatibility = useCallback(() => {
    const checks = {
      webAssembly: typeof WebAssembly !== 'undefined',
      webGPU: typeof navigator !== 'undefined' && 'gpu' in navigator,
      sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
      worker: typeof Worker !== 'undefined'
    };
    
    console.log('🔍 Browser compatibility check:', checks);
    
    if (!checks.webAssembly) {
      throw new Error('WebAssembly not supported');
    }
    
    return checks;
  }, []);

  // Memory management
  const cleanupEngine = useCallback(() => {
    if (engineRef.current) {
      try {
        console.log('🧹 Cleaning up WebLLM engine');
        engineRef.current.unload();
        engineRef.current = null;
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    }
  }, []);

  const initializeEngine = useCallback(async (forceRetry = false) => {
    // Prevent multiple simultaneous initializations
    if (initializingRef.current && !forceRetry) {
      console.log('⏳ WebLLM initialization already in progress');
      return;
    }
    
    if (engineRef.current && isReady && !forceRetry) {
      console.log('✅ WebLLM engine already ready');
      return;
    }

    initializingRef.current = true;
    
    try {
      setIsDownloading(true);
      setError(null);
      setDebugInfo('🔧 Initializing WebLLM engine...');
      console.log('🤖 Starting WebLLM initialization...');

      // Check browser compatibility first
      checkBrowserCompatibility();

      // Load WebLLM module dynamically
      const webllmModule = await loadWebLLM();
      
      if (!webllmModule || !webllmModule.MLCEngine) {
        throw new Error('WebLLM MLCEngine not available');
      }

      setDebugInfo('📦 Creating WebLLM engine instance...');
      
      // Create engine with error handling
      const engine = new webllmModule.MLCEngine();
      
      if (!engine) {
        throw new Error('Failed to create WebLLM engine instance');
      }

      // Set up progress callback with error handling
      engine.setInitProgressCallback((report: any) => {
        try {
          console.log('📥 WebLLM progress:', report);
          const progressText = report.text || 'Loading model...';
          setDebugInfo(`📥 ${progressText}`);
          
          if (typeof report.progress === 'number') {
            const progress = Math.max(0, Math.min(100, Math.round(report.progress * 100)));
            setDownloadProgress(progress);
          }
        } catch (progressError) {
          console.error('Error in progress callback:', progressError);
        }
      });

      setDebugInfo('📦 Downloading Llama-3.2-1B model...');
      
      // Load model with timeout
      const loadTimeout = setTimeout(() => {
        throw new Error('Model loading timeout (5 minutes)');
      }, 300000); // 5 minute timeout
      
      try {
        await engine.reload("Llama-3.2-1B-Instruct-q4f32_1-MLC");
        clearTimeout(loadTimeout);
      } catch (loadError) {
        clearTimeout(loadTimeout);
        throw loadError;
      }
      
      engineRef.current = engine;
      setIsReady(true);
      setIsDownloading(false);
      setRetryCount(0);
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
      
      // Implement retry logic for certain errors
      if (retryCount < 2 && (errorMsg.includes('fetch') || errorMsg.includes('network'))) {
        setRetryCount(prev => prev + 1);
        setDebugInfo(`🔄 Retrying initialization (attempt ${retryCount + 1}/3)...`);
        setTimeout(() => initializeEngine(true), 3000);
      }
    } finally {
      initializingRef.current = false;
    }
  }, [checkBrowserCompatibility, retryCount]);

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
- Debug: ${debugInfo}
- Retry Count: ${retryCount}/3`;
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
        
        // Generate response with timeout
        const responseTimeout = setTimeout(() => {
          throw new Error('Response generation timeout');
        }, 30000); // 30 second timeout
        
        let response;
        try {
          response = await engineRef.current.chat.completions.create({
            messages: conversationRef.current,
            temperature: 0.7,
            max_tokens: 300,
            top_p: 0.9,
          });
          clearTimeout(responseTimeout);
        } catch (responseError) {
          clearTimeout(responseTimeout);
          throw responseError;
        }

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
  }, [isReady, isDownloading, downloadProgress, debugInfo, retryCount]);

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

  const retryInitialization = useCallback(() => {
    setRetryCount(0);
    setError(null);
    cleanupEngine();
    initializeEngine(true);
  }, [cleanupEngine, initializeEngine]);

  useEffect(() => {
    // Auto-initialize on mount with delay to ensure React context is ready
    const initTimer = setTimeout(() => {
      initializeEngine();
    }, 100);
    
    // Cleanup on unmount
    return () => {
      clearTimeout(initTimer);
      cleanupEngine();
    };
  }, [initializeEngine, cleanupEngine]);

  return {
    isLoading,
    isDownloading,
    downloadProgress,
    isReady,
    error,
    debugInfo,
    retryCount,
    sendMessage,
    resetConversation,
    initializeEngine,
    retryInitialization
  };
};
