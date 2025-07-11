import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  X, 
  Send, 
  Minimize2, 
  Maximize2, 
  Bot, 
  User, 
  Loader2,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  action?: string;
}

interface AnnetteBubbleChatProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const AnnetteBubbleChat: React.FC<AnnetteBubbleChatProps> = ({
  isOpen,
  onClose,
  className
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm Annette, your HOUSIE AI assistant. I can help you parse tickets, optimize routes, check achievements, and more. What can I do for you?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const simulateAnnetteResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('parse') || lowerMessage.includes('ticket')) {
      return "I'll analyze that ticket for you! Based on the details, this appears to be a high-priority repair job. The customer mentioned urgency, and I recommend scheduling it within the next 24 hours. Would you like me to suggest optimal time slots?";
    }
    
    if (lowerMessage.includes('optimize') || lowerMessage.includes('route')) {
      return "Great! I've analyzed your current route and found 3 optimizations that could save you 45 minutes and 12km of driving. The most efficient order would be: Marie Dubois (9:00 AM), then Jean-Paul Tremblay (10:30 AM), followed by Sophie Martin (1:30 PM). This accounts for traffic patterns and service duration.";
    }
    
    if (lowerMessage.includes('schedule') || lowerMessage.includes('calendar')) {
      return "Opening your scheduling assistant... I can see you have availability tomorrow at 10:00 AM, 2:00 PM, and 4:30 PM. Based on the job type and location, I recommend the 2:00 PM slot for optimal travel time. Should I book it?";
    }
    
    if (lowerMessage.includes('prestige') || lowerMessage.includes('achievement') || lowerMessage.includes('title')) {
      return "You're currently at Technomancer ⚡ level with 87 completed jobs! You're 13 jobs away from reaching 'Crownbreaker' status. Your strongest category is Home Repairs (45 jobs), and you've maintained a 4.8-star rating. Keep up the excellent work!";
    }
    
    if (lowerMessage.includes('provider') || lowerMessage.includes('recommend') || lowerMessage.includes('network')) {
      return "Based on your location and service history, I recommend connecting with Alex Thompson (Sparkmate rank, 3.2km away) who specializes in electrical work, and Marie Claire (Cleanstorm rank, 1.8km away) for cleaning services. Both have excellent ratings and could complement your skill set for crew collaborations.";
    }
    
    if (lowerMessage.includes('rebook') || lowerMessage.includes('reminder')) {
      return "I noticed you typically service Marie Dubois every 3 weeks for furnace maintenance. It's been 18 days since her last appointment - would you like me to send her a friendly reminder about scheduling her next service?";
    }

    // Default response
    return "I understand you need help with that. As your AI assistant, I can help you with ticket parsing, route optimization, scheduling, achievement tracking, and network recommendations. Could you be more specific about what you'd like assistance with?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate processing delay
    setTimeout(() => {
      const response = simulateAnnetteResponse(userMessage.content);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 w-96 h-[500px] transition-all duration-300",
      isMinimized && "h-16",
      className
    )}>
      <Card className="h-full bg-card/95 backdrop-blur-md border-border/20 shadow-2xl">
        {/* Header */}
        <CardHeader className="pb-3 border-b border-border/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-100 to-orange-100">
                <AvatarFallback>
                  <img 
                    src="/lovable-uploads/854d6f0c-9abe-4605-bb62-0a08d7ea62dc.png" 
                    alt="Annette"
                    className="w-full h-full object-cover rounded-full"
                  />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-medium text-foreground flex items-center">
                  Annette
                  <Sparkles className="h-3 w-3 ml-1 text-yellow-500" />
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {isTyping ? 'Thinking...' : 'AI Assistant'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Badge variant="outline" className="text-xs">Beta</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.type === 'assistant' && (
                      <Avatar className="w-6 h-6 bg-gradient-to-r from-purple-100 to-orange-100">
                        <AvatarFallback>
                          <Bot className="h-3 w-3 text-purple-600" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={cn(
                        "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50 text-foreground'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    
                    {message.type === 'user' && (
                      <Avatar className="w-6 h-6 bg-blue-100">
                        <AvatarFallback>
                          <User className="h-3 w-3 text-blue-600" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="w-6 h-6 bg-gradient-to-r from-purple-100 to-orange-100">
                      <AvatarFallback>
                        <Bot className="h-3 w-3 text-purple-600" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <CardContent className="pt-3 border-t border-border/20">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Annette anything..."
                  disabled={isTyping}
                  className="flex-1 bg-muted/30 border-border/20"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  {isTyping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Try asking: "Parse this ticket", "Optimize my route", or "Check my achievements"
              </p>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};