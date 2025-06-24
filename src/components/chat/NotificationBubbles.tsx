
import React, { useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const NotificationBubbles = () => {
  const { totalUnreadCount } = useChat();
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState<Array<{ id: number; delay: number }>>([]);

  useEffect(() => {
    if (totalUnreadCount > 0) {
      const newBubbles = Array.from({ length: Math.min(totalUnreadCount, 8) }, (_, index) => ({
        id: index,
        delay: index * 0.15
      }));
      setBubbles(newBubbles);
    } else {
      setBubbles([]);
    }
  }, [totalUnreadCount]);

  const handleBubbleClick = () => {
    navigate('/notifications');
  };

  if (bubbles.length === 0) return null;

  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40 cursor-pointer" onClick={handleBubbleClick}>
      <div className="flex flex-col gap-1 p-1">
        {bubbles.slice(0, 6).map((bubble) => (
          <div
            key={bubble.id}
            className={cn(
              "px-2 py-1 rounded-full shadow-lg transition-all duration-500 hover:scale-110",
              "bg-red-500 border border-red-600",
              "animate-pulse hover:animate-bounce"
            )}
            style={{ 
              animationDelay: `${bubble.delay}s`,
              transform: `translateX(${Math.sin(bubble.id * 0.5) * -3}px)`
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        ))}
        
        {totalUnreadCount > 6 && (
          <div className={cn(
            "px-2 py-1 rounded-full shadow-lg",
            "bg-red-500 border border-red-600",
            "animate-pulse flex items-center justify-center min-w-[24px] h-6"
          )}>
            <div className="w-1 h-1 bg-white rounded-full animate-ping" />
          </div>
        )}
        
        {bubbles.length > 0 && (
          <div 
            className="text-xs text-white font-bold mt-1 animate-pulse bg-red-500 px-2 py-1 rounded-full border border-red-600 shadow-sm"
            style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}
          >
            {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
          </div>
        )}
      </div>
    </div>
  );
};
