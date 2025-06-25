
import React from 'react';
import { Button } from '@/components/ui/button';
import { Layers, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InteractiveMapToggleProps {
  searchParams?: URLSearchParams;
  className?: string;
}

const InteractiveMapToggle: React.FC<InteractiveMapToggleProps> = ({ 
  searchParams, 
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleNavigateToInteractiveMap = () => {
    // Build URL with current search parameters to maintain filters
    let targetUrl = '/interactive-map';
    
    if (searchParams && searchParams.toString()) {
      targetUrl += `?${searchParams.toString()}`;
    }
    
    navigate(targetUrl);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleNavigateToInteractiveMap}
      className={`
        bg-white/90 backdrop-blur-sm border-gray-200 
        hover:bg-white hover:border-blue-300 hover:shadow-md
        transition-all duration-200 ease-in-out
        text-gray-700 hover:text-blue-600
        flex items-center gap-2 px-3 py-2
        ${className}
      `}
    >
      <Layers className="h-4 w-4" />
      <span className="hidden sm:inline">Show Interactive Map</span>
      <span className="sm:hidden">Interactive</span>
      <ArrowRight className="h-3 w-3" />
    </Button>
  );
};

export default InteractiveMapToggle;
