
import React, { useState, useRef } from 'react';

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
  const [dragTranslate, setDragTranslate] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable || !elementRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = elementRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setDragTranslate({ x: 0, y: 0 }); // Reset translate on new drag
    
    // Apply dragging class immediately for visual feedback
    elementRef.current.classList.add('overlay-dragging');
    
    // Set cursor on document body
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !elementRef.current) return;
    
    // Calculate new translate values based on mouse movement
    const rect = elementRef.current.getBoundingClientRect();
    const translateX = e.clientX - rect.left - dragOffset.x;
    const translateY = e.clientY - rect.top - dragOffset.y;
    
    setDragTranslate({ x: translateX, y: translateY });
    
    // Apply transform using CSS transform for smooth movement
    elementRef.current.style.transform = `translate(${translateX}px, ${translateY}px) rotate(2deg)`;
  };

  const handleMouseUp = () => {
    if (!draggable || !elementRef.current || !isDragging) return;
    
    setIsDragging(false);
    
    // Clean up dragging styles and classes
    elementRef.current.classList.remove('overlay-dragging');
    elementRef.current.style.transform = '';
    
    // Reset cursor and user select
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    // Reset translate state
    setDragTranslate({ x: 0, y: 0 });
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

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      if (isDragging) {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`absolute ${position} ${className} ${
        draggable ? 'draggable-overlay' : ''
      } ${isDragging ? 'drag-in-progress' : ''}`}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};
