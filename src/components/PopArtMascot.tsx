
import React, { useState, useCallback } from 'react';
import { usePopArt } from '@/contexts/PopArtContext';

interface PopArtMascotProps {
  className?: string;
}

const PopArtMascot: React.FC<PopArtMascotProps> = ({ className = "" }) => {
  const { isPopArtMode, activatePopArt } = usePopArt();
  const [clickCount, setClickCount] = useState(0);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  const handleTripleClick = useCallback(() => {
    setClickCount(prev => {
      const newCount = prev + 1;
      
      // Clear existing timeout
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }

      // Set new timeout to reset clicks
      const timeout = setTimeout(() => {
        setClickCount(0);
      }, 500);
      setClickTimeout(timeout);

      // Check for triple click
      if (newCount === 3) {
        activatePopArt();
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
        setClickCount(0);
        if (clickTimeout) clearTimeout(clickTimeout);
      }

      return newCount;
    });
  }, [activatePopArt, clickTimeout]);

  return (
    <div className="relative">
      {/* Speech Bubble */}
      {showMessage && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl px-4 py-2 shadow-lg border-2 border-purple-300 animate-fade-in z-10">
          <div className="text-sm font-bold text-purple-600">
            Behold colors! 🌈
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-purple-300"></div>
        </div>
      )}

      {/* Mascot Container */}
      <div 
        className={`cursor-pointer transition-all duration-300 hover:scale-105 ${className} ${
          isPopArtMode ? 'pop-art-mascot' : ''
        }`}
        onClick={handleTripleClick}
        title="Triple-click me for a surprise! 🎨"
      >
        <div className="w-40 h-40 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden p-1">
          {/* Rainbow burst effect when activated */}
          {showMessage && (
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 opacity-20 animate-pulse rounded-3xl"></div>
          )}
          
          <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-orange-400 rounded-2xl flex items-center justify-center p-1">
            <img 
              src="/lovable-uploads/7e58a112-189a-4048-9103-cd1a291fa6a5.png" 
              alt="HOUSIE Mascot" 
              className={`w-full h-full rounded-xl object-cover transition-all duration-500 ${
                isPopArtMode ? 'hue-rotate-45 saturate-150 brightness-110' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {/* Click indicator */}
      {clickCount > 0 && clickCount < 3 && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  i < clickCount ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PopArtMascot;
