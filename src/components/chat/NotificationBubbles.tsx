
import React, { useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

export const NotificationBubbles = () => {
  const { totalUnreadCount } = useChat();
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

  if (bubbles.length === 0) return null;

  return (
    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40 pointer-events-none">
      <div className="flex flex-col gap-1 p-1">
        {bubbles.slice(0, 6).map((bubble) => (
          <div
            key={bubble.id}
            className={cn(
              "px-2 py-1 rounded-full shadow-lg transition-all duration-500",
              "bg-stone-100 border border-stone-200",
              "animate-pulse hover:animate-bounce"
            )}
            style={{ 
              animationDelay: `${bubble.delay}s`,
              transform: `translateX(${Math.sin(bubble.id * 0.5) * 3}px)`
            }}
          >
            <div className="w-2 h-2 bg-gray-800 rounded-full" />
          </div>
        ))}
        
        {totalUnreadCount > 6 && (
          <div className={cn(
            "px-2 py-1 rounded-full shadow-lg",
            "bg-stone-100 border border-stone-200",
            "animate-pulse flex items-center justify-center min-w-[24px] h-6"
          )}>
            <div className="w-1 h-1 bg-gray-800 rounded-full animate-ping" />
          </div>
        )}
        
        {bubbles.length > 0 && (
          <div 
            className="text-xs text-gray-800 font-bold mt-1 animate-pulse bg-stone-100 px-2 py-1 rounded-full border border-stone-200 shadow-sm"
            style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}
          >
            {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
          </div>
        )}
      </div>
    </div>
  );
};
