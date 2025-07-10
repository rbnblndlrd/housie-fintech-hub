import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Loader2, Mic, MicOff, Coins } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAICredits } from '@/hooks/useAICredits';
import { usePageContext } from '@/hooks/usePageContext';
import { useAnnetteChat } from '@/hooks/useAnnetteChat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AnnetteConversationProps {
  sessionId: string;
  context?: {
    type?: 'route' | 'bid' | 'profile' | 'cluster' | 'booking';
    data?: any;
  };
}

const AnnetteConversation: React.FC<AnnetteConversationProps> = ({ 
  sessionId,
  context 
}) => {
  const { user } = useAuth();
  const { credits, isLoading: creditsLoading, refreshCredits } = useAICredits();
  const pageContext = usePageContext();
  const { messages: annetteMessages, sendMessage: sendAnnetteMessage, isTyping } = useAnnetteChat();
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Transform Annette messages to local Message format
  const messages: Message[] = annetteMessages.map(msg => ({
    id: msg.id,
    role: msg.message_type,
    content: msg.content,
    timestamp: new Date(msg.created_at)
  }));

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add context-aware greeting message using the hook's setMessages
    if (messages.length === 0) {
      const contextGreeting = context?.type ? getContextGreeting(context.type) : pageContext.annettePersonality;
      const welcomeMessage = {
        id: 'welcome',
        session_id: sessionId,
        message_type: 'assistant' as const,
        content: `Hi! I'm Annette, your HOUSIE assistant. ${contextGreeting}`,
        created_at: new Date().toISOString()
      };
      // Note: We'll let useAnnetteChat handle the initial greeting
    }
  }, [context, pageContext, messages.length, sessionId]);

  const getContextGreeting = (contextType: string): string => {
    switch (contextType) {
      case 'route':
        return "Hi! I'm Annette, your HOUSIE assistant. I can help you optimize your route, reorder stops, or suggest better scheduling. What would you like to do?";
      case 'bid':
        return "Hi! I'm Annette. I'm here to help you plan the perfect bid strategy. I can assist with pricing, team coordination, and scheduling. How can I help?";
      case 'profile':
        return "Hi! I'm Annette. I can help you optimize your HOUSIE profile, suggest improvements, and provide feedback on your service descriptions. What would you like to work on?";
      case 'cluster':
        return "Hi! I'm Annette. I can help you manage your cluster, coordinate with participants, and optimize group bookings. How can I assist?";
      case 'booking':
        return "Hi! I'm Annette. I can help clarify booking details, suggest improvements, and answer any questions about your service request. What do you need help with?";
      default:
        return "Hi! I'm Annette, your HOUSIE AI assistant. I can help with route planning, bid strategies, profile optimization, and much more. How can I assist you today?";
    }
  };

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim();
    if (!content || isTyping) return;

    // Use the proper useAnnetteChat hook which handles credits, rate limiting, and emergency controls
    await sendAnnetteMessage(content, sessionId, context, pageContext);
    setInputValue('');
    refreshCredits();
  };

  const handleVoiceInput = async () => {
    if (!credits || credits.balance < 1) {
      // The useAnnetteChat hook will handle credit errors automatically
      return;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        
        // Auto-send voice messages
        sendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasCredits = credits && credits.balance > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header with Credits */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-orange-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 bg-gradient-to-r from-purple-600 to-orange-500">
              <AvatarFallback>
                <Bot className="h-5 w-5 text-white" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                Annette
                <span className="text-sm text-purple-600">AI Assistant</span>
              </h3>
              <p className="text-xs text-gray-600">
                {isTyping ? 'Thinking...' : 'Ready to help with HOUSIE'}
              </p>
            </div>
          </div>
          
          {/* Credits Display */}
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-orange-500" />
            <Badge variant={hasCredits ? "default" : "destructive"} className="text-xs">
              {creditsLoading ? '...' : credits?.balance || 0} credits
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-100 to-orange-100">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-purple-600" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gradient-to-r from-gray-100 to-purple-50 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              {message.role === 'user' && (
                <Avatar className="w-8 h-8 bg-blue-100">
                  <AvatarFallback>
                    <User className="h-4 w-4 text-blue-600" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-100 to-orange-100">
                <AvatarFallback>
                  <Bot className="h-4 w-4 text-purple-600" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gradient-to-r from-gray-100 to-purple-50 rounded-lg px-3 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={hasCredits ? "Ask Annette anything..." : "Need credits to chat..."}
            disabled={isTyping || !hasCredits}
            className="flex-1"
          />
          
          {/* Voice Input Button */}
          <Button
            onClick={handleVoiceInput}
            disabled={isTyping || !hasCredits || isListening}
            size="sm"
            variant="outline"
            className="px-3"
          >
            {isListening ? (
              <MicOff className="h-4 w-4 animate-pulse text-red-500" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            onClick={() => sendMessage()}
            disabled={!inputValue.trim() || isTyping || !hasCredits}
            size="sm"
            className="px-3"
          >
            {isTyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            1 credit per message • Voice commands supported
          </p>
          {!hasCredits && (
            <p className="text-xs text-orange-600 font-medium">
              Earn credits by completing services!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnetteConversation;