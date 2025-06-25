
import React, { useState, useRef, useEffect } from 'react';
import { useUIMode } from '@/hooks/useUIMode';
import './OverlayStyles.css';

interface OverlayWrapperProps {
  children: React.ReactNode;
  position: string;
  draggable?: boolean;
  className?: string;
}

const OverlayWrapper: React.FC<OverlayWrapperProps> = ({
  children,
  position,
  draggable = false,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);
  const { getOverlayClasses } = useUIMode();

  // Convert position string to CSS classes
  const getPositionClasses = () => {
    if (isDragging || (currentPosition.x !== 0 || currentPosition.y !== 0)) {
      return 'fixed';
    }
    
    switch (position) {
      case 'top-20 left-4': return 'absolute top-20 left-4';
      case 'top-20 right-4': return 'absolute top-20 right-4';
      case 'bottom-4 left-4': return 'absolute bottom-4 left-4';
      case 'bottom-4 right-4': return 'absolute bottom-4 right-4';
      case 'top-1/2 left-4 -translate-y-1/2': return 'absolute top-1/2 left-4 -translate-y-1/2';
      case 'top-1/2 right-4 -translate-y-1/2': return 'absolute top-1/2 right-4 -translate-y-1/2';
      case 'bottom-4 left-1/2 -translate-x-1/2': return 'absolute bottom-4 left-1/2 -translate-x-1/2';
      default: return `absolute ${position}`;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    const rect = overlayRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    
    document.body.classList.add('drag-in-progress');
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !draggable) return;
    
    setCurrentPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    document.body.classList.remove('drag-in-progress');
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const overlayStyle = (isDragging || (currentPosition.x !== 0 || currentPosition.y !== 0)) ? {
    left: currentPosition.x,
    top: currentPosition.y,
    zIndex: isDragging ? 9999 : 'auto'
  } : {};

  return (
    <div
      ref={overlayRef}
      className={`
        overlay-wrapper
        ${getPositionClasses()}
        ${isDragging ? 'overlay-dragging' : ''}
        ${draggable ? 'draggable-overlay' : ''}
        ${className}
      `}
      style={overlayStyle}
      onMouseDown={handleMouseDown}
    >
      <div className={`${getOverlayClasses()} backdrop-blur-sm rounded-2xl shadow-2xl transition-all duration-200`}>
        {children}
      </div>
    </div>
  );
};

export default OverlayWrapper;
