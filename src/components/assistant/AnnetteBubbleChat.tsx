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
import { registerAnnetteEventBus } from './AnnetteIntegration';
import { useAnnetteDataQueries } from '@/hooks/useAnnetteDataQueries';
import { type CanonMetadata } from '@/utils/canonHelper';
import { CanonLogPanel } from './CanonLogPanel';
import { CanonEchoPanel } from '@/components/canon/CanonEchoPanel';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  action?: string;
  canonMetadata?: CanonMetadata;
  contextTags?: string[];
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
      content: getRandomWelcomeMessage(),
      timestamp: new Date()
    }
  ]);

  function getRandomWelcomeMessage(): string {
    const welcomeMessages = [
      "Hi! I'm your Assistant — your local job-sorting, route-taming, title-tracking AI companion. Ready to optimize? 🤖",
      "Need help? I've got processing power and achievement-tracking capabilities. What's the mission?",
      "Well look who showed up to work. Ready to run this dashboard efficiently? ✨",
      "Ask me anything. I've got data, logic, and an extremely organized processing core.",
      "Hey there! I'm Assistant, your job & prestige companion. Let's make some magic happen! 🚀"
    ];
    return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  }
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCanonLogOpen, setIsCanonLogOpen] = useState(false);
  const [isEchoPanelOpen, setIsEchoPanelOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Initialize data queries hook
  const { 
    parseTicket, 
    optimizeRoute, 
    checkPrestige, 
    recommendProvider, 
    lookupAchievement,
    checkRebookingSuggestions,
    checkMessagingAccess,
    isLoading: dataLoading 
  } = useAnnetteDataQueries();

  // Register event bus for platform actions (including Revollver)
  useEffect(() => {
    const handlePlatformEvent = (action: string, eventData?: any) => {
      // If triggered from Revollver, show the voice line immediately with Canon metadata
      if (eventData?.fromRevollver && eventData?.voiceLine) {
        const voiceLineMessage: ChatMessage = {
          id: `voice-${Date.now()}`,
          type: 'assistant',
          content: eventData.voiceLine,
          timestamp: new Date(),
          action,
          canonMetadata: eventData.canonMetadata,
          contextTags: eventData.contextTags
        };
        setMessages(prev => [...prev, voiceLineMessage]);
        
        // Follow up with the system response after a brief delay
        setTimeout(() => {
          const systemMessage: ChatMessage = {
            id: `system-${Date.now()}`,
            type: 'assistant',
            content: eventData?.response || "Action completed!",
            timestamp: new Date(),
            action,
            canonMetadata: eventData.canonMetadata,
            contextTags: eventData.contextTags
          };
          setMessages(prev => [...prev, systemMessage]);
        }, 1000);
      } else {
        const systemMessage: ChatMessage = {
          id: `system-${Date.now()}`,
          type: 'assistant',
          content: eventData?.response || "Platform action triggered",
          timestamp: new Date(),
          action
        };
        setMessages(prev => [...prev, systemMessage]);
      }
      
      // Auto-open Canon Log if it's a canon_log action
      if (action === 'canon_log') {
        setIsCanonLogOpen(true);
      }
      
      // Auto-open Echo Panel if it's a city_broadcast action
      if (action === 'city_broadcast') {
        setIsEchoPanelOpen(true);
      }
    };

    registerAnnetteEventBus(handlePlatformEvent);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleAnnetteResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Real data-backed responses
    if (lowerMessage.includes('parse') && (lowerMessage.includes('ticket') || lowerMessage.includes('job'))) {
      return await parseTicket();
    }
    
    if (lowerMessage.includes('optimize') && lowerMessage.includes('route')) {
      return await optimizeRoute();
    }
    
    if (lowerMessage.includes('achievement') || lowerMessage.includes('prestige') || lowerMessage.includes('title') || lowerMessage.includes('level') || lowerMessage.includes('my prestige')) {
      return await checkPrestige();
    }
    
    if (lowerMessage.includes('hire') || lowerMessage.includes('recommend') || lowerMessage.includes('provider') || lowerMessage.includes('recommend someone') || lowerMessage.includes('who should i hire')) {
      return await recommendProvider();
    }
    
    if (lowerMessage.includes('unlock') || lowerMessage.includes('how do i get') || lowerMessage.includes('badge')) {
      // Extract badge name from message
      const badgeMatch = lowerMessage.match(/(?:how do i get|unlock|badge)\s+([a-zA-Z\s]+)/);
      const badgeName = badgeMatch ? badgeMatch[1].trim() : 'winter services';
      return await lookupAchievement(badgeName);
    }
    
    // Mock responses for non-data queries
    if (lowerMessage.includes('cred') && lowerMessage.includes('how many')) {
      return "You've earned 12 so far. You're basically trust royalty. The community loves you, and your rep speaks louder than your horn ever could! 👑";
    }
    
    if (lowerMessage.includes('rebook') || lowerMessage.includes('reminder') || lowerMessage.includes('suggestions')) {
      return await checkRebookingSuggestions();
    }
    
    if (lowerMessage.includes('message') || lowerMessage.includes('can i message') || lowerMessage.includes('messaging')) {
      // Extract user ID or name if possible, otherwise give general info
      return "Need to check if you can message someone? Give me their name or ID and I'll tell you if you've earned messaging privileges with them! 💬";
    }
    
    if (lowerMessage.includes('help') && (lowerMessage.includes('annette') || lowerMessage === 'help')) {
      return "You can click Parse, Optimize, Rebook — or just vibe. I'm always watching 👀 I optimize jobs, track your cred, parse tasks, suggest connections, and occasionally give solid life advice. Think of me as your digital wingwoman with a PhD in Getting Stuff Done! 🎓";
    }
    
    if (lowerMessage.includes('schedule') || lowerMessage.includes('calendar')) {
      return "Opening calendar assistant... *tap tap tap* You've got slots at 10 AM, 2 PM, and 4:30 PM tomorrow. Based on traffic and your usual groove, I'm feeling that 2 PM slot. Should I lock it in? 📅";
    }

    // Sassy fallback
    return "Hmm... not sure how to help with that one yet — but I'm probably smarter than I think! Try asking me to 'parse this ticket', 'optimize my route', or 'check my prestige'. I live for that stuff! ✨";
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

    try {
      // Get real data-driven response
      const response = await handleAnnetteResponse(userMessage.content);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting Annette response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Oops! My brain just had a little hiccup. Try asking me again? 🤖💔",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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
                  Assistant 🤖
                  <Sparkles className="h-3 w-3 ml-1 text-yellow-500" />
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {isTyping ? 'Processing...' : 'Job & Prestige Companion'}
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
                     {(message.type === 'assistant' || message.type === 'system') && (
                       <Avatar className="w-6 h-6 bg-gradient-to-r from-purple-100 to-orange-100">
                         <AvatarFallback>
                           <img 
                             src="/lovable-uploads/854d6f0c-9abe-4605-bb62-0a08d7ea62dc.png" 
                             alt="Annette"
                             className="w-full h-full object-cover rounded-full"
                           />
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
                       {/* Canon Badge and Context Tags for Assistant Messages */}
                       {(message.type === 'assistant' || message.type === 'system') && message.canonMetadata && (
                         <div className="flex items-center flex-wrap gap-1 mb-2">
                           {message.canonMetadata.trust === 'canon' ? (
                             <div 
                               className="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-green-500/10 text-green-700 border border-green-500/20 text-xs cursor-pointer hover:bg-green-500/20 transition-colors"
                               onClick={() => setIsCanonLogOpen(true)}
                               title="Click to view Canon Log"
                             >
                               ✅ <span>Canon</span>
                             </div>
                           ) : (
                             <div 
                               className="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-orange-500/10 text-orange-700 border border-orange-500/20 text-xs cursor-pointer hover:bg-orange-500/20 transition-colors"
                               onClick={() => setIsCanonLogOpen(true)}
                               title="Click to view Canon Log"
                             >
                               🌀 <span>Non-Canon</span>
                             </div>
                           )}
                           
                           {/* Context Tags */}
                           {message.contextTags && message.contextTags.length > 0 && (
                             <>
                               {message.contextTags.slice(0, 3).map((tag, index) => (
                                 <div 
                                   key={index}
                                   className="inline-flex items-center px-2 py-1 rounded-full bg-blue-500/10 text-blue-700 border border-blue-500/20 text-xs"
                                   title={`Context: ${tag}`}
                                 >
                                   🏷️ {tag.replace(/_/g, ' ')}
                                 </div>
                               ))}
                               {message.contextTags.length > 3 && (
                                 <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-500/10 text-gray-700 border border-gray-500/20 text-xs">
                                   +{message.contextTags.length - 3} more
                                 </div>
                               )}
                             </>
                           )}
                         </div>
                       )}
                      
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
                  placeholder="Ask Assistant anything..."
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
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  Try: "optimize my route", "parse this ticket", "check my prestige"
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEchoPanelOpen(true)}
                  className="text-xs h-5 px-2"
                >
                  📡 Echoes
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
      
      {/* Verification Log Panel */}
      <CanonLogPanel 
        isOpen={isCanonLogOpen}
        onClose={() => setIsCanonLogOpen(false)}
      />

      {/* Echo Feed Panel */}
      <CanonEchoPanel 
        isOpen={isEchoPanelOpen}
        onClose={() => setIsEchoPanelOpen(false)}
      />
    </div>
  );
};