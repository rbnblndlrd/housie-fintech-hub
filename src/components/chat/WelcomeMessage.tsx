
import React from 'react';
import { Bot, Cpu } from 'lucide-react';

interface WelcomeMessageProps {
  webLLMReady?: boolean;
  onSuggestedPrompt: (prompt: string) => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ 
  webLLMReady = false,
  onSuggestedPrompt
}) => {
  const suggestedPrompts = [
    "Find cleaning services near me",
    "How much does lawn care cost?",
    "Hi tax ?",
    "Pet sitting services?",
    "Home repair estimates",
    "show me colors"
  ];

  return (
    <>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 rounded-2xl rounded-bl-md p-4 max-w-[80%] border border-purple-200 dark:border-purple-700">
          <p className="text-sm text-gray-800 dark:text-gray-200 mb-3">
            🏠 Hi! I'm your HOUSIE AI assistant{webLLMReady ? ' powered by WebLLM running locally on your device' : ' with intelligent responses'}. I understand context and can help with:
          </p>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>Home services (cleaning, landscaping, repairs)</li>
            <li>Tax questions and home office deductions</li>
            <li>Pet services and pet-friendly providers</li>
            <li>Price estimates and booking assistance</li>
          </ul>
          <p className="text-sm text-gray-800 dark:text-gray-200 mt-3">
            Ask me anything - I understand context! Try "hi tax?" or "pets?" ✨
          </p>
          {webLLMReady && (
            <div className="mt-2 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <Cpu className="h-3 w-3" />
              <span>Local AI model loaded for complete privacy</span>
            </div>
          )}
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 italic">
            💡 Secret command: try "show me colors" for a surprise! 🎨
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 ml-11">
        {suggestedPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSuggestedPrompt(prompt)}
            className="px-3 py-1 text-xs bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-700 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-colors"
          >
            {prompt === 'show me colors' ? '🎨 ' + prompt : prompt}
          </button>
        ))}
      </div>
    </>
  );
};

export default WelcomeMessage;
