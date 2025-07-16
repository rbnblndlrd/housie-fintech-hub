import { useState, useEffect } from 'react';

export const useBubbleChatVisibility = () => {
  const [isBubbleChatOpen, setIsBubbleChatOpen] = useState(false);

  // Listen for BubbleChat state changes across components
  useEffect(() => {
    const handleBubbleChatStateChange = (event: CustomEvent) => {
      setIsBubbleChatOpen(event.detail.isOpen);
    };

    window.addEventListener('bubbleChatStateChanged', handleBubbleChatStateChange as EventListener);
    
    return () => {
      window.removeEventListener('bubbleChatStateChanged', handleBubbleChatStateChange as EventListener);
    };
  }, []);

  const emitBubbleChatStateChange = (isOpen: boolean) => {
    setIsBubbleChatOpen(isOpen);
    const event = new CustomEvent('bubbleChatStateChanged', {
      detail: { isOpen }
    });
    window.dispatchEvent(event);
  };

  return {
    isBubbleChatOpen,
    emitBubbleChatStateChange
  };
};