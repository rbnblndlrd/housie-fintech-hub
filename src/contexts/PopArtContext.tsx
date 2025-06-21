
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface PopArtContextType {
  isPopArtMode: boolean;
  activatePopArt: () => void;
  deactivatePopArt: () => void;
  togglePopArt: () => void;
  triggerPopArt: () => void;
}

export const PopArtContext = createContext<PopArtContextType | undefined>(undefined);

export const usePopArt = () => {
  const context = useContext(PopArtContext);
  if (!context) {
    throw new Error('usePopArt must be used within a PopArtProvider');
  }
  return context;
};

interface PopArtProviderProps {
  children: ReactNode;
}

export const PopArtProvider: React.FC<PopArtProviderProps> = ({ children }) => {
  const [isPopArtMode, setIsPopArtMode] = useState(false);
  const { theme } = useTheme();

  // Disable pop art mode when theme changes
  useEffect(() => {
    if (isPopArtMode) {
      setIsPopArtMode(false);
    }
  }, [theme]);

  const activatePopArt = () => {
    setIsPopArtMode(true);
    // Add transition effect class to body
    document.body.classList.add('pop-art-transition');
    setTimeout(() => {
      document.body.classList.remove('pop-art-transition');
    }, 1000);
  };

  const deactivatePopArt = () => {
    setIsPopArtMode(false);
  };

  const togglePopArt = () => {
    if (isPopArtMode) {
      deactivatePopArt();
    } else {
      activatePopArt();
    }
  };

  const triggerPopArt = () => {
    activatePopArt();
  };

  return (
    <PopArtContext.Provider value={{
      isPopArtMode,
      activatePopArt,
      deactivatePopArt,
      togglePopArt,
      triggerPopArt
    }}>
      <div className={isPopArtMode ? 'pop-art-mode' : ''}>
        {children}
      </div>
    </PopArtContext.Provider>
  );
};
