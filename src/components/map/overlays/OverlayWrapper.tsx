
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
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable || !elementRef.current) return;
    
    e.preventDefault();
    
    const rect = elementRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    
    // Set initial drag position to current element position
    setDragPosition({
      x: rect.left,
      y: rect.top
    });
    
    // Immediately disable transitions and apply dragging styles
    elementRef.current.style.transition = 'none';
    elementRef.current.style.position = 'fixed';
    elementRef.current.style.zIndex = '9999';
    elementRef.current.style.opacity = '0.9';
    elementRef.current.style.transform = 'rotate(2deg)';
    elementRef.current.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
    
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !elementRef.current) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    setDragPosition({ x: newX, y: newY });
    
    // Use transform for smooth positioning
    elementRef.current.style.left = `${newX}px`;
    elementRef.current.style.top = `${newY}px`;
  };

  const handleMouseUp = () => {
    if (!draggable || !elementRef.current) return;
    
    setIsDragging(false);
    
    // Re-enable transitions and reset dragging styles
    elementRef.current.style.transition = '';
    elementRef.current.style.position = '';
    elementRef.current.style.zIndex = '';
    elementRef.current.style.opacity = '';
    elementRef.current.style.transform = '';
    elementRef.current.style.boxShadow = '';
    elementRef.current.style.left = '';
    elementRef.current.style.top = '';
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={elementRef}
      className={`absolute ${position} ${className} ${
        draggable ? 'cursor-grab active:cursor-grabbing' : ''
      } ${isDragging ? 'select-none' : ''}`}
      onMouseDown={handleMouseDown}
      style={draggable ? { userSelect: 'none' } : undefined}
    >
      {children}
    </div>
  );
};
