
import React, { useState } from 'react';

interface OverlayWrapperProps {
  children: React.ReactNode;
  position: string;
  draggable?: boolean;
  className?: string;
}

export const OverlayWrapper: React.FC<OverlayWrapperProps> = ({
  children,
  position,
  draggable = false,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable) return;
    
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !draggable) return;
    
    const element = document.getElementById('dragging-overlay');
    if (element) {
      element.style.left = `${e.clientX - dragOffset.x}px`;
      element.style.top = `${e.clientY - dragOffset.y}px`;
      element.style.position = 'fixed';
    }
  };

  const handleMouseUp = () => {
    if (!draggable) return;
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div
      id={isDragging ? 'dragging-overlay' : undefined}
      className={`absolute ${position} ${className} ${
        draggable ? 'cursor-move' : ''
      } ${isDragging ? 'z-50 opacity-80' : ''}`}
      onMouseDown={handleMouseDown}
      style={draggable ? { userSelect: 'none' } : undefined}
    >
      {children}
    </div>
  );
};
