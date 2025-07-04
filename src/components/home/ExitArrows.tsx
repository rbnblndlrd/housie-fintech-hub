import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';

const ExitArrows = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();

  const handleClick = () => {
    if (user) {
      // Redirect to dashboard based on user's role  
      navigate('/dashboard');
    } else {
      // Don't show arrows for logged out users
      return null;
    }
  };

  // Only show arrows when user is authenticated
  if (!user) {
    return null;
  }

  return (
    <>
      <div 
        className="fixed exit-arrows-container cursor-pointer hover:scale-110 transition-transform duration-200"
        style={{ 
          bottom: '100px', 
          right: '100px',
          zIndex: 100,
          fontSize: '36px',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          width: '400px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
        onClick={handleClick}
        title={user ? "Go to Dashboard" : "View Pricing"}
      >
        <div className="arrow-1">➤</div>
        <div className="arrow-2">➤</div>
        <div className="arrow-3">➤</div>
      </div>
      
      <style>{`
        @keyframes flowRight1 {
          0% { opacity: 0; transform: translateX(-100px); }
          25% { opacity: 1; transform: translateX(0); }
          75% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(100px); }
        }
        
        @keyframes flowRight2 {
          0% { opacity: 0; transform: translateX(-100px); }
          33% { opacity: 0; transform: translateX(-100px); }
          50% { opacity: 1; transform: translateX(0); }
          75% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(100px); }
        }
        
        @keyframes flowRight3 {
          0% { opacity: 0; transform: translateX(-100px); }
          50% { opacity: 0; transform: translateX(-100px); }
          75% { opacity: 1; transform: translateX(0); }
          90% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(100px); }
        }
        
        .arrow-1 {
          animation: flowRight1 3s infinite;
          opacity: 0;
        }
        
        .arrow-2 {
          animation: flowRight2 3s infinite;
          opacity: 0;
        }
        
        .arrow-3 {
          animation: flowRight3 3s infinite;
          opacity: 0;
        }
        
        .exit-arrows-container:hover .arrow-1,
        .exit-arrows-container:hover .arrow-2,
        .exit-arrows-container:hover .arrow-3 {
          opacity: 1 !important;
          transform: translateX(0) !important;
          animation: none;
        }
      `}</style>
    </>
  );
};

export default ExitArrows;