import React, { useState } from 'react';
import { ChatBubble } from './ChatBubble';
import { AnnetteButton } from './AnnetteButton';
import { usePageContext } from '@/hooks/usePageContext';

interface ContextualAnnetteButtonProps {
  variant?: 'default' | 'floating' | 'embedded';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const ContextualAnnetteButton: React.FC<ContextualAnnetteButtonProps> = ({
  variant = 'embedded',
  size = 'default',
  className
}) => {
  const [chatOpen, setChatOpen] = useState(false);
  const pageContext = usePageContext();

  const handleClick = () => {
    setChatOpen(true);
  };

  return (
    <>
      <AnnetteButton
        onClick={handleClick}
        variant={variant}
        size={size}
        className={className}
      />
      
      {/* Show ChatBubble when opened */}
      {chatOpen && (
        <ChatBubble 
          defaultTab="ai" 
        />
      )}
    </>
  );
};