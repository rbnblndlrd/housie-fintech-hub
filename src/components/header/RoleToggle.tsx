
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';

const RoleToggle = () => {
  const { currentRole, switchRole } = useRoleSwitch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('🔧 RoleToggle render:', { currentRole, pathname: location.pathname });

  const handleRoleToggle = async (checked: boolean) => {
    const newRole = checked ? 'provider' : 'customer';
    console.log('🔧 Role switch toggled to:', newRole);
    
    try {
      await switchRole(newRole);
      console.log('✅ Role switched successfully to:', newRole);
      
      // Redirect to unified dashboard if currently on dashboard
      if (location.pathname.includes('/dashboard')) {
        console.log('🔧 Redirecting to unified dashboard');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('❌ Role switch failed:', error);
    }
  };

  // Comprehensive event handling for the switch container
  const handleSwitchEvent = (e: React.MouseEvent) => {
    console.log('🔧 Switch event triggered:', e.type);
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-lg">
      <span className={`text-xs ${currentRole === 'customer' ? 'font-medium text-white' : 'text-gray-400'}`}>
        Client
      </span>
      <div
        onPointerDown={handleSwitchEvent}
        onMouseDown={handleSwitchEvent}
        onClick={handleSwitchEvent}
        onContextMenu={handleSwitchEvent}
      >
        <Switch
          checked={currentRole === 'provider'}
          onCheckedChange={handleRoleToggle}
          className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600"
        />
      </div>
      <span className={`text-xs ${currentRole === 'provider' ? 'font-medium text-white' : 'text-gray-400'}`}>
        Prestataire
      </span>
    </div>
  );
};

export default RoleToggle;
