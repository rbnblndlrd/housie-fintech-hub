import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AnnetteServiceBoardTipsProps {
  context?: 'ticket-creation' | 'ticket-management' | 'general';
  className?: string;
}

const AnnetteServiceBoardTips: React.FC<AnnetteServiceBoardTipsProps> = ({ 
  context = 'general', 
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = {
    'ticket-creation': [
      "You'll see all your job tickets right from the Service Board, sugar. Think of it like a mission control center — but for clean floors and trimmed hedges!",
      "Pro tip: The more details you add, the better match we'll find you. Don't be shy about those special instructions! 📝",
      "Photo verification is your friend! It keeps everyone honest and your place looking exactly how you want it ✨"
    ],
    'ticket-management': [
      "Track your tickets like a boss! From creation to completion, everything's right here where you can see it 👀",
      "Got a stellar provider? Hit that message button! Building relationships is what HOUSIE is all about 💌",
      "Remember: You can edit instructions until a provider is matched. After that, use messaging to clarify!"
    ],
    'general': [
      "Welcome to your Service Board! This is where the magic happens — your personal command center 🎯",
      "Each ticket tells a story. From 'Created' to 'Completed' — we're with you every step of the way!",
      "Loving a provider's work? Great reviews and ratings help the whole HOUSIE community! 🌟"
    ]
  };

  const contextTips = tips[context];

  useEffect(() => {
    if (contextTips.length > 1) {
      const interval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % contextTips.length);
      }, 8000); // Change tip every 8 seconds

      return () => clearInterval(interval);
    }
  }, [contextTips.length]);

  if (!isVisible) return null;

  return (
    <div className={`bg-purple-50 border border-purple-200 rounded-lg p-4 relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-purple-100"
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="flex items-start gap-3 pr-8">
        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold">A</span>
        </div>
        <div className="flex-1">
          <p className="text-purple-700 font-medium mb-1">Annette says:</p>
          <p className="text-purple-600 text-sm leading-relaxed">
            {contextTips[currentTip]}
          </p>
          {contextTips.length > 1 && (
            <div className="flex gap-1 mt-3">
              {contextTips.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTip ? 'bg-purple-500' : 'bg-purple-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnetteServiceBoardTips;