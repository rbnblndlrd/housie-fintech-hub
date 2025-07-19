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
    console.log('⬅️ BackNavigation: Back button clicked', { currentPath: location.pathname });
    if (customBackAction) {
      console.log('⬅️ BackNavigation: Using custom back action');
      customBackAction();
    } else {
      // Smart back navigation - go to previous page or appropriate dashboard
      if (window.history.length > 1 && location.pathname !== '/dashboard') {
        console.log('⬅️ BackNavigation: Going back in history');
        navigate(-1);
      } else {
        // Fallback to appropriate dashboard based on current location
        if (location.pathname.includes('admin')) {
          console.log('⬅️ BackNavigation: Navigating to admin-dashboard');
          navigate('/admin-dashboard');
        } else if (location.pathname.includes('analytics')) {
          console.log('⬅️ BackNavigation: Navigating to dashboard from analytics');
          navigate('/dashboard');
        } else if (location.pathname.includes('community')) {
          console.log('⬅️ BackNavigation: Navigating to dashboard from community');
          navigate('/dashboard');
        } else if (location.pathname.includes('service-board')) {
          console.log('⬅️ BackNavigation: Navigating to dashboard from service-board');
          navigate('/dashboard');
        } else {
          console.log('⬅️ BackNavigation: Navigating to service-board as fallback');
          navigate('/service-board');
        }
      }
    }
  };

  const handleHome = () => {
    console.log('🏠 BackNavigation: Navigating to dashboard');
    navigate('/dashboard');
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