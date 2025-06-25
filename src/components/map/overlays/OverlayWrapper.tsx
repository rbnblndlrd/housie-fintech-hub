import React, { useState, useRef, useEffect } from 'react';
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

  // Get position classes based on whether we're dragging or using default positioning
  const getPositionClasses = () => {
    if (isDragging || (currentPosition.x !== 0 || currentPosition.y !== 0)) {
      return 'fixed';
    }
    
    // Default positioning when not dragging
    switch (position) {
      case 'top-20 left-4': return 'fixed top-20 left-4';
      case 'top-20 right-4': return 'fixed top-20 right-4';
      case 'top-96 left-4': return 'fixed top-96 left-4';
      case 'bottom-20 left-80': return 'fixed bottom-20 left-80';
      case 'bottom-20 left-1/2 -translate-x-1/2': return 'fixed bottom-20 left-1/2 -translate-x-1/2';
      default: return `fixed ${position}`;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable) return;
    
    // Only start drag from drag handles or overlay headers
    const target = e.target as HTMLElement;
    const isDragHandle = target.closest('[data-grip="true"]') || 
                        target.closest('[data-draggable-header="true"]') ||
                        target.closest('.drag-handle');
    
    if (!isDragHandle) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    const rect = overlayRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    
    // Add dragging class to body to prevent text selection
    document.body.classList.add('drag-in-progress');
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !draggable) return;
    
    e.preventDefault();
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Keep within viewport bounds with some padding
    const padding = 20;
    const maxX = window.innerWidth - 320 - padding; // Assume min overlay width of 320px
    const maxY = window.innerHeight - 200 - padding; // Assume min overlay height of 200px
    
    setCurrentPosition({
      x: Math.max(padding, Math.min(newX, maxX)),
      y: Math.max(padding, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    document.body.classList.remove('drag-in-progress');
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    
    // Save position to localStorage for persistence
    if (currentPosition.x !== 0 || currentPosition.y !== 0) {
      const savedPositions = JSON.parse(localStorage.getItem('overlay-positions') || '{}');
      savedPositions[position] = currentPosition;
      localStorage.setItem('overlay-positions', JSON.stringify(savedPositions));
    }
  };

  // Load saved position on mount
  useEffect(() => {
    const savedPositions = JSON.parse(localStorage.getItem('overlay-positions') || '{}');
    if (savedPositions[position]) {
      setCurrentPosition(savedPositions[position]);
    }
  }, [position]);

  // Attach global mouse events for dragging
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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('drag-in-progress');
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, []);

  // Calculate style for positioned overlays
  const overlayStyle = (isDragging || (currentPosition.x !== 0 || currentPosition.y !== 0)) ? {
    left: currentPosition.x,
    top: currentPosition.y,
    zIndex: isDragging ? 9999 : 50,
    transform: 'none' // Override any transform classes when dragging
  } : {};

  return (
    <div
      ref={overlayRef}
      className={`
        overlay-wrapper
        ${getPositionClasses()}
        ${isDragging ? 'overlay-dragging' : ''}
        ${draggable ? 'overlay-draggable' : ''}
        pointer-events-none
        ${className}
      `}
      style={overlayStyle}
      onMouseDown={handleMouseDown}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl transition-all duration-200 pointer-events-auto border border-gray-200">
        {children}
      </div>
    </div>
  );
};

export default OverlayWrapper;
