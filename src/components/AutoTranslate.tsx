
import React from 'react';
import { useAutoTranslate } from '@/hooks/useAutoTranslate';
import { Skeleton } from '@/components/ui/skeleton';

export interface AutoTranslateProps {
  children: string;
  fallback?: React.ReactNode;
  className?: string;
  showLoading?: boolean;
}

const AutoTranslate: React.FC<AutoTranslateProps> = ({ 
  children, 
  fallback,
  className = '',
  showLoading = true
}) => {
  const { translatedText, isLoading } = useAutoTranslate(children);

  if (isLoading && showLoading) {
    return fallback || <Skeleton className={`h-4 w-20 ${className}`} />;
  }

  return <span className={className}>{translatedText}</span>;
};

export default AutoTranslate;
