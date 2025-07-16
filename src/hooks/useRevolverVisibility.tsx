import { useState, useEffect } from 'react';

export const useRevolverVisibility = () => {
  const [isRevolverOpen, setIsRevolverOpen] = useState(false);

  // Listen for revolver state changes across components
  useEffect(() => {
    const handleRevolverStateChange = (event: CustomEvent) => {
      setIsRevolverOpen(event.detail.isOpen);
    };

    window.addEventListener('revolverStateChanged', handleRevolverStateChange as EventListener);
    
    return () => {
      window.removeEventListener('revolverStateChanged', handleRevolverStateChange as EventListener);
    };
  }, []);

  const emitRevolverStateChange = (isOpen: boolean) => {
    setIsRevolverOpen(isOpen);
    const event = new CustomEvent('revolverStateChanged', {
      detail: { isOpen }
    });
    window.dispatchEvent(event);
  };

  return {
    isRevolverOpen,
    emitRevolverStateChange
  };
};