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
      // Redirect to pricing for anonymous visitors
      navigate('/pricing');
    }
  };

  return (
    <>
      <div 
        className="fixed exit-arrows-container cursor-pointer hover:scale-110 transition-transform duration-200"
        style={{ 
          bottom: '100px', 
          right: '50%',
          transform: 'translateX(50%)',
          zIndex: 100,
          fontSize: '24px',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          width: '300px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
        onClick={handleClick}
        title={user ? "Go to Dashboard" : "View Pricing"}
      >
        <div className="arrow-1" style={{ opacity: 0 }}>➤</div>
        <div className="arrow-2" style={{ opacity: 0 }}>➤</div>
        <div className="arrow-3" style={{ opacity: 0 }}>➤</div>
      </div>
      
      <style>{`
        @keyframes flowRight1 {
          0% { opacity: 0; transform: translateX(-50px); }
          25% { opacity: 1; transform: translateX(0); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes flowRight2 {
          0% { opacity: 0; transform: translateX(-50px); }
          50% { opacity: 1; transform: translateX(0); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes flowRight3 {
          0% { opacity: 0; transform: translateX(-50px); }
          75% { opacity: 1; transform: translateX(0); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        .arrow-1 {
          animation: flowRight1 2s infinite;
        }
        
        .arrow-2 {
          animation: flowRight2 2s infinite;
        }
        
        .arrow-3 {
          animation: flowRight3 2s infinite;
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