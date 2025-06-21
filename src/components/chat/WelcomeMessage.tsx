
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
    "tax?",
    "pets?", 
    "cleaning costs",
    "show me colors"
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl rounded-tl-md p-4 border border-purple-200 dark:border-purple-700">
          <p className="text-sm text-gray-800 dark:text-gray-200 mb-3">
            🏠 Hi! I'm HOUSIE AI - your intelligent assistant for home services. I can help with:
          </p>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>🏛️ Tax questions (home office deductions, property tax)</li>
            <li>🐕 Pet services (sitting, walking, grooming)</li>
            <li>🏠 Home services (cleaning, landscaping, repairs)</li>
            <li>💰 Price estimates and cost comparisons</li>
          </ul>
          {webLLMReady && (
            <div className="mt-2 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <Cpu className="h-3 w-3" />
              <span>Local AI model loaded - intelligent responses!</span>
            </div>
          )}
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 italic">
            💡 Try "show me colors" for a groovy surprise! 🎨
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
    </div>
  );
};

export default WelcomeMessage;
