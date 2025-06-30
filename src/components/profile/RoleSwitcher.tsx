
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Briefcase, AlertCircle, Loader2 } from 'lucide-react';

const RoleSwitcher = () => {
  const { user, loading: authLoading } = useAuth();
  const { currentRole, availableRoles, switchRole, canSwitchToProvider, isLoading } = useRoleSwitch();
  const { toast } = useToast();

  console.log('🔧 RoleSwitcher render:', { 
    hasUser: !!user,
    authLoading,
    currentRole, 
    availableRoles, 
    canSwitchToProvider,
    isLoading
  });

  const handleRoleSwitch = async (newRole: string) => {
    console.log('🔧 Attempting to switch to role:', newRole);
    try {
      await switchRole(newRole as 'customer' | 'provider');
      toast({
        title: "Role Switched",
        description: `Switched to ${newRole} mode successfully`,
      });
    } catch (error) {
      console.error('❌ Role switch failed:', error);
      toast({
        title: "Error",
        description: "Failed to switch role",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'customer':
        return <User className="h-4 w-4" />;
      case 'provider':
        return <Briefcase className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'customer':
        return 'Customer';
      case 'provider':
        return 'Service Provider';
      default:
        return role;
    }
  };

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading roles...</span>
      </div>
    );
  }

  // Show debug info if only customer role is available but should have provider
  const showDebugInfo = availableRoles.length === 1 && availableRoles[0] === 'customer';

  return (
    <div className="space-y-2">
      {showDebugInfo && (
        <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
          <AlertCircle className="h-3 w-3" />
          <span>Debug: Only customer role available. Check console logs.</span>
        </div>
      )}
      
      {availableRoles.length <= 1 ? (
        <div className="text-sm text-gray-500">
          Current role: {getRoleLabel(currentRole)}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Switch Role:</span>
          <Select value={currentRole} onValueChange={handleRoleSwitch}>
            <SelectTrigger className="w-[180px]">
              <SelectValue>
                <div className="flex items-center gap-2">
                  {getRoleIcon(currentRole)}
                  {getRoleLabel(currentRole)}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(role)}
                    {getRoleLabel(role)}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;
