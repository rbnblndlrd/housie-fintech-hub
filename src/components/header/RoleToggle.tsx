
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';

const RoleToggle = () => {
  const { currentRole, switchRole, availableRoles, canSwitchToProvider } = useRoleSwitch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('🔧 RoleToggle render:', { 
    currentRole, 
    availableRoles,
    canSwitchToProvider,
    pathname: location.pathname 
  });

  // Only show toggle if user can actually switch to provider
  const canToggle = availableRoles.includes('provider');

  const handleRoleToggle = async (checked: boolean) => {
    const newRole = checked ? 'provider' : 'customer';
    console.log('🔧 Role switch toggled to:', newRole);
    
    if (!canToggle && newRole === 'provider') {
      console.error('❌ Cannot switch to provider - not available in roles:', availableRoles);
      return;
    }
    
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

  // Don't render if provider mode is not available
  if (!canToggle) {
    console.log('🔧 RoleToggle hidden - provider mode not available');
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-lg">
      <span className={`text-xs ${currentRole === 'customer' ? 'font-medium text-white' : 'text-gray-400'}`}>
        Client
      </span>
      <Switch
        checked={currentRole === 'provider'}
        onCheckedChange={handleRoleToggle}
        className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600"
      />
      <span className={`text-xs ${currentRole === 'provider' ? 'font-medium text-white' : 'text-gray-400'}`}>
        Prestataire
      </span>
    </div>
  );
};

export default RoleToggle;
