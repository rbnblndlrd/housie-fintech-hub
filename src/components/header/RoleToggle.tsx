
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { useRole } from '@/contexts/RoleContext';

const RoleToggle = () => {
  const { currentRole, toggleRole } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleToggle = (checked: boolean) => {
    console.log('🔧 Role switch toggled to:', checked ? 'provider' : 'customer');
    toggleRole();
    
    // Instantly redirect to the appropriate dashboard
    const newRole = checked ? 'provider' : 'customer';
    
    // Check if user is currently on a dashboard page
    if (location.pathname === '/customer-dashboard' || location.pathname === '/provider-dashboard') {
      const targetDashboard = newRole === 'provider' ? '/provider-dashboard' : '/customer-dashboard';
      navigate(targetDashboard);
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
