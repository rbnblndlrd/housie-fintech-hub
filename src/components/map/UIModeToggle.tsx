
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Minimize2 } from 'lucide-react';
import { useUIMode } from '@/hooks/useUIMode';

interface UIModeToggleProps {
  className?: string;
}

const UIModelToggle: React.FC<UIModeToggleProps> = ({ className = '' }) => {
  const { uiMode, changeUIMode, getUIModeButtonText } = useUIMode();

  const getIcon = () => {
    switch (uiMode) {
      case 'transparent':
        return <EyeOff className="h-4 w-4" />;
      case 'borderless':
        return <Minimize2 className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getButtonColor = () => {
    switch (uiMode) {
      case 'transparent':
        return 'bg-purple-600 hover:bg-purple-700 border-purple-800';
      case 'borderless':
        return 'bg-blue-600 hover:bg-blue-700 border-blue-800';
      default:
        return 'bg-green-600 hover:bg-green-700 border-green-800';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={changeUIMode}
        className={`${getButtonColor()} text-cream font-bold py-2 px-4 rounded-xl border-2 shadow-lg transition-all duration-200 hover:scale-105`}
      >
        {getIcon()}
        <span className="ml-2">{getUIModeButtonText()}</span>
      </Button>
      
      <Badge 
        variant="outline" 
        className="bg-white/90 backdrop-blur-sm border-black text-black font-medium"
      >
        {uiMode.charAt(0).toUpperCase() + uiMode.slice(1)} Mode
      </Badge>
    </div>
  );
};

export default UIModelToggle;
