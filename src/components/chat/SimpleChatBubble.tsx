
import React, { useState } from 'react';
import { MessageCircle, X, Send, Users, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/useChat';
import { useAIChat } from '@/hooks/useAIChat';
import { useWebLLM } from '@/hooks/useWebLLM';
import { usePopArt } from '@/contexts/PopArtContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const SimpleChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'ai'>('ai');
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const { totalUnreadCount } = useChat();
  const { messages: aiMessages, sendMessage: sendAIMessage, isTyping } = useAIChat();
  const { 
    sendMessage: sendWebLLMMessage,
    isLoading: webLLMLoading,
    isReady: webLLMReady
  } = useWebLLM();
  const { activatePopArt } = usePopArt();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const messageToSend = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      if (activeTab === 'ai') {
        // Create a new AI session for this conversation
        await sendAIMessage(messageToSend, undefined, activatePopArt, sendWebLLMMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <Button
            onClick={() => setIsOpen(true)}
            className={cn(
              "relative rounded-full w-16 h-16 shadow-lg transition-all duration-300 hover:scale-110",
              "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
              "border-4 border-white dark:border-gray-800"
            )}
          >
            <MessageCircle className="h-7 w-7 text-white" />
            {totalUnreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs font-bold animate-pulse"
              >
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </Badge>
            )}
          </Button>
        ) : (
          /* Chat Panel */
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-96 h-[600px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">HOUSIE Chat</h3>
                  <p className="text-white/80 text-sm">Connect • Communicate • Complete</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="bg-gray-50 dark:bg-gray-800 flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('messages')}
                className={cn(
                  "flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors",
                  activeTab === 'messages'
                    ? "bg-white dark:bg-gray-900 text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                )}
              >
                <Users className="h-4 w-4" />
                Messages
                {totalUnreadCount > 0 && activeTab !== 'messages' && (
                  <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                    {totalUnreadCount}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={cn(
                  "flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors",
                  activeTab === 'ai'
                    ? "bg-white dark:bg-gray-900 text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                )}
              >
                <Bot className="h-4 w-4" />
                AI Assistant
                <Badge variant="outline" className={`text-xs ${
                  webLLMReady ? 'bg-green-50 text-green-700 border-green-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {webLLMReady ? 'WebLLM' : 'Fallback'}
                </Badge>
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {activeTab === 'ai' ? (
                  <>
                    {aiMessages.length === 0 && (
                      <div className="text-center py-8">
                        <Bot className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Hi! I'm HOUSIE AI. Try asking about services, pricing, or type "test webllm"!
                        </p>
                        {webLLMReady && (
                          <Badge className="mt-2 bg-green-100 text-green-800">
                            Local WebLLM Active
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {aiMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3",
                          message.message_type === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {message.message_type === 'assistant' && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                            message.message_type === 'user'
                              ? "bg-blue-600 text-white rounded-br-md"
                              : "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 rounded-bl-md"
                          )}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className={cn(
                            "text-xs mt-1 opacity-70",
                            message.message_type === 'user' 
                              ? 'text-blue-100' 
                              : 'text-purple-600 dark:text-purple-300'
                          )}>
                            {formatTime(message.created_at)}
                          </p>
                        </div>

                        {message.message_type === 'user' && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-blue-600 text-white text-xs">
                              <Users className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}

                    {(isTyping || webLLMLoading) && (
                      <div className="flex gap-3 justify-start">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-purple-100 dark:bg-purple-900/30 rounded-2xl px-4 py-2">
                          <div className="flex items-center gap-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <span className="text-sm text-purple-600 dark:text-purple-300">
                              {webLLMLoading ? 'WebLLM thinking...' : 'HOUSIE AI is typing...'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Human-to-human messages will appear here when you book services!
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={activeTab === 'ai' ? "Ask HOUSIE AI anything..." : "Type your message..."}
                  disabled={isSending || (activeTab === 'ai' && webLLMLoading)}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!inputText.trim() || isSending || (activeTab === 'ai' && webLLMLoading)}
                  className={cn(
                    activeTab === 'ai' 
                      ? "bg-purple-600 hover:bg-purple-700" 
                      : "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              
              {activeTab === 'ai' && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                  💡 Try: "tax?", "pets?", "cleaning costs", "test webllm", or "show me colors"
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Left Border Notification Bubbles */}
      {!isOpen && totalUnreadCount > 0 && (
        <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
          <div className="flex flex-col gap-2 p-2">
            {[...Array(Math.min(totalUnreadCount, 5))].map((_, index) => (
              <div
                key={index}
                className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"
                style={{ animationDelay: `${index * 0.2}s` }}
              />
            ))}
            {totalUnreadCount > 5 && (
              <div className="w-3 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full animate-pulse shadow-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">+</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
