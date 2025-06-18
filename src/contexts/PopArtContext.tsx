
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PopArtContextType {
  isPopArtMode: boolean;
  activatePopArt: () => void;
  deactivatePopArt: () => void;
  togglePopArt: () => void;
}

const PopArtContext = createContext<PopArtContextType | undefined>(undefined);

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

  return (
    <PopArtContext.Provider value={{
      isPopArtMode,
      activatePopArt,
      deactivatePopArt,
      togglePopArt
    }}>
      <div className={isPopArtMode ? 'pop-art-mode' : ''}>
        {children}
      </div>
    </PopArtContext.Provider>
  );
};
