
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import RoleToggle from './RoleToggle';

const HeaderActions = () => {
  const { user } = useAuth();
  const { currentRole, availableRoles } = useRoleSwitch();

  console.log('🎯 HeaderActions render:', { 
    hasUser: !!user, 
    currentRole, 
    availableRolesCount: availableRoles.length 
  });

  // Only show role toggle if user is authenticated and has multiple roles
  const showRoleToggle = user && availableRoles.length > 1;

  return (
    <div className="flex items-center space-x-4">
      {showRoleToggle && <RoleToggle />}
    </div>
  );
};

export default HeaderActions;
