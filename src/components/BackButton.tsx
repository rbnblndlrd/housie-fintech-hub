
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';

interface BackButtonProps {
  customPath?: string;
  customLabel?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  customPath, 
  customLabel, 
  className = "" 
}) => {
  const navigate = useNavigate();
  const { currentRole } = useRole();

  const handleBack = () => {
    if (customPath) {
      navigate(customPath);
      return;
    }

    // Try to go back in browser history first
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to appropriate dashboard based on role
      const dashboardPath = currentRole === 'provider' 
        ? '/provider-dashboard' 
        : '/customer-dashboard';
      navigate(dashboardPath);
    }
  };

  const getDefaultLabel = () => {
    if (customLabel) return customLabel;
    
    return currentRole === 'provider' 
      ? 'Back to Provider Dashboard'
      : 'Back to Customer Dashboard';
  };

  return (
    <Button
      onClick={handleBack}
      variant="outline"
      className={`flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700 border-purple-600 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {getDefaultLabel()}
    </Button>
  );
};

export default BackButton;
