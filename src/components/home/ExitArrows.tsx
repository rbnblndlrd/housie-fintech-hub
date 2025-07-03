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
          right: '100px', 
          zIndex: 100,
          fontSize: '24px',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
        }}
        onClick={handleClick}
        title={user ? "Go to Dashboard" : "View Pricing"}
      >
        <div className="exit-arrows">➤</div>
      </div>
      
      <style>{`
        @keyframes exitArrows {
          0% { content: "➤"; }
          33% { content: "➤➤"; }
          66% { content: "➤➤➤"; }
          100% { content: "➤"; }
        }
        
        .exit-arrows::before {
          content: "➤";
          animation: exitArrows 2s infinite;
        }
        
        .exit-arrows-container:hover .exit-arrows::before {
          content: "➤➤➤";
          animation: none;
        }
      `}</style>
    </>
  );
};

export default ExitArrows;