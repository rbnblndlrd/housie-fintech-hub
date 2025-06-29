
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { useToast } from '@/hooks/use-toast';
import { User, Briefcase, Building2 } from 'lucide-react';

const RoleSwitcher = () => {
  const { currentRole, availableRoles, switchRole } = useRoleSwitch();
  const { toast } = useToast();

  const handleRoleSwitch = async (newRole: string) => {
    try {
      await switchRole(newRole as 'customer' | 'provider' | 'commercial');
      toast({
        title: "Role Switched",
        description: `Switched to ${newRole} mode successfully`,
      });
    } catch (error) {
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
      case 'commercial':
        return <Building2 className="h-4 w-4" />;
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
      case 'commercial':
        return 'Commercial Account';
      default:
        return role;
    }
  };

  if (availableRoles.length <= 1) {
    return null;
  }

  return (
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
  );
};

export default RoleSwitcher;
