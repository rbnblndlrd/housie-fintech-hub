
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
  disabled: boolean;
  webLLMReady?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  onSendMessage,
  disabled,
  webLLMReady = false
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Input
            placeholder={webLLMReady ? "Ask your local AI about home services..." : "Ask me anything about home services..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className="pr-12 rounded-full border-purple-300 dark:border-purple-600 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-800"
          />
          <Button
            onClick={onSendMessage}
            disabled={!newMessage.trim() || disabled}
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {disabled ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
            ) : (
              <Send className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
      
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
        {webLLMReady ? 'AI runs locally on your device for complete privacy.' : 'AI responses are generated and may not always be accurate. Verify important information.'}
      </p>
    </div>
  );
};

export default MessageInput;
