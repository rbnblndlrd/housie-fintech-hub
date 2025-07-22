import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GhostBubblePreviewProps {
  message: string | null;
  isVisible: boolean;
  onDismiss: () => void;
  className?: string;
}

export const GhostBubblePreview: React.FC<GhostBubblePreviewProps> = ({
  message,
  isVisible,
  onDismiss,
  className
}) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (isVisible && message) {
      setShouldShow(true);
      // Auto-dismiss after 20 seconds
      const timer = setTimeout(() => {
        setShouldShow(false);
        onDismiss();
      }, 20000);

      return () => clearTimeout(timer);
    } else {
      setShouldShow(false);
    }
  }, [isVisible, message, onDismiss]);

  if (!shouldShow || !message) return null;

  return (
    <div className={cn(
      "fixed bottom-6 left-6 z-40 max-w-xs",
      className
    )}>
      <Card 
        className="p-3 bg-card/90 backdrop-blur-md border-border/20 shadow-lg cursor-pointer transition-all duration-300 hover:bg-card/95"
        onClick={() => {
          setShouldShow(false);
          onDismiss();
        }}
      >
        <div className="flex items-start gap-2">
          <div className="text-lg">🤖</div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Assistant</p>
            <p className="text-sm text-foreground/80 italic">
              {message}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};