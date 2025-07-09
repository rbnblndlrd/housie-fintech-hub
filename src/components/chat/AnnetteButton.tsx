import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnnetteButtonProps {
  onClick: () => void;
  className?: string;
  variant?: 'default' | 'floating' | 'embedded';
  size?: 'sm' | 'default' | 'lg';
}

export const AnnetteButton: React.FC<AnnetteButtonProps> = ({
  onClick,
  className,
  variant = 'default',
  size = 'default'
}) => {
  if (variant === 'floating') {
    return (
      <div className={cn("fixed bottom-6 right-6 z-40", className)}>
        <Button
          onClick={onClick}
          className="rounded-full w-14 h-14 shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
        >
          <Brain className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  if (variant === 'embedded') {
    return (
      <Button
        onClick={onClick}
        variant="outline"
        size={size}
        className={cn(
          "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-blue-100 hover:border-purple-300",
          className
        )}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        💬 Ask Annette
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      className={cn(
        "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white",
        className
      )}
      size={size}
    >
      <Brain className="h-4 w-4 mr-2" />
      Ask Annette
    </Button>
  );
};