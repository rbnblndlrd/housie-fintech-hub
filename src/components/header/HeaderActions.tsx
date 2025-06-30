
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import RoleToggle from './RoleToggle';

const HeaderActions = () => {
  const { user, loading: authLoading } = useAuth();
  const { availableRoles, isLoading: roleLoading } = useRoleSwitch();

  console.log('🎯 HeaderActions render:', { 
    hasUser: !!user, 
    authLoading,
    roleLoading,
    availableRolesCount: availableRoles.length 
  });

  // Only show role toggle if user is authenticated, not loading, and has multiple roles
  const showRoleToggle = user && !authLoading && !roleLoading && availableRoles.length > 1;

  return (
    <div className="flex items-center space-x-4">
      {showRoleToggle && <RoleToggle />}
    </div>
  );
};

export default HeaderActions;
