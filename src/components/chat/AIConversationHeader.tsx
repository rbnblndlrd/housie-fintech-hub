
import React from 'react';
import { ArrowLeft, Bot, Sparkles, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AIConversationHeaderProps {
  onBack: () => void;
  webLLMReady?: boolean;
  webLLMLoading?: boolean;
  isTyping?: boolean;
}

const AIConversationHeader: React.FC<AIConversationHeaderProps> = ({ 
  onBack, 
  webLLMReady = false,
  webLLMLoading = false,
  isTyping = false
}) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-1 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
          <Bot className="h-5 w-5 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            Annette
            {webLLMReady ? <Cpu className="h-4 w-4 text-green-500" /> : <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />}
          </h3>
          <p className="text-xs text-purple-600 dark:text-purple-400">
            {webLLMLoading ? 'Thinking...' : 
             isTyping ? 'Typing...' : 
             webLLMReady ? 'Local AI ready' : 'Your HOUSIE AI Assistant'}
          </p>
        </div>
        
        <Badge className={`border-0 text-white ${
          webLLMReady ? 'bg-gradient-to-r from-green-500 to-orange-500' : 'bg-gradient-to-r from-purple-500 to-orange-500'
        }`}>
          {webLLMReady ? 'Local AI' : 'Annette'}
        </Badge>
      </div>
    </div>
  );
};

export default AIConversationHeader;
