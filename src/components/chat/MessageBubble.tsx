
import React from 'react';
import { Bot, User, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AIMessage } from '@/hooks/useAIChat';

interface MessageBubbleProps {
  message: AIMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUserMessage = message.message_type === 'user';

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={cn(
      "flex items-start gap-3",
      isUserMessage ? "flex-row-reverse" : ""
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUserMessage 
          ? "bg-gradient-to-r from-blue-600 to-purple-600" 
          : "bg-gradient-to-r from-purple-600 to-blue-600"
      )}>
        {isUserMessage ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>
      
      <div className={cn(
        "relative px-4 py-3 rounded-2xl max-w-[80%] break-words group",
        isUserMessage
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md"
          : "bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 text-gray-800 dark:text-gray-200 border border-purple-200 dark:border-purple-700 rounded-bl-md"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        
        <div className={cn(
          "flex items-center justify-between mt-2",
          isUserMessage ? "flex-row-reverse" : ""
        )}>
          <span className={cn(
            "text-xs",
            isUserMessage 
              ? "text-white/70" 
              : "text-gray-500 dark:text-gray-400"
          )}>
            {formatMessageTime(message.created_at)}
          </span>
          
          {!isUserMessage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(message.content)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
            >
              <Copy className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
