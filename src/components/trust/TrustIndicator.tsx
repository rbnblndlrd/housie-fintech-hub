import React from 'react';
import { Shield, MessageCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TrustIndicatorProps {
  isConnected: boolean;
  canMessage: boolean;
  connectionTier?: 'service' | 'trusted' | 'network';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TrustIndicator: React.FC<TrustIndicatorProps> = ({
  isConnected,
  canMessage,
  connectionTier = 'service',
  size = 'sm',
  className
}) => {
  if (!isConnected) return null;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const colorClasses = {
    service: 'text-blue-500',
    trusted: 'text-green-500',
    network: 'text-purple-500'
  };

  const tooltipText = canMessage 
    ? "You're connected! Messaging unlocked."
    : "Service connection established. Complete another job to unlock messaging.";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("inline-flex items-center", className)}>
            <Shield 
              className={cn(
                sizeClasses[size],
                colorClasses[connectionTier],
                "fill-current"
              )} 
            />
            {canMessage && (
              <MessageCircle 
                className={cn(
                  sizeClasses[size],
                  "text-green-500 ml-1"
                )} 
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};