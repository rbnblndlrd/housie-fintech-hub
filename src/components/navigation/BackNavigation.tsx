import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface BackNavigationProps {
  customBackAction?: () => void;
  backLabel?: string;
  showHomeButton?: boolean;
  className?: string;
}

const BackNavigation: React.FC<BackNavigationProps> = ({
  customBackAction,
  backLabel = 'Back',
  showHomeButton = true,
  className = 'fixed top-4 left-4 z-50 flex gap-2'
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (customBackAction) {
      customBackAction();
    } else {
      // Smart back navigation - go to previous page or appropriate dashboard
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        // Fallback to home or dashboard based on common patterns
        if (location.pathname.includes('admin')) {
          navigate('/admin-dashboard');
        } else if (location.pathname.includes('analytics')) {
          navigate('/analytics-dashboard');
        } else if (location.pathname.includes('provider')) {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className={className}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBack}
        className="bg-white/90 backdrop-blur-sm border-slate-300 shadow-lg text-slate-800 hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {backLabel}
      </Button>
      
      {showHomeButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleHome}
          className="bg-white/90 backdrop-blur-sm border-slate-300 shadow-lg text-slate-800 hover:bg-slate-50"
        >
          <Home className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default BackNavigation;