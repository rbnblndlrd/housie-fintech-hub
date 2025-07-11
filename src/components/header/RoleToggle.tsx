
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { useAuth } from '@/contexts/AuthContext';

const RoleToggle = () => {
  const { user, loading: authLoading } = useAuth();
  const { currentRole, switchRole, availableRoles, canSwitchToProvider, isLoading } = useRoleSwitch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('🔧 RoleToggle render:', { 
    hasUser: !!user,
    authLoading,
    currentRole, 
    availableRoles,
    canSwitchToProvider,
    isLoading,
    pathname: location.pathname 
  });

  // Don't render while loading or if provider mode is not available
  if (authLoading || isLoading || !canSwitchToProvider || !user) {
    console.log('🔧 RoleToggle hidden - loading or provider mode not available');
    return null;
  }

  const handleRoleToggle = async (checked: boolean) => {
    const newRole = checked ? 'provider' : 'customer';
    console.log('🔧 Role switch toggled to:', newRole);
    
    if (!availableRoles.includes(newRole)) {
      console.error('❌ Cannot switch to role - not available in roles:', availableRoles);
      return;
    }
    
    try {
      await switchRole(newRole);
      console.log('✅ Role switched successfully to:', newRole);
      
      // If we're not on the dashboard page, navigate there to show the role-appropriate content
      if (location.pathname !== '/dashboard') {
        navigate('/dashboard');
      }
      // If we're already on /dashboard, the UnifiedDashboard will automatically re-render with the new role
      
    } catch (error) {
      console.error('❌ Role switch failed:', error);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-lg">
      <span className={`text-sm font-medium transition-colors ${
        currentRole === 'customer' ? 'text-white' : 'text-white/60'
      }`}>
        Customer
      </span>
      <Switch
        checked={currentRole === 'provider'}
        onCheckedChange={handleRoleToggle}
        className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-blue-600 scale-110"
      />
      <span className={`text-sm font-medium transition-colors ${
        currentRole === 'provider' ? 'text-white' : 'text-white/60'
      }`}>
        Provider
      </span>
    </div>
  );
};

export default RoleToggle;
