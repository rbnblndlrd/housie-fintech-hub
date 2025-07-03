import React from 'react';
import { Rnd } from 'react-rnd';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Move, Lock, Unlock } from 'lucide-react';

interface DraggableWidgetProps {
  id: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  isLocked?: boolean;
  onPositionChange?: (id: string, position: { x: number; y: number }) => void;
  onSizeChange?: (id: string, size: { width: number; height: number }) => void;
  onLockToggle?: (id: string) => void;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  id,
  children,
  defaultPosition = { x: 0, y: 0 },
  defaultSize = { width: 300, height: 200 },
  isLocked = false,
  onPositionChange,
  onSizeChange,
  onLockToggle
}) => {
  return (
    <Rnd
      default={{
        ...defaultPosition,
        ...defaultSize
      }}
      disabled={isLocked}
      onDragStop={(e, d) => {
        if (onPositionChange) {
          onPositionChange(id, { x: d.x, y: d.y });
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (onSizeChange) {
          onSizeChange(id, {
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height)
          });
        }
      }}
      bounds="window"
      minWidth={200}
      minHeight={150}
      dragHandleClassName="drag-handle"
      className={`${isLocked ? 'opacity-90' : ''}`}
    >
      <Card className="h-full w-full fintech-card relative">
        {/* Control Header */}
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 bg-white/80 hover:bg-white/90"
            onClick={() => onLockToggle?.(id)}
          >
            {isLocked ? (
              <Lock className="h-3 w-3" />
            ) : (
              <Unlock className="h-3 w-3" />
            )}
          </Button>
          {!isLocked && (
            <div className="drag-handle cursor-move">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 bg-white/80 hover:bg-white/90"
              >
                <Move className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Widget Content */}
        <div className="h-full w-full">
          {children}
        </div>
      </Card>
    </Rnd>
  );
};

export default DraggableWidget;