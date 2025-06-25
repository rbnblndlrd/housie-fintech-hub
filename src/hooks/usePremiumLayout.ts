
import { useState, useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';

interface DraggableBox {
  id: string;
  title: string;
  content: React.ReactNode;
  position: 'right' | 'bottom' | 'overMap' | 'left';
  minimized: boolean;
  order: number;
}

export const usePremiumLayout = () => {
  const { currentRole } = useRole();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // For demo purposes, let's say providers are premium users
    // In a real app, this would check the user's subscription status
    setIsPremium(currentRole === 'provider');
  }, [currentRole]);

  const loadSavedLayout = (defaultBoxes: DraggableBox[]): DraggableBox[] => {
    try {
      const saved = localStorage.getItem('housie-map-layout');
      if (saved) {
        const savedLayout = JSON.parse(saved);
        // Merge saved positions with current box definitions
        return defaultBoxes.map(box => {
          const savedBox = savedLayout.find((s: DraggableBox) => s.id === box.id);
          return savedBox ? { ...box, position: savedBox.position, minimized: savedBox.minimized } : box;
        });
      }
    } catch (error) {
      console.error('Error loading saved layout:', error);
    }
    return defaultBoxes;
  };

  const saveLayout = (boxes: DraggableBox[]) => {
    try {
      localStorage.setItem('housie-map-layout', JSON.stringify(boxes));
    } catch (error) {
      console.error('Error saving layout:', error);
    }
  };

  return {
    isPremium,
    loadSavedLayout,
    saveLayout
  };
};
